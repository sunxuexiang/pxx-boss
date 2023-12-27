import React, { useState, useEffect } from 'react';
import { getOnlineServerSwitch, saveIMConfig } from '../webapi';
import { Modal, Form, Radio, Checkbox, Input, message } from 'antd';

function SupplyChat(props) {
  // 终端类型
  const [plainOptions] = useState([
    { label: 'APP', value: 'app' },
    { label: 'PC', value: 'pc' },
    { label: '小程序', value: 'mini' },
    { label: 'h5', value: 'h5' }
  ]);
  // 终端字段映射
  const [effectData] = useState({
    app: 'effectiveApp',
    pc: 'effectivePc',
    mini: 'effectiveMiniProgram',
    h5: 'effectiveH5'
  });
  // IM配置信息
  const [chatConfig, setChatConfig] = useState({} as any);
  // 已选择终端类型
  const [checkData, setCheckData] = useState([]);
  // 初始化
  useEffect(() => {
    if (props.show) {
      props.form.resetFields();
      getChatConfig();
    }
  }, [props.show]);
  // 获取配置信息
  const getChatConfig = () => {
    getOnlineServerSwitch(0)
      .then((data) => {
        const resData = data.res.context.imSystemConfigVO;
        console.warn(resData);
        // 是否已设置客服配置
        if (resData.context) {
          const configData = JSON.parse(resData.context);
          console.warn(configData);
          // 终端类型选择默认值
          const checkArr = [];
          for (let key in effectData) {
            if (
              configData[effectData[key]] &&
              configData[effectData[key]] === 1
            ) {
              checkArr.push(key);
            }
          }
          // 设置选择终端类型
          setCheckData(checkArr);
          // 设置客服配置参数
          setChatConfig(configData);
        }
      })
      .catch((err) => {
        console.warn(err);
        message.error('查询客服配置失败');
      });
  };
  // 选择终端
  const changeCheck = (checkedValues) => {
    console.warn(checkedValues);
  };
  // 保存配置
  const confirmOperate = () => {
    props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const { appId, appKey, enableFlag, effectTerminal } = value;
        const params = {
          appId,
          appKey,
          enableFlag
        };
        effectTerminal.forEach((item) => {
          if (effectData[item]) {
            params[effectData[item]] = 1;
          }
        });
        saveIMConfig(params)
          .then((res) => {
            console.warn(res);
            message.success('保存成功');
            props.closeSupplyChat();
          })
          .catch((err) => {
            console.warn(err);
            message.error('保存失败');
          });
      }
    });
  };
  const { getFieldDecorator } = props.form;
  return (
    <Modal
      maskClosable={false}
      title="IM商家客服"
      visible={props.show}
      onOk={confirmOperate}
      onCancel={() => props.closeSupplyChat()}
      width="600px"
    >
      <Form
        labelCol={{
          span: 6
        }}
        wrapperCol={{
          span: 18
        }}
        autoComplete="off"
      >
        <Form.Item style={{ marginBottom: 15 }} label="启用开关">
          {getFieldDecorator('enableFlag', {
            rules: [{ required: true, message: '请选择启用状态' }],
            initialValue: chatConfig.enableFlag ? chatConfig.enableFlag : 0
          })(
            <Radio.Group>
              <Radio value={0}>启用</Radio>
              <Radio value={1}>停用</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item style={{ marginBottom: 15 }} label="生效终端">
          {getFieldDecorator('effectTerminal', {
            initialValue: checkData.length ? checkData : [],
            rules: [
              {
                required: true,
                message: '启用时请选择生效终端'
              }
            ]
          })(<Checkbox.Group options={plainOptions} onChange={changeCheck} />)}
        </Form.Item>
        <Form.Item style={{ marginBottom: 15 }} label="AppKey">
          {getFieldDecorator('appKey', {
            rules: [{ required: true, message: '请输入AppKey' }],
            initialValue: chatConfig.appKey || ''
          })(<Input placeholder="请输入AppKey" />)}
        </Form.Item>
        <Form.Item style={{ marginBottom: 15 }} label="AppId">
          {getFieldDecorator('appId', {
            rules: [{ required: true, message: 'AppId' }],
            initialValue: chatConfig.appId || ''
          })(<Input placeholder="请输入AppId" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
}
const SupplyChatTemplate = Form.create()(SupplyChat);
export default SupplyChatTemplate;
