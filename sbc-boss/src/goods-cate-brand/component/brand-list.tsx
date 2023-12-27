import * as React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop } from 'qmkit';
import { List, fromJS, Map } from 'immutable';
import { Modal, Tooltip } from 'antd';

declare type IList = List<any>;
const { Column } = DataGrid;
const confirm = Modal.confirm;

const styles = {
  edit: {
    paddingRight: 10
  },
  img: {
    display: 'block',
    width: 120,
    height: 50,
    padding: 5
  },
  supplier: {
    width: '460px',
    display: 'inline-block',
    textAlign: 'left',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    margin: '0'
  }
} as any;

@Relax
export default class BrandList extends React.Component<any, any> {
  props: {
    cateId: string;
    relaxProps?: {
      dataList: IList;
      doDelete: Function;
      showEditModal: Function;
      pageSize: number;
      pageNum: number;
      total: number;
      init: Function;
    };
  };

  static relaxProps = {
    // 品牌列表
    dataList: 'dataList',
    // 删除品牌
    doDelete: noop,
    // 显示修改弹窗
    showEditModal: noop,
    pageSize: 'pageSize',
    pageNum: 'pageNum',
    total: 'total',
    init: noop
  };

  render() {
    const { dataList, init, pageSize, pageNum, total } = this.props.relaxProps;
    return (
      <DataGrid
        dataSource={dataList.toJS()}
        rowKey="brandId"
        pagination={{
          pageSize,
          total,
          current: pageNum + 1,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize: pageSize });
          }
        }}
      >
        <Column
          title="排序"
          dataIndex="serialNo"
          key="serialNo"
          render={(brandSeqNum) => brandSeqNum || '-'}
          width={80}
        />
        <Column title="品牌名称" dataIndex="name" key="name" width={100} />
        <Column
          title="品牌别名"
          dataIndex="alias"
          key="alias"
          render={(nickName) => nickName || '-'}
          width={100}
        />
        {/* <Column
          title="品牌logo"
          dataIndex="logo"
          key="logo"
          render={(logo) =>
            logo ? <img src={logo} style={styles.img} /> : '-'
          }
          width={180}
        /> */}
        <Column
          className="supplier"
          title="已签约商家"
          dataIndex="storeNames"
          key="storeNames"
          width={480}
          render={(supplierNames) =>
            supplierNames ? (
              <Tooltip placement="top" title={supplierNames}>
                <div style={styles.supplier}>{supplierNames}</div>
              </Tooltip>
            ) : (
              '-'
            )
          }
        />
        <Column
          title="操作"
          key="option"
          width={180}
          render={(rowInfo) => {
            rowInfo = fromJS(rowInfo);
            return (
              <div>
                <AuthWrapper functionName={'f_goods_brand_1'}>
                  <a
                    style={styles.edit}
                    onClick={this._showEditModal.bind(
                      this,
                      rowInfo.get('brandId'),
                      rowInfo.get('name'),
                      rowInfo.get('alias'),
                      rowInfo.get('serialNo')
                    )}
                  >
                    编辑排序
                  </a>
                </AuthWrapper>
                {/* <AuthWrapper functionName={'f_goods_brand_2'}>
                  <a onClick={this._delete.bind(this, rowInfo.get('brandId'))}>
                    删除
                  </a>
                </AuthWrapper> */}
              </div>
            );
          }}
        />
      </DataGrid>
    );
  }

  /**
   * 显示修改弹窗
   */
  _showEditModal = (
    brandId: string,
    name: string,
    alias: string,
    serialNo: string
  ) => {
    const { showEditModal } = this.props.relaxProps;
    console.log(this.props.cateId);
    showEditModal(Map({ brandId, alias, serialNo, cateId: this.props.cateId }));
  };

  /**
   * 删除品牌
   */
  _delete = (brandId: string) => {
    const { doDelete } = this.props.relaxProps;
    confirm({
      title: '提示',
      content: '您确认要删除这个品牌吗？',
      onOk() {
        doDelete(brandId);
      }
    });
  };
}
