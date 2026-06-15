import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { AppProvider } from '@/context/AppContext';
// 全局样式
import './app.scss';

function App(props) {
  useEffect(() => {
    console.log('[App] 应用初始化完成');
  }, []);

  useDidShow(() => {
    console.log('[App] 应用显示');
  });

  useDidHide(() => {
    console.log('[App] 应用隐藏');
  });

  return (
    <AppProvider>
      {props.children}
    </AppProvider>
  );
}

export default App;
