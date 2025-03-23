/*
 * @Description: 首页
 * @Author: smilechao
 * @Date: 2023-06-14 09:27:50
 * @dev: 1. NFT上传 转移 领取
 * 样式处理
 */
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import {
  Button,
  Row,
  Col,
  Avatar,
  Dropdown,
  Modal,
  List,
  Card,
  Tooltip,
  message,
} from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  createFromIconfontCN,
  TransactionOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import CustomIcon from "@/components/CustomIcon";
//import classnames from 'classnames';
import styles from "./index.less";
//import moment from 'moment';
import UploadModal from "./uploadModal";
import smileImg from "@/assets/images/smile.jpg";
import { ethers } from "ethers";
import {useModel} from '@umijs/max'

type MenuItem = Required<MenuProps>["items"][number];

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
    { name: "mao", age: 16, img: smileImg },
  ]);
  const { signer, login, logout } = useModel("walletSigner"); // 不知道为什么用不成功
  
  // useImperativeHandle(ref, () => ({
  // }));
  //const {} = props

  const menuList: MenuItem[] = [
    {
      key: "1",
      label: "上传NFT",
      onClick: (e) => handleMenuClick("1"),
    },
    {
      key: "2",
      label: "转移NFT",
      onClick: (e) => handleMenuClick("2"),
    },
    {
      key: "3",
      label: "我的个人资料",
      onClick: (e) => handleMenuClick("3"),
    },
  ]; // 数据

  const handleMenuClick = async (key: string) => {
    if (key === "1") {
      setNftUploadInfo({
        visible: true,
        nftInfo: {},
      });
    } else if (key === "2") {
      // TODO 调用合约
    } else {
     
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <div className={styles.box}>
        <div className={styles.header}>
          <Row>
            <Col span={3}>
              <div className={styles.left_fun_box}></div>
            </Col>
            <Col span={18}>
              <h1 style={{ textAlign: "center" }}>NTF市场</h1>
            </Col>
            <Col span={3}>
              <div className={styles.right_fun_box}>
                {
                  signer?.address ? ( <Dropdown menu={{ items: menuList }}>
                    <div className={styles.userbox}>
                    <Avatar size={32} shape="square" icon={<UserOutlined />} />
                    <span >{signer.address}</span>
                    </div>
                    
                  </Dropdown>) : (<Button type="primary" onClick={() => { login();}}>登陆</Button>)
                }
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
                    <Tooltip title="转移">
                      <CustomIcon
                        type="transfer"
                        key="transfer"
                        onClick={() => {}}
                        style={{ fontSize: 14 }}
                      />
                    </Tooltip>,
                    <Tooltip title="领养">
                      <CustomIcon
                        type="adopt"
                        key="adopt"
                        onClick={() => {
                          //TODO web3 调用合约
                        }}
                        style={{ fontSize: 14 }}
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
    </>
  );
};
// forwardRef(ComName);
export default ComName;
// export default connect(({ user }) => ({
// ...user
// }))(ComName);
