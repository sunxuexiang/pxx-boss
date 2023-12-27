import React, { FC, useEffect, useState } from 'react';
import { Modal, InputNumber } from 'antd';

const SortModal: FC<any> = (props) => {
  const { visible, close, current, onOk } = props;
  const [index, setIndex] = useState(0 as number);

  useEffect(() => {
    setIndex(current);
  }, [current]);
  return (
    <Modal
      visible={visible}
      title={'序号'}
      onCancel={() => {
        close(false);
      }}
      onOk={() => {
        onOk(index);
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <InputNumber
          value={index}
          min={1}
          type="text"
          onChange={(val: number) => {
            setIndex(val);
          }}
        />
      </div>
    </Modal>
  );
};

export default SortModal;
