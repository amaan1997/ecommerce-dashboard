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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as vendorActions from '../../redux/actions/vendorAction';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

class AddVendor extends Component {
  constructor(props) {
    super(props);
    this.state = { countries: [] };
  }
  componentDidMount = () => {
    this.props.actions.getCountries().then(() => {
      if (this.props.countries && this.props.countries.length > 0) {
        this.setState({
          countries: this.props.countries
        });
      } else {
        this.setState({ countries: [] });
      }
    });
  };
  onAddVendorHandler = values => {
    console.log('values>>>', values);
  };

  render() {
    const layout = {
      labelCol: {
        span: 2
      },
      wrapperCol: {
        span: 8
      }
    };
    const { countries } = this.state;
    console.log('state>>', this.state);

    return (
      <div className='xs-mt-40 xs-ml-20 xs-mr-20'>
        <div className='d-flex justify-between'>
          <div className='text-bold font-24'>VENDOR</div>
          <Breadcrumb>
            <Breadcrumb.Item href='/'>
              <HomeOutlined />
            </Breadcrumb.Item>

            <Breadcrumb.Item href='/vendor'>Vendor</Breadcrumb.Item>
            <Breadcrumb.Item>Add </Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Card
          className='xs-mt-20 product-image-card'
          title={<div className='text-bold font-20 color-grey'>ADD VENDOR</div>}
        >
          <Form
            {...layout}
            name='add_vendor'
            onFinish={this.onAddVendorHandler}
          >
            <FormItem
              label={'Vendor Name'}
              name='name'
              rules={[{ required: true, message: 'Please input vendor name!' }]}
            >
              <Input />
            </FormItem>
            <FormItem
              label={'Email'}
              name='email'
              rules={[{ required: true, message: 'Please input email!' }]}
            >
              <Input />
            </FormItem>
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
              rules={[{ required: true, message: 'Please input zip code!' }]}
            >
              <InputNumber className='full-width' />
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { countries, states, cities } = state.vendor;
  return {
    countries: countries,
    states,
    cities
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
export default connect(mapStateToProps, mapDispatchToProps)(AddVendor);
