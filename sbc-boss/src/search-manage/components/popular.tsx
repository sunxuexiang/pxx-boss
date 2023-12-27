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
      popularList: IList;
      showEditPopularModal: Function;
      deletePopular: Function;
      popularModal: Function;
      popularCateSort: Function;
    };
  };

  static relaxProps = {
    popularList: 'popularList',
    //展示热搜词框
    showEditPopularModal: noop,
    // 删除
    deletePopular: noop,
    popularModal: noop,
    popularCateSort: noop
  };

  _columns = [
    {
      title: '热搜词名称',
      dataIndex: 'popularSearchKeyword',
      key: 'popularSearchKeyword',
      width: 200
    },
    {
      title: '移动端落地页',
      dataIndex: 'relatedLandingPage',
      key: 'relatedLandingPage',
      width: 300,
      render: (record) => {
        if (record) {
          let item = record.replace(/\'/g, '\\"').replace(/\\/g, '');
          item = JSON.parse(item);

          return this._getRelatedLandingPage(item);
        } else {
          return '-';
        }
      }
    },
    {
      title: 'PC端落地页',
      dataIndex: 'pcLandingPage',
      key: 'pcLandingPage',
      width: 300,
      render: (record) => {
        if (record) {
          let item = record.replace(/\'/g, '\\"').replace(/\\/g, '');
          item = JSON.parse(item);
          return this._getRelatedLandingPage(item);
        } else {
          return '-';
        }
      }
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

  //格式化落地页
  _getRelatedLandingPage = (item) => {
    let info = item.info;
    if (item.linkKey === 'goodsList') {
      return info.name && '商品' + ' > ' + unescape(info.name);
    } else if (item.linkKey === 'storeList') {
      return info.storeName && '店铺' + ' > ' + unescape(info.storeName);
    } else if (item.linkKey === 'categoryList') {
      let name = '';
      let pathName = info.pathName.split(',');
      pathName.map((v) => {
        name += ' > ' + v;
      });
      return info.pathName && '类目' + name;
    } else if (item.linkKey === 'pageList') {
      return info.title && '页面' + ' > ' + info.title;
    } else if (item.linkKey === 'userpageList') {
      return info.title && '常用功能' + ' > ' + info.title;
    } else if (item.linkKey === 'promotionList') {
      let cateKey = item.info.cateKey;
      if (cateKey === 'preOrder') {
        return (
          info.goodsInfo.goodsInfoName &&
          '营销' + ' > ' + '预约' + ' > ' + info.goodsInfo.goodsInfoName
        );
      } else if (cateKey === 'preSell') {
        return (
          info.goodsInfo.goodsInfoName &&
          '营销' + ' > ' + '预售' + ' > ' + info.goodsInfo.goodsInfoName
        );
      } else if (cateKey === 'groupon') {
        return (
          info.goodsInfo.goodsInfoName &&
          '营销' + ' > ' + '拼团' + ' > ' + info.goodsInfo.goodsInfoName
        );
      } else if (cateKey === 'flash') {
        return (
          info.goods.goodsName &&
          '营销' + ' > ' + '秒杀' + ' > ' + info.goods.goodsName
        );
      } else if (cateKey === 'full') {
        return (
          info.marketingName &&
          '营销' + ' > ' + '满减/折/赠' + ' > ' + info.marketingName
        );
      } else if (cateKey === 'comBuy') {
        return (
          info.marketingName &&
          '营销' + ' > ' + '组合购' + ' > ' + info.marketingName
        );
      } else if (cateKey === 'onePrice') {
        return (
          info.marketingName &&
          '营销' + ' > ' + '打包一口价' + ' > ' + info.marketingName
        );
      } else if (cateKey === 'halfPrice') {
        return (
          info.marketingName &&
          '营销' + ' > ' + '第二件半价' + ' > ' + info.marketingName
        );
      }
    } else if (item.linkKey === 'custom') {
      return info.content && '自定义' + ' > ' + info.content;
    } else if (item.linkKey === 'operationClassifyList') {
      return '运营分类目' + '>' + info.cateName;
    }
  };

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
    const { showEditPopularModal } = this.props.relaxProps;
    showEditPopularModal(fromJS(record), false);
  };

  /**
   * 删除
   */
  _delete = async (record) => {
    const { deletePopular } = this.props.relaxProps;
    console.log('_delete', record);
    confirm({
      title: '提示',
      content: '删除后无法恢复，确定要删除？',
      okText: '确定',
      cancelText: '取消',
      iconType: 'exclamation-circle',
      onOk() {
        deletePopular(record);
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

    const { popularList, popularCateSort } = this.props.relaxProps;
    console.log('popularList', popularList.toJS().popularSearchTermsVO);

    let sortList = update(popularList.toJS().popularSearchTermsVO, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, popularList.toJS().popularSearchTermsVO[dragIndex]]
      ]
    });
    console.log('sortList', sortList);
    popularCateSort(sortList);
  };

  render() {
    const { popularList } = this.props.relaxProps;
    if (!checkAuth('f_popular_search_terms')) {
      message.error('暂无权限访问');
      return null;
    }
    return (
      <div>
        <Button
          onClick={() => this._showModal()}
          type="primary"
          htmlType="submit"
          style={{ marginBottom: 16 }}
        >
          新增热搜词
        </Button>
        <Table
          columns={this._columns}
          dataSource={popularList.toJS().popularSearchTermsVO}
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

  _showModal = () => {
    const { popularModal } = this.props.relaxProps;
    popularModal(true);
  };
}
