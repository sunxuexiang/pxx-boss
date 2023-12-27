import React, { Component } from 'react';
import { Icon } from 'antd';
import {  IList } from 'typings/globalType';

export default class MarketingImageList extends Component<any, any> {
  props: {
    images: IList;        
    imgCount: number;
    imgType: number;
    skuId: string;

    modalVisible: Function;
    clickImg: Function;
    removeImg: Function;   
    addLink:Function;
  };

  render() {
    const {
      images,      
      modalVisible,
      clickImg,
      removeImg,
      imgCount,
      imgType,
      skuId,        
      addLink
    } = this.props;    
    return (
      <div>
        {images.map((v, index) => {
          return (
            <div key={index}>
              <div className="ant-upload-list ant-upload-list-picture-card">
                <div className="ant-upload-list-item ant-upload-list-item-done">
                  <div className="ant-upload-list-item-info">
                    <span>
                      <a
                        className="ant-upload-list-item-thumbnail"
                        href=""
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={v.get('imgSrc')} />
                      </a>
                    </span>
                  </div>
                  <span className="ant-upload-list-item-actions">
                    <i
                      className="anticon anticon-eye-o"
                      onClick={() => clickImg(v.get('imgSrc'))}
                    />

                    <i
                      title="Remove file"
                      onClick={() => removeImg(index)}
                      className="anticon anticon-delete"
                    />
                    
                    <i
                      style={{color:'#fff'}}
                      className="anticon anticon-edit"
                      onClick={() => addLink(index)}                      
                    />
                    
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {images.count() < imgCount ? (
          <div
            onClick={() => modalVisible(imgCount, imgType, skuId)}
            style={styles.addImg}
          >
            <div style={styles.imgBox}>
              <Icon type="plus" style={styles.plus} />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const styles = {
  plus: {
    color: '#999',
    fontSize: '28px'
  } as any,
  addImg: {
    border: '1px dashed #d9d9d9',
    width: 104,
    height: 104,
    borderRadius: 4,
    textAlign: 'center',
    display: 'inline-block',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fbfbfb'
  } as any,
  imgBox: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItem: 'center',
    justifyContent: 'center',
    padding: '32px 0'
  } as any
};
