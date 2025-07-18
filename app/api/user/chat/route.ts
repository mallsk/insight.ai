import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as XLSX from 'xlsx';
import { prisma } from '@/lib/prisma'; // your prisma client
import { v4 as uuidv4 } from 'uuid';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const query = formData.get('query') as string | null;
    const email = formData.get('email') as string | null;
    const chatLink = formData.get('chatLink') as string | null;

    if (!file || !query || !email) {
      return NextResponse.json({ error: 'Missing file, query, or email.' }, { status: 400 });
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

    // Fetch user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Create or find chat
    let chat = null;
    let finalChatLink = chatLink;

    if (!chatLink) {
      finalChatLink = uuidv4();
      chat = await prisma.chat.create({
        data: {
          title : query,
          userId: user.id,
          link: finalChatLink,
        },
      });
    } else {
      chat = await prisma.chat.findUnique({
        where: { link: chatLink },
      });
    }

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found or could not be created.' }, { status: 500 });
    }

    // Save user message
    await prisma.message.create({
      data: {
        text: query,
        type: 'user',
        chatId: finalChatLink!,
      },
    });

    // AI response
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
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiMessage = response.text();

    // Save AI message
    await prisma.message.create({
      data: {
        text: aiMessage,
        type: 'ai',
        chatId: finalChatLink!,
      },
    });

    return NextResponse.json({
      message: aiMessage,
      chatLink: finalChatLink,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
