import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Breadcrumb, Card, Table, Tag, Row, Col, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { get } from 'lodash';
import * as productActions from '../../redux/actions/productAction';
import history from '../../utils/history';

import renderHTML from 'react-render-html';
import draftToHtml from 'draftjs-to-html';

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productDetail: {},
      loading: false
    };
  }
  componentDidMount() {
    const productId = get(this.props.match.params, 'productId', '');

    if (productId) {
      this.setState({ loading: true });
      this.props.actions.getProductDetail(productId).then(() => {
        console.log('props.>>', this.props.productDetail);
        if (this.props.productDetail.error) {
          this.setState(
            {
              loading: false
            },
            () => {
              history.push('/product');
            }
          );
        } else {
          this.setState({
            productDetail: this.props.productDetail.data,
            loading: false
          });
        }
      });
    }
  }
  render() {
    const productId = get(this.props.match.params, 'productId', '');
    const { productDetail, loading } = this.state;
    let spec = get(productDetail, 'specification', []);
    let sizes = get(productDetail, 'sizeAvailable', []);
    let imageUrls = get(productDetail, 'imageUrls', []);

    console.log('productDetail', this.state.productDetail);
    return (
      <React.Fragment>
        <Spin spinning={loading} className='d-flex justify-center align-center'>
          <div className='xs-mt-40 xs-ml-20 xs-mr-20'>
            <div className='d-flex justify-between'>
              <div className='text-bold font-24'>PRODUCT DETAIL</div>
              <Breadcrumb>
                <Breadcrumb.Item href='/'>
                  <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item href='/product'>Product List</Breadcrumb.Item>
                <Breadcrumb.Item>{productId}</Breadcrumb.Item>
              </Breadcrumb>
            </div>

            <div className='d-flex'>
              <div className='full-width xs-mr-20'>
                <Card className='xs-mt-20 '>
                  <Row className='border-bottom xs-mt-10 xs-pb-10'>
                    <Col sm={16}>
                      <div>
                        <div className='text-bold font-20'>Product Name</div>
                        <h4>{productDetail.name}</h4>
                      </div>
                    </Col>
                    <Col sm={8}>
                      <div>
                        <div className='text-bold font-20'>Brand Name</div>
                        <h4>{productDetail.brand}</h4>
                      </div>
                    </Col>
                  </Row>

                  <Row className='border-bottom xs-mt-10 xs-pb-10'>
                    <Col sm={16}>
                      <div>
                        <div className='text-bold font-20'>Actual Price</div>
                        <h4>{productDetail.actualPrice}</h4>
                      </div>
                    </Col>
                    <Col sm={8}>
                      <div>
                        <div className='text-bold font-20'>Status</div>
                        <h4>
                          {productDetail.status === 'active' ? (
                            <Tag color='#2db7f5'>{productDetail.status}</Tag>
                          ) : (
                            <Tag color='#f50'>{productDetail.status}</Tag>
                          )}
                        </h4>
                      </div>
                    </Col>
                  </Row>

                  <Row className='border-bottom xs-mt-10 xs-pb-10'>
                    <Col sm={16}>
                      <div>
                        <div className='text-bold font-20'>Discount</div>
                        <h4>{productDetail.discount}</h4>
                      </div>
                    </Col>
                    <Col sm={8}>
                      <div>
                        <div className='text-bold font-20'>Final Price</div>
                        <h4>{Math.round(productDetail.finalPrice, 0)}</h4>
                      </div>
                    </Col>
                  </Row>

                  <Row className='border-bottom xs-mt-10 xs-pb-10'>
                    <Col sm={16}>
                      <div>
                        <div className='text-bold font-20'>Category Name</div>
                        <h4>{productDetail.categoryName}</h4>
                      </div>
                    </Col>
                    <Col sm={8}>
                      <div>
                        <div className='text-bold font-20'>
                          Sub Category Name
                        </div>
                        <h4>{productDetail.subCategoryName}</h4>
                      </div>
                    </Col>
                  </Row>
                  <Row className='xs-mt-10 '>
                    <Col sm={16}>
                      <div>
                        <div className='text-bold font-20'>Vendor Name</div>
                        <h4>{productDetail.vendorName}</h4>
                      </div>
                    </Col>
                    <Col sm={8}>
                      <div>
                        <div className='text-bold font-20'>Sizes Available</div>
                        <h4>{sizes.length > 0 && sizes.join()}</h4>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </div>
              <div className='full-width'>
                <Card
                  className='xs-mt-20 product-image-card'
                  title={
                    <div className='text-bold font-20 color-grey'>
                      PRODUCT IMAGES
                    </div>
                  }
                >
                  <div className='d-flex flex-wrap'>
                    {imageUrls.length > 0 &&
                      imageUrls.map(imageUrl => (
                        <img
                          src={imageUrl}
                          className='view-product-image xs-ml-8 xs-mr-8 xs-mb-20'
                        />
                      ))}
                  </div>
                </Card>
              </div>
            </div>
            <div className='d-flex xs-mt-20'>
              <div className='full-width xs-mr-20'>
                <Card
                  title={
                    <div className='text-bold font-20 color-grey'>
                      SPECIFICATION
                    </div>
                  }
                >
                  <Row className='border-bottom xs-mt-10 xs-pb-10'>
                    {spec &&
                      spec.length > 0 &&
                      spec.map((item, index) => (
                        <React.Fragment>
                          <Col sm={index % 2 !== 0 ? 8 : 16}>
                            <div>
                              <div className='text-bold font-20'>
                                {item.key}
                              </div>
                              <h4>{item.value}</h4>
                            </div>
                          </Col>
                        </React.Fragment>
                      ))}
                  </Row>
                </Card>
              </div>
              <div className='full-width'>
                <Card
                  title={
                    <div className='text-bold font-20 color-grey'>
                      DESCRIPTION
                    </div>
                  }
                >
                  {productDetail.description &&
                    renderHTML(draftToHtml(productDetail.description))}
                </Card>
              </div>
            </div>
          </div>
        </Spin>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    productDetail: state.product.productDetail
  };
};
const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators({ ...productActions }, dispatch)
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
