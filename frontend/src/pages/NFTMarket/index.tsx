/*
 * @Description: 首页
 * @Author: smilechao
 * @Date: 2023-06-14 09:27:50
 * @dev: 1. NFT上传 转移 领取
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
import smileImg from '@/assets/images/smile.jpg';
import { useModel } from '@umijs/max';
import UploadModal from './uploadModal';

// import { strings } from '@helia/strings';
import { createHelia } from 'helia';

type MenuItem = Required<MenuProps>['items'][number];

type ntfInfo = {
  name: string;
  age: number;
  img: string;
};

interface uploadInfo {
  visible: boolean;
  nftInfo: ntfInfo;
}

const ComName: React.FC = (props: any, ref: any) => {
  const [nftUploadInfo, setNftUploadInfo] = useState({
    visible: false,
    nftInfo: {},
  });
  const [nftList, setNftList] = useState<ntfInfo[]>([
    { name: 'mao', age: 16, img: smileImg },
  ]);
  const { signer, login, logout } = useModel('walletSigner'); // 不知道为什么用不成功

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

  // usermenu click
  const handleMenuClick = async (key: string) => {
    if (key === '1') {
      setNftUploadInfo({
        visible: true,
        nftInfo: {},
      });
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

  useEffect(() => {}, []);

  // 测试button
  const testFun = async () => {
    // const helia = await createHelia();
    // const s = strings(helia);

    // const myImmutableAddress = await s.add('hello world');

    // console.log(await s.get(myImmutableAddress));
  };

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
                  cover={<img alt="example" src={item.img} />}
                  actions={[
                    // <Tooltip title="转移">
                    //   <CustomIcon
                    //     type="transfer"
                    //     key="transfer"
                    //     onClick={() => {}}
                    //     style={{ width: 25 }}
                    //   />
                    // </Tooltip>,
                    <Tooltip title="领养">
                      <CustomIcon
                        type="adopt"
                        key="adopt"
                        onClick={() => {
                          //TODO web3 调用合约
                        }}
                        style={{ width: 25 }}
                      />
                    </Tooltip>,
                  ]}
                >
                  <p>名字：{item.name}</p>
                  <p>年龄：{item.age}</p>
                </Card>
              </List.Item>
            )}
          />
        </div>
      </div>
      <UploadModal
        nftUploadInfo={nftUploadInfo}
        onChange={(e: any) => {
          setNftUploadInfo(e);
        }}
      />

      <Button
        onClick={() => {
          testFun();
        }}
      >
        点我
      </Button>
    </>
  );
};
// forwardRef(ComName);
export default ComName;
// export default connect(({ user }) => ({
// ...user
// }))(ComName);

// TODO

// https://github.com/ipfs/helia
// https://ipfs.github.io/helia/

// 对接本地IPFS 获取 CID ， 因为 FileBase 获取不了bucket的CID所以无法完成
// https://www.npmjs.com/package/@helia/dag-cbor
// import { createHeliaHTTP } from 'https://esm.sh/@helia/http?bundle-deps'
// import { dagCbor } from 'https://esm.sh/@helia/dag-cbor?bundle-deps'

// const output = document.getElementById('output')
// const input = document.getElementById('user-input')
// const button = document.getElementById('get-cid')
// const helia = await createHeliaHTTP()
// const dcbor = dagCbor(helia)
//     globalThis.helia = helia
// button.addEventListener('click', handleGetCid)

// async function handleGetCid(event) {
//   try {
//     const object = JSON.parse(input.value)

//     // Encode the file with dag-cbor
//     const cid = await dcbor.add(object)

//     // Display the CID
//     output.innerHTML = `Object addressed by CID: <a href="https://cid.ipfs.tech/#${cid.toString()}">${cid.toString()}</a>`

//   } catch (err) {
//     console.error(err)
//     document.getElementById('output').textContent =
//       `Error: ${err.message}`
//   }
// }

// https://www.npmjs.com/package/@helia/unixfs

// import { createHeliaHTTP } from 'https://esm.sh/@helia/http?bundle-deps'
// import { unixfs } from 'https://esm.sh/@helia/unixfs?bundle-deps'

// const output = document.getElementById('output')
// const fileInput = document.getElementById('user-file')
// const helia = await createHeliaHTTP()
// const fs = unixfs(helia)

// fileInput.addEventListener('change', handleFileUpload)

// async function handleFileUpload(event) {
//   try {
//     const file = event.target.files[0]
//     if (!file) return

//     // Encode the file with UnixFS
//     const cid = await fs.addFile({
//       content: file.stream(),
//       path: file.name
//     })

//     // Display the CID
//     output.innerHTML = `File addressedf by CID: <a href="https://cid.ipfs.tech/#${cid.toString()}">${cid.toString()}</a>`

//   } catch (err) {
//     console.error(err)
//     document.getElementById('output').textContent =
//       `Error: ${err.message}`
//   }
// }

// 通过CID检索数据
// import { verifiedFetch } from 'https://esm.sh/@helia/verified-fetch?bundle-deps'
// const output = document.getElementById('output')

// const resp = await verifiedFetch('ipfs://bafkreia2xtwwdys4dxonlzjod5yxdz7tkiut5l2sgrdrh4d52d3qpstrpy')
// const blob = await resp.blob()
// const imgEl = document.createElement('img')
// imgEl.setAttribute('src', URL.createObjectURL(blob))
// imgEl.setAttribute('width', '50%')
// output.appendChild(imgEl)
