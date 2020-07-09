import React, { Component } from 'react';
import {
  Form,
  Input,
  Select,
  Breadcrumb,
  Card,
  InputNumber,
  Radio,
  Button,
  message,
  DatePicker
} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { get } from 'lodash';
import * as couponActions from '../../redux/actions/couponAction';
import history from '../../utils/history';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

class AddCoupon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitted: false,
      editable: false,
      prevCouponCode: '',
      couponId: ''
    };
    this.formRef = React.createRef();
  }
  componentDidMount() {
    const couponId = get(this.props.match.params, 'couponId', '');
    if (couponId) {
      this.props.actions.getCouponDetailsById(couponId).then(() => {
        if (this.props.couponById.error) {
          history.push('/coupon');
        } else {
          let data = this.props.couponById.data;
          this.formRef.current.setFieldsValue({
            couponCode: data.couponCode,
            description: data.description,
            discount: data.discount,
            minAmount: data.minAmount,
            validFrom: moment(data.validFrom, 'DD MMM YYYY hh:mm:ss A'),
            validTill: moment(data.validTill, 'DD MMM YYYY hh:mm:ss A'),
            maxRedemptions: data.maxRedemptions,
            status: data.status
          });
          this.setState({
            editable: true,
            prevCouponCode: data.couponCode,
            couponId: couponId
          });
        }
      });
    }
  }

  addCouponHandler = values => {
    const { editable, prevCouponCode, couponId } = this.state;
    values.validFrom = moment(values.validFrom).format(
      'DD MMM YYYY hh:mm:ss A'
    );
    values.validTill = moment(values.validTill).format(
      'DD MMM YYYY hh:mm:ss A'
    );

    if (editable) {
      this.props.actions
        .validateCouponCode(values.couponCode, prevCouponCode, true)
        .then(() => {
          if (!this.props.isCouponCodeValid) {
            message.error('Please enter a valid coupon code');
          } else {
            message.loading('Action in progess...', 5);
            this.props.actions.updateCoupon(couponId, values).then(() => {
              if (this.props.updateCouponResponse.error) {
                message.error(this.props.updateCouponResponse.error);
              } else {
                message.success('Coupon Updated successfully!');
                history.push('/coupon');
              }
            });
          }
        });
    } else {
      this.props.actions
        .validateCouponCode(values.couponCode, null, false)
        .then(() => {
          if (!this.props.isCouponCodeValid) {
            message.error('Please enter a valid coupon code');
          } else {
            message.loading('Action in progess...', 5);

            this.props.actions.addCoupon(values).then(() => {
              if (this.props.addCouponResponse.error) {
                message.error(this.props.addCouponResponse.error);
              } else {
                message.success('Coupon Added successfully!');
                history.push('/coupon');
              }
            });
          }
        });
    }
  };
  render() {
    const layout = {
      labelCol: {
        span: 3
      },
      wrapperCol: {
        span: 8
      }
    };
    const { editable } = this.state;
    return (
      <div className='xs-mt-40 xs-ml-20 xs-mr-20'>
        <div className='d-flex justify-between'>
          <div className='text-bold font-24'>Coupon</div>
          <Breadcrumb>
            <Breadcrumb.Item href='/'>
              <HomeOutlined />
            </Breadcrumb.Item>

            <Breadcrumb.Item href='/coupon'>Coupon</Breadcrumb.Item>
            <Breadcrumb.Item>Add</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Card
          className='xs-mt-20'
          title={
            <div className='text-bold font-20 color-grey'>
              {editable ? 'UPDATE COUPON' : 'ADD Coupon'}
            </div>
          }
        >
          <Form
            {...layout}
            ref={this.formRef}
            name='add_coupon'
            onFinish={this.addCouponHandler}
          >
            <FormItem
              label={'Coupon Code'}
              name='couponCode'
              rules={[{ required: true, message: 'Please input coupon code!' }]}
            >
              <Input />
            </FormItem>
            <FormItem
              label={'Coupon Description'}
              name='description'
              rules={[
                { required: true, message: 'Please input coupon description!' }
              ]}
            >
              <TextArea rows={2} />
            </FormItem>
            <FormItem
              label={'Discount(in %)'}
              name='discount'
              rules={[{ required: true, message: 'Please input discount' }]}
            >
              <InputNumber min={0} max={100} />
            </FormItem>
            <FormItem
              label={'Min Amount'}
              name='minAmount'
              rules={[{ required: true, message: 'Please input min amount!' }]}
            >
              <InputNumber />
            </FormItem>
            <FormItem
              label={'Valid From'}
              name='validFrom'
              rules={[{ required: true, message: 'Please input start date!' }]}
            >
              <DatePicker />
            </FormItem>
            <FormItem
              label={'Valid till'}
              name='validTill'
              rules={[{ required: true, message: 'Please input end date!' }]}
            >
              <DatePicker />
            </FormItem>

            <FormItem
              label={'Max Redemptions'}
              name='maxRedemptions'
              rules={[
                { required: true, message: 'Please input max redemption!' }
              ]}
            >
              <InputNumber />
            </FormItem>
            <FormItem
              label={'Status'}
              name='status'
              rules={[
                {
                  required: true,
                  message: 'Please select coupon status!'
                }
              ]}
            >
              <Radio.Group>
                <Radio value='active'>Enable </Radio>
                <Radio value='inactive'>Disable</Radio>
              </Radio.Group>
            </FormItem>
            <Button
              type='primary'
              htmlType='submit'
              className='submit-btn d-flex justify-center'
            >
              {editable ? 'Update Coupon' : 'Add Coupon'}
            </Button>
          </Form>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isCouponCodeValid: state.coupon.isCouponCodeValid,
    addCouponResponse: state.coupon.addCouponResponse,
    couponById: state.coupon.couponById,
    updateCouponResponse: state.coupon.updateCouponResponse
  };
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      {
        ...couponActions
      },
      dispatch
    )
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddCoupon);
