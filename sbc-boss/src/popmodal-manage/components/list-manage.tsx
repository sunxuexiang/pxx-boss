import React from 'react';
import { Link } from 'react-router-dom';
import { AuthWrapper } from 'qmkit';
import { Table } from 'antd';
const Column = Table.Column;

/**
 * 订单收款单列表
 */

export default class PayOrderList extends React.Component<any, any> {
  render() {
    let dataLists = [
      { name: '商城首页', applicationPageName: 'shoppingIndex' },
      { name: '购物车', applicationPageName: 'shoppingCart' },
      { name: '个人中心', applicationPageName: 'personalCenter' },
      { name: '会员中心', applicationPageName: 'memberCenter' },
      { name: '拼团频道', applicationPageName: 'groupChannel' },
      { name: '秒杀频道', applicationPageName: 'seckillChannel' },
      { name: '领券中心', applicationPageName: 'securitiesCenter' }
      // { name: '积分商城', applicationPageName: 'integralMall' }
    ];
    return (
      <Table dataSource={dataLists} pagination={false}>
        <Column title="弹窗名称" key="name" dataIndex="name" width="10%" />

        <Column
          title="操作"
          render={(text, record) => {
            return this.operator(text, record);
          }}
          width="15%"
        />
      </Table>
    );
  }
  /**
   * 操作按钮
   * @param record
   * @returns {any}
   */
  private operator(_text, record: any) {
    return (
      <div>
        <AuthWrapper functionName="f_page_management">
          <Link
            to={`/popmodal-manage-edit/${record.applicationPageName}/${record.name}`}
          >
            设置
          </Link>
        </AuthWrapper>
      </div>
    );
  }
}
