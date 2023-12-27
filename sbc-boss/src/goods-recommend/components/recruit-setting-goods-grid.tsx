import * as React from 'react';
import { DataGrid } from 'qmkit';

import styled from 'styled-components';
import { Relax } from 'plume2';
import PropTypes from 'prop-types';
import Store from '../store';
import { IList } from '../../../typings/globalType';
import noop from '../../../web_modules/qmkit/noop';
import { Button, Input, InputNumber, message, Tabs, Table } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import SortModal from './sortModal';
import update from 'immutability-helper';
import HTML5Backend from 'react-dnd-html5-backend';
const { TabPane } = Tabs;
const { Column } = Table;

const TableRow = styled.div`
  margin-top: 20px;
  .red {
    background-color: #eee;
  }
`;
/**
 * 商品添加
 */
@Relax
class SelectedGoodsGrid extends React.Component<any, any> {
  form;
  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  props: {
    relaxProps?: {
      goodsRows: IList;
      deleteSelectedSku: Function;
      saveSortSku: Function;
      fieldsValue: Function;
      onFormFieldChange: Function;
      showSort: Function;
      sortVisible: boolean;
      setRowData: Function;
      sortData: any;
      setSortChange: Function;
    };
  };

  static relaxProps = {
    goodsRows: 'goodsRows',
    sortVisible: 'sortVisible',
    deleteSelectedSku: noop,
    saveSortSku: noop,
    fieldsValue: noop,
    onFormFieldChange: noop,
    showSort: noop,
    setRowData: noop,
    sortData: 'sortData',
    setSortChange: noop
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const {
      goodsRows,
      deleteSelectedSku,
      saveSortSku,
      showSort,
      sortVisible,
      setRowData,
      sortData,
      setSortChange
    } = this.props.relaxProps;
    let data =
      goodsRows &&
      goodsRows.toJS().map((item, index) => {
        return { ...item, index: index + 1 };
      });
    return (
      <div>
        <Button type="primary" icon="plus" onClick={() => this.onAdd()}>
          添加推荐商品
        </Button>
        <TableRow>
          <DataGrid
            scroll={{ y: 500 }}
            size="small"
            rowKey={(record) => record.goodsInfoId}
            dataSource={data || []}
            pagination={{
              pageSize: 20
            }}
            // components={this.components}
            // onRow={(_record, index) => ({
            //   index,
            //   moveRow: this._moveRow
            // })}
          >
            {/* <Column
              title="排序"
              width="10%"
              render={(row) => {
                return <InputNumber defaultValue={row.recommendSort} onBlur={(e) => {
                  const value = e.target.value;
                  if (value && value != '0' && Number(value) > 0) {
                    saveSortSku(e.target.value, row.goodsInfoId);
                  } else {
                    message.error('请输入正确的排序号');
                  }
                }} />;
              }}
            /> */}
            <Column
              title="排序"
              key="index"
              width="10%"
              align="center"
              render={(row) => {
                return (
                  <a
                    onClick={() => {
                      showSort(true);
                      setRowData(row);
                    }}
                  >
                    {row.index}
                  </a>
                );
              }}
            />
            <Column
              title="主图"
              key="goodsInfoImg"
              width="10%"
              render={(row) => {
                return <img src={row.goodsInfoImg} style={styles.imgItem} />;
              }}
            />

            <Column
              title="商品编码"
              dataIndex="goodsInfoNo"
              key="goodsInfoNo"
              width="10%"
            />

            <Column
              title="商品名称"
              dataIndex="goodsInfoName"
              key="goodsInfoName"
              width="15%"
            />

            <Column
              title="规格"
              dataIndex="specText"
              key="specText"
              width="10%"
              render={(v) => (v ? v : '-')}
            />

            <Column
              title="分类"
              key="cateName"
              dataIndex="cateName"
              width="10%"
            />

            <Column
              title="品牌"
              key="brandName"
              dataIndex="brandName"
              width="10%"
              render={(v) => (v ? v : '-')}
            />

            <Column
              title="门店价"
              key="marketPrice"
              dataIndex="marketPrice"
              width="8%"
              render={(data) => {
                return `¥${data}`;
              }}
            />

            <Column
              title="大客户价"
              key="vipPrice"
              dataIndex="vipPrice"
              width="8%"
              render={(data) => {
                return `¥${data == null ? 0 : data}`;
              }}
            />

            <Column
              title="操作"
              key="operate"
              width="5%"
              render={(row) => {
                return (
                  <a onClick={() => deleteSelectedSku(row.goodsInfoId)}>删除</a>
                );
              }}
            />
          </DataGrid>
        </TableRow>
        <SortModal
          visible={sortVisible}
          close={showSort}
          current={sortData.index}
          onOk={setSortChange}
        ></SortModal>
      </div>
    );
  }

  /**
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @private
   */
  _moveRow = async (goodsInfoId, dragIndex, hoverIndex) => {
    const { goodsRows, onFormFieldChange } = this.props.relaxProps;
    let rGoods = JSON.parse(JSON.stringify(goodsRows.toJS()));

    rGoods.splice(dragIndex, 1);
    rGoods.splice(hoverIndex, 0, goodsRows.toJS()[dragIndex]); //index:元素需要放置的位置索引，从0开始
    // rGoods.splice(dragIndex, 1);

    // this.setState(
    //   update(this.state, {
    //     goodsRows: {
    //       $splice: [[dragIndex, 1], [hoverIndex, 0, goodsRows[dragIndex]]],
    //     },
    //   }),
    // );
    onFormFieldChange('goodsRows', rGoods);
    // let list = rGoods.map((item, i) => { return { goodsInfoId: item.goodsInfoId, recommendSort: i + 1 } });
    // console.log(list, '123123');

    // // const { res }: any = await api.sort(list);
    // if (res.code == 'K-000000') {
    //   // this.init(pageNum, pageSize);
    // } else {
    //   message.error(res.message);
    // }
    // const { cateSort } = this.props.relaxProps;
    // cateSort(catePath, dragIndex, hoverIndex);
  };

  // components = {
  //   body: {
  //     row: _BodyRow
  //   }
  // };

  onAdd() {
    this._store.onFormFieldChange('goodsModalVisible', true);
  }
}
let _dragDirection = (
  dragIndex,
  hoverIndex,
  initialClientOffset,
  clientOffset,
  sourceClientOffset
) => {
  const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
  const hoverClientY = clientOffset.y - sourceClientOffset.y;
  if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
    return 'downward';
  }
  if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
    return 'upward';
  }
};

let _BodyRow = (props) => {
  const {
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    dragRow,
    clientOffset,
    sourceClientOffset,
    initialClientOffset,
    ...restProps
  } = props;
  const style = { ...restProps.style, cursor: 'move' };
  let className = restProps.className;
  if (isOver && initialClientOffset) {
    const direction = _dragDirection(
      dragRow.index,
      restProps.index,
      initialClientOffset,
      clientOffset,
      sourceClientOffset
    );
    if (direction === 'downward') {
      className += ' drop-over-downward';
    }
    if (direction === 'upward') {
      className += ' drop-over-upward';
    }
  }
  return connectDragSource(
    connectDropTarget(<tr {...restProps} className={className} style={style} />)
  );
};

const _rowSource = {
  beginDrag(props) {
    return {
      index: props.index,
      cateInfo: props.children[0].props.record
    };
  }
};

const _rowTarget = {
  drop(props, monitor) {
    //源对象
    const sourceCate = monitor.getItem().cateInfo;
    //目标对象
    // const targetCate = props.children[0].props.record;
    // //判断两个拖拽目标是不是同一级
    // if (sourceCate.cateParentId != targetCate.cateParentId) {
    //     return;
    // }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    //自己不能和自己换位置
    if (dragIndex === hoverIndex) {
      return;
    }
    //拖拽排序方法
    props.moveRow(sourceCate.goodsInfoId, dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  }
};

_BodyRow = DropTarget('row', _rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  sourceClientOffset: monitor.getSourceClientOffset()
}))(
  DragSource('row', _rowSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    dragRow: monitor.getItem(),
    clientOffset: monitor.getClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset()
  }))(_BodyRow)
);

const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  },
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    background: '#fff'
  },
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#1890ff',
    display: 'inline-block',
    marginLeft: 5
  }
};
export default DragDropContext(HTML5Backend)(SelectedGoodsGrid);
