import React, { Component } from 'react';
import { Table, Button, message } from 'antd';
import GoodsModal from './modoul/goods-modal';
import Buttom from './buttom';
import * as api from '../webapi';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import update from 'immutability-helper';
import { orderBy } from 'lodash';

class list extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            selectedSkuIds: [],
            // selectedRows: fromJS(relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList ? relaxProps.get('marketingBean').toJS().marketingSuitDetialVOList : []),
            selectedRows: [],
            //公用的商品弹出框
            goodsModal: {
                _modalVisible: false,
                _selectedSkuIds: [],
                _selectedRows: []
            },
            pageNum: 1,
            pageSize: 10,
            total: 100,
            dataSource: [],
            Imageget: []
        }
    }
    componentDidMount(): void {
        this.init(this.state.pageNum, this.state.pageSize)
    }
    render() {
        let columns = [
            {
                title: '序号',
                width: 50,
                align: 'left',
                key: 'rowIndex',
                dataIndex: 'rowIndex',
                render: (text, row, index) => `${index + 1}`
            },
            {
                title: '类目名称',
                dataIndex: 'cateName',
                key: 'cateName',
                width: '30%',
                className: 'namerow'
            },
            {
                title: '类目图片',
                dataIndex: 'cateImg',
                key: 'cateImg',
                render: (img) =>
                    img ? (
                        <img
                            src={img}
                            style={{ width: 40, height: 40, display: 'inline-block' }}
                        />
                    ) : (
                        '-'
                    )
            },
            {
                title: '操作',
                render: ((res) => {
                    return (<Button
                        type="danger"
                        onClick={() => this._deleteIt(res)}
                    >
                        删除
                    </Button>)
                })
            },
        ] as any;
        const { selectedSkuIds, pageNum, pageSize, total, dataSource, Imageget } = this.state;

        return (
            <div>
                <Buttom onischoun={this.ontrueas} seacher={(val)=>{this.init(pageNum,pageSize,val)}} Imageget={Imageget} batchDelete={this.batchDelete} />
                <Table rowSelection={{
                    selectedRowKeys: selectedSkuIds,
                    onChange: (selectedSkuIds) => {
                        this.onSelectChange(selectedSkuIds);
                    }
                }}
                    rowKey={(record) => record.cateId}
                    dataSource={dataSource} 
                    columns={columns}
                    onRow={(_record, index) => ({
                        index,
                        moveRow: this._moveRow
                    })}
                    components={this.components}
                />;
                <GoodsModal
                    visible={this.state.goodsModal._modalVisible}
                    // marketingId={marketingId}
                    selectedSkuIds={this.state.goodsModal._selectedSkuIds}
                    selectedRows={this.state.goodsModal._selectedRows}
                    onOkBackFun={this.skuSelectedBackFun}
                    onCancelBackFun={this.closeGoodsModal}
                    limitNOSpecialPriceGoods={true}
                />
            </div>
        )
    }

    components = {
        body: {
            row: _BodyRow
        }
    };

    /**
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @private
   */
    _moveRow = async(cateId, dragIndex, hoverIndex) => {
        const { pageNum, pageSize,dataSource } = this.state;
        this.setState(
            update(this.state, {
                dataSource: {
                $splice: [[dragIndex, 1], [hoverIndex, 0, dataSource[dragIndex]]],
              },
            }),
        );
        let list=this.state.dataSource.map((item,i)=>{return {cateId:item.cateId,cateSort:i+1}})
        const { res }:any = await api.sort(list);
        if (res.code == 'K-000000') {
            // this.init(pageNum, pageSize);
        } else {
            message.error(res.message);
        }
        // const { cateSort } = this.props.relaxProps;
        // cateSort(catePath, dragIndex, hoverIndex);
    };
    // 删除
    async _deleteIt(ronfin) {
        const { pageNum, pageSize } = this.state;
        const { res } = await api.deleteRecommendlist({
            cateIds: [ronfin.cateId]
        })
        this.init(pageNum, pageSize);
    }
    // 批量删除
    batchDelete = async () => {
        const { pageNum, pageSize, selectedSkuIds } = this.state;
        const { res } = await api.deleteRecommendlist({
            cateIds: selectedSkuIds
        })
        this.init(pageNum, pageSize);
    }
    // 初始化
    init = async (pageNum, pageSize,cateId=null) => {
        const { res } = await api.addRecommendlist({ pageNum, pageSize,cateId });
        if (res.code == 'K-000000') {
            const ids = res.context.map(element => element.cateId);
            this.setState({ dataSource: res.context, goodsModal: { _selectedSkuIds: ids }, selectedSkuIds: [] });
        } else {
            message.error(res.message);
        }
    }
    // 确认回调
    skuSelectedBackFun = async (selectedSkuIds, selectedRows) => {
        const { pageNum, pageSize } = this.state;
        const { res } = await api.addRecommend({
            cateIds: selectedSkuIds,
        });
        if (res.code == 'K-000000') {
            this.setState({ selectedSkuIds: [], goodsModal: { _modalVisible: false } });
            this.init(pageNum, pageSize);
        } else if (res.code == 'K-032203') {
            message.error('不能重复添加，已有的三级类目')
        } else {
            message.error(res.message);
        }
    }
    // 打开弹窗
    ontrueas = () => {
        this.setState({ goodsModal: { _modalVisible: true } })
    }

    onSelectChange(selectedSkuIds) {
        this.setState({
            selectedSkuIds
        })
    }
    /**
* 关闭货品选择modal
*/
    closeGoodsModal = () => {
        this.setState({ goodsModal: { _modalVisible: false } });
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

export default DragDropContext(HTML5Backend)(list);
