import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Breadcrumb,
  Card,
  Table,
  Tag,
  message,
  Button,
  Popconfirm,
  Pagination
} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import history from '../../utils/history';
import * as productActions from '../../redux/actions/productAction';

class ListProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 1
    };
  }
  componentDidMount() {
    this.fetchProduct();
  }
  fetchProduct = () => {
    const { pageNumber, pageSize } = this.state;
    const data = {
      pageNumber,
      pageSize
    };
    message.loading('Action in progress..', 0);
    this.props.actions.fetchProducts(data).then(() => {
      console.log('productList>>>', this.props.productList);
      if (this.props.productList && this.props.productList.error) {
        message.error(this.props.productList.error);
      } else {
        if (
          this.props.productList.data &&
          this.props.productList.data.length > 0
        ) {
          this.setState(
            {
              products: this.props.productList.data,
              totalCount: this.props.productList.totalCount
            },
            () => {
              message.success('Products fetched successfully!');
            }
          );
        } else {
          this.setState(
            {
              products: []
            },
            () => {
              message.info('No product found!');
            }
          );
        }
      }
      setTimeout(() => {
        message.destroy();
      }, 1000);
    });
  };
  onChangePage = page => {
    this.setState({ pageNumber: page }, () => {
      this.fetchProduct();
    });
  };
  deleteProductHandler = productId => {
    message.loading('Action in progress..', 0);
    this.props.actions.deleteProduct(productId).then(() => {
      if (
        this.props.deleteProductResponse &&
        this.props.deleteProductResponse.error
      ) {
        message.error(this.props.deleteProductResponse.error);
      } else {
        this.setState(
          {
            pageNumber: 1
          },
          () => {
            message.success(this.props.deleteProductResponse.data);
            this.fetchProduct();
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
        title: 'Product Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Brand Name',
        dataIndex: 'brand',
        key: 'brand'
      },
      {
        title: 'Actual Price',
        dataIndex: 'actualPrice',
        key: 'actualPrice'
      },
      {
        title: 'Discount',
        dataIndex: 'discount',
        key: 'discount',
        render: text => <div>{`${text}%`}</div>
      },
      {
        title: 'Final Price',
        dataIndex: 'finalPrice',
        key: 'finalPrice'
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
        title: 'Size Available',
        dataIndex: 'sizeAvailable',
        key: 'sizeAvailable',
        render: text => <div>{text.join()}</div>
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
                  history.push(`/product/${text.productId}`);
                }}
              >
                View Details
              </Button>

              <Popconfirm
                title='Are you sure delete this product?'
                onConfirm={() => {
                  this.deleteProductHandler(text.productId);
                }}
              >
                <Button type='danger' size='small'>
                  Delete Product
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
    const columns = this.getColumns();
    const { products, pageNumber, pageSize, totalCount } = this.state;
    console.log('State>>', this.state);
    return (
      <div className='xs-mt-40 xs-ml-20 xs-mr-20'>
        <div className='d-flex justify-between'>
          <div className='text-bold font-24'>PRODUCTS</div>
          <Breadcrumb>
            <Breadcrumb.Item href='/'>
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Product List</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Card className='xs-mt-20 '>
          <div className='d-flex justify-between'>
            <div className='text-bold font-24'>Product List</div>
            <button
              className='custom-btn product-btn'
              onClick={() => {
                history.push('/product/add');
              }}
            >
              ADD PRODUCT
            </button>
          </div>
          <Table
            columns={columns}
            dataSource={products}
            className='xs-mt-20'
            pagination={false}
          />
          <Pagination
            current={pageNumber}
            defaultCurrent={pageNumber}
            onChange={page => this.onChangePage(page)}
            total={totalCount ? totalCount : 9}
            pageSize={pageSize}
            style={{ marginTop: 10 }}
          />
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { productList, deleteProductResponse } = state.product;
  return {
    productList: productList,
    deleteProductResponse: deleteProductResponse
  };
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...productActions }, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListProduct);
