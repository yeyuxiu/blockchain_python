import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  // access: {},
  model: {
    // extraModels: [
    //   "src/models/walletSigner.ts",
    // ],
    // sort: (a: any, b: any) => a.namespace.localeCompare(b.namespace),
  },
  initialState: {},
  request: {},
  layout: { title: '@umijs/max' },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: 'NFT市场',
      path: '/NFTMarket',
      component: './NFTMarket',
    },
    {
      name: '老虎机',
      path: '/slotMachine',
      component: './SlotMachine',
    },
  ],
  npmClient: 'pnpm',
  tailwindcss: {},
  dva: {},
  proxy: {
    '/api/v0': {
      target: 'http://127.0.0.1:5001',
      secure: false,
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api/v0': '', 
      // },
    },
    '/ipfs':{
      target: 'http://127.0.0.1:8080',
      secure:false,
      changeOrigin:true
    }
  },
});
