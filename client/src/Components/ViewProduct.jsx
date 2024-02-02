import { MinusCircleOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Empty, Form, Image, Input, Rate, Row, Select, Typography, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CONFIG from '../config';
import styles from './css/ViewProduct.module.css';
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

function ViewProduct() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [product, setProduct] = React.useState(null);
  const [updateProduct, setUpdateProduct] = React.useState('Thêm vào giỏ hàng');
  const [loading, setLoading] = React.useState(true);
  const { Meta } = Card;
  const [selectedSizes, setSelectedSizes] = React.useState({});
  const [form] = Form.useForm();
  const [reviews, setReviews] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // State để kiểm soát sự hiển thị của modal
  const navigate = useNavigate();

  React.useEffect(() => {
    axios
      .get(`${CONFIG.API_URL}homepage/products/${id}`)
      .then((response) => {
        setProduct(response.data.product);
        setReviews(response.data.reviews);
        setSelectedSizes({ ['S']: 1 });

        const quantity = Number(searchParams.get('quantity'));
        quantity && setSelectedSizes({ ['S']: quantity });
        quantity && setUpdateProduct('Cập nhật giỏ hàng');
        console.log('quantity', quantity);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const handleSizeChange = (sizeName, quantity) => {
    quantity = parseInt(quantity);
    const maxQuantity = product.sizes.find((size) => size.name === sizeName).quantity;

    // Kiểm tra nếu số lượng nhập vào lớn hơn số lượng hiện có thì gán giá trị là số lượng hiện có
    if (quantity > maxQuantity) {
      quantity = maxQuantity;
    }

    setSelectedSizes((prevSelectedSizes) => ({
      ...prevSelectedSizes,
      [sizeName]: quantity,
    }));
  };

  const handleRemoveSize = (sizeName) => {
    setSelectedSizes((prevSizes) => {
      const updatedSizes = { ...prevSizes };
      delete updatedSizes[sizeName];
      return updatedSizes;
    });
  };

  const handleAddToCart = () => {
    form.validateFields().then((values) => {
      const selectedProduct = {
        productId: id,
        sizes: selectedSizes,
      };
      const userJson = localStorage.getItem('user');
      const user = JSON.parse(userJson);
      const userId = user ? user._id : null;

      if (!userId) {
        // Người dùng chưa đăng nhập, hiển thị thông báo và chuyển đến trang đăng nhập
        message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
        navigate('/login', { state: { returnTo: location.pathname } });
        return; // Dừng xử lý tiếp theo
      }

      axios
        .post(`${CONFIG.API_URL}cart/${userId}/add`, selectedProduct) // Thay đổi URL để gửi dữ liệu giỏ hàng cho user cụ thể
        .then((response) => {
          // Thực hiện chuyển hướng sau khi thêm sản phẩm thành công
          message.success('Sản phẩm đã được thêm vào giỏ hàng.');
          navigate('/cart');
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  const handleOpenChat = () => {
    // Xử lý khi nút được nhấp, ví dụ: mở modal chat hoặc trang chat
    setIsModalVisible(true);
  };

  const handleCloseChat = () => {
    setIsModalVisible(false); // Khi bạn đóng modal, ẩn modal đi
  };

  const handleSendMessage = () => {
    // Thực hiện xử lý gửi tin nhắn hoặc chuyển đến giao diện chat tương tác
    // Tùy thuộc vào yêu cầu của ứng dụng của bạn.
    // Ví dụ:
    console.log(product);
    const productId = product._id;
    navigate(`/chat/${productId}`); // Chuyển đến giao diện chat
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  const sizes = product.sizes;
  const totalProducts = product.total;
  console.log('Tổng sản phẩm còn lại:', totalProducts);

  const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRatings / reviews.length;

  const reversedReviews = [...reviews].reverse();
  return (
    <div className={styles.product_inf}>
      <Row gutter={[16, 16]} className={styles.imageRow}>
        <Col span={10}>
          <Row gutter={[16, 16]}>
            <Col span={18}>
              <Image src={product.imageUrl[0]} alt={product.name} className={styles.largeImage} />
            </Col>
            <Col span={6}>
              <Row gutter={[16, 16]}>
                {product.imageUrl.slice(1, 5).map((url, index) => (
                  <Col span={18} key={index} className={`${styles.img} ${styles.smallImage}`}>
                    <Image src={url} alt="" style={{ flex: 1 }} />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={14}>
          <Card className={styles.card}>
            <Title level={4}>{product.name}</Title>
            <Paragraph style={{ fontSize: '16px', marginBottom: '8px' }}>Giá: {product.price?.toLocaleString('en-US')} đ</Paragraph>
            Đánh giá : <Rate disabled allowHalf value={averageRating} style={{ fontSize: '16px', marginBottom: '16px' }} />
            <Paragraph
              style={{
                fontSize: '14px',
                marginBottom: '16px',
                whiteSpace: 'pre-line',
                color: 'rgb(199 128 128)',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'normal',
                fontStyle: 'normal',
              }}
            >
              {product.description}
            </Paragraph>
            <Form form={form} layout="vertical">
              <Row gutter={[16, 8]}>
                {/* <Col span={24}>
                  <Form.Item style={{ margin: '0' }}>
                    <Select style={{ width: '25%' }} onChange={(value) => handleSizeChange(value)} placeholder="Chọn size">
                      {sizes.map((size) => {
                        if (size.quantity > 0) {
                          return (
                            <Option key={size._id} value={size.name}>
                              {size.name}
                            </Option>
                          );
                        }
                        return null; // Bỏ qua tùy chọn khi số lượng bằng 0
                      })}
                    </Select>
                  </Form.Item>
                </Col> */}

                <Row gutter={[16, 16]} style={{ width: '100%', margin: 0 }}>
                  {Object.entries(selectedSizes).map(([sizeName, value]) => (
                    <React.Fragment key={sizeName}>
                      <Col span={8}>
                        <Form.Item
                          label={<span>Số Lượng : {product.sizes.find((size) => size.name === sizeName).quantity}</span>}
                          style={{ marginBottom: 0, width: '100%' }}
                        >
                          <div className={styles.formItemContainer}>
                            <Input
                              type="number"
                              min={1}
                              max={product.sizes.find((size) => size.name === sizeName).quantity}
                              placeholder="Nhập số lượng"
                              value={
                                value > product.sizes.find((size) => size.name === sizeName).quantity
                                  ? product.sizes.find((size) => size.name === sizeName).quantity
                                  : value
                              }
                              onChange={(e) => handleSizeChange(sizeName, e.target.value)}
                              style={{ width: '100%' }}
                            />
                            {/* <div className={styles.deleteButtonContainer}>
                              <Button onClick={() => handleRemoveSize(sizeName)} size="small" className={styles.delete_button}>
                                <div className={styles.delete_button_wrapper}>
                                  <MinusCircleOutlined className={styles.deleteButtonIcon} />
                                </div>
                              </Button>
                            </div> */}
                          </div>
                        </Form.Item>
                      </Col>
                    </React.Fragment>
                  ))}
                </Row>

                <Col span={24} style={{ marginTop: 16 }}>
                  <Form.Item style={{ margin: 0 }}>
                    <Button type="primary" onClick={handleAddToCart}>
                      {updateProduct}
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
      <div className={styles.product_reviews}>
        <Title level={4} style={{ color: 'rgb(199, 128, 128)' }}>
          Đánh giá sản phẩm
        </Title>
        {reviews.length === 0 ? (
          <Empty
            description="Chưa có đánh giá nào về sản phẩm"
            style={{ minHeight: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          />
        ) : (
          <div className={styles.reviewList}>
            {reversedReviews.map((review) => (
              <div key={review._id} className={styles.reviewItem}>
                <Row gutter={[16, 16]}>
                  <Col span={6}>
                    <Avatar src={review.userId.picture} size={32} className={styles.avatar} />
                    <Title level={5} className={styles.userName}>
                      {review.userId.name}
                    </Title>
                    <Rate disabled allowHalf value={review.rating} className={styles.rating} />
                  </Col>
                  <Col span={18}>
                    <Row gutter={[16, 16]} style={{ rowGap: '8px' }}>
                      <Col span={24}>
                        <Text className={styles.createdAt}>{moment(review.createdAt).locale('vi').format('DD/MM/YYYY - HH:mm')}</Text>
                        <Paragraph className={styles.comment}>{review.comment}</Paragraph>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        )}
      </div>
      '<span className="ai-achievement"></span>'
    </div>
  );
}

export default ViewProduct;
