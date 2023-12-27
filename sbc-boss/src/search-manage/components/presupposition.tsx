import React from 'react';
import { Relax } from 'plume2';
import { Button, Table, Modal } from 'antd';
import { checkAuth, noop } from 'qmkit';
import { IList } from 'typings/globalType';
const confirm = Modal.confirm;
import { fromJS } from 'immutable';
import { DragSource, DropTarget } from 'react-dnd';
import update from 'immutability-helper';
import { message } from 'antd';
const styles = {
  edit: {
    paddingRight: 10
  }
};

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
    props.moveRow(dragIndex, hoverIndex, 1);
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

@Relax
export default class PopularSettig extends React.Component<any, any> {
  props: {
    relaxProps?: {
      presetModal: Function;
      presetform: IList;
      showEditPopularModal: Function;
      deletePreset: Function;
      popularModal: Function;
      popularCateSort: Function;
    };
  };

  static relaxProps = {
    presetform: 'presetform',
    //展示热搜词框
    showEditPopularModal: noop,
    // 删除
    presetModal: noop,
    deletePreset: noop,
    popularModal: noop,
    popularCateSort: noop
  };

  _columns = [
    {
      title: '搜索词',
      dataIndex: 'presetSearchKeyword',
      key: 'presetSearchKeyword'
    },
    {
      title: '顺序',
      dataIndex: 'sort',
      key: 'sort'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => this._getOption(record)
    }
  ];

  constructor(props) {
    super(props);

    this.state = {};
  }

  /**
   * 获取操作项
   */
  _getOption = (record) => {
    return (
      <div>
        <a style={styles.edit} onClick={this._showEditModal.bind(this, record)}>
          编辑
        </a>
        <a onClick={this._delete.bind(this, record)}>删除</a>
      </div>
    );
  };

  /**
   * 显示修改联想词弹窗
   */
  _showEditModal = (record: object) => {
    const { presetModal } = this.props.relaxProps;
    presetModal(false, fromJS(record));
  };

  /**
   * 删除
   */
  _delete = async (record) => {
    const { deletePreset } = this.props.relaxProps;
    console.log('_delete', record);
    confirm({
      title: '提示',
      content: '删除后无法恢复，确定要删除？',
      okText: '确定',
      cancelText: '取消',
      iconType: 'exclamation-circle',
      onOk() {
        deletePreset(record);
      }
    });
  };

  components = {
    body: {
      row: _BodyRow
    }
  };

  //拖拽处理
  _moveRow = (dragIndex, hoverIndex) => {
    console.log('dragIndex', dragIndex, hoverIndex);

    const { presetform, popularCateSort } = this.props.relaxProps;
    console.log('presetform', presetform.toJS().presetSearchTermsVO);
    const presetSearchTermsVO = presetform.toJS().presetSearchTermsVO;
    // let sortList = update(presetform.toJS().presetSearchTermsVO, {
    //   $splice: [
    //     [dragIndex, 1],
    //     [hoverIndex, 0, presetform.toJS().presetSearchTermsVO[dragIndex]]
    //   ]
    // });
    const date1 = presetSearchTermsVO[hoverIndex].sort;
    const date2 = presetSearchTermsVO[dragIndex].sort;
    presetSearchTermsVO[dragIndex].sort = date1;
    presetSearchTermsVO[hoverIndex].sort = date2;
    console.log('sortList', presetSearchTermsVO);
    popularCateSort(presetSearchTermsVO);
  };

  render() {
    const { presetform } = this.props.relaxProps;

    if (!checkAuth('f_popular_search_terms')) {
      message.error('暂无权限访问');
      return null;
    }
    return (
      <div>
        <Button
          onClick={() => this._showSearchModal()}
          type="primary"
          htmlType="submit"
          style={{ marginBottom: 16 }}
        >
          新增预置搜索词
        </Button>
        <Table
          columns={this._columns}
          dataSource={presetform.toJS().presetSearchTermsVO}
          pagination={false}
          components={this.components}
          onRow={(record, index) => ({
            index,
            moveRow: this._moveRow
          })}
        />
      </div>
    );
  }

  //新增搜索词
  _showSearchModal = () => {
    const { presetModal } = this.props.relaxProps;
    presetModal(true);
  };
}
