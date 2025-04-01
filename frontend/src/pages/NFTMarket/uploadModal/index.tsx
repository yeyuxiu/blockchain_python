/*
 * @Description: nft上传modal
 * @Author: smilechao
 * @Date: 2023-06-14 09:27:50
 * @dev: 1. NFT上传
 */
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import type { GetProp, UploadProps } from 'antd';
import { Form, Input, message, Modal, Upload } from 'antd';
import { useState } from 'react';
//import moment from 'moment';
//import classnames from 'classnames';
import { axiosPost } from '@/utils/axios';
import { useModel } from '@umijs/max';
// import { dagCbor } from '@helia/dag-cbor';
// import { createHeliaHTTP } from '@helia/http';
import { ethers } from 'ethers';
import NFTMarketABI from '../NFTMarket.json';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

function ComName(props: any, ref: any) {
  //useImperativeHandle(ref, () => ({
  //lyFormRef
  //}));
  const { visible, setVisible = false, pushNftList = false } = props;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [onUploadOkLoading, setUploadOkLoading] = useState(false);
  const { signer, login, logout } = useModel('walletSigner'); // 登陆数据

  // upload modal handle ok
  // TODO 对接区块后台

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const [form] = Form.useForm();

  // 上传函数
  const uploadModalOk = () => {
    form.validateFields().then(async (values) => {
      // const helia = await createHelia();

      const imgUrl = URL.createObjectURL(values.img.file.originFileObj);
      values.img = imgUrl;
      const formData = new FormData();
      formData.append('file', JSON.stringify(values));
      setUploadOkLoading(true);
      const resc = await axiosPost(`/api/v0/add`, formData); // 这个cid是拿来 上传到ipfs 的

      if (resc.Hash) {
        // 固定到本地
        const res = await axiosPost(`/api/v0/pin/add?arg=/ipfs/${resc.Hash}`, {
          arg: `/ipfs/${resc.Hash}`,
        });
      }

      // 本地测试
      const providerLocal = new ethers.JsonRpcProvider(`http://127.0.0.1:8545`); // window.ethereum

      //私钥
      const privateKey =
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
      const wallet = new ethers.Wallet(privateKey, providerLocal);
      //读写合约
      const ContractAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'; // 替换

      const NFTMarketAbi = NFTMarketABI;

      const _Contract = new ethers.Contract(
        ContractAddress,
        NFTMarketAbi.abi,
        wallet,
      );

      const safeMintResult = await _Contract.safeMint(
        await signer.getAddress(),
        `http://127.0.0.1:8080/ipfs/${resc.Hash}`,
      );
      // console.log('address: ', await signer.getAddress());
      const getMyOwnerTokens = await _Contract.getMyOwnerTokens(
        // await signer.getAddress()
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
      );
      console.log('getMyOwnerTokens', getMyOwnerTokens);
      setUploadOkLoading(false);
      if (safeMintResult) {
        message.success('上传成功');
        console.log('ipfs: ', `http://127.0.0.1:8080/ipfs/${resc.Hash}`);
        console.log(safeMintResult, 'safeMintResult');
        pushNftList(resc.Hash);
        setVisible(false);
      }

      // await helia.stop();
    });
  };

  // 文件转为url
  function readAsDataURL(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(file);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传图片</div>
    </button>
  );

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传jepg或png!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  return (
    <Modal
      title="上传NFT"
      open={visible}
      onOk={uploadModalOk}
      cancelText="取消"
      okText="确定"
      confirmLoading={onUploadOkLoading}
      onCancel={() => {
        setVisible(false);
      }}
    >
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="宠物名字"
          name="name"
          rules={[{ required: true, message: '名字不能为空' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="宠物年龄"
          name="age"
          rules={[{ required: true, message: '年龄不能为空' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="上传图片"
          name="img"
          rules={[{ required: true, message: '图片不能为空' }]}
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            // TODO IPFS
            // action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
// ComName = forwardRef(ComName);
export default ComName;
//export default connect(({ test }) => ({
//...test
//}))(ComName);
