import { Button, Form, Input, List, Modal, Rate, notification } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CONFIG from '../../config';

const { TextArea } = Input;

function ReviewOrder() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');

  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewedProducts, setReviewedProducts] = useState([]);

  useEffect(() => {
    // Gọi API để lấy danh sách các sản phẩm trong đơn hàng
    axios
      .get(`${CONFIG.API_URL}orders/reviews/${orderId}`)
      .then((response) => {
        // Lấy danh sách sản phẩm từ JSON response và cập nhật state
        setProducts(response.data.products);
        console.log(response.data.products);

        // Kiểm tra và lọc ra các sản phẩm đã được đánh giá
        const reviewedProductIds = response.data.products.filter((product) => product.isReviewed).map((product) => product.productId);

        setReviewedProducts(reviewedProductIds);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [orderId]);

  // Hàm kiểm tra xem một sản phẩm đã được đánh giá hay chưa
  const isProductReviewed = (productId) => {
    return reviewedProducts.includes(productId);
  };

  const showReviewModal = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleRateChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleReviewSubmit = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user._id;
    console.log(userId);

    const reviewData = {
      orderId: orderId,
      productId: selectedProduct.productId,
      userId: userId,
      rating,
      comment,
    };

    axios
      .post(`${CONFIG.API_URL}orders/reviews`, reviewData)
      .then((response) => {
        notification.success({
          message: 'Thành công',
          description: response.data.message,
        });

        setReviewedProducts([...reviewedProducts, selectedProduct.productId]);
        setIsModalVisible(false);
        setRating(0);
        setComment('');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <div style={{ marginLeft: '5%', marginRight: '5%', marginTop: '2rem' }}>
        <h4 style={{ marginBottom: '2rem' }}>Đánh giá sản phẩm</h4>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={products}
          renderItem={(product) => (
            <List.Item>
              <div
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100%', borderRadius: '8px' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{product.name}</h3>
                  <p style={{ color: '#666' }}>
                    <strong>Giá:</strong> {product.price?.toLocaleString('en-US')}
                  </p>
                  <p style={{ color: '#666' }}>
                    <strong>Số lượng:</strong> {product.sizeAndQuantitySizeWant[0].quantity}
                  </p>
                  <Button
                    type={isProductReviewed(product.productId) ? 'default' : 'primary'}
                    onClick={() => {
                      if (isProductReviewed(product.productId)) {
                        // Xử lý khi sản phẩm đã được đánh giá
                        console.log('Sản phẩm này đã được đánh giá trước đó.');
                      } else {
                        showReviewModal(product);
                      }
                    }}
                  >
                    {isProductReviewed(product.productId) ? 'Đã đánh giá' : 'Đánh giá'}
                  </Button>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>

      {/* Modal đánh giá */}
      <Modal title="Đánh giá sản phẩm" visible={isModalVisible} onOk={handleReviewSubmit} onCancel={() => setIsModalVisible(false)}>
        <Form>
          <Form.Item label="Xếp hạng">
            <Rate allowHalf defaultValue={0} onChange={handleRateChange} value={rating} />
          </Form.Item>
          <Form.Item label="Nhận xét">
            <TextArea rows={4} value={comment} onChange={handleCommentChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ReviewOrder;
