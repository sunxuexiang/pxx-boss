import React, { FC, useEffect, useState } from 'react';
import { Modal, Carousel  } from 'antd';
import './index.less'

const ImgModal:FC<{
    visible: boolean;
    imgList: Array<any>;
    close: Function;
}> = (props) => {
    const { visible, close, imgList } = props;
    // const [ cont, setCont ] = useState(100 as number);

    // const picture  = (e) => {
    //     e.target.addEventListener('wheel', wheelEvent => {
    //         console.log(cont)
    //         if(wheelEvent.wheelDelta > 0) {
    //             setCont(cont + 5)
    //         } else {
    //             if(cont === 5 ) {
    //                 setCont(5)
    //             } else {
    //                 setCont(cont - 5)
    //             }
    //         }
            
    //         console.log('wheelDelta', wheelEvent.wheelDelta);
    //     })
    //     // e.addEventListener('wheel', (wheelEvent) => {
    //     //     console.log('wheelEvent', wheelEvent);
    //     // })
    // }
    //  onWheel={picture}


    return <Modal
        visible={visible}
        footer={null}
        width={600}
        onCancel={() => {
            close()
        }}
    >
        <div className="img-modal">
            <Carousel dots dotPosition={'bottom'}>
                {
                    imgList && imgList.map(item => {
                        return <div style={{width: '420px', height: '600px', overflow: 'auto'}}>
                            <img style={{ width: '100%' }} src={item.manualRefundPaymentVoucherImg} alt="" />
                        </div>
                    })
                }
            </Carousel>
        </div>
    </Modal>
}

export default ImgModal;