import React from 'react';
import { Relax, Store } from 'plume2';
import { Modal, message, Button, Upload, Icon, Table } from 'antd';
import { noop, Const, util } from 'qmkit';
import { fromJS, List } from 'immutable';
import styled from 'styled-components';
// import { downLoad }  from '../webapi';

const styles = {
  flex: {
    display: 'flex',
    alignItems: 'baseline',
    marginTop: '30px'
  },
  flext: {
    display: 'flex',
    // alignItems: 'baseline',
    padding: '10px 0',
    justifyContent: 'center'
  },
  item: {
    padding: '10px 15px',
    border: '1px solid #eee',
    borderRadius: '3px',
    textAlign: 'center',
    width: '600px'
  } as any
};
declare type IList = List<any>;
const header = {
  Accept: 'application/json',
  authorization: 'Bearer ' + (window as any).token
};
const GreyText = styled.span`
  color: #999999;
  margin-left: 5px;
`;

@Relax
export default class CustomrImportModal extends React.Component<any, any> {
  props: {
    relaxProps?: {
      importModalVisible: boolean;
      importModalShow: Function;
      onCancel: Function;
      reason: IList;
      onErrSetTable: Function;
    };
  };

  static relaxProps = {
    importModalVisible: 'importModalVisible',
    importModalShow: noop,
    onCancel: noop,
    reason: 'reason',
    onErrSetTable: noop
  };

  state = {
    isType: 0,
    file: {
      status: '',
      name: ''
    }
  };

  upload = (val) => {
    const { onErrSetTable, importModalShow } = this.props.relaxProps;
    const { file } = val as any;
    if (file.response) {
      if (file.response.code === Const.SUCCESS_CODE) {
        if (file.response.context.status) {
          message.success('上传成功');
          importModalShow(false);
        } else {
          onErrSetTable(file.response.context.reason);
        }
        this.setState({
          file: { name: file.name, status: file.status },
          isType: file.response.context.status
        });
      } else {
        message.error(file.response.message);
      }
    }
  };

  columns = [
    {
      title: '客户账号',
      dataIndex: 'customerAccount',
      key: 'customerAccount',
      align: 'center'
    },
    {
      title: '业务代表姓名',
      dataIndex: 'employeeName',
      key: 'employeeName',
      align: 'center'
    },
    {
      title: '白鲸管家姓名',
      dataIndex: 'managerName',
      key: 'managerName',
      align: 'center'
    },
    {
      title: '失败原因',
      dataIndex: 'reason',
      key: 'reason',
      align: 'center'
    }
  ];

  render() {
    const {
      importModalVisible,
      importModalShow,
      reason
    } = this.props.relaxProps;
    const { isType, file } = this.state;

    return (
      <Modal
        title="导入客户"
        width={800}
        visible={importModalVisible}
        footer={null}
        destroyOnClose
        onCancel={() => {
          // onCancel()
          importModalShow(false);
        }}
      >
        {isType === 0 || isType === 1 ? (
          <div style={styles.flex}>
            导入文件：
            <div style={styles.item}>
              <div>
                {/* <a download="客户导入模板" href={`${Const.HOST}/customer/relation/downloadTemplate`}>
                  下载模板
                </a> */}
                <Button
                  type="link"
                  onClick={() => {
                    const token = (window as any).token;
                    if (token) {
                      let base64 = new util.Base64();
                      let result = JSON.stringify({ token: token });
                      let encrypted = base64.urlEncode(result);
                      // 新窗口下载
                      const exportHref =
                        Const.HOST +
                        `/customer/relation/downloadTemplate/${encrypted}`;
                      window.open(exportHref);
                    } else {
                      message.error('请登录');
                    }
                  }}
                >
                  下载模板
                </Button>
                <Upload
                  multiple={false}
                  showUploadList={false}
                  accept=".xls,.xlsx"
                  headers={header}
                  action={`${Const.HOST}/customer/relation/import`}
                  onChange={this.upload}
                  name="file"
                >
                  <a href="javascript:;">选择文件上传</a>
                </Upload>
                <div>
                  <GreyText>
                    仅支持 xls, xlsx
                    格式文件。格式可参考模板。不可上传重复的数据
                  </GreyText>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {isType === 0 && file.status === 'done' && reason.toJS().length ? (
          <div>
            <div style={{ marginBottom: '6px' }}>
              导入错误，以下为错误信息：
            </div>
            <Table
              columns={this.columns}
              scroll={{ y: 440 }}
              dataSource={reason.toJS()}
            />
          </div>
        ) : null}
      </Modal>
    );
  }
}
