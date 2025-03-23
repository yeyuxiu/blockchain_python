import { ethers } from "ethers";
import { message } from "antd";

export default {
  namespace: "user",
  state: {
    signer:{}
  },

  effects: {
    *login({ payload }, { call, put }) {
  
    },
  },

  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        signer: payload,
      };
    },  
  },
};
