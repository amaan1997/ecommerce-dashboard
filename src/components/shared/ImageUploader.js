import React from 'react';
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};
const uploadButton = (
  <div>
    <PlusOutlined />
    <div className='ant-upload-text'>Upload</div>
  </div>
);

class ImageUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previewImage: '',
      previewVisible: false,
      previewTitle: ''
    };
  }
  componentDidUpdate = (prevProps, prevState) => {
    console.log('props.>', this.props);
    console.log('prevProps>>', prevProps);
  };
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    });
  };
  handleCancel = () => {
    this.setState({
      previewVisible: false
    });
  };
  render() {
    const { handleChange, fileList } = this.props;
    const { previewVisible, previewTitle, previewImage } = this.state;
    return (
      <div className='clearfix'>
        <Upload
          listType='picture-card'
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={handleChange}
          accept='.png,.jpg,.jpeg'
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt='example' className='preview-image' src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default ImageUploader;
