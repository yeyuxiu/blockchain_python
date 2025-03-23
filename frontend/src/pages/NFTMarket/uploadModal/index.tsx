/*
 * @Description: nft上传modal
 * @Author: smilechao
 * @Date: 2023-06-14 09:27:50
 * @dev: 1. NFT上传
 */
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { Button, Modal, Form, Input, Upload, Flex, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import styles from "./index.less";
import type { GetProp, UploadProps } from "antd";
//import moment from 'moment';
//import classnames from 'classnames';

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

function ComName(props: any, ref: any) {
  //useImperativeHandle(ref, () => ({
  //lyFormRef
  //}));
  const { nftUploadInfo, onChange = false } = props;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {}, []);
  // upload modal handle ok
  // TODO 对接区块后台

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const [form] = Form.useForm();

  // 上传函数
  const uploadModalOk = (values: any) => {
    form.validateFields().then((values) => {
      onChange({
        visible: false,
        nftInfo: {},
      });
      console.log(values);
    });
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传图片</div>
    </button>
  );

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("只能上传jepg或png!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小不能超过2MB");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  return (
    <Modal
      title="上传NFT"
      open={nftUploadInfo.visible}
      onOk={uploadModalOk}
      cancelText="取消"
      okText="确定"
      confirmLoading={false}
      onCancel={() => {
        onChange({
          visible: false,
          nftInfo: {},
        });
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
          rules={[{ required: true, message: "名字不能为空" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="宠物年龄"
          name="age"
          rules={[{ required: true, message: "年龄不能为空" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="上传图片"
          name="img"
          rules={[{ required: true, message: "图片不能为空" }]}
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            // TODO IPFS
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
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
