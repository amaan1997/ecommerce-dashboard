import React, { Component } from 'react';
import {
  Button,
  Popconfirm,
  message,
  Table,
  Breadcrumb,
  Tag,
  Card
} from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HomeOutlined } from '@ant-design/icons';
import history from '../../utils/history';
import * as couponActions from '../../redux/actions/couponAction';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coupons: []
    };
  }
  componentDidMount() {
    this.fetchCoupons();
  }
  fetchCoupons = () => {
    message.loading('Action in progress..');

    this.props.actions.fetchCoupon().then(() => {
      if (this.props.couponList.error) {
        message.error(this.props.couponList.error);
      } else {
        this.setState({
          coupons: this.props.couponList.data
        });
      }
    });
    setTimeout(() => {
      message.destroy();
    }, 1000);
  };
  updateStatusHandler = (couponId, status) => {
    let finalStatus = status === 'active' ? 'inactive' : 'active';

    message.loading('Action in progress..', 0);

    this.props.actions.updateCouponStatus(couponId, finalStatus).then(() => {
      if (this.props.updateCouponStatusResponse.error) {
        message.error(this.props.updateCouponStatusResponse.error);
      } else {
        message.success(this.props.updateCouponStatusResponse.data);
        this.fetchCoupons();
      }
    });
    setTimeout(() => {
      message.destroy();
    }, 1000);
  };
  deleteCouponHandler = couponId => {
    message.loading('Action in progress..', 0);
    this.props.actions.deleteCoupon(couponId).then(() => {
      if (this.props.deleteCouponResponse.error) {
        message.error(this.props.deleteCouponResponse.error);
      } else {
        message.success(this.props.deleteCouponResponse.data);
        this.fetchCoupons();
      }
    });
    setTimeout(() => {
      message.destroy();
    }, 1000);
  };
  getCouponColumns = () => {
    const columns = [
      {
        title: 'Coupon Code',
        dataIndex: 'couponCode',
        key: 'couponCode'
      },
      {
        title: 'Coupon Description',
        dataIndex: 'description',
        key: 'description'
      },
      {
        title: 'Discount',
        dataIndex: 'discount',
        key: 'discount',
        render: text => <div>{`${text}%`}</div>
      },
      {
        title: 'Min Amount',
        dataIndex: 'minAmount',
        key: 'minAmount'
      },
      {
        title: 'Max Redemptions',
        dataIndex: 'maxRedemptions',
        key: 'maxRedemptions'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: text =>
          text === 'active' ? (
            <Tag color='#2db7f5'>{text}</Tag>
          ) : (
            <Tag color='#f50'>{text}</Tag>
          )
      },
      {
        title: 'Valid From',
        dataIndex: 'validFrom',
        key: 'validFrom',
        render: text => (
          <div>{moment(text).format('DD MMM YYYY hh:mm:ss A')}</div>
        )
      },
      {
        title: 'Valid Till',
        dataIndex: 'validTill',
        key: 'validTill',
        render: text => (
          <div>{moment(text).format('DD MMM YYYY hh:mm:ss A')}</div>
        )
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
                  history.push(`/coupon/edit/${text.couponId}`);
                }}
              >
                Edit Details
              </Button>

              <Popconfirm
                title='Are you sure delete this coupon?'
                onConfirm={() => {
                  this.deleteCouponHandler(text.couponId);
                }}
              >
                <Button type='danger' size='small' className='xs-mr-10'>
                  Delete Coupon
                </Button>
              </Popconfirm>
              <Button
                size='small'
                onClick={() =>
                  this.updateStatusHandler(text.couponId, text.status)
                }
              >
                {text.status === 'active'
                  ? 'Deactivate Coupon'
                  : 'Activate Coupon'}
              </Button>
            </div>
          );
        }
      }
    ];
    return columns;
  };
  render() {
    const { coupons } = this.state;
    const columns = this.getCouponColumns();
    return (
      <div className='xs-mt-40 xs-ml-20 xs-mr-20'>
        <div className='d-flex justify-between'>
          <div className='text-bold font-24'>COUPONS</div>
          <Breadcrumb>
            <Breadcrumb.Item href='/'>
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Coupon List</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Card className='xs-mt-20 '>
          <div className='d-flex justify-between'>
            <div className='text-bold font-24'>Coupon List</div>
            <button
              className='custom-btn product-btn'
              onClick={() => {
                history.push('/coupon/add');
              }}
            >
              ADD COUPON
            </button>
          </div>
          <Table columns={columns} dataSource={coupons} className='xs-mt-20' />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {
    couponList,
    updateCouponStatusResponse,
    deleteCouponResponse
  } = state.coupon;
  return {
    couponList: couponList,
    updateCouponStatusResponse: updateCouponStatusResponse,
    deleteCouponResponse: deleteCouponResponse
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
export default connect(mapStateToProps, mapDispatchToProps)(index);
