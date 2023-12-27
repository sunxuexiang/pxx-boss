import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb, Tabs, Form, Button } from 'antd';
import { Headline, history, BreadCrumb, AuthWrapper } from 'qmkit';
import AppStore from './store';
import StepOne from './components/step-one';
import StepTwo from './components/step-two';
import StepThree from './components/step-three';
import StepFour from './components/step-four';
import SupplierModal from './components/supplier-modal';
import DismissedModal from './components/dismissed-modal';
import TipsModal from './components/tips-modal';

const TabPane = Tabs.TabPane;

const StepTwoForm = Form.create()(StepTwo as any);
const StepOneForm = Form.create()(StepOne as any);
const StepFourForm = Form.create()(StepFour as any);
const SupplierForm = Form.create()(SupplierModal as any);
const DismissedModalForm = Form.create()(DismissedModal as any);

// @ts-ignore
@StoreProvider(AppStore, { debug: __DEV__ })
export default class SupplierDetail extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { sid } = this.props.match.params;
    this.store.init(sid);
  }

  render() {
    const momentTab = this.store.state().get('momentTab');
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>商家详情</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container">
          <Headline title="商家详情" />

          <Tabs
            defaultActiveKey={momentTab}
            onChange={(data) => this.change(data)}
          >
            <TabPane tab="基本信息" key="1">
              <StepOneForm />
            </TabPane>
            <TabPane tab="工商信息" key="2">
              <StepTwoForm />
            </TabPane>
            <TabPane tab="签约信息" key="3">
              <StepThree />
            </TabPane>
            <TabPane tab="财务信息" key="4">
              <StepFourForm />
            </TabPane>
          </Tabs>
        </div>

        {this.store.state().get('company').get('storeInfo').get('auditState') ==
        2 ? null : (
          <div className="bar-button">{this._renderButton()}</div>
        )}

        {/* 商家审核弹窗 */}
        <SupplierForm />

        {/* 驳回弹窗 */}
        <DismissedModalForm />

        {/* 审核提示弹窗 */}
        <TipsModal />
      </div>
    );
  }

  /**
   * 切换tab页面
   */
  change = (value) => {
    this.store.setTab(value);
  };

  /**
   * 加载按钮
   * @returns {any}
   * @private
   */
  _renderButton = () => {
    //基本信息
    const storeInfo = this.store.state().get('company').get('storeInfo');
    //店铺ID
    const storeId = this.store.state().get('storeId');
    //已审核的时候，提供编辑按钮
    if (storeInfo.get('auditState') == 1) {
      return storeInfo.get('storeType') == 0 ? (
        <AuthWrapper functionName={'f_provider_edit_1'}>
          <Button type="primary" onClick={() => this._edit(storeId)}>
            编辑
          </Button>
        </AuthWrapper>
      ) : (
        <AuthWrapper functionName={'f_supplier_edit_1'}>
          <Button type="primary" onClick={() => this._edit(storeId)}>
            编辑
          </Button>
        </AuthWrapper>
      );
    } else {
      return (
        <div>
          <Button type="primary" onClick={() => this.store.supplierModal()}>
            去审核
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            onClick={() => this.store.dismissedModal()}
          >
            驳回
          </Button>
        </div>
      );
    }
  };

  /**
   * 编辑入口，跳转到编辑页面
   * @private
   */
  _edit = (id: number) => {
    history.push(`/supplier-edit/${id}`);
  };
}
