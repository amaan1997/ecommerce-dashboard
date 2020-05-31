import React, { Component } from 'react';
import { Result } from 'antd';
import history from '../../utils/history';

class NoPageFound extends Component {
  render() {
    return (
      <Result
        status='404'
        title='404'
        subTitle='Sorry, the page you visited does not exist.'
        extra={
          <div className='back-btn'>
            <button
              className='custom-btn'
              onClick={() => {
                history.push('/login');
              }}
            >
              Back To Dashboard
            </button>
          </div>
        }
      />
    );
  }
}

export default NoPageFound;
