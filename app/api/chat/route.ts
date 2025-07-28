import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as XLSX from 'xlsx';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    const query = formData.get('query') as string | null;
    const chatLink = formData.get('chatId') as string | null;

    if (!file || !query || !chatLink) {
      return NextResponse.json(
        { error: 'File, query, and chatLink are required.' },
        { status: 400 }
      );
    }

    // Read file buffer and decode
    const fileBuffer = await file.arrayBuffer();
    let fileContent: string;
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      const textDecoder = new TextDecoder('utf-8');
      fileContent = textDecoder.decode(fileBuffer);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      fileContent = XLSX.utils.sheet_to_csv(worksheet);
    } else {
      return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 });
    }

    // Get session and user
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prepare prompts
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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

Here is the data:
--- DATA START ---
${fileContent}
--- DATA END ---

Here is the user question:
"${query}"

Respond ONLY with a JSON format chart config.
If the user didn't mention a specific chart type, default to a bar chart.
Return only the JSON object (do not include markdown or explanation).
`;

    const [answerRes, chartRes] = await Promise.all([
      model.generateContent(analysisPrompt),
      model.generateContent(chartPrompt),
    ]);

    const answerText = answerRes.response.text();
    const chartText = chartRes.response.text();


  let chartJson = null;
try {
  const cleanedChart = chartText.replace(/```json|```/g, '').trim();
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
          { role: 'user', content: query },
          {
            role: 'assistant',
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
          { role: 'user', content: query },
          {
            role: 'assistant',
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
    console.error('Error in chat upload API:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
