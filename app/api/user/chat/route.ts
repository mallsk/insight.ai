import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as XLSX from 'xlsx';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const query = formData.get('query') as string | null;

    if (!file || !query) {
      return NextResponse.json({ error: 'File and query are required.' }, { status: 400 });
    }
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

    // --- Gemini AI Interaction ---
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
      You are an expert data analyst AI, the core of the "InsightAI Dashboard".
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiMessage = response.text();

    return NextResponse.json({ message: aiMessage });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}