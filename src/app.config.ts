export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/tasks/index',
    'pages/report/index',
    'pages/messages/index',
    'pages/records/index',
    'pages/task-detail/index',
    'pages/record-detail/index',
    'pages/exception-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1E88E5',
    navigationBarTitleText: '能源站巡检',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#1E88E5',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页状态'
      },
      {
        pagePath: 'pages/tasks/index',
        text: '当班任务'
      },
      {
        pagePath: 'pages/report/index',
        text: '异常上报'
      },
      {
        pagePath: 'pages/messages/index',
        text: '消息提醒'
      },
      {
        pagePath: 'pages/records/index',
        text: '我的记录'
      }
    ]
  }
})
