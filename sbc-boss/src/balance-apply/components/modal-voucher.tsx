
import React, { FC, useState, useEffect } from 'react';
import { Modal, Button, message, Icon } from 'antd';
import { uploadImg } from '../webapi';
import './index.less';

const VoucherModal: FC<{
    visible: boolean;
    setVoucherVisible: Function;
    updataImgSubmit: Function;
    size?: Number;
    defaultList?: Array<string>;
}> = (props) => {
    const { setVoucherVisible, visible, updataImgSubmit, size, defaultList } = props;
    const [ imgList, setImgList ] = useState([] as any);
    const [ imgVisible, setImgVisible ] = useState( false as boolean);
    const [ currentImg, setCurrentImg ] = useState('' as string);


    useEffect(() => {
        document.addEventListener('dragleave',function(e){e.preventDefault();});
        //拖后放
        document.addEventListener('drop',function(e){e.preventDefault();});
        //拖进
        document.addEventListener('dragenter',function(e){e.preventDefault();});
        //拖来拖去
        document.addEventListener('dragover',function(e){e.preventDefault();});
    }, [])

    useEffect(() => {
        if(defaultList.length > 0) {
            setImgList(defaultList);
        }
    }, [])

    const upImgClick = () => {
        if(size > 0 && imgList.length >= size) {
            return message.error(`上传图片不能超过${size}张`)
        }
        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.onchange = () => {
            // JPG、PNG、BMP
            let reg = /png$|jpg$|bpm$|jpeg$/;
            if(!reg.test(fileInput.files[0].name)) {
              return message.error('请上传JPG、PNG、BMP,JPEG格式的图片');
            };
            if(fileInput.files[0].size > 5 * 1024 * 1024) {
                return message.error('请上传小于5MB的图片');
            }
            let fileData = new FormData()
            fileData.append('uploadFile', fileInput.files[0])
            uploadImg(fileData).then(res => {
                if(res.status === 200 && res.data.length > 0) {
                    setImgList([...imgList, ...res.data])
                }
            })
        }
        fileInput.click();
    }


    const uploadData = async (fileList) => {
        if(size > 0 && fileList.length + imgList.length > size) {
            return message.error(`上传图片不能超过${size}张`)
        }
        let arr = [];
        for (let i = 0; i < fileList.length; i++) {
            let reg = /png$|jpg$|bpm$|jpeg$/;
            if(!reg.test(fileList[i].name)) {
              return message.error('请上传JPG、PNG、BMP,JPEG格式的图片');
            };
            if(fileList[i].size > 5 * 1024 * 1024) {
                return message.error('请上传小于5MB的图片');
            }
            let fileData = new FormData();
            fileData.append('uploadFile', fileList[i]);
            const res = await uploadImg(fileData);
            if(res.status === 200 && res.data.length > 0) {
                arr.push(res.data[0])
            }
        }
        setImgList([...imgList, ...arr])
    }


    return <Modal
        visible={visible}
        onCancel={() => {
            setVoucherVisible(false)
        }}
        destroyOnClose
        onOk={() => {
            updataImgSubmit(imgList)
        }}
        width={600}
        bodyStyle={{
            height: '360px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <div 
            className="modal-voucher"
            style={{
                justifyContent: imgList.length === 0 ? 'center' : 'flex-start',
                alignItems: imgList.length === 0 ? 'center' : 'flex-start',
            }}
            onPaste={(e) => {
                let arr = []
                const items = (e.clipboardData || window['clipboardData']).items;
                if(items && items.length > 0) {
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf('image') !== -1) {
                          // 如果是image类型存为file
                        //   file = 
                          arr.push(items[i].getAsFile())
                        }
                    }
                }
                uploadData(arr);
            }}
            onDrop={(e) => {
                let arr = []
                e.preventDefault(); //取消默认浏览器拖拽效果
                let fileList = e.dataTransfer.files; //获取文件对象
                if(fileList && fileList.length > 0) {
                    for (let i = 0; i < fileList.length; i++) {
                        if (fileList[i].type.indexOf('image') !== -1) {
                          // 如果是image类型存为file
                        //   file = 
                          arr.push(fileList[i])
                        }
                    }
                }
                uploadData(arr);
            }}
        >
            {
                imgList && imgList.length > 0 ? (
                    <div style={{ width: '100%', height: '160px', display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', padding: '16px' }}>
                        {
                            imgList.map((item, index) => {
                                return <div style={{width: '80px', height: '80px', marginRight: '8px', position: 'relative'}} key={'imgblock' + index}>
                                    <div
                                        className="imgMask"
                                    >
                                        <Icon type="eye" style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }} onClick={() => {
                                            setImgVisible(true);
                                            setCurrentImg(item);
                                        }} />
                                        <Icon type="delete" style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }} onClick={() => {
                                            let arr = [...imgList];
                                            arr.splice(index, 1)
                                            // let arr = imgList.filter(imgUrl => imgUrl !== item);
                                            setImgList(arr);
                                        }} />
                                    </div>
                                    <img style={{width: '100%', height: '100%'}} src={item} alt=""  />
                                </div>
                            })
                        }
                    </div>
                ) : (
                    <div>            
                        <div style={{marginBottom: '20px'}}>拖拽或者复制图片到这里</div>
                        <div>此处只能上传图片文件，支持JPG、PNG、BMP格式</div>
                        <div style={{marginBottom: '40px', color: '#F56C1D'}}>单个图片大小不超过5MB</div>
                    </div>
                )
            }
            <div style={{ width: '100%' }}>
                <Button type={'primary'} onClick={() => upImgClick()}>上传凭证图片</Button>
            </div>
            <Modal
                visible={imgVisible}
                width="640px"
                onCancel={() => {
                    setImgVisible(false)
                }}
                footer={null}
            >
                <img style={{ width: '100%' }} src={currentImg} alt="" />
            </Modal>
        </div>
    </Modal>
}

export default VoucherModal;
