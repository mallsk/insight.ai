import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { chatlink: string } }
) {
  try {
    const messages = await prisma.message.findMany({
      where: { chatId: params.chatlink },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { chatlink: string } }
) {
  try {
    const { type, text, chartData } = await request.json();

    if (!type || !text) {
      return NextResponse.json(
        { error: 'Missing message type or text.' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        chatId: params.chatlink,
        type,
        text,
        chartData: chartData || undefined,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { error: 'Failed to save message.' },
      { status: 500 }
    );
  }
}
