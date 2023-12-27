import React from 'react';
import { Relax } from 'plume2';
import { AuthWrapper, noop } from 'qmkit';
import { Modal, Table } from 'antd';
import { IList } from 'typings/globalType';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const confirm = Modal.confirm;
const styles = {
  edit: {
    paddingRight: 10
  }
} as any;

@Relax
class InfoList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      dataList: IList;
      cateSort: Function;
      onDelete: Function;
      onEdit: Function;
      onVisible: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    dataList: 'dataList',
    //拖拽排序
    cateSort: noop,
    onDelete: noop,
    onEdit: noop,
    onVisible: noop
  };

  render() {
    const { loading, dataList } = this.props.relaxProps;
    return (
      <Table
        rowKey="id"
        loading={loading}
        dataSource={dataList.toJS()}
        components={this.components}
        columns={this._columns}
        pagination={false}
        onRow={(_record, index) => ({
          index,
          moveRow: this._moveRow
        })}
      />
    );
  }

  components = {
    body: {
      row: _BodyRow
    }
  };

  /**
   * 列表数据的column信息
   */
  _columns = [
    {
      key: 'index',
      title: '序号',
      render: (_text, _rowInfo, index) => {
        return index + 1;
      }
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: '标签名称'
    },
    {
      key: 'visible',
      dataIndex: 'visible',
      title: '标签状态',
      render: (_text, rowInfo) => {
        if (rowInfo.visible) {
          return '启用';
        }
        return '禁用';
      }
    },
    {
      key: 'image',
      dataIndex: 'image',
      title: '标签图标',
      render: (_text, rowInfo) => {
        return (
          <img
            style={{ width: 50, height: 50 }}
            src={JSON.parse(_text)[0].url}
          />
        );
      }
    },
    {
      key: 'option',
      title: '操作',
      render: (rowInfo) => this._getOption(rowInfo)
    }
  ];

  /**
   * 获取操作项
   */
  _getOption = (rowInfo) => {
    return (
      <div>
        {/* <AuthWrapper functionName={'f_goods_label_3'}> */}
        <a style={styles.edit} onClick={() => this._onEdit(rowInfo.id)}>
          编辑
        </a>
        {/* </AuthWrapper> */}
        {/* <AuthWrapper functionName={'f_goods_label_5'}> */}
        <a style={styles.edit} onClick={() => this._onVisible(rowInfo)}>
          {rowInfo.visible ? '禁用' : '启用'}
        </a>
        {/* </AuthWrapper>
        <AuthWrapper functionName={'f_goods_label_4'}> */}
        <a onClick={() => this._onDelete(rowInfo.id)}>删除</a>
        {/* </AuthWrapper> */}
      </div>
    );
  };

  /**
   * 编辑信息
   */
  _onEdit = (id) => {
    const { onEdit } = this.props.relaxProps;
    onEdit(id);
  };

  /**
   * 单个删除信息
   */
  _onDelete = (id) => {
    const { onDelete } = this.props.relaxProps;
    confirm({
      title: '确定要删除选中标签吗?',
      onOk() {
        onDelete(id);
      },
      onCancel() {}
    });
  };

  /**
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @private
   */
  _moveRow = (dragIndex, hoverIndex) => {
    const { cateSort } = this.props.relaxProps;
    cateSort(dragIndex, hoverIndex);
  };

  /**
   * 启用/禁用
   */
  _onVisible = (item) => {
    const { onVisible } = this.props.relaxProps;
    onVisible(item);
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
      index: props.index
    };
  }
};

const _rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    //自己不能和自己换位置
    if (dragIndex === hoverIndex) {
      return;
    }
    //拖拽排序方法
    props.moveRow(dragIndex, hoverIndex);
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

export default DragDropContext(HTML5Backend)(InfoList);
