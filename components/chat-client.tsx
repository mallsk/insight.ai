'use client';

import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import DashboardMain from './dashboard-main';

export default function ChatClient() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    // console.log('Sidebar toggle clicked');
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="h-screen flex bg-slate-950 text-white">
      <DashboardSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          onToggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />
        <DashboardMain />
      </div>
    </div>
  );
}
