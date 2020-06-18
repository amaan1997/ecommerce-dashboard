import React from 'react';
import {
  SketchOutlined,
  HomeOutlined,
  TeamOutlined,
  BarChartOutlined,
  UserOutlined,
  DollarOutlined,
  TransactionOutlined
} from '@ant-design/icons';

// Component Import
import Dashboard from '../components/Dashboard';
import ListCategory from '../components/Product/ListCategory';
import ListSubCategory from '../components/Product/ListSubCategory';
import ListProduct from '../components/Product/ListProduct';
import AddProduct from '../components/Product/AddProduct';
import ListOrders from '../components/Order';
import ListTransactions from '../components/Transaction';
import ListVendor from '../components/Vendor';
import AddVendor from '../components/Vendor/AddVendor';
import Reports from '../components/Report';
import ManageUser from '../components/User/ManageUser';
import ListUsers from '../components/User';
import CreateUser from '../components/User/CreateUser';

const routes = [
  {
    name: 'Dashboard',
    icon: <HomeOutlined />,
    path: '/',
    component: Dashboard
  },
  {
    name: 'Products',
    icon: <SketchOutlined />,
    subRoutes: [
      {
        name: 'Category',
        component: ListCategory,
        path: '/product/list-category'
      },
      {
        name: 'Sub Category',
        component: ListSubCategory,
        path: '/product/list-sub-category'
      },
      {
        name: 'List Product',
        component: ListProduct,
        path: '/product/list'
      },
      {
        name: 'Add Product',
        component: AddProduct,
        path: '/product/add'
      }
    ]
  },
  {
    name: 'Orders',
    icon: <DollarOutlined />,
    path: '/orders/list',
    component: ListOrders
  },
  {
    name: 'Vendors',
    icon: <TeamOutlined />,
    subRoutes: [
      {
        name: 'Vendor List',
        component: ListVendor,
        path: '/vendor/list'
      },
      {
        name: 'Add Vendor',
        component: AddVendor,
        path: '/vendor/add'
      }
    ]
  },

  {
    name: 'Transactions',
    icon: <TransactionOutlined />,
    path: '/transactions/list',
    component: ListTransactions
  },

  {
    name: 'Users',
    icon: <UserOutlined />,
    subRoutes: [
      {
        name: 'Users List',
        component: ListUsers,
        path: '/users/list'
      },
      {
        name: 'Manage User',
        component: ManageUser,
        path: '/user/manage'
      },
      {
        name: 'Create User',
        component: CreateUser,
        path: '/user/create'
      }
    ]
  },
  {
    name: 'Reports',
    icon: <BarChartOutlined />,
    path: '/reports',
    component: Reports
  }
];

export default routes;
