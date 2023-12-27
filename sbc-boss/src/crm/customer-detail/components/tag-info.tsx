import React from 'react';
import { Store, Relax } from 'plume2';
import PropTypes from 'prop-types';
import { Headline, noop } from 'qmkit';

const tagLables = {
  0: '零食店',
  1: '便利店',
  2: '商超',
  3: '二批发',
  4: '水果零食',
  5: '连锁系统',
  6: '炒货'
};

@Relax
export default class TagInfo extends React.Component<any, any> {
  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  props: {
    relaxProps?: {
      baseInfo: any;
      groupNames: any;
      toggleTagModal: Function;
    };
  };

  static relaxProps = {
    baseInfo: 'baseInfo',
    groupNames: 'groupNames',
    toggleTagModal: noop
  };

  render() {
    const { groupNames, baseInfo } = this.props.relaxProps;
    const customerTag = baseInfo.customerTag;
    const registerType = baseInfo.customerRegisterType;
    return (
      <div className="tag-info">
        {registerType == 1 && (
          <div className="article-wrap">
            <div className="title">
              TA的标签{' '}
              <a
                href="javascript:;"
                className="link"
                onClick={() => {
                  this.props.relaxProps.toggleTagModal();
                }}
              >
                编辑
              </a>
            </div>
            <span className="tag">{tagLables[customerTag]}</span>
          </div>
        )}
        {/*<div className="article-wrap">*/}
        {/*<Headline title="TA所属的会员群体" />*/}
        {/*{groupNames.length && (*/}
        {/*<div className="tags custom-detail-body">*/}
        {/*{groupNames.length &&*/}
        {/*groupNames.map((tag) => (*/}
        {/*<span className="tag" key={tag}>*/}
        {/*{tag}*/}
        {/*</span>*/}
        {/*))}*/}
        {/*</div>*/}
        {/*)}*/}
        {/*</div>*/}
      </div>
    );
  }
}
