import React, { FC, useState, useEffect } from 'react';
import { Icon } from 'antd';
import ModalVoucher from '../../balance-apply/components/modal-voucher';
// import '../../balance-apply/components';

const UpdataImg: FC<{
  value: Array<any>;
  row: any;
  onUploadImg: Function;
}> = (props) => {
  const { value, row, onUploadImg } = props;
  const [imgList, setImgList] = useState([] as any);
  const [urlList, setUrlList] = useState([] as any);
  const [visible, setVisible] = useState(false as boolean);

  useEffect(() => {
    let arr: Array<string> = [];
    console.log('------value', value);
    if (value) {
      value.forEach((item) => {
        arr.push(item.manualRefundPaymentVoucherImg);
      });
      setUrlList(arr);
      setImgList(value);
    }
  }, [value]);

  /**
     * 
     *    refundId:row.refundId,
          refundBillType:1,
          refundBelongBillId: row.id,
          manualRefundPaymentVoucherImg:file?.response[0]
     */

  const changeImg = (arr) => {
    let newArr = arr.map((item) => {
      return {
        refundId: row.refundId,
        refundBillType: 1,
        refundBelongBillId: row.orderCode,
        manualRefundPaymentVoucherImg: item
      };
    });
    setUrlList(arr);
    setImgList(newArr);
    setVisible(false);
    onUploadImg(
      arr.length > 0
        ? newArr
        : [
            {
              refundId: row.refundId,
              refundBillType: 1,
              refundBelongBillId: row.orderCode,
              manualRefundPaymentVoucherImg: null
            }
          ],
      row
    );
  };

  return (
    <div className="_xiyaya-formImg">
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {imgList.length > 0 &&
          imgList.map((item, index) => {
            return (
              <img
                style={{ height: '100px', width: '100px', marginRight: '8px' }}
                key={row.refundId + index}
                src={item.manualRefundPaymentVoucherImg}
                alt=""
                onClick={() => setVisible(true)}
              />
            );
          })}
        {imgList.length > 3 ? null : (
          <div className="img-icon" onClick={() => setVisible(true)}>
            <Icon
              type="plus"
              style={{
                color: '#999',
                fontSize: '28px'
              }}
            />
          </div>
        )}
      </div>
      {visible ? (
        <ModalVoucher
          visible={visible}
          setVoucherVisible={setVisible}
          updataImgSubmit={changeImg}
          defaultList={urlList}
          size={3}
        />
      ) : null}
    </div>
  );
};

export default UpdataImg;
