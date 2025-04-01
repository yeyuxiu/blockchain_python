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
  Form,
  Input,
  List,
  Modal,
  Row,
  Space,
  Tooltip,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';
//import classnames from 'classnames';
import styles from './index.less';
//import moment from 'moment';
import { axiosGet } from '@/utils/axios';
import { useModel } from '@umijs/max';
import 'dotenv/config';
import { ethers } from 'ethers';
import NFTMarketABI from './NFTMarket.json';
import UploadModal from './uploadModal';

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

type FieldType = {
  address: string;
};

const NFTMarket: React.FC = (props: any, ref: any) => {
  const [nftUploadVisible, setNftUploadVisible] = useState(false); // 上传
  const [transferVisibleInfo, setTransferVisibleInfo] = useState({
    visible: false,
    index: ''
  }); // 转移
  const [transferLoading, setTransferLoading] = useState(false);
  const [cidList, setCidList] = useState<string[]>([]); // 存cid 同时监控 转换为 nft list
  const [nftList, setNftList] = useState<ntfInfo[]>([]); // 所有nft数据
  const [form] = Form.useForm();

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
      label: '我的个人资料',
      onClick: (e) => handleMenuClick('2'),
    },
  ]; // 数据

  // useEffect(() => {
  //   console.log(process.env, 'process.env');
  // }, []);

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
    }
  };

  // 公钥中间部分省略
  const handleAddressName = (name: string): string => {
    // 处理名字 前5位 后4位
    const startStr = name.substring(0, 6);
    const endStr = name.substring(name.length - 4);

    return startStr + '...' + endStr;
  };

  // 转移
  const transferOk = () => {
    form.validateFields().then(async (values) => {
      // 本地测试
      const providerLocal = new ethers.JsonRpcProvider(`http://127.0.0.1:8545`); // window.ethereum

      //读写合约
      const ContractAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'; // 替换
      const NFTMarketAbi = NFTMarketABI;
      setTransferLoading(true);

      const privateKey =
        '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
      const wallet = new ethers.Wallet(privateKey, providerLocal);

      const _Contract = new ethers.Contract(
        ContractAddress,
        NFTMarketAbi.abi,
        wallet,
      );

      const transferFromResult = await _Contract.transferFrom(
        await signer.getAddress(),
        values.address,
        transferVisibleInfo.index,
      );
      setTransferLoading(false);
      if (transferFromResult) {
        message.success('转移成功');
        console.log(transferFromResult, 'transferFromResult');
        setTransferVisibleInfo({
          visible: false,
          index: '',
        });
      }
    });
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
            renderItem={(item, index) => (
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
                        onClick={() => {
                          setTransferVisibleInfo({visible:true, index:`${index}`});
                        }}
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
      {/* 上传 */}
      <UploadModal
        visible={nftUploadVisible}
        setVisible={(e: any) => {
          setNftUploadVisible(e);
        }}
        pushNftList={pushNftList}
      />

      {/* 转移 */}
      <Modal
        title="转移NFT"
        open={transferVisibleInfo.visible}
        confirmLoading={transferLoading}
        onOk={transferOk}
        onCancel={() => {
          setTransferVisibleInfo({
            visible: false,
            index: '',
          })
        }}
      >
        <Form
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="转移的地址"
            name="address"
            rules={[{ required: true, message: '请输入地址' }]}
          >
            <Input placeholder="请输入地址" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
// forwardRef(NFTMarket);
export default NFTMarket;
// export default connect(({ user }) => ({
// ...user
// }))(NFTMarket);
