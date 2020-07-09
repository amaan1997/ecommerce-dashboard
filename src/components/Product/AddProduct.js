import React, { Component } from 'react';
import {
  Form,
  Input,
  Select,
  Breadcrumb,
  Card,
  InputNumber,
  Radio,
  Space,
  Button,
  Modal,
  Upload,
  Checkbox,
  message
} from 'antd';
import { HomeOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Editor } from 'react-draft-wysiwyg';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import history from '../../utils/history';
import * as categoryActions from '../../redux/actions/categoryAction';
import * as subCategoryActions from '../../redux/actions/subCategoryAction';
import * as vendorActions from '../../redux/actions/vendorAction';
import * as productActions from '../../redux/actions/productAction';

const { Option } = Select;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];
const uploadButton = (
  <div>
    <PlusOutlined />
    <div className='ant-upload-text'>Upload</div>
  </div>
);
const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};
class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryTypes: [],
      subCategoryTypes: [],
      vendors: [],
      fileList: [],
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      isSubmitted: false,
      description: {},
      subCategories: [],
      selectedSize: []
    };
  }
  componentDidMount = () => {
    this.props.actions.fetchCategoryTypes().then(() => {
      if (this.props.categoryTypes.data.length > 0) {
        this.props.actions.fetchSubCategoryTypes().then(() => {
          if (
            this.props.subCategoryTypes.data &&
            this.props.subCategoryTypes.data.length > 0
          ) {
            this.setState(
              {
                categoryTypes: this.props.categoryTypes.data,
                subCategoryTypes: this.props.subCategoryTypes.data
              },
              () => {
                this.fetchVendors();
              }
            );
          } else {
            this.setState(
              {
                categoryTypes: this.props.categoryTypes.data,
                subCategoryTypes: []
              },
              () => {
                this.fetchVendors();
              }
            );
          }
        });
      }
    });
  };
  handleChange = ({ fileList }) => this.setState({ fileList });

  handleCancel = () => this.setState({ previewVisible: false });

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
  fetchVendors = () => {
    this.props.actions.getVendors().then(() => {
      console.log('props...', this.props.vendors);
      if (
        this.props.vendors &&
        this.props.vendors.data &&
        this.props.vendors.data.length > 0
      ) {
        this.setState({
          vendors: this.props.vendors.data
        });
      } else {
        this.setState({
          vendors: []
        });
      }
    });
  };
  onAddProductHandler = values => {
    const { fileList, description, selectedSize } = this.state;
    this.setState({ isSubmitted: true });

    if (
      fileList.length >= 3 &&
      Object.keys(description).length > 0 &&
      selectedSize.length > 0
    ) {
      const data = {
        name: values.name,
        brand: values.brand,
        actualPrice: values.actualPrice,
        discount: values.discount,
        categoryId: values.categoryId,
        subCategoryId: values.subCategoryId,
        vendorId: values.vendorId,
        specification: values.specification ? values.specification : [],
        status: values.status,
        productImages: fileList,
        description: description,
        selectedSize: selectedSize
      };
      message.loading('Action in progress..', 0);

      this.props.actions.addProduct(data).then(() => {
        if (
          this.props.addProductResponse &&
          this.props.addProductResponse.error
        ) {
          message.error(this.props.addProductResponse.error);
        } else {
          // message.success('Product Added Successfuly!');
          history.push('/product');
        }
      });
    }
  };
  onDescriptionChange = value => {
    this.setState({
      description: value
    });
  };
  handleCategoryChange = categoryId => {
    const { subCategoryTypes } = this.state;

    let result = subCategoryTypes.filter(type => {
      return type.categoryId === categoryId;
    });
    console.log('result>>', result);
    this.setState({
      subCategories: result
    });
  };
  onCheckboxChange = value => {
    this.setState({
      selectedSize: value
    });
  };
  render() {
    const {
      categoryTypes,
      subCategories,
      vendors,
      previewVisible,
      previewImage,
      fileList,
      previewTitle,
      isSubmitted,
      selectedSize,
      description
    } = this.state;

    const layout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 12
      }
    };
    console.log('state>>', this.state);

    return (
      <div className='xs-mt-40 xs-ml-20 xs-mr-20'>
        <div className='d-flex justify-between'>
          <div className='text-bold font-24'>PRODUCT</div>
          <Breadcrumb>
            <Breadcrumb.Item href='/'>
              <HomeOutlined />
            </Breadcrumb.Item>

            <Breadcrumb.Item>Add Product</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Form
          {...layout}
          name='add_product'
          onFinish={this.onAddProductHandler}
        >
          <div className='d-flex'>
            <div className='full-width xs-mr-20'>
              <Card
                className='xs-mt-20'
                title={
                  <div className='text-bold font-20 color-grey xs-pl-30'>
                    GENERAL
                  </div>
                }
              >
                <FormItem
                  label={'Product Name'}
                  name='name'
                  rules={[
                    { required: true, message: 'Please input product name!' }
                  ]}
                >
                  <Input />
                </FormItem>
                <FormItem
                  label={'Brand Name'}
                  name='brand'
                  rules={[
                    { required: true, message: 'Please input brand name!' }
                  ]}
                >
                  <Input />
                </FormItem>
                <FormItem
                  label={'Actual Price'}
                  name='actualPrice'
                  rules={[
                    { required: true, message: 'Please input product price' }
                  ]}
                >
                  <InputNumber />
                </FormItem>
                <FormItem
                  label={'Discount(in %)'}
                  name='discount'
                  rules={[{ required: true, message: 'Please input discount' }]}
                >
                  <InputNumber min={0} max={100} />
                </FormItem>
                <FormItem
                  label={'Category Type'}
                  name='categoryId'
                  rules={[
                    { required: true, message: 'Please select category type!' }
                  ]}
                >
                  <Select
                    style={{ width: 200 }}
                    onChange={this.handleCategoryChange}
                  >
                    {categoryTypes.map(type => (
                      <Option value={type.value}>{type.label}</Option>
                    ))}
                  </Select>
                </FormItem>
                <FormItem
                  label={'Sub Category Type'}
                  name='subCategoryId'
                  rules={[
                    {
                      required: true,
                      message: 'Please select sub category type!'
                    }
                  ]}
                >
                  <Select style={{ width: 200 }}>
                    {subCategories.map(type => (
                      <Option value={type.value}>{type.label}</Option>
                    ))}
                  </Select>
                </FormItem>
                <FormItem
                  label={'Vendor'}
                  name='vendorId'
                  rules={[
                    {
                      required: true,
                      message: 'Please select vendor!'
                    }
                  ]}
                >
                  <Select style={{ width: 200 }}>
                    {vendors.map(type => (
                      <Option value={type.value}>{type.label}</Option>
                    ))}
                  </Select>
                </FormItem>
                <FormItem label={'Size'} name='size'>
                  <div className='site-checkbox-all-wrapper'>
                    <CheckboxGroup
                      options={sizeOptions}
                      value={selectedSize}
                      onChange={this.onCheckboxChange}
                    />
                  </div>
                  {isSubmitted && selectedSize.length === 0 && (
                    <span className='error-message'>
                      Select atleast one size
                    </span>
                  )}
                </FormItem>
                <FormItem
                  label={'Status'}
                  name='status'
                  rules={[
                    {
                      required: true,
                      message: 'Please select product status!'
                    }
                  ]}
                >
                  <Radio.Group>
                    <Radio value='active'>Enable </Radio>
                    <Radio value='inactive'>Disable</Radio>
                  </Radio.Group>
                </FormItem>
              </Card>
              <Card
                className='xs-mt-20'
                title={
                  <div className='text-bold font-20 color-grey xs-pl-30'>
                    Specifications
                  </div>
                }
              >
                <Form.List name='specification'>
                  {(fields, { add, remove }) => {
                    return (
                      <div>
                        {fields.map(field => (
                          <Space
                            key={field.key}
                            className='d-flex xs-mb-8'
                            align='start'
                          >
                            <Form.Item
                              {...field}
                              name={[field.name, 'key']}
                              fieldKey={[field.fieldKey, 'key']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Missing Key'
                                }
                              ]}
                            >
                              <Input
                                placeholder='Key'
                                className='dynamic-input xs-mr-10'
                              />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, 'value']}
                              fieldKey={[field.fieldKey, 'value']}
                              rules={[
                                { required: true, message: 'Missing value' }
                              ]}
                            >
                              <Input
                                placeholder='Value'
                                className='dynamic-input xs-mr-10'
                              />
                            </Form.Item>

                            <DeleteOutlined
                              onClick={() => {
                                remove(field.name);
                              }}
                              className='font-24'
                            />
                          </Space>
                        ))}

                        <Form.Item>
                          <Button
                            type='dashed'
                            onClick={() => {
                              add();
                            }}
                            block
                          >
                            <PlusOutlined /> Add Spec
                          </Button>
                        </Form.Item>
                      </div>
                    );
                  }}
                </Form.List>
              </Card>
              <Card
                className='xs-mt-20'
                title={
                  <div className='text-bold font-20 color-grey xs-pl-30'>
                    Upload Images
                  </div>
                }
              >
                <Upload
                  listType='picture-card'
                  accept='.png,.jpg,.jpeg,.png'
                  fileList={fileList}
                  onPreview={this.handlePreview}
                  onChange={this.handleChange}
                  multiple={true}
                >
                  {fileList.length >= 10 ? null : uploadButton}
                </Upload>
                {isSubmitted && fileList.length < 3 && (
                  <span className='error-message'>
                    Please add atleast 3 images of product
                  </span>
                )}
                <Modal
                  visible={previewVisible}
                  title={previewTitle}
                  footer={null}
                  onCancel={this.handleCancel}
                >
                  <img
                    alt='example'
                    style={{ width: '100%' }}
                    src={previewImage}
                  />
                </Modal>
              </Card>
            </div>
            <div>
              <Card
                className='xs-mt-20 text-editor'
                title={
                  <div className='text-bold font-20 color-grey'>
                    DESCRIPTION
                  </div>
                }
              >
                <Editor
                  toolbarClassName='toolbarClassName'
                  wrapperClassName='wrapperClassName'
                  editorClassName='editorClassName'
                  onChange={this.onDescriptionChange}
                />
              </Card>
              {isSubmitted && Object.keys(description).length == 0 && (
                <span className='error-message'>
                  Description cannot be empty
                </span>
              )}
            </div>
          </div>
          <Button
            type='primary'
            htmlType='submit'
            className='add-product-btn d-flex justify-center font-20'
          >
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    categoryTypes: state.category.categoryTypes,
    subCategoryTypes: state.subCategory.subCategoryTypes,
    vendors: state.vendor.vendorList
  };
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      {
        ...categoryActions,
        ...subCategoryActions,
        ...vendorActions,
        ...productActions
      },
      dispatch
    )
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
