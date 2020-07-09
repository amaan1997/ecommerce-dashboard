import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Breadcrumb,
  Card,
  Table,
  message,
  Button,
  Popconfirm,
  Modal,
  Spin,
  Form,
  InputNumber,
  Input
} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import * as vendorActions from '../../redux/actions/vendorAction';

const { TextArea } = Input;
const FormItem = Form.Item;

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addVendorModal: false,
      loading: false,
      isEmailValid: false,
      isZipCodeValid: false,
      isSubmitted: false,
      email: '',
      zipCode: '',
      vendors: [],
      vendorDetails: {}
    };
    this.formRef = React.createRef();
  }
  componentDidMount() {
    this.fetchVendors();
  }
  fetchVendors = () => {
    message.loading('Action in progress..', 0);
    this.props.actions.fetchVendorDetails().then(() => {
      console.log('props....', this.props.vendorDetails);
      if (this.props.vendorDetails.error) {
        message.error(this.props.vendorDetails.error);
      } else {
        if (
          this.props.vendorDetails.data &&
          this.props.vendorDetails.data.length > 0
        ) {
          this.setState(
            {
              vendors: this.props.vendorDetails.data
            },
            () => {
              message.success('Vendors fetched successfully!');
            }
          );
        } else {
          this.setState(
            {
              vendors: []
            },
            () => {
              message.info('No Vendors found!');
            }
          );
        }
      }
    });
    setTimeout(() => {
      message.destroy();
    }, 1000);
  };
  onModalHandler = () => {
    this.setState({
      addVendorModal: !this.state.addVendorModal
    });
  };
  onChangeHandler = (key, value) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const zipCodeRegex = /^[1-9][0-9]{5}$/;

    if (key === 'email') {
      if (emailRegex.test(value)) {
        this.setState({
          isEmailValid: true,
          email: value
        });
      } else {
        this.setState({
          isEmailValid: false,
          email: value
        });
      }
    } else {
      if (zipCodeRegex.test(value)) {
        this.setState({
          isZipCodeValid: true,
          zipCode: value
        });
      } else {
        this.setState({
          isZipCodeValid: false,
          zipCode: value
        });
      }
    }
  };
  addVendorModal = values => {
    const { isEmailValid, isZipCodeValid } = this.state;
    this.setState({ isSubmitted: true });
    if (isEmailValid && isZipCodeValid) {
      message.loading('Action in progress..', 0);

      this.props.actions.addVendor(values).then(() => {
        if (this.props.addVendorResponse.error) {
          message.error(this.props.addVendorResponse.error);
        } else {
          this.setState(
            {
              addVendorModal: false
            },
            () => {
              message.success(this.props.addVendorResponse.data);
              this.fetchVendors();
            }
          );
        }
      });
    }
    setTimeout(() => {
      message.destroy();
    }, 1000);
  };
  deleteVendor = vendorId => {
    message.loading('Action in progress..', 0);
    this.props.actions.deleteVendor(vendorId).then(() => {
      if (
        this.props.deleteVendorResponse &&
        this.props.deleteVendorResponse.error
      ) {
        message.error(this.props.deleteVendorResponse.error);
      } else {
        message.success(this.props.deleteVendorResponse.data);
        this.fetchVendors();
      }
      setTimeout(() => {
        message.destroy();
      }, 1000);
    });
  };

  editVendorHandler = vendorId => {
    message.loading('Action in progress..', 0);
    this.props.actions.getVendorById(vendorId).then(() => {
      console.log('props>>', this.props.vendorByIdResponse);
      if (
        this.props.vendorByIdResponse &&
        this.props.vendorByIdResponse.error
      ) {
        message.error(this.props.vendorByIdResponse.error);
      } else {
        this.setState(
          {
            addVendorModal: true,
            isEditable: true
          },
          () => {
            const vendorDetails = this.props.vendorByIdResponse.data;

            console.log('props.,', vendorDetails);
            console.log('props.,', this.formRef);

            // this.formRef.current.setFieldsValue({
            //   name: vendorDetails.name,
            //   email: vendorDetails.email,
            //   address: vendorDetails.address,
            //   zipCode: vendorDetails.zipCode
            // });
          }
        );
      }
      setTimeout(() => {
        message.destroy();
      }, 1000);
    });
  };

  getColumns = () => {
    const columns = [
      {
        title: 'Vendor Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Vendor Address',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: 'Zip Code',
        dataIndex: 'zipCode',
        key: 'zipCode'
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => {
          console.log('text>>', text);
          return (
            <div className='d-flex'>
              <Button
                type='success'
                className='xs-mr-10'
                size='small'
                onClick={() => {
                  this.editVendorHandler(text.vendorId);
                }}
              >
                Edit Vendor
              </Button>

              <Popconfirm
                title='Are you sure delete this vendor?'
                onConfirm={() => {
                  this.deleteVendor(text.vendorId);
                }}
              >
                <Button type='danger' size='small'>
                  Delete Vendor
                </Button>
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
      addVendorModal,
      loading,
      isEmailValid,
      isZipCodeValid,
      isSubmitted,
      email,
      zipCode,
      vendors
    } = this.state;

    const columns = this.getColumns();
    console.log('state', this.state);
    return (
      <div className='xs-mt-40 xs-ml-20 xs-mr-20'>
        <div className='d-flex justify-between'>
          <div className='text-bold font-24'>VENDORS</div>
          <Breadcrumb>
            <Breadcrumb.Item href='/'>
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Vendor List</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Card className='xs-mt-20 '>
          <div className='d-flex justify-between'>
            <div className='text-bold font-24'>Vendor List</div>
            <button
              className='custom-btn product-btn'
              onClick={this.onModalHandler}
            >
              ADD VENDOR
            </button>
          </div>
          <Table
            columns={columns}
            dataSource={vendors}
            className='xs-mt-20'
            pagination={false}
          />
        </Card>
        <Modal
          visible={addVendorModal}
          title='Add Vendor'
          onCancel={this.onModalHandler}
          footer={[
            <React.Fragment>
              <Button
                key='back'
                onClick={this.onModalHandler}
                className='height-30 xs-mt-12'
              >
                Cancel
              </Button>
              <button
                className='custom-btn product-btn height-30'
                type='submit'
                onClick={() => {
                  this.formRef.current.validateFields().then(values => {
                    this.addVendorModal(values);
                  });
                }}
              >
                Add Vendor
              </button>
            </React.Fragment>
          ]}
        >
          <Spin spinning={loading}>
            <Form ref={this.formRef} layout='vertical' name='vendor_modal'>
              <FormItem
                label={'Vendor Name'}
                name='name'
                rules={[
                  { required: true, message: 'Please input vendor name!' }
                ]}
              >
                <Input />
              </FormItem>
              <div>
                <FormItem
                  label={'Email'}
                  name='email'
                  className='vendor-form-item'
                  onChange={e => this.onChangeHandler('email', e.target.value)}
                  rules={[{ required: true, message: 'Please input email!' }]}
                >
                  <Input />
                </FormItem>
                {isSubmitted && !isEmailValid && email && (
                  <span className='error-message'>
                    Please enter a valid email
                  </span>
                )}
              </div>
              <FormItem
                label={'Address'}
                name='address'
                rules={[
                  { required: true, message: 'Please input vendor address!' }
                ]}
              >
                <TextArea rows={3} />
              </FormItem>

              <FormItem
                label={'Zip Code'}
                name='zipCode'
                onChange={e => this.onChangeHandler('zipCode', e.target.value)}
                className='vendor-form-item'
                rules={[{ required: true, message: 'Please input zip code!' }]}
              >
                <InputNumber className='full-width' />
              </FormItem>
              {isSubmitted && !isZipCodeValid && zipCode && (
                <span className='error-message'>
                  Please enter a valid zip code
                </span>
              )}
            </Form>
          </Spin>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    addVendorResponse: state.vendor.addVendorResponse,
    vendorDetails: state.vendor.vendorDetails,
    deleteVendorResponse: state.vendor.deleteVendorResponse,
    vendorByIdResponse: state.vendor.vendorByIdResponse
  };
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      {
        ...vendorActions
      },
      dispatch
    )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(index);
