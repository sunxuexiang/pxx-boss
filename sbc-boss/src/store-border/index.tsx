import React, { useEffect, useState } from 'react';
import { AuthWrapper, Headline, BreadCrumb, QMUpload, Const } from 'qmkit';
import { Icon, message, Button } from 'antd';
import { fetchImages, saveImages } from './webapi';
import './index.less';

const StoreBorder = () => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  //获取店招边框列表
  const getList = async () => {
    const { res } = await fetchImages();
    if (res && res.code === Const.SUCCESS_CODE) {
      const arr = [];
      res.context.forEach((item) => {
        arr.push({
          uid: item.image,
          name: item.image,
          size: 1,
          status: 'done',
          url: item.image
        });
      });
      setFileList(arr);
    } else {
      message.error(res.message || '');
    }
  };
  useEffect(() => {
    getList();
  }, []);
  const fileListChange = (info) => {
    setFileList(info.fileList);
  };
  const beforeUpload = async (file) => {
    return new Promise<void>((resolve, reject) => {
      let fileName = file.name.toLowerCase();
      // 支持的图片格式：jpg、jpeg、png、gif
      if (
        fileName.endsWith('.jpg') ||
        fileName.endsWith('.jpeg') ||
        fileName.endsWith('.png') ||
        fileName.endsWith('.gif')
      ) {
        if (file.size > 2 * 1024 * 1024) {
          message.error('文件大小不能超过' + 2 + 'M');
          resolve();
        }
        const imgSize = {
          width: 440,
          height: 200
        };
        // 检测尺寸
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.src = _URL.createObjectURL(file);
        img.onload = () => {
          if (img.width !== imgSize.width || img.height !== imgSize.height) {
            message.error(
              `上传尺寸必须是${imgSize.width}px * ${imgSize.height}px!`
            );
            reject();
          } else {
            resolve();
          }
        };
      } else {
        message.error('文件格式错误');
        return reject();
      }
    });
  };
  //保存店招边框列表
  const save = async () => {
    const images = [];
    fileList.forEach((item) => {
      if (item.status === 'done') {
        if (item.url) {
          images.push(item.url);
        } else if (item.response && item.response[0]) {
          images.push(item.response[0]);
        }
      }
    });
    if (images.length === 0) {
      message.error('请上传至少一张图片');
      return;
    }
    setLoading(true);
    const { res } = await saveImages({ images });
    setLoading(false);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('保存成功');
      getList();
    } else {
      message.error(res.message || '');
    }
  };
  return (
    <AuthWrapper functionName={'f_store_border'}>
      <div>
        <BreadCrumb />
        <div className="container activity">
          <Headline title="店招边框模板" />
          <QMUpload
            action={Const.HOST + '/uploadImage'}
            listType="picture-card"
            name="uploadFile"
            onChange={fileListChange}
            fileList={fileList}
            beforeUpload={beforeUpload}
            accept={'.jpg,.jpeg,.png,.gif'}
          >
            {fileList.length < 8 && (
              <div>
                <Icon type="plus" />
              </div>
            )}
          </QMUpload>
          <div className="store-border-tip">
            店招模板，最多可添加8张，图片格式仅限jpg、jpeg、png、gif，尺寸440px*200px，大小不超过2M
          </div>
          <Button
            className="store-border-btn"
            type="primary"
            loading={loading}
            onClick={save}
          >
            保存
          </Button>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default StoreBorder;
