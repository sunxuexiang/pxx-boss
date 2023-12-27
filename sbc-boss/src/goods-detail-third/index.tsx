import React from 'react';
import { Breadcrumb, Button, message } from 'antd';
import { StoreProvider } from 'plume2';

import { AuthWrapper, Const, Headline, BreadCrumb } from 'qmkit';
import Detail from './components/detail';
import AppStore from './store';

import ForbidModal from './components/audit-forbid-modal';
import RejectModal from './components/audit-reject-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsDetailThird extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    const { gid, pageNum } = this.props.match.params;
    if (pageNum) {
      sessionStorage.setItem('pageNum', pageNum);
    }
    if (gid != 'null') {
      this.store.init(gid);
    } else {
      message.error('该商品已删除');
    }
  }

  render() {
    const { gid } = this.props.match.params;
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>商品详情</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container">
          <Headline title="商品详情">
            <div className="rightBtn">
              {/* <AuthWrapper functionName="f_goods_2"> */}
              <Button
                type="primary"
                loading={this.store.state().get('saveLoading')}
                onClick={() => this._handleAuditForbid(gid)}
              >
                禁售
              </Button>
              {/* </AuthWrapper> */}
            </div>
          </Headline>
          <Detail />
        </div>
        <ForbidModal />
      </div>
    );
  }

  _handleAuditForbid = (gid: string) => {
    if (gid) {
      this.store.modalForbidShow();
    } else {
      console.error('商品编号不可为空');
    }
  };
}
