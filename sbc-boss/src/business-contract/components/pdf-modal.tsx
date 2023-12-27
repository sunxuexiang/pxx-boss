import * as React from 'react';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import { Modal, Button } from 'antd';

@Relax
export default class PdfModal extends React.Component<any, any> {
  props: {
    relaxProps?: {
      visible: boolean;
      pdfTitle: string;
      togglePadMoadl: Function;
    };
  };

  static relaxProps = {
    visible: 'visible',
    pdfTitle: 'pdfTitle',
    togglePadMoadl: noop
  };

  render() {
    const { visible, pdfTitle, togglePadMoadl } = this.props.relaxProps;
    return (
      <Modal
        width={800}
        title={pdfTitle}
        visible={visible}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => togglePadMoadl(false)}
          >
            关闭
          </Button>
        ]}
        onCancel={() => togglePadMoadl(false)}
        destroyOnClose
      >
        <div id="pdf-view" style={{ height: '600px' }}>
          {' '}
        </div>
        {/* <iframe
          src="https://xyytest-image01.oss-cn-hangzhou.aliyuncs.com/202306201514451257.pdf"
          width="100%"
          height="100%"
        ></iframe> */}
      </Modal>
    );
  }
}
