import React from 'react';
import { Relax } from 'plume2';
import { Button,Radio } from 'antd';
import { noop, isSystem, Const } from 'qmkit';
import RenderFrame from './render-frame';

@Relax
export default class ButtonGroup extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      frameFlag: false,
      loading: false
    };
  }

  props: {
    relaxProps?: {
      platform: string;
      setVisible: Function;
      saveMagicPage: Function;
      warehouseList:any;
      wareId:any;
      onhandleChange:Function;
    };
  };

  static relaxProps = {
    platform: 'platform',
    warehouseList:'warehouseList',
    wareId:'wareId',
    setVisible: noop,
    saveMagicPage: noop,
    onhandleChange:noop,
  };

  render() {
    const { platform, setVisible,warehouseList,wareId,onhandleChange} = this.props.relaxProps;
    return (
      <div>
        {/* <Radio.Group value={String(wareId)} onChange={(e)=>onhandleChange('wareId',e.target.value)}>
          {warehouseList.toJS().map((item,i)=><Radio.Button key={i} value={`${item.wareId}`}>{item.wareName}</Radio.Button>)}
        </Radio.Group>
        <br />
        <br /> */}
         <div className="handle-bar">
          <Button type="primary" onClick={() => setVisible(true)}>
            新增页面
          </Button>
          {platform === 'weixin' && (
            <Button
              type="primary"
              loading={this.state.loading}
              onClick={this._indexStatic}
            >
              首页静态化
            </Button>
          )}
          {this.state.frameFlag && <RenderFrame />}
        </div>
      </div>
     
    );
  }

  /**
   * 首页静态化方法
   */
  _indexStatic = () => {
    this.setState({
      frameFlag: true,
      loading: true
    });
    setTimeout(() => {
      const { saveMagicPage } = this.props.relaxProps;
      // 取得魔方dom内容
      let content = document.getElementsByClassName('render-frame')[0]
        .innerHTML;
      // 取得样式引用
      const headItems = document.getElementsByTagName('head')[0].children;
      const xsiteLinks = [];
      for (let i = 0; i < headItems.length; i++) {
        const item: any = headItems[i];
        if (item.nodeName === 'LINK' && item.href.startsWith(Const.OSS_HOST)) {
          xsiteLinks.push(item.outerHTML);
        }
      }
      saveMagicPage(renderHtml(content, xsiteLinks));
      this.setState({
        frameFlag: false,
        loading: false
      });
    }, 10 * 1000);
  };
}

const renderHtml = (content, xsiteLinks) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width,viewport-fit=cover">
<meta name="viewport" content="initial-scale=1.0,user-scalable=no,maximum-scale=1,viewport-fit=cover" media="(device-height: 568px)">
${xsiteLinks.join('\n')}
<style type="text/css">
    *,
    *::before,
    *::after {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    html {
      font-size: 13.333333vw !important;
      box-sizing: border-box;
      line-height: 1.15;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    body {
      margin: 0;
      font-size: 14px;
      font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
      'Microsoft YaHei', Arial, sans-serif;
      word-break: break-all;
    }
    
    a {
      background-color: transparent;
      -webkit-text-decoration-skip: objects;
      text-decoration: none;
      -webkit-tap-highlight-color: transparent;
    }
  
    p {
      margin: 0;
      padding: 0;
    }
  
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  
    ul li {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  
    * {
      box-sizing: border-box;
    }
    .resetElement .element-box{
      transform: scale(1)!important;
    }
  </style>
</head>
<body>
  <div class="resetElement">
  ${content}
  </div>
</body>
</html>
`;
};
