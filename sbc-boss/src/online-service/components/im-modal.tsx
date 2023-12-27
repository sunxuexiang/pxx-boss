import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Radio,
  Checkbox,
  message,
  Row,
  Col,
  Select,
  Button
} from 'antd';
import {
  saveIMConfigDetail,
  getIMConfigDetail,
  getAllEmployees
} from '../webapi';
import { cache, Const } from 'qmkit';
let serviceKey = 0;
function ImModal(props) {
  // 终端类型
  const [plainOptions] = useState([
    { label: 'APP', value: 'app' },
    { label: 'PC', value: 'pc' }
    // { label: '小程序', value: 'mini' },
    // { label: 'h5', value: 'h5' }
  ]);
  // 终端字段映射
  const [effectData] = useState({
    app: 'effectiveApp',
    pc: 'effectivePc',
    mini: 'effectiveMiniProgram',
    h5: 'effectiveH5'
  });
  // 已选择终端类型
  const [checkData, setCheckData] = useState([]);
  // 客服配置信息
  const [chatConfig, setConfig] = useState({} as any);
  // 账号信息
  const [accountConfig, setAccountConfig] = useState({} as any);
  // 当前用户的登录信息
  const [loginInfo, setLogoinInfo] = useState({} as any);
  // 员工列表
  const [employeesList, setEmployeesList] = useState([]);
  // 添加参数
  const [addParams, setAddParams] = useState({} as any);
  // 保存按钮loading
  const [saveLoading, setSaveLoading] = useState(false);
  // const [key, setKey] = useState(0);
  useEffect(() => {
    if (props.show) {
      console.warn(props.imData);
      getIMConfigData();
      getAllEmployeesList();
    }
  }, [props.show]);
  // 终端选择
  const changeCheck = () => {};
  // 获取所有员工
  const getAllEmployeesList = () => {
    getAllEmployees({ pageSize: 99999 })
      .then((data) => {
        if (data.res.code !== Const.SUCCESS_CODE) {
          return;
        }
        setEmployeesList(data.res.context.content);
      })
      .catch((err) => {
        console.warn(err);
        message.error('查询员工列表信息失败');
      });
  };
  // 获取IM配置
  const getIMConfigData = () => {
    getIMConfigDetail()
      .then((data) => {
        console.warn(data);
        if (data.res.code !== Const.SUCCESS_CODE) {
          return;
        }
        // 终端类型选择默认值
        const configData = data.res.context.imOnlineServerRop;
        const checkArr = [];
        for (let key in effectData) {
          if (
            configData[effectData[key]] &&
            configData[effectData[key]] === 1
          ) {
            checkArr.push(key);
          }
        }
        const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
        console.warn(loginInfo);
        loginInfo.isMasterAccount = 1; // 目前暂时默认为1

        if (loginInfo.isMasterAccount === 1) {
          const serviceList = data.res.context.imOnlineServerItemRopList.map(
            (item) => {
              let account = '';
              if (item.customerServiceAccount.indexOf('-1_') !== -1) {
                const accountArr = item.customerServiceAccount.split('-1_');
                account = accountArr[1];
              } else {
                account = item.customerServiceAccount || '';
              }
              const listItem = {
                ...item,
                customerServiceAccount: account,
                serviceKey: serviceKey++
              };
              return listItem;
            }
          );
          const configParams = {
            imOnlineServerRop: { ...data.res.context.imOnlineServerRop },
            imOnlineServerItemRopList: [...serviceList]
          };
          setConfig({ ...configParams });
        } else {
          const currentServiceInfo = data.res.context.imOnlineServerItemRopList.find(
            (item) => {
              return item.phoneNo === loginInfo.mobile;
            }
          );

          console.warn(currentServiceInfo, '当前客服信息');
          setAccountConfig(currentServiceInfo || {});
          setConfig({ ...data.res.context });
        }
        setLogoinInfo(loginInfo);
        // 设置选择终端类型
        setCheckData(checkArr);
      })
      .catch((err) => {});
  };
  // 保存
  const confirmOperate = () => {
    props.form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        // 生效终端
        const effectParams = {};
        value.effectTerminal.forEach((item) => {
          if (effectData[item]) {
            effectParams[effectData[item]] = 1;
          }
        });
        const imOnlineServerRop = chatConfig.imOnlineServerRop;
        const params = {
          imOnlineServerRop: {
            ...imOnlineServerRop,
            serverStatus: value.serverStatus,
            ...effectParams
          },
          imOnlineServerItemRopList: []
        };
        if (loginInfo.isMasterAccount === 1) {
          // 管理员保存
          const serviceList = chatConfig.imOnlineServerItemRopList.map(
            (item) => {
              const newItem = { ...item };
              newItem.customerServiceName =
                value[`customerServiceName${item.serviceKey}`];
              newItem.customerServiceAccount = `-1_${
                value[`customerServiceAccount${item.serviceKey}`]
              }`;
              newItem.phoneNo = value[`phoneNo${item.serviceKey}`];
              const current = employeesList.find(
                (el) => el.employeeMobile === newItem.phoneNo
              );
              newItem.employeeId = current.employeeId;
              return newItem;
            }
          );
          params.imOnlineServerItemRopList = serviceList;
          console.warn(params);
        } else {
          // 商家保存
          const serviceList = chatConfig.imOnlineServerItemRopList;
          if (serviceList.length > 0) {
            serviceList.map((item) => {
              if (item.phoneNo === value.phoneNo) {
                item['customerServiceName'] = value.customerServiceName;
                item['customerServiceAccount'] = value.customerServiceAccount;
                item['phoneNo'] = value.phoneNo;
              }
              return item;
            });
          } else {
            const {
              customerServiceName,
              customerServiceAccount,
              phoneNo
            } = value;
            const item = {
              customerServiceName,
              customerServiceAccount,
              phoneNo
            };
            serviceList.push(item);
          }

          params.imOnlineServerItemRopList = serviceList;
        }
        setSaveLoading(true);
        saveIMConfigDetail(params)
          .then((res) => {
            console.warn(res);
            setSaveLoading(false);
            message.success('保存成功');
            props.form.resetFields();
            serviceKey = 0;
            props.closeModal(true, params.imOnlineServerItemRopList);
          })
          .catch((err) => {
            console.warn(err);
            setSaveLoading(false);
            message.error('保存失败');
            props.form.resetFields();
            serviceKey = 0;
            props.closeModal(false);
          });
      }
    });
  };
  // 根据登录身份渲染客服部分内容
  const renderService = () => {
    if (loginInfo.isMasterAccount === 1) {
      return (
        <Row>
          {chatConfig.imOnlineServerItemRopList.map((item) => {
            return (
              <Row gutter={20} key={item.serviceKey}>
                <Col span={8}>
                  <Form.Item style={{ marginBottom: 15 }} label="昵称">
                    {getFieldDecorator(
                      `customerServiceName${item.serviceKey}`,
                      {
                        rules: [{ required: true, message: '请输入客服昵称' }],
                        initialValue: item.customerServiceName || ''
                      }
                    )(<Input placeholder="请输入客服昵称" />)}
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item style={{ marginBottom: 15 }} label="账号">
                    {getFieldDecorator(
                      `customerServiceAccount${item.serviceKey}`,
                      {
                        rules: [{ required: true, message: '客服账号' }],
                        initialValue: item.customerServiceAccount || ''
                        // normalize: serviceAccountDeal
                      }
                    )(<Input placeholder="客服账号" />)}
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Form.Item style={{ marginBottom: 15 }} label="手机号">
                    {getFieldDecorator(`phoneNo${item.serviceKey}`, {
                      rules: [{ required: true, message: '请选择客服手机号' }],
                      initialValue: item.phoneNo || ''
                    })(
                      <Select
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option: any) => {
                          return option.props.children.indexOf(input) >= 0;
                        }}
                      >
                        {employeesList.map((el) => {
                          return (
                            <Select.Option
                              value={el.employeeMobile}
                              key={el.employeeId}
                            >
                              {el.employeeMobile}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Button
                    type="link"
                    onClick={() => {
                      delService(item.serviceKey);
                    }}
                  >
                    删除
                  </Button>
                </Col>
              </Row>
            );
          })}
        </Row>
      );
    } else {
      return (
        <Row>
          <Form.Item style={{ marginBottom: 15 }} label="客服昵称">
            {getFieldDecorator('customerServiceName', {
              rules: [{ required: true, message: '请输入客服昵称' }],
              initialValue: accountConfig.customerServiceName || ''
            })(<Input placeholder="请输入客服昵称" />)}
          </Form.Item>
          <Form.Item style={{ marginBottom: 15 }} label="客服账号">
            {getFieldDecorator('customerServiceAccount', {
              rules: [{ required: true, message: '客服账号' }],
              initialValue: accountConfig.customerServiceAccount || ''
              // normalize: serviceAccountDeal
            })(<Input placeholder="客服账号" />)}
          </Form.Item>
          <Form.Item style={{ marginBottom: 15 }} label="手机号">
            {getFieldDecorator('phoneNo', {
              rules: [{ required: false, message: '请选择客服手机号' }],
              initialValue: accountConfig.phoneNo || ''
            })(
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input, option: any) => {
                  return option.props.children.indexOf(input) >= 0;
                }}
              >
                {employeesList.map((el, index) => {
                  return (
                    <Select.Option
                      value={el.employeeMobile}
                      key={el.employeeId}
                    >
                      {el.employeeMobile}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
        </Row>
      );
    }
  };
  // 客服账号输入控制
  const serviceAccountDeal = (value) => {
    const mustStr = `${-1}_`;
    if (value.indexOf(mustStr) < 0) {
      // return `${loginInfo.companyInfoId}_${loginInfo.mobile}`;
      return mustStr;
    } else {
      return value;
    }
  };
  // 删除
  const delService = (serviceKey) => {
    const list = chatConfig.imOnlineServerItemRopList;
    const arr = list.filter((item) => {
      return item.serviceKey !== serviceKey;
    });
    setConfig({ ...chatConfig, imOnlineServerItemRopList: [...arr] });
  };
  // 添加客服
  const addService = () => {
    console.warn(addParams);
    const list = chatConfig.imOnlineServerItemRopList;
    list.push({ ...addParams, serviceKey: serviceKey++ });
    setAddParams({});
    setConfig({ ...chatConfig, imOnlineServerItemRopList: [...list] });
  };
  const { getFieldDecorator } = props.form;
  return (
    <Modal
      maskClosable={false}
      title="IM商家客服"
      visible={props.show}
      confirmLoading={saveLoading}
      okText={saveLoading ? '正在保存' : '保存'}
      onOk={confirmOperate}
      onCancel={() => props.closeModal()}
      width={loginInfo.isMasterAccount === 1 ? 900 : 600}
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
        <Row>
          <Col span={loginInfo.isMasterAccount === 1 ? 9 : 24}>
            <Form.Item style={{ marginBottom: 15 }} label="启用开关">
              {getFieldDecorator('serverStatus', {
                rules: [{ required: true, message: '请选择启用状态' }],
                initialValue: chatConfig.imOnlineServerRop
                  ? chatConfig.imOnlineServerRop.serverStatus
                  : ''
              })(
                <Radio.Group>
                  <Radio value={1}>启用</Radio>
                  <Radio value={0}>停用</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </Col>
          <Col span={loginInfo.isMasterAccount === 1 ? 12 : 24}>
            <Form.Item style={{ marginBottom: 15 }} label="生效终端">
              {getFieldDecorator('effectTerminal', {
                initialValue: checkData.length ? checkData : [],
                rules: [
                  {
                    required: true,
                    message: '请选择生效终端'
                  }
                ]
              })(
                <Checkbox.Group options={plainOptions} onChange={changeCheck} />
              )}
            </Form.Item>
          </Col>
        </Row>
        {loginInfo.isMasterAccount === 1 && (
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item style={{ marginBottom: 15 }} label="昵称">
                <Input
                  placeholder="请输入客服昵称"
                  value={addParams.customerServiceName}
                  onChange={(e) => {
                    setAddParams({
                      ...addParams,
                      customerServiceName: e.target.value
                    });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item style={{ marginBottom: 15 }} label="账号">
                <Input
                  placeholder="客服账号"
                  value={addParams.customerServiceAccount}
                  onChange={(e) => {
                    setAddParams({
                      ...addParams,
                      customerServiceAccount: e.target.value
                    });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item style={{ marginBottom: 15 }} label="手机号">
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option: any) => {
                    return option.props.children.indexOf(input) >= 0;
                  }}
                  value={addParams.phoneNo}
                  onChange={(e) => {
                    setAddParams({
                      ...addParams,
                      phoneNo: e
                    });
                  }}
                >
                  {employeesList.map((el) => {
                    return (
                      <Select.Option
                        value={el.employeeMobile}
                        key={el.employeeId}
                      >
                        {el.employeeMobile}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={2}>
              <Button type="link" onClick={addService}>
                添加
              </Button>
            </Col>
          </Row>
        )}
        {chatConfig.imOnlineServerItemRopList && renderService()}
      </Form>
    </Modal>
  );
}
const ImModalTemplate = Form.create()(ImModal);
export default ImModalTemplate;
