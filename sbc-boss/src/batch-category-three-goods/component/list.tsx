import React from 'react';
import { Link } from 'react-router-dom';
import { Relax } from 'plume2';
import { AuthWrapper, DataGrid, noop } from 'qmkit';
import { IList } from 'typings/globalType';
import { Popconfirm, Switch,Table } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
const { Column } = Table;

@Relax
export default class List extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      pageNum: number;
      pageSize: number;
      list: IList;
      deleteCoupon: Function;
      init: Function;
      copyCoupon: Function;
      onchangeStart: Function;
      goodsRows: IList
    };
  };

  static relaxProps = {
    total: 'total',
    pageNum: 'pageNum',
    pageSize: 'pageSize',
    list: 'list',
    deleteCoupon: noop,
    init: noop,
    copyCoupon: noop,
    onchangeStart: noop,
    goodsSort:noop,
    goodsRows: 'goodsRows'
  };

  render() {
    const {
      total,
      pageNum,
      pageSize,
      list,
      init,
    } = this.props.relaxProps;
    // console.log(list.toJS(), 'listlist');
    
    return (
      <DataGrid
        rowKey={(record) => record.advertisingId}
        dataSource={list.toJS()}
        onRow={(_record, index) => ({
          index,
          moveRow: this._moveRow
        })}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
      >
        {/* <Column title="名称" dataIndex="advertisingName" key="advertisingName" /> */}
        <Column
          title="图片"
          dataIndex="goodsInfoImg"
          key="goodsInfoImg"
          render={(goodsInfoImg) => {
            return goodsInfoImg ? <img src={goodsInfoImg} style={styles.imgItem} /> : ''
          }
          }
        />
        <Column
          title="商品名称"
          dataIndex="goodsInfoName"
          key="goodsInfoName"
        />
         <Column
          title="类目"
          dataIndex="mofangName"
          key="mofangName"
        />
          <Column
          title="品牌"
          dataIndex="storeName"
          key="storeName"
        />
         <Column
          title="单位"
          dataIndex="goodsUnit"
          key="goodsUnit"
        />
        <Column
          title="零售价"
          dataIndex="marketPrice"
          key="marketPrice"
        />
      
      </DataGrid>
    );
  }
      _moveRow = async(cateId, dragIndex, hoverIndex) => {
        console.log(cateId, dragIndex, hoverIndex, 'cateId, dragIndex, hoverIndex');
        const { pageNum, pageSize,dataSource } = this.state;
        
        
        const { goodsSort }:any = this.props.relaxProps;
        goodsSort( dragIndex, hoverIndex);
    };
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
      props.moveRow(sourceCate.cateId, dragIndex, hoverIndex);
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
  imgItem: {
    width: '60px',
    height: '60px',
    padding: ' 5px',
    border: '1px solid #ddd',
    float: 'left',
    marginRight: '10px',
    background: '#fff',
    borderRadius: '3px'
  } as any,
}