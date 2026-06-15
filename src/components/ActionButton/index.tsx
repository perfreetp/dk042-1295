import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import { classnames } from '@/utils';
import styles from './index.module.scss';

type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'default';
type ButtonSize = 'small' | 'medium' | 'large';

interface ActionButtonProps {
  text: string;
  type?: ButtonType;
  size?: ButtonSize;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  block?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  type = 'primary',
  size = 'medium',
  icon,
  onClick,
  disabled = false,
  block = false
}) => {
  const typeColors: Record<ButtonType, { bg: string; color: string }> = {
    primary: { bg: 'linear-gradient(135deg, #1E88E5 0%, #64B5F6 100%)', color: '#FFFFFF' },
    success: { bg: 'linear-gradient(135deg, #00C853 0%, #69F0AE 100%)', color: '#FFFFFF' },
    warning: { bg: 'linear-gradient(135deg, #FF9100 0%, #FFD180 100%)', color: '#FFFFFF' },
    danger: { bg: 'linear-gradient(135deg, #FF1744 0%, #FF8A80 100%)', color: '#FFFFFF' },
    default: { bg: '#F2F3F5', color: '#4E5969' }
  };

  const sizeHeights: Record<ButtonSize, number> = {
    small: 64,
    medium: 80,
    large: 96
  };

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
    }
  };

  return (
    <Button
      className={classnames(
        styles.actionButton,
        styles[type],
        styles[size],
        { [styles.block]: block, [styles.disabled]: disabled }
      )}
      style={{
        background: typeColors[type].bg,
        height: `${sizeHeights[size]}rpx`
      }}
      onClick={handleClick}
      disabled={disabled}
    >
      <View className={styles.buttonContent}>
        {icon && <Text className={styles.buttonIcon}>{icon}</Text>}
        <Text className={styles.buttonText} style={{ color: typeColors[type].color }}>
          {text}
        </Text>
      </View>
    </Button>
  );
};

export default ActionButton;
