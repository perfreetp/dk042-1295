import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, Textarea, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Task, TaskStatus } from '@/types';
import { getTaskStatusColor, getTaskStatusText, classnames, getCurrentDateTime, getMockVoiceText } from '@/utils';
import TaskCard from '@/components/TaskCard';
import ActionButton from '@/components/ActionButton';
import { useAppContext } from '@/context/AppContext';
import { createReportRecord } from '@/data/mockRecords';
import styles from './index.module.scss';

type FilterType = 'all' | TaskStatus;

const TasksPage: React.FC = () => {
  const { userInfo, tasks, updateTaskStatus, addRecord } = useAppContext();
  const [filter, setFilter] = useState<FilterType>('all');
  const [showSheet, setShowSheet] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [sheetType, setSheetType] = useState<'process' | 'complete'>('process');

  const [measures, setMeasures] = useState('');
  const [description, setDescription] = useState('');
  const [currentTemp, setCurrentTemp] = useState('');
  const [currentRise, setCurrentRise] = useState('');
  const [reviewTime, setReviewTime] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter(t => t.status === filter);
  }, [tasks, filter]);

  const allCount = tasks.length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const processingCount = tasks.filter(t => t.status === 'processing').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: '全部', count: allCount },
    { key: 'pending', label: '待处理', count: pendingCount },
    { key: 'processing', label: '处理中', count: processingCount },
    { key: 'completed', label: '已完成', count: completedCount }
  ];

  const reviewOptions = [
    { value: '15', label: '15分钟后' },
    { value: '30', label: '30分钟后' },
    { value: '60', label: '1小时后' },
    { value: '120', label: '2小时后' }
  ];

  const handleProcess = useCallback((task: Task) => {
    setCurrentTask(task);
    setSheetType('process');
    setMeasures(task.measures || '');
    setDescription('');
    setCurrentTemp(task.temperature.toString());
    setCurrentRise(task.temperatureRise.toString());
    setReviewTime(null);
    setPhotos(task.photoUrl ? [task.photoUrl] : []);
    setShowSheet(true);
  }, []);

  const handleComplete = useCallback((task: Task) => {
    setCurrentTask(task);
    setSheetType('complete');
    setMeasures(task.measures || '');
    setDescription('');
    setCurrentTemp(task.temperature.toString());
    setCurrentRise(task.temperatureRise.toString());
    setReviewTime(null);
    setPhotos(task.photoUrl ? [task.photoUrl] : []);
    setShowSheet(true);
  }, []);

  const handleCallRepair = useCallback((task: Task) => {
    Taro.makePhoneCall({
      phoneNumber: '400-123-4567'
    }).then(() => {
      console.log('[Task] 呼叫维修人员成功:', task.gunPositionName);
      Taro.showToast({
        title: '已呼叫维修人员',
        icon: 'success'
      });
    }).catch((err) => {
      console.error('[Task] 呼叫维修失败:', err);
    });
  }, []);

  const handleVoiceInput = useCallback(() => {
    console.log('[Task] 启动语音输入');
    const voiceText = getMockVoiceText();
    setDescription(prev => {
      if (prev.trim()) {
        return prev + '\n' + voiceText;
      }
      return voiceText;
    });
    Taro.showToast({
      title: '语音识别完成',
      icon: 'success'
    });
  }, []);

  const handleTakePhoto = useCallback(() => {
    console.log('[Task] 启动拍照');
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera']
    }).then((res) => {
      setPhotos(prev => [...prev, res.tempFilePaths[0]]);
      console.log('[Task] 拍照成功:', res.tempFilePaths[0]);
    }).catch((err) => {
      console.error('[Task] 拍照失败:', err);
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (!currentTask) return;

    const newStatus: TaskStatus = sheetType === 'complete' ? 'completed' : 'processing';
    const now = getCurrentDateTime();

    const updates = {
      description: description || currentTask.description,
      measures: measures || currentTask.measures,
      photoUrl: photos.length > 0 ? photos[0] : currentTask.photoUrl,
      reviewTime: reviewTime || currentTask.reviewTime,
      handler: userInfo.name,
      completedAt: newStatus === 'completed' ? now : currentTask.completedAt
    };

    updateTaskStatus(currentTask.id, newStatus, updates);

    if (newStatus === 'completed') {
      const record = createReportRecord({
        gunPositionName: currentTask.gunPositionName,
        gunPositionCode: currentTask.gunPositionCode,
        riskLevel: currentTask.riskLevel,
        action: '任务完成',
        description: description || '任务处理完成',
        temperature: parseFloat(currentTemp) || currentTask.temperature,
        temperatureRise: parseFloat(currentRise) || currentTask.temperatureRise,
        measures: measures
      });
      addRecord(record);
    }

    console.log('[Task] 提交处理结果:', {
      taskId: currentTask.id,
      type: sheetType,
      status: newStatus,
      ...updates
    });

    Taro.showToast({
      title: sheetType === 'complete' ? '任务已完成' : '已开始处理',
      icon: 'success'
    });

    setShowSheet(false);
  }, [currentTask, sheetType, description, measures, currentTemp, currentRise, reviewTime, photos, userInfo.name, updateTaskStatus, addRecord]);

  const handleCloseSheet = useCallback(() => {
    setShowSheet(false);
    setCurrentTask(null);
  }, []);

  return (
    <View className={styles.tasksPage}>
      <View className={styles.filterSection}>
        {filters.map((f) => (
          <View
            key={f.key}
            className={classnames(styles.filterTab, { [styles.active]: filter === f.key })}
            onClick={() => setFilter(f.key)}
          >
            <Text className={styles.filterText}>
              {f.label}
              <Text className={styles.filterCount}>({f.count})</Text>
            </Text>
          </View>
        ))}
      </View>

      <View className={styles.statsSection}>
        <View className={styles.statsGrid}>
          <View className={styles.statCard}>
            <Text className={styles.statNumber} style={{ color: getTaskStatusColor('pending') }}>
              {pendingCount}
            </Text>
            <Text className={styles.statLabel}>待处理</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNumber} style={{ color: getTaskStatusColor('processing') }}>
              {processingCount}
            </Text>
            <Text className={styles.statLabel}>处理中</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statNumber} style={{ color: getTaskStatusColor('completed') }}>
              {completedCount}
            </Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
        </View>
      </View>

      <ScrollView scrollY>
        <View className={styles.tasksSection}>
          <Text className={styles.sectionTitle}>
            {filter === 'all' ? '全部任务' : getTaskStatusText(filter as TaskStatus)}
          </Text>
          <View className={styles.tasksList}>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onProcess={handleProcess}
                  onComplete={handleComplete}
                  onCallRepair={handleCallRepair}
                />
              ))
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>📋</Text>
                <Text className={styles.emptyText}>暂无任务</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {showSheet && <View className={styles.overlay} onClick={handleCloseSheet} />}

      {showSheet && (
        <View className={styles.actionSheet}>
          <Text className={styles.sheetTitle}>
            {sheetType === 'complete' ? '完成任务' : '处理任务'} - {currentTask?.gunPositionName}
          </Text>

          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>当前温度 / 温升</Text>
            <View className={styles.inputRow}>
              <View className={styles.inputItem}>
                <Input
                  className={styles.input}
                  type="digit"
                  value={currentTemp}
                  onInput={(e) => setCurrentTemp(e.detail.value)}
                  placeholder="当前温度(℃)"
                />
              </View>
              <View className={styles.inputItem}>
                <Input
                  className={styles.input}
                  type="digit"
                  value={currentRise}
                  onInput={(e) => setCurrentRise(e.detail.value)}
                  placeholder="温升(K)"
                />
              </View>
            </View>
          </View>

          <View className={styles.inputGroup}>
            <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text className={styles.inputLabel}>现场情况描述</Text>
              <Text
                style={{ fontSize: '24rpx', color: '#1E88E5' }}
                onClick={handleVoiceInput}
              >
                🎤 语音输入
              </Text>
            </View>
            <Textarea
              className={styles.textarea}
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
              placeholder="请描述现场情况..."
              maxlength={200}
            />
          </View>

          <View className={styles.inputGroup}>
            <Text className={styles.inputLabel}>已采取的临时措施</Text>
            <Textarea
              className={styles.textarea}
              value={measures}
              onInput={(e) => setMeasures(e.detail.value)}
              placeholder="请描述已采取的临时措施..."
              maxlength={200}
            />
          </View>

          <View className={styles.photoSection}>
            <Text className={styles.inputLabel}>现场照片（点击拍照）</Text>
            <View className={styles.photoGrid}>
              {photos.map((photo, index) => (
                <View key={index} className={styles.photoItem}>
                  <Text className={styles.photoAdd}>📷</Text>
                </View>
              ))}
              {photos.length < 4 && (
                <View className={styles.photoItem} onClick={handleTakePhoto}>
                  <Text className={styles.photoAdd}>+</Text>
                </View>
              )}
            </View>
          </View>

          {sheetType === 'process' && (
            <View className={styles.reviewSection}>
              <Text className={styles.inputLabel}>设置复查提醒</Text>
              <View className={styles.timeOptions}>
                {reviewOptions.map((opt) => (
                  <View
                    key={opt.value}
                    className={classnames(styles.timeOption, { [styles.active]: reviewTime === opt.value })}
                    onClick={() => setReviewTime(opt.value)}
                  >
                    {opt.label}
                  </View>
                ))}
              </View>
            </View>
          )}

          <View className={styles.sheetButtons}>
            <View className={styles.sheetBtn}>
              <ActionButton
                text="取消"
                type="default"
                size="large"
                onClick={handleCloseSheet}
                block
              />
            </View>
            <View className={styles.sheetBtn}>
              <ActionButton
                text={sheetType === 'complete' ? '确认完成' : '确认处理'}
                type={sheetType === 'complete' ? 'success' : 'primary'}
                size="large"
                onClick={handleSubmit}
                block
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default TasksPage;
