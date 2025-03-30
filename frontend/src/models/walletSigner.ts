import { message } from 'antd';
import { ethers } from 'ethers';
import { useCallback, useState } from 'react';

export default () => {
  const [signer, setSigner] = useState({});

  const login = useCallback(async () => {
    let signer = null;
    let provider;
    if (window.ethereum == null) {
      message.warning('钱包还没安装');
      return;
    }
    // provider = new ethers.BrowserProvider(window.ethereum);
    // If no url is provided, it connects to the default
    // http://localhost:8545, which most nodes use.
    provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

// 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

// 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
// 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

    // 拿到公钥
    signer = await provider.getSigner();
    console.log(signer, 'signer');

    // 查找当前块号
    const blockNumber = await provider.getBlockNumber();
    // 获取账户余额（通过地址或 ENS 名称，如果网络支持）
    const balance = await provider.getBalance('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    // { BigNumber: "182334002436162568" }
    const networkConfig = await provider.getNetwork();
    console.log('测试钱包信息：', {
      signer,
      blockNumber,
      balance, // ethers.utils.formatEther(balance)
      networkConfig
    });

    setSigner(signer);
  }, []);

  const logout = useCallback(() => {
    setSigner({});
  }, []);

  return { signer, login, logout };
};
