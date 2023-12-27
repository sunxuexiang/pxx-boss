
import React, { FC, useState } from 'react';
import { Icon } from 'antd';
import ModalVoucher from './modal-voucher';
import './index.less';

const FormImg:FC<any> = (props) => {
    console.log(props);
    const {value, onChange} = props;
    const [visible, setVisible ] = useState(false as boolean);
    
    const changeImg = (arr) => {
        onChange(arr);
        setVisible(false);
    }

    return <div className="_xiyaya-formImg">
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {
            value.length > 0 && value.map((item, index) => {
                return <img onClick={() => setVisible(true)} style={{ height: '100px', width: '100px', marginRight: '8px' }} key={'img' + index} src={item} alt="" />
            })
            }
            {value.length > 3 ? null : (
                <div className="img-icon" onClick={() => setVisible(true)}>
                    <Icon type="plus" style={{
                        color: '#999',
                        fontSize: '28px'
                    }} />
                </div>
            )}
        </div>
        <ModalVoucher visible={visible} setVoucherVisible={setVisible} updataImgSubmit={changeImg} size={3} defaultList={[]} />
    </div>
}

export default FormImg;
