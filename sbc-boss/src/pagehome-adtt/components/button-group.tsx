import React from 'react';
import { Relax } from 'plume2';
import { Button, Menu,Radio } from 'antd';
import { AuthWrapper, history,noop} from 'qmkit';
import { IList,IMap } from 'typings/globalType';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  props: {
    relaxProps?: {
      form:IMap,
      warehouseList:IList;
      onWarehouse:Function;
    };
  };

  static relaxProps = {
    warehouseList:'warehouseList',
    form:'form',
    onWarehouse:noop
  };

  render() {
    const {warehouseList,form,onWarehouse}=this.props.relaxProps
    return (
      <div>
        <Radio.Group value={String(form.get('wareId'))} onChange={(e)=>onWarehouse('wareId', e.target.value)}>
              {warehouseList.toJS().map((item,i)=>
                <Radio.Button key={item.wareId} value={`${item.wareId}`}>{item.wareName}</Radio.Button>
              )}
            </Radio.Group>
            <br />
            <br />
         <div className="handle-bar">
            {/* <AuthWrapper functionName={'f_pagehome-addtl'}> */}
              <Button
                type="primary"
                onClick={() =>
                  history.push({
                    pathname: `pagehome-addtl/${form.get('wareId')}`,
                    state: {
                      homeType: '0',
                    }
                  })
                }
              >
                新建通栏推荐位
              </Button>
              <Button
                type="primary"
                onClick={() =>
                  history.push({
                    pathname: `pageclass-addtl/${form.get('wareId')}`,
                    state: {
                      couponType: '1',
                      source: 'list'
                    }
                  })
                }
              >
                新建分栏推荐位
              </Button>
              <Button
                type="primary"
                onClick={() =>
                  history.push({
                    pathname: `pagehome-swit/${form.get('wareId')}`,
                    state: {
                      couponType: '2',
                      source: 'list'
                    }
                  })
                }
              >
                新建轮播推荐位
              </Button>
              {/* <Dropdown
                overlay={this._menu()}
                getPopupContainer={() => document.getElementById('page-content')}
              >
                <Button
                  onClick={() =>
                    history.push({
                      pathname: 'coupon-add',
                      state: {
                        couponType: '0',
                        source: 'list'
                      }
                    })
                  }
                >
                  创建优惠券<Icon type="down" />
                </Button>
              </Dropdown> */}
            {/* </AuthWrapper> */}
          </div>
      </div>
    );
  }
  _menu = () => {
    return (
      <Menu>
        <Menu.Item>
          <a
            href="javascript:;"
            onClick={() =>
              history.push({
                pathname: 'coupon-add',
                state: {
                  couponType: '2',
                  source: 'list'
                }
              })
            }
          >
            创建运费券
          </a>
        </Menu.Item>
      </Menu>
    );
  };
}
