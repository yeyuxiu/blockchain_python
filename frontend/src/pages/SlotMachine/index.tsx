/*
 * @Description: 老虎机
 * @Author: smilechao
 * @Date: 2023-06-14 09:27:50
 * @dev: VRF + Transfer
 * TODO:
 * 1. 点击登陆，metamask可以切换登录账号
 * 2. 每次点击抽奖都要触发钱包的交互
 */
import React, { useEffect, useState } from 'react';
//import classnames from 'classnames';
import styles from './index.less';
//import moment from 'moment';
import { useModel } from '@umijs/max';
import { Button, message } from 'antd';
import { ethers } from 'ethers';
import abi from './abi.json';

const ComName: React.FC = (props, ref) => {
  //useImperativeHandle(ref, () => ({
  //lyFormRef
  //}));
  //const {} = props
  const [data, setData] = useState(null); // 数据
  const [reqVRFLoading, setReqVARLoading] = useState(false); // 请求VRF
  const [loading, setLoading] = useState(false); //交易等待时间
  const { signer, provider, login, logout } = useModel('walletSigner'); // 登陆数据

  useEffect(() => {}, []);

  const loginFun = () => {
    login();
  };

  const getRandom = async () => {
    if (signer?.address) {
      setLoading(true);
      const address = '0xb28A2bBB5Fcbb849cB44aE7a0B0765b1C5423503';
      const slotMachineContract_rw = new ethers.Contract(address, abi, signer);

      // const slotMacineWithSigner = slotMachineContract.connect(signer);
      // const testResult =
      // await slotMachineContract_rw.callStatic.requestRandomWords(false);
      // console.log(testResult, 'testResult');

      const trans = await slotMachineContract_rw.requestRandomWords(false);
      // 这不会修改状态，只是模拟调用

      const receipt = await trans.wait(6);
      setLoading(false);
      // 交易哈希
      // console.log('交易哈希:', receipt.hash);

      // 区块信息
      // console.log('区块号:', receipt.blockNumber);
      // console.log('区块哈希:', receipt.blockHash);

      // 交易索引
      // console.log('交易索引:', receipt.index);

      // Gas使用情况
      // console.log('Gas使用量:', receipt.gasUsed.toString());
      // console.log('累计Gas使用量:', receipt.cumulativeGasUsed.toString());
      // console.log("有效Gas价格:", receipt.effectiveGasPrice.toString());

      // 交易状态(1=成功, 0=失败)
      console.log('交易状态:', receipt.status);

      // 合约地址(如果是部署合约的交易)
      const events = receipt.logs;
      // console.log(events, 'events');
      if (events) {
        // console.log(`交易触发了 ${events.length} 个事件`);

        // 遍历所有事件
        events.forEach(async (event, i) => {
          console.log(`事件 #${i}:`);
          if (event?.fragment?.name == 'RequestSent') {
            console.log(event, 'event');
            const reqId = event.args?.[0];
            if (reqId) {
              let status = false;

              message.success('等待区块确定');
              while (!status) {

                const result = await slotMachineContract_rw.getRequestStatus(
                  reqId,
                ); // r-o (read-only)
                if (result[0]) {
                  status = true;
                  setData(result[1].map(item => item.toString()));
                }
              }
            }
          }
        });
      }
    } else {
      message.error('无效用户');
    }
  };
  console.log(data, 'data');
  return (
    <div className={styles.box}>
      {signer?.address && (
        <div>
          <span>账户：</span>
          <span>{signer.address}</span>
        </div>
      )}

      {!signer?.address && (
        <Button
          onClick={() => {
            loginFun();
          }}
          type="primary"
        >
          登陆
        </Button>
      )}

      {signer?.address && (
        <Button
          onClick={() => {
            getRandom();
          }}
          className="ml-16"
          loading={loading}
        >
          投币
        </Button>
      )}

      <div>
        {data && <span>结果：{data[0]}</span>}
        <span></span>
      </div>
    </div>
  );
};
//forwardRef(ComName);
export default ComName;
//export default connect(({ test }) => ({
//...test
//}))(ComName);
