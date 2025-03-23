import { defineConfig } from "@umijs/max";

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
  layout: { title: "@umijs/max" },
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      name: "首页",
      path: "/home",
      component: "./Home",
    },
    {
      name: "NFT市场",
      path: "/NFTMarket",
      component: "./NFTMarket",
    },
  ],

  npmClient: "pnpm",
  tailwindcss: {},
  dva: {},
});
