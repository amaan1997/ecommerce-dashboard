import React from 'react';
import { Row, Col, Input } from 'antd';
import { ShopOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import ecommerceImage from '../../assets/images/ecommerce.webp';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isEmailValid: false
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
    }
  };

  render() {
    const { email, password, isEmailValid, isSubmitted } = this.state;
    return (
      <div className='d-flex justify-center align-center full-height flex-wrap'>
        <img src={ecommerceImage} className='image-container' />
        <div className='login-content-container login-container'>
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
                      onChange={e => this.handleChange('email', e.target.value)}
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
        </div>
      </div>
    );
  }
}

export default Login;
