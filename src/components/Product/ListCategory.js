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
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ImageUploader } from '../shared';
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
  handleCategoryType,
  intialValues
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
        categoryName: get(intialValues, 'categoryName', ''),
        categoryType: get(intialValues, 'categoryType', '')
      });
    } else {
      form.setFieldsValue({
        categoryName: '',
        categoryType: ''
      });
    }
  }, [intialValues]);

  console.log('intialValues', intialValues);
  return (
    <Modal
      visible={visible}
      title='Add Category'
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
                .catch(info => {
                  console.log('Validate Failed:', info);
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
        <Form
          form={form}
          layout='vertical'
          name='category_modal'
          // initialValues={{ ...intialValues }}
        >
          <FormItem
            label={'Category Name'}
            name='categoryName'
            rules={[{ required: true, message: 'Please input category name!' }]}
          >
            <Input />
          </FormItem>
          <FormItem label={'Category Image'} name='fileList'>
            <ImageUploader
              handleChange={handleFileChange}
              fileList={fileList}
            />
            {isSubmitted && !isValid && (
              <span className='error-message'>
                Please upload category image
              </span>
            )}
          </FormItem>
          <FormItem
            label={'Category Type'}
            name='categoryType'
            rules={[{ required: true, message: 'Please input category type!' }]}
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
class ListCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addCategoryModal: false,
      fileList: [],
      isSubmitted: false,
      loading: false,
      categories: [],
      categoryType: '',
      intialValues: {},
      categoryId: ''
    };
  }
  componentDidMount() {
    this.fetchCategory();
  }
  fetchCategory = () => {
    message.loading('Action in progress..', 0);
    this.props.actions.fetchCategory().then(() => {
      if (this.props.categories && this.props.categories.error) {
        message.error(this.props.categories.error);
      } else {
        if (this.props.categories.data.length > 0) {
          this.setState({ categories: this.props.categories.data }, () => {
            message.success('Categories Fetched successfully!', 5);
          });
        } else {
          this.setState({ categories: [] }, () => {
            message.info('No Categories Found!');
          });
        }
      }
      setTimeout(() => {
        message.destroy();
      }, 1000);
    });
  };

  handleAddCategoryModal = () => {
    const { addCategoryModal } = this.state;
    if (addCategoryModal) {
      this.setState({
        addCategoryModal: false,
        intialValues: {},
        categoryId: '',
        categoryType: '',
        fileList: []
      });
    } else {
      this.setState({
        addCategoryModal: true
      });
    }
  };
  handleCategoryType = value => {
    this.setState({ categoryType: value });
  };
  onHandleCategoryStatus = (categoryId, isActive) => {
    message.loading('Action in progress..', 0);
    this.props.actions.updateCategoryStatus(categoryId, isActive).then(() => {
      console.log('props>>>', this.props.updateStatusResponse);
      if (
        this.props.updateStatusResponse &&
        this.props.updateStatusResponse.error
      ) {
        message.error(this.props.updateStatusResponse.error);
      } else {
        message.success(this.props.updateStatusResponse.data);
        this.fetchCategory();
      }
      setTimeout(() => {
        message.destroy();
      }, 1000);
    });
  };
  addCategoryHandler = values => {
    const { fileList, categoryType, categoryId } = this.state;
    this.setState({ isSubmitted: true });
    if (fileList.length > 0) {
      this.setState({ loading: true });
      const file = fileList[0];
      const data = {
        categoryName: values.categoryName,
        categoryImage: file,
        categoryType: values.categoryType
      };
      if (categoryId) {
        this.props.actions.updateCategory(data, categoryId).then(() => {
          if (
            this.props.updateCategoryResponse &&
            this.props.updateCategoryResponse.error
          ) {
            this.setState({ loading: false }, () => {
              message.error(this.props.updateCategoryResponse.error);
            });
          } else {
            this.setState(
              {
                loading: false,
                addCategoryModal: false,
                categoryId: '',
                intialValues: {},
                fileList: [],
                isSubmitted: false
              },
              () => {
                message.success(this.props.updateCategoryResponse.data);
                this.fetchCategory();
              }
            );
          }
        });
      } else {
        this.props.actions.addCategory(data).then(() => {
          if (
            this.props.addCategoryResponse &&
            this.props.addCategoryResponse.error
          ) {
            this.setState({ loading: false }, () => {
              message.error(this.props.addCategoryResponse.error);
            });
          } else {
            this.setState(
              {
                loading: false,
                addCategoryModal: false,
                categoryId: '',
                intialValues: {},
                fileList: [],
                isSubmitted: false
              },
              () => {
                message.success(this.props.addCategoryResponse.data);
                this.fetchCategory();
              }
            );
          }
        });
      }
    }
  };
  deleteCategoryHandler = categoryId => {
    message.loading('Action in progress..', 0);
    this.props.actions.deleteCategory(categoryId).then(() => {
      if (
        this.props.deleteCategoryResponse &&
        this.props.deleteCategoryResponse.error
      ) {
        message.error(this.props.deleteCategoryResponse.error);
      } else {
        message.success(this.props.deleteCategoryResponse.data);
        this.fetchCategory();
      }
      setTimeout(() => {
        message.destroy();
      }, 1000);
    });
  };
  handleFileChange = ({ fileList }) => {
    this.setState({ fileList });
  };
  editCategoryHandler = categoryId => {
    message.loading('Action in progress..', 0);
    this.props.actions.getCategoryById(categoryId).then(() => {
      if (this.props.categoryResponse && this.props.categoryResponse.error) {
        message.error(this.props.categoryResponse.error);
      } else {
        const { data } = this.props.categoryResponse;
        this.setState({
          addCategoryModal: true,
          intialValues: { ...data },
          categoryId: categoryId,
          fileList: [...data.fileList]
          // categoryType: data.type
        });
      }
      setTimeout(() => {
        message.destroy();
      }, 1000);
    });
  };
  getCategoryColumns = () => {
    const columns = [
      {
        title: 'Category Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <h2>{text}</h2>
      },
      {
        title: 'Category Image',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: text => <img src={text} className='category-image' />
      },
      {
        title: 'Category Type',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: 'Active Status',
        dataIndex: 'isActive',
        key: 'isActive',
        render: text => {
          console.log('text>>', text);
          return (
            <Switch
              checked={text.active}
              onChange={() =>
                this.onHandleCategoryStatus(text.categoryId, text.active)
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
                onClick={() => this.editCategoryHandler(text.categoryId)}
              />
              <Popconfirm
                title='Are you sure delete this category?'
                onConfirm={() => {
                  this.deleteCategoryHandler(text.categoryId);
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
      addCategoryModal,
      categories,
      loading,
      categoryType,
      intialValues
    } = this.state;
    const columns = this.getCategoryColumns();
    const { fileList, isSubmitted } = this.state;

    console.log('state', this.state);

    return (
      <div className='xs-mt-40 xs-ml-20 xs-mr-20'>
        <div className='d-flex justify-end'>
          <button
            className='custom-btn product-btn'
            onClick={this.handleAddCategoryModal}
          >
            ADD CATEGORY
          </button>
        </div>
        <Table columns={columns} dataSource={categories} className='xs-mt-20' />

        <AddCategoryForm
          visible={addCategoryModal}
          onCreate={this.addCategoryHandler}
          onCancel={this.handleAddCategoryModal}
          handleFileChange={this.handleFileChange}
          fileList={fileList}
          isSubmitted={isSubmitted}
          loading={loading}
          categoryType={categoryType}
          handleCategoryType={this.handleCategoryType}
          intialValues={intialValues}
        />
      </div>
    );
  }
}
const mapStateToProps = state => {
  const {
    addCategoryResponse,
    categories,
    deleteCategoryResponse,
    updateStatusResponse,
    categoryResponse,
    updateCategoryResponse
  } = state.product;
  return {
    addCategoryResponse: addCategoryResponse,
    categories: categories,
    deleteCategoryResponse: deleteCategoryResponse,
    updateStatusResponse: updateStatusResponse,
    categoryResponse: categoryResponse,
    updateCategoryResponse: updateCategoryResponse
  };
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...productActions }, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListCategory);
