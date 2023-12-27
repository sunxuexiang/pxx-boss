import React from 'react';
import { Relax } from 'plume2';

import { Table, Button, Modal } from 'antd';
import { DragSource, DropTarget } from 'react-dnd';
import update from 'immutability-helper';
import { fromJS, List } from 'immutable';
import { noop } from 'qmkit';

declare type IList = List<any>;
const confirm = Modal.confirm;

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
export default class AssociationSetting extends React.Component<any, any> {
  props: {
    relaxProps?: {
      associationList: IList;
      associationCateSort: Function;
      showEditSearchModal: Function;
      showEditAssociationModal: Function;
      deleteAssociation: Function;
      deleteSearch: Function;
      searchModal: Function;
      total: number;
      currentPage: number;
      pageSize: number;
      init: Function;
    };
  };

  static relaxProps = {
    associationList: 'associationList',
    total: 'total',
    currentPage: 'currentPage',
    pageSize: 'pageSize',

    //拖拽排序
    associationCateSort: noop,
    // 展示搜索词框
    showEditSearchModal: noop,
    //展示联想词框
    showEditAssociationModal: noop,
    // 删除
    deleteAssociation: noop,
    searchModal: noop,
    deleteSearch: noop,
    init: noop
  };

  constructor(props) {
    super(props);

    this.state = {
      keys: [],
      record: {}
    };
  }

  components = {
    body: {
      row: _BodyRow
    }
  };

  _moveRow = (dragIndex, hoverIndex) => {
    const { record } = this.state;

    const { associationList, associationCateSort } = this.props.relaxProps;
    const context = associationList.toJS().searchAssociationalWordPage.content;
    let new_data = context.find((k) => k.id == record.id);
    const dragRow = new_data.associationLongTailWordList[dragIndex];
    let sortList = update(new_data.associationLongTailWordList, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow]
      ]
    });
    new_data.associationLongTailWordList = sortList;

    associationCateSort(sortList);
  };

  expandedRowRender = (_record, index, _indent, _expanded) => {
    const columns = [
      {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
        width: 200
      },
      {
        title: 'associationalWord',
        dataIndex: 'associationalWord',
        key: 'associationalWord',
        width: 200
      },
      {
        title: 'longTailWord',
        dataIndex: 'longTailWord',
        key: 'longTailWord',
        width: 200
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (_text, record) => this._getSecOption(record)
      }
    ];

    const { associationList } = this.props.relaxProps;

    return (
      <Table
        columns={columns}
        showHeader={false}
        dataSource={
          associationList.toJS().searchAssociationalWordPage.content[index]
            .associationLongTailWordList
            ? associationList.toJS().searchAssociationalWordPage.content[index]
                .associationLongTailWordList
            : []
        }
        pagination={false}
        components={this.components}
        onRow={(_record, index) => ({
          index,
          moveRow: this._moveRow
        })}
      />
    );
  };

  _columns = [
    {
      title: '搜索词',
      dataIndex: 'searchTerms',
      key: 'searchTerms',
      width: 200
    },
    {
      title: '联想词',
      dataIndex: 'associationName',
      key: 'associationName',
      width: 200
    },
    {
      title: '联想长尾词',
      dataIndex: 'longtail',
      key: 'longtail',
      width: 200
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      render: (_text, record) => this._getOption(record)
    }
  ];
  /**
   * 获取二级操作项
   */
  _getSecOption = (record) => {
    return (
      <div>
        <a
          style={styles.edit}
          onClick={this._showEditAssociationModal.bind(this, record, false)}
        >
          编辑
        </a>
        <a onClick={this._delete.bind(this, record)}>删除</a>
      </div>
    );
  };

  /**
   * 获取操作项
   */
  _getOption = (record) => {
    return (
      <div>
        <a
          style={styles.edit}
          onClick={this._showEditAssociationModal.bind(this, record, true)}
        >
          添加联想词
        </a>
        <a
          style={styles.edit}
          onClick={this._showSearchEditModal.bind(this, record)}
        >
          编辑
        </a>
        <a onClick={this._deleteSearch.bind(this, record)}>删除</a>
      </div>
    );
  };

  /**
   * 显示修改联想词弹窗
   */
  _showEditAssociationModal = (record, idAdd) => {
    const { showEditAssociationModal, associationList } = this.props.relaxProps;
    record.longTailWordList =
      record.longTailWord && record.longTailWord.split(';');

    //找到当前点击的搜索词
    //如果是编辑联想词
    if (!record.searchTerms) {
      const content = associationList.toJS().searchAssociationalWordPage
        .content;
      content.find((k) => k == record.searchAssociationalWordId);
      record.searchTerms = this.state.record.searchTerms;
    }

    showEditAssociationModal(fromJS(record), idAdd);
  };

  /**
   * 显示修改弹窗
   */
  _showSearchEditModal = (record) => {
    const { showEditSearchModal } = this.props.relaxProps;
    showEditSearchModal(fromJS(record), false);
  };

  //删除搜索词
  _deleteSearch = async (record) => {
    const { deleteSearch } = this.props.relaxProps;
    confirm({
      title: '提示',
      content: '删除后无法恢复，确定要删除？',
      okText: '确定',
      cancelText: '取消',
      iconType: 'exclamation-circle',
      onOk() {
        deleteSearch(record.id);
      }
    });
  };

  /**
   * 删除联想词
   */
  _delete = async (record) => {
    const { deleteAssociation } = this.props.relaxProps;
    confirm({
      title: '提示',
      content: '删除后无法恢复，确定要删除？',
      okText: '确定',
      cancelText: '取消',
      iconType: 'exclamation-circle',
      onOk() {
        deleteAssociation(record.associationLongTailWordId);
      }
    });
  };

  render() {
    const {
      associationList,
      total,
      currentPage,
      pageSize,
      init
    } = this.props.relaxProps;
    const list =
      associationList
        .getIn(['searchAssociationalWordPage', 'content'])
        ?.toJS() || [];

    return (
      <div>
        <Button
          onClick={() => this._showSearchModal()}
          type="primary"
          htmlType="submit"
          style={{ marginBottom: 16 }}
        >
          新增搜索词
        </Button>
        <Table
          columns={this._columns}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: () => `共 ${total} 条`,
            onChange: (pageNum, pageSize) => {
              init({ pageNum: pageNum - 1, pageSize });
            },
            onShowSizeChange: (current, size) =>
              init({ pageNum: current - 1, pageSize: size }),
            pageSizeOptions: ['10', '20', '50', '100']
          }}
          dataSource={list}
          onExpand={(_expanded, record) => {
            this.setState({ record });
          }}
          expandedRowRender={this.expandedRowRender}
        />
      </div>
    );
  }

  //新增搜索词
  _showSearchModal = () => {
    const { searchModal } = this.props.relaxProps;
    searchModal(true);
  };
}
