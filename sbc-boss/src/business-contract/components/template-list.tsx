import * as React from 'react';
import { IMap, Relax } from 'plume2';
// import { fromJS } from 'immutable';
import { withRouter } from 'react-router';
// import { Link } from 'react-router-dom';
import { Table, Button, Switch, Icon, Upload, message } from 'antd';
import { noop, Const } from 'qmkit';
import { List } from 'immutable';

declare type IList = List<any>;
const { Column } = Table;
const header = {
  Accept: 'application/json',
  authorization: 'Bearer ' + (window as any).token
};

@withRouter
@Relax
export default class TemplateList extends React.Component<any, any> {
  props: {
    isPerson: number;
    relaxProps?: {
      template: IMap;
      getTemplateList: Function;
      uploadUrl: Function;
      changeTempSatus: Function;
      delTemp: Function;
    };
  };

  state = {
    uploading: false
  };

  static relaxProps = {
    template: 'template',
    getTemplateList: noop,
    showPdf: noop,
    uploadUrl: noop,
    changeTempSatus: noop,
    delTemp: noop
  };

  componentDidMount() {
    const { isPerson } = this.props;
    const { getTemplateList } = this.props.relaxProps;
    getTemplateList(isPerson);
  }

  render() {
    const { uploading } = this.state;
    const { isPerson } = this.props;
    const { template, changeTempSatus, delTemp } = this.props.relaxProps;
    const data = template.toJS();
    const { loading } = data;

    return (
      <div>
        <Upload
          name="uploadFile"
          multiple={false}
          showUploadList={false}
          beforeUpload={this.beforeUpload}
          accept=".docx"
          headers={header}
          action={Const.HOST + '/uploadResource?resourceType=IMAGE'}
          onChange={this.upload}
        >
          <Button loading={uploading} type="primary">
            <Icon type="upload" />
            上传合同模板
          </Button>
        </Upload>
        <Table
          loading={loading}
          rowKey="contractId"
          pagination={false}
          dataSource={isPerson === 1 ? data.personList : data.companyList}
        >
          <Column
            title="合同名称"
            key="contractName"
            dataIndex="contractName"
          />
          <Column title="上传人" key="createPerson" dataIndex="createPerson" />
          <Column title="上传时间" key="uploadTime" dataIndex="uploadTime" />
          <Column
            title="启用状态"
            key="contractFlag"
            dataIndex="contractFlag"
            render={(text, row: any) => {
              return (
                <Switch
                  checked={text === 1}
                  disabled={text === 1}
                  onChange={() => changeTempSatus(row.contractId, isPerson)}
                />
              );
            }}
          />
          <Column
            title="操作"
            key="opration"
            dataIndex="opration"
            render={(_, rowInfo: any) => {
              return (
                <div>
                  {/* <Button
                    type="link"
                    onClick={() => showPdf(rowInfo.contractUrl, '查看合同模板')}
                  >
                    查看
                  </Button> */}
                  <Button
                    type="link"
                    onClick={() => this.downloadTemp(rowInfo.contractUrl)}
                  >
                    下载
                  </Button>
                  {rowInfo.contractFlag !== 1 && (
                    <Button
                      type="link"
                      onClick={() => delTemp(rowInfo.contractId, isPerson)}
                    >
                      删除
                    </Button>
                  )}
                </div>
              );
            }}
          />
        </Table>
      </div>
    );
  }

  /**
   * 检查文件格式
   */
  beforeUpload = (file) => {
    const isSupportFile =
      file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (!isSupportFile) {
      message.error('只能上传docx文件');
    }
    return isSupportFile;
  };

  upload = async (info) => {
    const { isPerson } = this.props;
    const { uploadUrl, getTemplateList } = this.props.relaxProps;
    const status = info.file.status;
    let uploading = true;
    if (status == 'uploading') {
      this.setState({ uploading });
    }
    if (status === 'done') {
      uploading = false;
      if (info.file.response && info.file.response.length > 0) {
        const res = await uploadUrl({
          contractUrl: info.file.response[0],
          docTitle: info.file.name.replace('.docx', ''),
          isPerson,
          contractFlag: 1
        });
        if (res && res.code === Const.SUCCESS_CODE) {
          message.success('上传成功');
          getTemplateList(isPerson);
        } else {
          message.error(res.message);
        }
      } else {
        if (info.file.response === 'Method Not Allowed') {
          message.error('此功能您没有权限访问');
        } else {
          message.error(info.file.response.message);
        }
      }
      this.setState({ uploading });
      return;
    } else if (status === 'error') {
      message.error('上传失败');
      uploading = false;
      this.setState({ uploading });
      return;
    }
  };

  downloadTemp = (url) => {
    if (url) {
      window.open(url);
    }
  };
}
