import React from 'react';
import { Row, Col, Input, message, Spin } from 'antd';
import { ShopOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get } from 'lodash';
import ecommerceImage from '../../assets/images/ecommerce.webp';
import * as authActions from '../../redux/actions/authAction';
import history from '../../utils/history';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isEmailValid: false,
      loading: false
    };
  }

  handleChange = (key, value) => {
    this.setState(
      {
        [key]: value
      },
      () => {
        if (key === 'email') {
          const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          if (regex.test(value)) {
            this.setState({ isEmailValid: true });
          } else {
            this.setState({ isEmailValid: false });
          }
        }
      }
    );
  };
  handleSubmit = () => {
    const { email, password, isEmailValid } = this.state;
    this.setState({
      isSubmitted: true
    });
    if (email && password && isEmailValid) {
      this.setState({
        loading: true
      });
      let data = {
        email,
        password
      };
      this.props.actions.loginWithEmailRequest(data).then(() => {
        console.log('user>>in login', this.props.user);
        if (this.props.user && this.props.user.error) {
          console.log('test', this.props.user);

          this.setState(
            {
              loading: false
            },
            () => {
              message.error(this.props.user.error);
            }
          );
        } else {
          console.log('test1');
          history.push('/');
        }
      });
    }
  };

  render() {
    const { email, password, isEmailValid, isSubmitted, loading } = this.state;
    console.log('loadinf', loading);
    return (
      <div className='d-flex justify-center align-center full-height flex-wrap'>
        <img src={ecommerceImage} className='image-container' />

        <div className='login-content-container login-container'>
          <Spin spinning={loading}>
            <div className='d-flex justify-center xs-pt-30'>
              <div>
                <ShopOutlined className='login-icon d-flex justify-center' />
                <div className='text-white font-24 xs-pt-20 text-center'>
                  ECOMMERCE DASHBOARD
                </div>
                <div className='xs-ml-10 xs-mr-10 xs-mt-30 xs-mb-30'>
                  <div className='xs-mb-30'>
                    <div className='xs-mb-30'>
                      <Input
                        size='large'
                        placeholder='Email'
                        prefix={<UserOutlined />}
                        className='input-field'
                        onChange={e =>
                          this.handleChange('email', e.target.value)
                        }
                      />
                      {isSubmitted && (!email || !isEmailValid) && (
                        <div className='text-white text-center'>
                          Please enter a valid email
                        </div>
                      )}
                    </div>
                    <Input
                      type='password'
                      size='large'
                      placeholder='Password'
                      prefix={<LockOutlined />}
                      className='input-field'
                      onChange={e =>
                        this.handleChange('password', e.target.value)
                      }
                    />
                    {isSubmitted && !password && (
                      <div className='text-white text-center'>
                        Password cannot be empty
                      </div>
                    )}
                  </div>
                  <button
                    type='submit'
                    className='custom-btn'
                    onClick={this.handleSubmit}
                  >
                    LOGIN
                  </button>

                  <div className=' text-right text-white xs-pt-20'>
                    FORGOT PASSWORD
                  </div>
                </div>
              </div>
            </div>
          </Spin>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  console.log('state-amu>>', state);
  return {
    user: state.auth.user
  };
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...authActions }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
