/*
 * @Description: 首页
 * @Author: smilechao
 * @Date: 2023-06-14 09:27:50
 * @dev: 1. NFT Mint = 上传操作
 * 2. NFT Transfer = 转移操作
 * 样式处理
 */
import CustomIcon from '@/components/CustomIcon';
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  List,
  Row,
  Space,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
//import classnames from 'classnames';
import styles from './index.less';
//import moment from 'moment';
import { axiosGet } from '@/utils/axios';
import { useModel } from '@umijs/max';
import 'dotenv/config';
import UploadModal from './uploadModal';
import {ethers} from 'ethers'
// import {createHelia} from 'helia'
// import { dagCbor } from '@helia/dag-cbor';
// import { json } from '@helia/json';

type MenuItem = Required<MenuProps>['items'][number];

type ntfInfo = {
  name: string;
  age: number;
  img: string;
  // ipfsCid: string;
};

interface uploadInfo {
  visible: boolean;
  nftInfo: ntfInfo;
}

const ComName: React.FC = (props: any, ref: any) => {
  const [nftUploadVisible, setNftUploadVisible] = useState(false);
  const [cidList, setCidList] = useState<string[]>([]); // 存cid 同时监控 转换为 nft list
  const [nftList, setNftList] = useState<ntfInfo[]>([]); // 所有nft数据

  const { signer, login, logout } = useModel('walletSigner'); // 登陆数据

  // useImperativeHandle(ref, () => ({
  // }));
  //const {} = props

  const menuList: MenuItem[] = [
    {
      key: '1',
      label: '上传NFT',
      onClick: (e) => handleMenuClick('1'),
    },
    {
      key: '2',
      label: '转移NFT',
      onClick: (e) => handleMenuClick('2'),
    },
    {
      key: '3',
      label: '我的个人资料',
      onClick: (e) => handleMenuClick('3'),
    },
  ]; // 数据

  useEffect(() => {
    console.log(process.env, 'process.env');
  }, [])
  
  // 监控cidList变化同时转化数据并改变 nftList
  useEffect(() => {
    fromCidGetData(cidList);
  }, [cidList]);

  // cid转换为可见数据 利用 verify 验证
  const fromCidGetData = async (cidList: string[]) => {
    // const helia = await createHelia()
    // const j = json(helia)
    const reqList = cidList.map((cid) => axiosGet(`/ipfs/${cid}`));
    Promise.all(reqList).then((resList) => {
      cidList.forEach((cid, index) => {
        resList[index].ipfsCid = cid;
      });
      setNftList(resList);
    });

    // await helia.stop();
  };

  // 新增nft cid数据
  const pushNftList = (cid: string) => {
    setCidList((pre) => [...pre, cid]);
  };

  // usermenu click
  const handleMenuClick = async (key: string) => {
    if (key === '1') {
      setNftUploadVisible(true);
    } else if (key === '2') {
      // TODO 调用合约
    } else {
    }
  };

  // 公钥中间部分省略
  const handleAddressName = (name: string): string => {
    // 处理名字 前5位 后4位
    const startStr = name.substring(0, 6);
    const endStr = name.substring(name.length - 4);

    return startStr + '...' + endStr;
  };
  console.log(signer, 'signer');
  return (
    <>
      <div className={styles.box}>
        <div className={styles.header}>
          <Row>
            <Col span={3}>
              <div className={styles.left_fun_box}></div>
            </Col>
            <Col span={18}>
              <h1 className="text-xl text-center font-bold">NTF市场</h1>
            </Col>
            <Col span={3}>
              <div className={styles.right_fun_box}>
                {signer?.address ? (
                  <Dropdown menu={{ items: menuList }}>
                    <div className={styles.userbox}>
                      <Space>
                        <Avatar
                          size={32}
                          shape="square"
                          icon={<UserOutlined />}
                        />
                        <span>{handleAddressName(signer.address)}</span>
                      </Space>
                    </div>
                  </Dropdown>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => {
                      login();
                    }}
                  >
                    登陆
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
        {/* each box */}
        <div className={styles.content}>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={nftList}
            renderItem={(item) => (
              <List.Item>
                <Card
                  style={{ width: 300 }}
                  cover={
                    <img
                      alt="example"
                      src={item.img}
                      style={{ width: '100', height: 120 }}
                    />
                  }
                  actions={[
                    <Tooltip title="转移">
                      <CustomIcon
                        type="transfer"
                        key="transfer"
                        onClick={() => {}}
                        style={{ width: 25 }}
                      />
                    </Tooltip>,
                    // <Tooltip title="领养">
                    //   <CustomIcon
                    //     type="adopt"
                    //     key="adopt"
                    //     onClick={() => {
                    //       //TODO web3 调用合约
                    //     }}
                    //     style={{ width: 25 }}
                    //   />
                    // </Tooltip>,
                  ]}
                >
                  <p>名字：{item.name}</p>
                  <p>年龄：{item.age}</p>
                  <a
                    href={`http://127.0.0.1:8080/ipfs/${item.ipfsCid}`}
                    className="overflow-ellipsis overflow-hidden whitespace-nowrap"
                  >
                    ipfs：{item.ipfsCid}
                  </a>
                </Card>
              </List.Item>
            )}
          />
        </div>
      </div>
      <UploadModal
        visible={nftUploadVisible}
        setVisible={(e: any) => {
          setNftUploadVisible(e);
        }}
        pushNftList={pushNftList}
      />

      {/* {cidSource && <img src={cidSource} alt="" />} */}
    </>
  );
};
// forwardRef(ComName);
export default ComName;
// export default connect(({ user }) => ({
// ...user
// }))(ComName);

// TODO

/**
 *  helia 一个IPFS的库
 * 
// https://github.com/ipfs/helia
// https://ipfs.github.io/helia/
 */

// p2p 节点连接
// import { createLibp2p } from 'libp2p'
// import { bootstrap } from '@libp2p/bootstrap'
// import { identify } from '@libp2p/identify'
// import { tcp } from '@libp2p/tcp'
// import { noise } from '@chainsafe/libp2p-noise'
// import { yamux } from '@chainsafe/libp2p-yamux'
// import { webRTC } from '@libp2p/webrtc'
// import { websockets } from '@libp2p/websockets'
// import { webtransport } from '@libp2p/webtransport'

// 通过CID检索数据
// import { verifiedFetch } from '@helia/verified-fetchs'
// const output = document.getElementById('output')

// const resp = await verifiedFetch('ipfs://bafkreia2xtwwdys4dxonlzjod5yxdz7tkiut5l2sgrdrh4d52d3qpstrpy')
// const blob = await resp.blob()
// const imgEl = document.createElement('img')
// imgEl.setAttribute('src', URL.createObjectURL(blob))
// imgEl.setAttribute('width', '50%')
// output.appendChild(imgEl)
