import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { UserInfo, ShiftInfo, Task, TaskTimelineItem, Message, Record, TaskStatus } from '@/types';
import { mockTasks } from '@/data/mockTasks';
import { mockMessages } from '@/data/mockMessages';
import { mockRecords } from '@/data/mockRecords';
import { getCurrentDateTime } from '@/utils';

interface TaskUpdateData {
  description?: string;
  measures?: string;
  photoUrl?: string;
  photoUrls?: string[];
  reviewTime?: string;
  handler?: string;
  completedAt?: string;
  timeline?: TaskTimelineItem[];
}

interface AppContextType {
  userInfo: UserInfo;
  shiftInfo: ShiftInfo;
  tasks: Task[];
  messages: Message[];
  records: Record[];
  unreadCount: number;
  completionRate: number;
  pendingCount: number;
  showHandoverModal: boolean;
  setShowHandoverModal: (show: boolean) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus, updates?: TaskUpdateData) => void;
  addTask: (task: Task) => void;
  markMessageAsRead: (messageId: string) => void;
  markAllMessagesAsRead: () => void;
  addMessage: (message: Message) => void;
  addRecord: (record: Record) => void;
  addReviewReminder: (task: Task) => void;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInfo] = useState<UserInfo>({
    name: '张三',
    role: '值守员',
    team: '白班一组'
  });

  const [shiftInfo, setShiftInfo] = useState<ShiftInfo>({
    date: '2026-06-16',
    shiftType: 'morning',
    startTime: '08:00',
    endTime: '16:00',
    completedTasks: 3,
    totalTasks: 8,
    completionRate: 38
  });

  const [tasks, setTasks] = useState<Task[]>([...mockTasks]);
  const [messages, setMessages] = useState<Message[]>([...mockMessages]);
  const [records, setRecords] = useState<Record[]>([...mockRecords]);
  const [showHandoverModal, setShowHandoverModal] = useState<boolean>(true);

  const unreadCount = useMemo(() => {
    return messages.filter(m => !m.isRead).length;
  }, [messages]);

  const completionRate = useMemo(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  const pendingCount = useMemo(() => {
    return tasks.filter(t => t.status === 'pending').length;
  }, [tasks]);

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus, updates?: TaskUpdateData) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          const newTimeline: TaskTimelineItem[] = [...(task.timeline || [])];
          if (status === 'processing' && task.status === 'pending') {
            newTimeline.push({
              time: getCurrentDateTime(),
              action: '开始处理',
              operator: updates?.handler,
              detail: updates?.description || '开始处理任务'
            });
          }
          if (status === 'completed') {
            newTimeline.push({
              time: getCurrentDateTime(),
              action: '完成处理',
              operator: updates?.handler,
              detail: updates?.measures || '任务处理完成'
            });
          }
          return {
            ...task,
            status,
            timeline: updates?.timeline || newTimeline,
            ...updates
          };
        }
        return task;
      });

      const completed = newTasks.filter(t => t.status === 'completed').length;
      setShiftInfo(prev => ({
        ...prev,
        completedTasks: completed,
        totalTasks: newTasks.length,
        completionRate: Math.round((completed / newTasks.length) * 100)
      }));

      return newTasks;
    });
  }, []);

  const addTask = useCallback((task: Task) => {
    setTasks(prevTasks => {
      const newTasks = [task, ...prevTasks];
      const completed = newTasks.filter(t => t.status === 'completed').length;
      setShiftInfo(prev => ({
        ...prev,
        completedTasks: completed,
        totalTasks: newTasks.length,
        completionRate: Math.round((completed / newTasks.length) * 100)
      }));
      return newTasks;
    });
  }, []);

  const markMessageAsRead = useCallback((messageId: string) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  }, []);

  const markAllMessagesAsRead = useCallback(() => {
    setMessages(prevMessages =>
      prevMessages.map(msg => ({ ...msg, isRead: true }))
    );
  }, []);

  const addMessage = useCallback((message: Message) => {
    setMessages(prevMessages => [message, ...prevMessages]);
  }, []);

  const addRecord = useCallback((record: Record) => {
    setRecords(prevRecords => [record, ...prevRecords]);
  }, []);

  const addReviewReminder = useCallback((task: Task) => {
    const reminder: Message = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
      type: 'reminder',
      title: '复查提醒',
      content: `${task.gunPositionName}(${task.gunPositionCode})已到复查时间，请及时复查温度`,
      isRead: false,
      createdAt: getCurrentDateTime(),
      relatedId: task.id
    };
    setMessages(prevMessages => [reminder, ...prevMessages]);
  }, []);

  const refreshData = useCallback(() => {
    setTasks([...mockTasks]);
    setMessages([...mockMessages]);
    setRecords([...mockRecords]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        userInfo,
        shiftInfo,
        tasks,
        messages,
        records,
        unreadCount,
        completionRate,
        pendingCount,
        showHandoverModal,
        setShowHandoverModal,
        updateTaskStatus,
        addTask,
        markMessageAsRead,
        markAllMessagesAsRead,
        addMessage,
        addRecord,
        addReviewReminder,
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
