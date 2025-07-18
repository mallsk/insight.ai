import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { link: string } }
) {
  try {
    const messages = await prisma.message.findMany({
      where: { chatId: params.link },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages.' },
      { status: 500 }
    );
  }
}

// Save a new message to a specific chat
export async function POST(
  request: Request,
  { params }: { params: { link: string } }
) {
  try {
    const body = await request.json();
    const { type, text, chartData } = body;

    const newMessage = await prisma.message.create({
      data: {
        chatId: params.link,
        type,
        text,
        chartData: chartData || undefined,
      },
    });
    return NextResponse.json(newMessage);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save message.' },
      { status: 500 }
    );
  }
}