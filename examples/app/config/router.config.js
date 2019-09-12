/*
 * elc_web_version
 *   - 0: 企业版
 *   - 1：集团版
 * 默认都是
 *   0
 * */
export default [{
  path: '/user',
  component: '/walala',
  routes: []
}, // app
{
  path: '/',
  component: '../layouts/BasicLayout',
  Routes: ['src/pages/Authorized'],
  routes: [{
    path: "/AccountManagement",
    name: "AccountManagement",
    component: "./Account/Settings/AccountManagement"
  }, {
    path: '/',
    redirect: '/home',
    authority: ['admin', 'user']
  }, {
    path: '/home',
    name: 'home',
    icon: 'home',
    component: './Home/Home' // elc_web_version: [0, 1],

  }, {
    path: '/optimizer',
    name: 'optimizer',
    icon: 'control',
    routes: [{
      path: '/optimizer/overview',
      name: 'optimizeroverview',
      component: './Optimizer/Overview'
    }, {
      path: '/optimizer/services',
      name: 'optimizerservices',
      component: './Optimizer/Optimizer'
    }]
  }, {
    component: '404'
  }]
}];