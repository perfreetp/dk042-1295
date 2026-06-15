import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserInfo, ShiftInfo, GunPosition, Task, Message } from '@/types';
import { getUnreadCount } from '@/data/mockMessages';
import { getCompletionRate, getPendingTasksCount } from '@/data/mockTasks';

interface AppContextType {
  userInfo: UserInfo;
  shiftInfo: ShiftInfo;
  unreadCount: number;
  completionRate: number;
  pendingCount: number;
  showHandoverModal: boolean;
  setShowHandoverModal: (show: boolean) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInfo] = useState<UserInfo>({
    name: '张三',
    role: '值守员',
    team: '白班一组'
  });

  const [shiftInfo] = useState<ShiftInfo>({
    date: '2026-06-16',
    shiftType: 'morning',
    startTime: '08:00',
    endTime: '16:00',
    completedTasks: 3,
    totalTasks: 8,
    completionRate: 38
  });

  const [unreadCount, setUnreadCount] = useState<number>(getUnreadCount());
  const [completionRate, setCompletionRate] = useState<number>(getCompletionRate());
  const [pendingCount, setPendingCount] = useState<number>(getPendingTasksCount());
  const [showHandoverModal, setShowHandoverModal] = useState<boolean>(true);

  const refreshData = useCallback(() => {
    setUnreadCount(getUnreadCount());
    setCompletionRate(getCompletionRate());
    setPendingCount(getPendingTasksCount());
  }, []);

  return (
    <AppContext.Provider
      value={{
        userInfo,
        shiftInfo,
        unreadCount,
        completionRate,
        pendingCount,
        showHandoverModal,
        setShowHandoverModal,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
