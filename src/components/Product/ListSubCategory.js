import React, { Component, useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Switch,
  Table,
  message,
  Spin,
  Select,
  Popconfirm
} from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ImageUploader } from '../shared';
import * as subCategoryActions from '../../redux/actions/subCategoryAction';
import * as productActions from '../../redux/actions/productAction';
import { categoryTypes } from '../../utils/data';

const { Option } = Select;
const AddCategoryForm = ({
  visible,
  onCreate,
  onCancel,
  handleFileChange,
  fileList,
  isSubmitted,
  loading,
  categories,
  intialValues,
  categoryTypes,
  handleCategoryType
}) => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState({});
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    setFiles(fileList);
    if (fileList.length > 0) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [fileList]);

  useEffect(() => {
    if (intialValues) {
      form.setFieldsValue({
        subCategoryName: get(intialValues, 'subCategoryName', ''),
        categoryType: get(intialValues, 'categoryType', '')
      });
    } else {
      form.setFieldsValue({
        subCategoryName: '',
        categoryType: ''
      });
    }
  }, [intialValues]);

  console.log('intialValues', intialValues);
  return (
    <Modal
      visible={visible}
      title='Add Sub Category'
      onCancel={onCancel}
      footer={[
        <React.Fragment>
          <Button key='back' onClick={onCancel} className='height-30 xs-mt-12'>
            Cancel
          </Button>
          <button
            className='custom-btn product-btn height-30'
            onClick={() => {
              form
                .validateFields()
                .then(values => {
                  onCreate(values);
                })
                .catch(error => {
                  console.log('error', error);
                });
            }}
          >
            {intialValues && Object.keys(intialValues).length > 0
              ? 'UPDATE'
              : 'ADD'}
          </button>
        </React.Fragment>
      ]}
    >
      <Spin spinning={loading}>
        <Form form={form} layout='vertical' name='sub_category_modal'>
          <FormItem
            label={'Sub Category Name'}
            name='subCategoryName'
            rules={[
              { required: true, message: 'Please input sub category name!' }
            ]}
          >
            <Input />
          </FormItem>
          <FormItem label={'Sub Category Image'} name='fileList'>
            <ImageUploader
              handleChange={handleFileChange}
              fileList={fileList}
            />
            {isSubmitted && !isValid && (
              <span className='error-message'>
                Please upload sub category image
              </span>
            )}
          </FormItem>
          <FormItem
            label={'Category Type'}
            name='categoryType'
            rules={[
              { required: true, message: 'Please select category type!' }
            ]}
          >
            <Select
              style={{ width: 120 }}
              onChange={handleCategoryType}
              // value={categoryType}
            >
              {categoryTypes.map(type => (
                <Option value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  );
};
const FormItem = Form.Item;
class ListSubCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addSubCategoryModal: false,
      intialValues: {},
      subCategoryId: '',
      selectedCategoryId: '',
      fileList: [],
      categories: [],
      subCategories: [],
      loading: false,
      categoryTypes: [],
      isSubmitted: false
    };
  }
  componentDidMount = () => {
    this.fetchSubCategory();
  };
  fetchSubCategory = () => {
    message.loading('Action in progress..', 0);
    this.props.actions.fetchSubCategory().then(() => {
      console.log('props>>>', this.props.subCategories);
      if (this.props.subCategories) {
        if (this.props.subCategories.error) {
          message.error(this.props.subCategories.error);
        } else {
          if (
            this.props.subCategories.data &&
            this.props.subCategories.data.length > 0
          ) {
            this.setState(
              { subCategories: this.props.subCategories.data },
              () => {
                message.success('Sub Categories Fetched successfully!', 5);
              }
            );
          } else {
            this.setState({ subCategories: [] }, () => {
              message.info('No Sub Categories Found!');
            });
          }
        }
      } else {
        message.error('Something went wrong!');
      }
      setTimeout(() => {
        message.destroy();
      }, 1000);
    });
  };
  handleCategoryType = value => {
    this.setState({ selectedCategoryId: value });
  };
  handleAddSubCategoryModal = () => {
    const { addSubCategoryModal } = this.state;
    if (addSubCategoryModal) {
      this.setState({
        addSubCategoryModal: false,
        intialValues: {},
        subCategoryId: '',
        selectedCategoryId: '',
        fileList: [],
        categoryTypes: []
      });
    } else {
      this.props.actions.fetchCategoryTypes().then(() => {
        if (this.props.categoryTypes && this.props.categoryTypes.error) {
          message.error('Please add Categories before adding sub category');
        } else {
          if (this.props.categoryTypes.data.length > 0) {
            this.setState({
              categoryTypes: this.props.categoryTypes.data,
              addSubCategoryModal: true
            });
          } else {
            message.error('Please add Categories before adding sub category');
          }
        }
      });
    }
  };
  handleFileChange = ({ fileList }) => {
    this.setState({ fileList });
  };
  addSubCategoryHandler = values => {
    const {
      fileList,
      subCategoryId,
      selectedCategoryId,
      categoryTypes
    } = this.state;
    this.setState({ isSubmitted: true });
    if (fileList.length > 0) {
      this.setState({ loading: true });
      const file = fileList[0];
      let categoryId = '';
      if (selectedCategoryId) {
        categoryId = values.categoryType;
      } else {
        categoryTypes.map(type => {
          if (type.label === values.categoryType) {
            categoryId = type.value;
          }
        });
      }
      const data = {
        subCategoryName: values.subCategoryName,
        subCategoryImage: file,
        categoryId
      };

      if (subCategoryId) {
        this.props.actions.updateSubCategory(data, subCategoryId).then(() => {
          if (
            this.props.updateSubCategoryResponse &&
            this.props.updateSubCategoryResponse.error
          ) {
            this.setState({ loading: false }, () => {
              message.error(this.props.updateSubCategoryResponse.error);
            });
          } else {
            this.setState(
              {
                loading: false,
                addSubCategoryModal: false,
                subCategoryId: '',
                intialValues: {},
                fileList: [],
                isSubmitted: false,
                selectedCategoryId: ''
              },
              () => {
                message.success(this.props.updateSubCategoryResponse.data);
                this.fetchSubCategory();
              }
            );
          }
        });
      } else {
        console.log('data>>', data);
        this.props.actions.addSubCategory(data).then(() => {
          if (
            this.props.addSubCategoryResponse &&
            this.props.addSubCategoryResponse.error
          ) {
            this.setState({ loading: false }, () => {
              message.error(this.props.addSubCategoryResponse.error);
            });
          } else {
            this.setState(
              {
                loading: false,
                addSubCategoryModal: false,
                subCategoryId: '',
                intialValues: {},
                fileList: [],
                isSubmitted: false,
                selectedCategoryId: ''
              },
              () => {
                message.success(this.props.addSubCategoryResponse.data);
                this.fetchSubCategory();
              }
            );
          }
        });
      }
    }
  };
  deleteCategoryHandler = subCategoryId => {
    message.loading('Action in progress..', 0);
    this.props.actions.deleteSubCategory(subCategoryId).then(() => {
      console.log('prosp>>>', this.props.deleteSubCategoryResponse);
      if (
        this.props.deleteSubCategoryResponse &&
        this.props.deleteSubCategoryResponse.error
      ) {
        message.error(this.props.deleteSubCategoryResponse.error);
      } else {
        message.success(this.props.deleteSubCategoryResponse.data);
        this.fetchSubCategory();
      }
      setTimeout(() => {
        message.destroy();
      }, 1000);
    });
  };
  onHandleCategoryStatus = (subCategoryId, isActive) => {
    message.loading('Action in progress..', 0);
    this.props.actions
      .updateSubCategoryStatus(subCategoryId, isActive)
      .then(() => {
        if (
          this.props.updateStatusResponse &&
          this.props.updateStatusResponse.error
        ) {
          message.error(this.props.updateStatusResponse.error);
        } else {
          message.success(this.props.updateStatusResponse.data);
          this.fetchSubCategory();
        }
        setTimeout(() => {
          message.destroy();
        }, 1000);
      });
  };
  editSubCategoryHandler = subCategoryId => {
    message.loading('Action in progress..', 0);
    this.props.actions.fetchCategoryTypes().then(() => {
      if (this.props.categoryTypes && this.props.categoryTypes.error) {
        message.error('Please add Categories before adding sub category');
      } else {
        this.props.actions.getSubCategoryById(subCategoryId).then(() => {
          if (
            this.props.subCategoryResponse &&
            this.props.subCategoryResponse.error
          ) {
            message.error(this.props.subCategoryResponse.error);
          } else {
            const { data } = this.props.subCategoryResponse;
            this.setState({
              addSubCategoryModal: true,
              intialValues: { ...data },
              subCategoryId: subCategoryId,
              fileList: [...data.fileList],
              categoryTypes: this.props.categoryTypes.data
            });
          }
        });
      }
    });
    setTimeout(() => {
      message.destroy();
    }, 1000);
  };
  getSubCategoryColumns = () => {
    const columns = [
      {
        title: 'Sub Category Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <h2>{text}</h2>
      },
      {
        title: 'Sub Category Image',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: text => <img src={text} className='category-image' />
      },
      {
        title: 'Category Type',
        dataIndex: 'categoryType',
        key: 'categoryType'
      },
      {
        title: 'Active Status',
        dataIndex: 'isActive',
        key: 'isActive',
        render: text => {
          return (
            <Switch
              checked={text.active}
              onChange={() =>
                this.onHandleCategoryStatus(text.subCategoryId, text.active)
              }
            />
          );
        }
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => {
          console.log('text>>', text);
          return (
            <div className='d-flex'>
              <EditOutlined
                className='font-24 xs-mr-12'
                onClick={() => this.editSubCategoryHandler(text.subCategoryId)}
              />
              <Popconfirm
                title='Are you sure delete this sub-category?'
                onConfirm={() => {
                  this.deleteCategoryHandler(text.subCategoryId);
                }}
              >
                <DeleteOutlined className='font-24' />
              </Popconfirm>
            </div>
          );
        }
      }
    ];
    return columns;
  };
  render() {
    const {
      addSubCategoryModal,
      subCategories,
      loading,
      intialValues,
      categoryTypes,
      fileList,
      isSubmitted
    } = this.state;
    const columns = this.getSubCategoryColumns();
    return (
      <div className='xs-mt-40 xs-ml-20 xs-mr-20'>
        <div className='d-flex justify-end'>
          <button
            className='custom-btn product-btn'
            onClick={this.handleAddSubCategoryModal}
          >
            ADD SUB CATEGORY
          </button>
        </div>
        <Table
          columns={columns}
          dataSource={subCategories}
          className='xs-mt-20'
        />

        <AddCategoryForm
          visible={addSubCategoryModal}
          onCreate={this.addSubCategoryHandler}
          onCancel={this.handleAddSubCategoryModal}
          handleFileChange={this.handleFileChange}
          fileList={fileList}
          isSubmitted={isSubmitted}
          loading={loading}
          handleCategoryType={this.handleCategoryType}
          intialValues={intialValues}
          categoryTypes={categoryTypes}
        />
      </div>
    );
  }
}
const mapStateToProps = state => {
  const {
    addSubCategoryResponse,
    subCategories,
    updateStatusResponse,
    deleteSubCategoryResponse,
    subCategoryResponse,
    updateSubCategoryResponse
  } = state.subCategory;
  return {
    addSubCategoryResponse: addSubCategoryResponse,
    subCategories: subCategories,
    updateStatusResponse: updateStatusResponse,
    deleteSubCategoryResponse: deleteSubCategoryResponse,
    subCategoryResponse: subCategoryResponse,
    updateSubCategoryResponse: updateSubCategoryResponse,
    categoryTypes: state.product.categoryTypes
  };
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      { ...productActions, ...subCategoryActions },
      dispatch
    )
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListSubCategory);
