import React from 'react';

export default class Headline extends React.PureComponent<any, any> {
  props: {
    children?: any;
    title?: string;
    number?: string;
    //禁止显示line
    lineDisable?: Boolean;
    smallTitle?: string;
  };

  render() {
    return (
      <div
        className={this.props.lineDisable ? 'headlinewithnoline' : 'headline'}
      >
        <h3>
          {this.props.title}
          {this.props.number ? <small>(共{this.props.number}条)</small> : null}
          {this.props.smallTitle && <small>{this.props.smallTitle}</small>}
        </h3>
        {this.props.children}
      </div>
    );
  }
}
