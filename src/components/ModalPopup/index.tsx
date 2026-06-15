import React from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import { GunPosition } from '@/types';
import GunPositionCard from '@/components/GunPositionCard';
import { classnames } from '@/utils';
import styles from './index.module.scss';

interface ModalPopupProps {
  visible: boolean;
  title: string;
  gunPositions?: GunPosition[];
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  showKeyPoints?: boolean;
}

const ModalPopup: React.FC<ModalPopupProps> = ({
  visible,
  title,
  gunPositions = [],
  onClose,
  onConfirm,
  confirmText = '我知道了',
  showKeyPoints = true
}) => {
  if (!visible) return null;

  return (
    <View className={styles.modalOverlay} onClick={onClose}>
      <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <View className={styles.modalHeader}>
          <View className={styles.alertIcon}>
            <Text className={styles.alertIconText}>!</Text>
          </View>
          <Text className={styles.modalTitle}>{title}</Text>
        </View>

        {gunPositions.length > 0 && (
          <View className={styles.modalBody}>
            <Text className={styles.sectionTitle}>
              本班需重点关注的枪位（共{gunPositions.length}个）
            </Text>
            <ScrollView className={styles.gunList} scrollY>
              {gunPositions.map((gun) => (
                <GunPositionCard
                  key={gun.id}
                  gun={gun}
                  showKeyTag={showKeyPoints}
                />
              ))}
            </ScrollView>
          </View>
        )}

        <View className={styles.modalFooter}>
          {onConfirm && (
            <Button
              className={classnames(styles.modalBtn, styles.confirmBtn)}
              onClick={onConfirm}
            >
              <Text className={styles.btnText}>{confirmText}</Text>
            </Button>
          )}
          <Button
            className={classnames(styles.modalBtn, styles.closeBtn)}
            onClick={onClose}
          >
            <Text className={styles.closeBtnText}>关闭</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default ModalPopup;
