'use client';

import { useState } from 'react';
import DashboardMain from './dashboard-main';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';

interface Message {
  id: number;
  text: string;
  type: "user" | "ai";
  chartData?: any;
  createdAt: string;
}

export default function ChatClient({
  chatLink,
  messages,
}: {
  chatLink: string;
  messages: Message[];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex bg-slate-950 text-white">
      <DashboardSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(p => !p)} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          onToggleSidebar={() => setSidebarOpen(p => !p)}
          sidebarOpen={sidebarOpen}
        />
        <DashboardMain chatLink={chatLink} initialMessages={messages} />
      </div>
    </div>
  );
}
