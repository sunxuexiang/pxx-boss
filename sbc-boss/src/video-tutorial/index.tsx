import React from 'react';
import { Row, Col, Button, Popconfirm } from 'antd';

import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';

import VedioList from './component/video-list';
import UploadVedioModal from './component/uploadVedio-modal';
import CateList from './component/cate-list';
import Tool from './component/tool';
import MenuModal from './component/menu-modal';
import { StoreProvider } from 'plume2';
import { AuthWrapper } from 'qmkit';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class VideoTutorial extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const cateType = this.props.location.pathname === '/video-tutorial' ? 1 : 2;
    this.store.init(cateType);
    this.store.queryAppVideoData('9999');
    this.store.queryAppVideoData('8888');
  }

  render() {
    const cateType = this.store.state().get('cateType');
    return (
      <AuthWrapper
        functionName={cateType === 1 ? 'f_videoTutorial_0' : 'f_videoUser_0'}
      >
        <div>
          <BreadCrumb />
          <div className="container">
            <Headline title="视频教程" />
            <div>
              <div style={{ marginBottom: '16px' }}>
                <AuthWrapper
                  functionName={
                    cateType === 1 ? 'f_videoTutorial_1' : 'f_videoUser_1'
                  }
                >
                  <Button
                    type="primary"
                    onClick={() => this.store.showAddModal(0)}
                  >
                    新增一级分类
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => this.store.showAddModal(1)}
                    style={{ marginLeft: '16px' }}
                    loading={this.store.state().get('videoLoading')}
                  >
                    新增子分类
                  </Button>
                </AuthWrapper>
                <AuthWrapper
                  functionName={
                    cateType === 1 ? 'f_videoTutorial_2' : 'f_videoUser_2'
                  }
                >
                  <Popconfirm
                    title="确定删除此分类吗?"
                    onConfirm={this.store.deleteMenu}
                  >
                    <Button type="primary" style={{ marginLeft: '16px' }}>
                      删除分类
                    </Button>
                  </Popconfirm>
                </AuthWrapper>
              </div>
              <Row>
                <Col span={4}>
                  {/*分类列表*/}
                  <CateList />
                </Col>
                <Col span={1} />
                <Col span={19}>
                  {/*工具条*/}
                  <Tool />

                  {/*视频列表*/}
                  <VedioList />

                  <UploadVedioModal />
                  <MenuModal
                    visible={this.store.state().get('visible')}
                    close={this.store.closeAddModal}
                    addVideoMenu={this.store.addVideoMenu}
                    type={this.store.state().get('type')}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
