import React, { useState, useCallback } from 'react';
import { View, Text, Input, Textarea, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { mockGunPositions } from '@/data/mockGunPositions';
import { createExceptionTask } from '@/data/mockTasks';
import { createAlertMessage } from '@/data/mockMessages';
import { createReportRecord } from '@/data/mockRecords';
import { RiskLevel } from '@/types';
import {
  getRiskLevelText,
  getRiskLevelColor,
  classnames,
  getRiskByTemperature,
  getMockVoiceText
} from '@/utils';
import ActionButton from '@/components/ActionButton';
import { useAppContext } from '@/context/AppContext';
import styles from './index.module.scss';

const ReportPage: React.FC = () => {
  const { userInfo, addTask, addMessage, addRecord } = useAppContext();

  const [selectedGun, setSelectedGun] = useState<string | null>(null);
  const [riskLevel, setRiskLevel] = useState<RiskLevel | null>(null);
  const [temperature, setTemperature] = useState('');
  const [temperatureRise, setTemperatureRise] = useState('');
  const [description, setDescription] = useState('');
  const [measures, setMeasures] = useState<string[]>([]);
  const [customMeasure, setCustomMeasure] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const measureOptions = [
    '开启通风设备',
    '降低充电功率',
    '暂停使用该枪位',
    '设置警示标识',
    '检查连接是否松动',
    '清理散热孔'
  ];

  const riskOptions: { value: RiskLevel; label: string }[] = [
    { value: 'normal', label: '正常' },
    { value: 'attention', label: '注意' },
    { value: 'warning', label: '警告' },
    { value: 'danger', label: '危险' }
  ];

  const handleTempChange = useCallback((e: any) => {
    const temp = parseFloat(e.detail.value);
    setTemperature(e.detail.value);

    if (!isNaN(temp) && temperatureRise) {
      const rise = parseFloat(temperatureRise);
      if (!isNaN(rise)) {
        const autoRisk = getRiskByTemperature(temp, rise) as RiskLevel;
        setRiskLevel(autoRisk);
      }
    }
  }, [temperatureRise]);

  const handleRiseChange = useCallback((e: any) => {
    const rise = parseFloat(e.detail.value);
    setTemperatureRise(e.detail.value);

    if (!isNaN(rise) && temperature) {
      const temp = parseFloat(temperature);
      if (!isNaN(temp)) {
        const autoRisk = getRiskByTemperature(temp, rise) as RiskLevel;
        setRiskLevel(autoRisk);
      }
    }
  }, [temperature]);

  const handleVoiceInput = useCallback(() => {
    console.log('[Report] 启动语音输入');
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
    console.log('[Report] 启动拍照');
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera']
    }).then((res) => {
      setPhotos(prev => [...prev, res.tempFilePaths[0]]);
      console.log('[Report] 拍照成功:', res.tempFilePaths[0]);
    }).catch((err) => {
      console.error('[Report] 拍照失败:', err);
    });
  }, [photos]);

  const handleCallRepair = useCallback(() => {
    console.log('[Report] 一键呼叫维修');
    Taro.makePhoneCall({
      phoneNumber: '400-123-4567'
    }).then(() => {
      console.log('[Report] 呼叫维修人员成功');
      Taro.showToast({
        title: '已呼叫维修人员',
        icon: 'success'
      });
    }).catch((err) => {
      console.error('[Report] 呼叫维修失败:', err);
    });
  }, []);

  const toggleMeasure = useCallback((measure: string) => {
    setMeasures(prev =>
      prev.includes(measure)
        ? prev.filter(m => m !== measure)
        : [...prev, measure]
    );
  }, []);

  const handleSubmit = useCallback(() => {
    if (!selectedGun) {
      Taro.showToast({ title: '请选择枪位', icon: 'none' });
      return;
    }
    if (!riskLevel) {
      Taro.showToast({ title: '请选择风险等级', icon: 'none' });
      return;
    }
    if (!temperature || !temperatureRise) {
      Taro.showToast({ title: '请填写温度数据', icon: 'none' });
      return;
    }

    const gunPosition = mockGunPositions.find(g => g.id === selectedGun);
    if (!gunPosition) {
      Taro.showToast({ title: '枪位信息错误', icon: 'none' });
      return;
    }

    const allMeasures = [...measures];
    if (customMeasure.trim()) {
      allMeasures.push(customMeasure.trim());
    }
    const measuresStr = allMeasures.join('；');

    const tempVal = parseFloat(temperature);
    const riseVal = parseFloat(temperatureRise);

    const taskData = {
      gunPositionId: selectedGun,
      gunPositionName: gunPosition.name,
      gunPositionCode: gunPosition.code,
      temperature: tempVal,
      temperatureRise: riseVal,
      description: description || '异常上报',
      measures: measuresStr,
      photoUrls: photos,
      reporter: userInfo.name
    };

    const newTask = createExceptionTask(taskData);
    addTask(newTask);

    const messageData = {
      gunPositionName: gunPosition.name,
      gunPositionCode: gunPosition.code,
      temperature: tempVal,
      temperatureRise: riseVal,
      riskLevel: riskLevel,
      relatedId: newTask.id
    };
    const newMessage = createAlertMessage(messageData);
    addMessage(newMessage);

    const recordData = {
      gunPositionName: gunPosition.name,
      gunPositionCode: gunPosition.code,
      riskLevel: riskLevel,
      action: '异常上报',
      description: description || '发现温度异常，已上报',
      temperature: tempVal,
      temperatureRise: riseVal,
      measures: measuresStr
    };
    const newRecord = createReportRecord(recordData);
    addRecord(newRecord);

    console.log('[Report] 提交异常上报:', {
      task: newTask,
      message: newMessage,
      record: newRecord
    });

    Taro.showToast({
      title: '上报成功',
      icon: 'success'
    });

    setTimeout(() => {
      setSelectedGun(null);
      setRiskLevel(null);
      setTemperature('');
      setTemperatureRise('');
      setDescription('');
      setMeasures([]);
      setCustomMeasure('');
      setPhotos([]);
      Taro.switchTab({ url: '/pages/tasks/index' });
    }, 1500);
  }, [selectedGun, riskLevel, temperature, temperatureRise, description, measures, customMeasure, photos, userInfo.name, addTask, addMessage, addRecord]);

  return (
    <ScrollView className={styles.reportPage} scrollY>
      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>基本信息</Text>

        <View className={styles.inputGroup}>
          <Text className={styles.inputLabel}>
            选择枪位<Text className={styles.required}>*</Text>
          </Text>
          <View className={styles.gunSelector}>
            {mockGunPositions.map((gun) => (
              <View
                key={gun.id}
                className={classnames(styles.gunOption, { [styles.active]: selectedGun === gun.id })}
                onClick={() => setSelectedGun(gun.id)}
              >
                {gun.name}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.inputGroup}>
          <Text className={styles.inputLabel}>
            风险等级<Text className={styles.required}>*</Text>
          </Text>
          <View className={styles.riskSelector}>
            {riskOptions.map((opt) => (
              <View
                key={opt.value}
                className={classnames(styles.riskOption, { [styles.active]: riskLevel === opt.value })}
                style={{ color: getRiskLevelColor(opt.value) }}
                onClick={() => setRiskLevel(opt.value)}
              >
                <Text className={styles.riskText}>{opt.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.inputGroup}>
          <Text className={styles.inputLabel}>
            温度数据<Text className={styles.required}>*</Text>
          </Text>
          <View className={styles.inputRow}>
            <View className={styles.inputItem}>
              <Input
                className={styles.input}
                type="digit"
                value={temperature}
                onInput={handleTempChange}
                placeholder="当前温度(℃)"
              />
            </View>
            <View className={styles.inputItem}>
              <Input
                className={styles.input}
                type="digit"
                value={temperatureRise}
                onInput={handleRiseChange}
                placeholder="温升(K)"
              />
            </View>
          </View>
        </View>
      </View>

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>异常描述</Text>

        <View className={styles.inputGroup}>
          <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text className={styles.inputLabel}>现场情况描述</Text>
            <View className={styles.voiceBtn} onClick={handleVoiceInput}>
              <Text className={styles.voiceIcon}>🎤</Text>
              <Text className={styles.voiceText}>语音输入</Text>
            </View>
          </View>
          <Textarea
            className={styles.textarea}
            value={description}
            onInput={(e) => setDescription(e.detail.value)}
            placeholder="请详细描述异常情况..."
            maxlength={500}
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
      </View>

      <View className={styles.formCard}>
        <Text className={styles.sectionTitle}>已采取的临时措施</Text>

        <View className={styles.measuresSection}>
          <View className={styles.measuresOptions}>
            {measureOptions.map((measure) => (
              <View
                key={measure}
                className={classnames(styles.measureOption, { [styles.active]: measures.includes(measure) })}
                onClick={() => toggleMeasure(measure)}
              >
                {measure}
              </View>
            ))}
          </View>

          <View className={styles.customMeasure}>
            <Textarea
              className={styles.textarea}
              value={customMeasure}
              onInput={(e) => setCustomMeasure(e.detail.value)}
              placeholder="其他措施（可选）..."
              maxlength={200}
            />
          </View>
        </View>
      </View>

      <View className={styles.actionSection}>
        <View className={styles.quickActions}>
          <View className={styles.quickBtn}>
            <ActionButton
              text="一键呼叫维修"
              type="danger"
              size="large"
              onClick={handleCallRepair}
              block
            />
          </View>
        </View>

        <View className={styles.submitBtn}>
          <ActionButton
            text="提交上报"
            type="primary"
            size="large"
            onClick={handleSubmit}
            block
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default ReportPage;
