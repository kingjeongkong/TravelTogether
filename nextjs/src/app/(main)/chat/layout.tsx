'use client';

import DataFetchErrorBoundary from '@/components/ErrorBoundary/DataFetchErrorBoundary';
import ChatList from '@/features/chat/components/ChatList';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { usePathname } from 'next/navigation';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const pathname = usePathname();
  const isRootPath = pathname === '/chat';

  if (isMobile) {
    // ------ (A) 모바일 레이아웃 ------
    return (
      <div className="flex flex-col h-[100dvh] bg-gray-100 overflow-hidden">
        <main className="flex-1 overflow-hidden pb-16 md:pb-0">
          {/* 모바일에서는 children 안에서 index이면 ChatList, :chatId이면 ChatRoom */}
          <DataFetchErrorBoundary>{children}</DataFetchErrorBoundary>
        </main>
      </div>
    );
  } else {
    // ------ (B) 데스크톱 레이아웃 ------
    const hasChatId = !isRootPath; // /chat/:chatId면 true, /chat이면 false

    return (
      <div className="flex h-full min-h-0 overflow-hidden bg-gray-100">
        <main className="flex flex-1 h-full min-h-0">
          {/* 직접 ChatList를 렌더링 */}
          <div className="border-r border-gray-300 w-[350px] h-full min-h-0">
            <DataFetchErrorBoundary>
              <ChatList />
            </DataFetchErrorBoundary>
          </div>

          {/* 오른쪽 영역: /chat/:chatId 일 때만 children (ChatRoom) 표시 */}
          {hasChatId ? (
            <div className="flex-1 h-full min-h-0">
              <DataFetchErrorBoundary>{children}</DataFetchErrorBoundary>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center h-full min-h-0">
              <div className="text-gray-500">Select a chat.</div>
            </div>
          )}
        </main>
      </div>
    );
  }
}
