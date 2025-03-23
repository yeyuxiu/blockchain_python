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
    provider = new ethers.BrowserProvider(window.ethereum);
    // // If no %%url%% is provided, it connects to the default
    // // http://localhost:8545, which most nodes use.
    // provider = new ethers.JsonRpcProvider(url);

    // 拿到公钥
    signer = await provider.getSigner();
    console.log(signer, 'signer');
    setSigner(signer);
  }, []);

  const logout = useCallback(() => {
    setSigner({});
  }, []);

  return { signer, login, logout };
};
