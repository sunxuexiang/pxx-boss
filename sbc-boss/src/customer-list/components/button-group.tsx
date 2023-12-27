import React from 'react';
import { Relax } from 'plume2';
import { Button, Modal, message } from 'antd';
import { AuthWrapper, noop, util, Const } from 'qmkit';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onBatchDelete: Function;
      onBatchAudit: Function;
      onAdd: Function;
      importModalShow: Function;
      importModalVisible: boolean;
      form: any;
    };
  };

  static relaxProps = {
    onBatchDelete: noop,
    onBatchAudit: noop,
    onAdd: noop,
    importModalShow: noop,
    importModalVisible: 'importModalVisible',
    form: 'form'
  };
  // 客户列表导出
  exportCustomData = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const base64 = new util.Base64();
        const token = (window as any).token || '';
        const searchRes = this.props.relaxProps.form.toJS();
        // 可用参数
        const ableParams = {};
        // 过滤无效参数
        for (let key in searchRes) {
          if (key && searchRes[key] && key !== 'checkState') {
            ableParams[key] = searchRes[key];
          }
        }
        console.warn(ableParams, searchRes);
        // 校验登录
        if (token) {
          // 参数加密
          let result = JSON.stringify({ ...ableParams, token: token });
          let encrypted = base64.urlEncode(result);
          const exportHref =
            Const.HOST + `/customer/export/params/${encrypted}`;
          // 新窗口下载
          window.open(exportHref);
        } else {
          message.error('请登录后重试');
        }
        resolve(null);
      }, 500);
    });
  };

  render() {
    const {
      onBatchAudit,
      onAdd,
      importModalShow,
      importModalVisible,
      form
    } = this.props.relaxProps;
    console.log('importModalVisible', importModalVisible);
    return (
      <div className="handle-bar">
        <AuthWrapper functionName={'f_customer_1'}>
          <Button type="primary" onClick={() => onAdd()}>
            新增
          </Button>
        </AuthWrapper>
        <AuthWrapper functionName={'f_customer_4'}>
          <Button onClick={() => onBatchAudit(0)}>批量启用</Button>
        </AuthWrapper>
        <AuthWrapper functionName={'f_customer_5'}>
          <Button onClick={() => importModalShow(true)}>批量导入</Button>
        </AuthWrapper>
        <Button type="primary" onClick={this.exportCustomData}>
          导出
        </Button>
      </div>
    );
  }

  /**
   * 批量禁用确认提示
   * @private
   */
  _showBatchAudit = (status) => {
    const { onBatchAudit } = this.props.relaxProps;
    const confirm = Modal.confirm;
    confirm({
      title: '账号禁用',
      content: '是否确认禁用已选账号？禁用后该客户将无法登录！',
      onOk() {
        onBatchAudit(status);
      }
    });
  };

  /**
   * 批量删除确认提示
   * @private
   */
  _showBatchDelete = () => {
    const { onBatchDelete } = this.props.relaxProps;
    const confirm = Modal.confirm;
    confirm({
      title: '客户删除',
      content: '是否确认删除已选客户和他的账号？删除将无法恢复！',
      onOk() {
        onBatchDelete();
      }
    });
  };
}
