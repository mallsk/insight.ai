import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as XLSX from "xlsx";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const query = formData.get("query") as string | null;
    const chatLink = formData.get("chatId") as string | null;

    if (!file || !query || !chatLink) {
      return NextResponse.json(
        { error: "File, query, and chatLink are required." },
        { status: 400 }
      );
    }

    // Read file buffer and decode
    const fileBuffer = await file.arrayBuffer();
    let fileContent: string;
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (fileExtension === "csv") {
      const textDecoder = new TextDecoder("utf-8");
      fileContent = textDecoder.decode(fileBuffer);
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      fileContent = XLSX.utils.sheet_to_csv(worksheet);
    } else {
      return NextResponse.json(
        { error: "Unsupported file type." },
        { status: 400 }
      );
    }

    // Get session and user
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare prompts
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const analysisPrompt = `
You are an expert data analyst AI, the core of the "InsightAI".
Your task is to analyze the provided data and answer the user's question in a clear, concise, and friendly manner.

Here is the data, presented in CSV format:
--- DATA START ---
${fileContent}
--- DATA END ---

Here is the user's question about this data:
"${query}"

Please provide a natural language response that directly answers the question based on the data.
Do not return code. Do not just repeat the data.
Generate insights, summaries, or calculations as needed to form your answer.
`;

const chartPrompt = `
You are a chart-generation AI working for InsightAI.

Your job is to convert data and a user query into a JSON chart configuration compatible with Chart.js.

--- DATA START ---
${fileContent}
--- DATA END ---

User's question:
"${query}"

### Rules:
1. Respond ONLY with a single JSON object. Do NOT include markdown, explanations, or extra text.
2. Only use one of the following supported chart types: **bar**, **line**, **pie**, or **scatter**.
3. If the user does not mention a chart type, default to **bar**.
4. Your output should include three keys: "type", "data", and optionally "options".

### Chart Format Examples:

--- BAR CHART ---
{
  "type": "bar",
  "data": {
    "labels": ["Jan", "Feb", "Mar"],
    "datasets": [
      {
        "label": "Sales",
        "data": [100, 200, 150],
        "backgroundColor": "rgba(54, 162, 235, 0.2)",
        "borderColor": "rgba(54, 162, 235, 1)",
        "borderWidth": 1
      }
    ]
  },
  "options": {
    "scales": {
      "x": { "title": { "display": true, "text": "Month" }},
      "y": { "beginAtZero": true }
    }
  }
}

--- LINE CHART ---
{
  "type": "line",
  "data": {
    "labels": ["Week 1", "Week 2", "Week 3"],
    "datasets": [
      {
        "label": "Revenue",
        "data": [500, 600, 750],
        "borderColor": "rgba(75, 192, 192, 1)",
        "backgroundColor": "rgba(75, 192, 192, 0.2)",
        "tension": 0.4
      }
    ]
  },
  "options": {
    "scales": {
      "x": { "title": { "display": true, "text": "Week" }},
      "y": { "title": { "display": true, "text": "Revenue" }, "beginAtZero": true }
    }
  }
}

--- PIE CHART ---
{
  "type": "pie",
  "data": {
    "labels": ["Apples", "Oranges", "Bananas"],
    "datasets": [
      {
        "label": "Fruit Distribution",
        "data": [30, 45, 25],
        "backgroundColor": [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)"
        ],
        "borderColor": [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)"
        ],
        "borderWidth": 1
      }
    ]
  }
}

--- SCATTER CHART ---
{
  "type": "scatter",
  "data": {
    "datasets": [
      {
        "label": "Study Hours vs Score",
        "data": [
          { "x": 1, "y": 50 },
          { "x": 2, "y": 60 },
          { "x": 3, "y": 70 }
        ],
        "backgroundColor": "rgba(153, 102, 255, 0.2)",
        "borderColor": "rgba(153, 102, 255, 1)"
      }
    ]
  },
  "options": {
    "scales": {
      "x": { "title": { "display": true, "text": "Study Hours" }},
      "y": { "title": { "display": true, "text": "Score" }}
    }
  }
}

Only return one JSON object following the above pattern — no additional explanation or formatting.
`;


    const [answerRes, chartRes] = await Promise.all([
      model.generateContent(analysisPrompt),
      model.generateContent(chartPrompt),
    ]);

    const answerText = answerRes.response.text();
    const chartText = chartRes.response.text();

    let chartJson = null;
    try {
      const cleanedChart = chartText.replace(/```json|```/g, "").trim();
      chartJson = JSON.parse(cleanedChart);
    } catch (err) {
      console.error("Chart JSON parsing failed:", err);
    }

    // Save chat + messages to DB
    const existingChat = await prisma.chat.findUnique({
      where: { chatLink },
      include: { messages: true },
    });

    let savedChat;

    if (existingChat) {
      savedChat = await prisma.chat.update({
        where: { chatLink },
        data: {
          messages: {
            create: [
              { role: "user", content: query },
              {
                role: "assistant",
                content: answerText,
                chartData: chartJson || undefined,
              },
            ],
          },
        },
      });
    } else {
      savedChat = await prisma.chat.create({
        data: {
          chatLink,
          userId: user.id,
          title: query.slice(0, 100),
          messages: {
            create: [
              { role: "user", content: query },
              {
                role: "assistant",
                content: answerText,
                chartData: chartJson || undefined,
              },
            ],
          },
        },
      });
    }

    return NextResponse.json({
      message: answerText,
      chart: chartJson,
    });
  } catch (error) {
    console.error("Error in chat upload API:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
