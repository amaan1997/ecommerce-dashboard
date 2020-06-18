import React, { Component } from 'react';
import { Switch, Link, Route } from 'react-router-dom';
import { Layout, Drawer, Collapse } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import routes from './Routes';
import AuthenticatedRoute from './AuthenticatedRoute';

const { Content, Sider } = Layout;
const { Panel } = Collapse;

class Base extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawerOpen: false
    };
  }
  drawerHandler = () => {
    this.setState({
      isDrawerOpen: !this.state.isDrawerOpen
    });
  };
  render() {
    const { isDrawerOpen } = this.state;
    return (
      <div>
        <Layout>
          <Sider trigger={null} collapsible collapsed={isDrawerOpen}>
            <MenuOutlined
              onClick={this.drawerHandler}
              className='xs-m-10 font-24'
            />
            <Drawer
              title='Basic Drawer'
              placement='left'
              closable={false}
              onClose={this.drawerHandler}
              visible={isDrawerOpen}
            >
              {routes &&
                routes.length > 0 &&
                routes.map(route =>
                  route.subRoutes && route.subRoutes.length > 0 ? (
                    <Collapse
                      defaultActiveKey={['1']}
                      expandIconPosition='right'
                    >
                      <Panel
                        header={
                          <div className='d-flex drawer-tab'>
                            <div className='font-24'> {route.icon}</div>
                            <div className='xs-pl-10 d-flex align-center bold'>
                              {route.name}
                            </div>
                          </div>
                        }
                      >
                        {route.subRoutes.map((subRoute, index) => (
                          <div className='xs-pb-10 xs-pl-50 '>
                            <Link
                              to={subRoute.path}
                              className='color-grey drawer-tab'
                            >
                              {subRoute.name}
                            </Link>
                          </div>
                        ))}
                      </Panel>
                    </Collapse>
                  ) : (
                    <div className='d-flex xs-ml-16 drawer-tab '>
                      <div className='font-24'> {route.icon}</div>
                      <Link
                        to={route.path}
                        className='d-flex align-center xs-pl-10 bold color-black drawer-tab'
                      >
                        {route.name}
                      </Link>
                    </div>
                  )
                )}
            </Drawer>
          </Sider>
          {/* <Layout className='site-layout'> */}
          <Content className='site-layout-background xs-mr-10 xs-mt-10'>
            <Switch>
              {routes &&
                routes.length > 0 &&
                routes.map((route, index) => {
                  if (route.subRoutes && route.subRoutes.length > 0) {
                    return route.subRoutes.map(subRoute => (
                      <Route
                        key={index + 1}
                        exact
                        path={subRoute.path}
                        component={subRoute.component}
                        user={this.props.user}
                      />
                    ));
                  } else {
                    return (
                      <Route
                        key={index + 1}
                        exact
                        path={route.path}
                        component={route.component}
                        user={this.props.user}
                      />
                    );
                  }
                })}
            </Switch>
          </Content>
          {/* </Layout> */}
        </Layout>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps, null)(Base);
