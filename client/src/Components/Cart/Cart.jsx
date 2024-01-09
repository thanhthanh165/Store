import { Button, Card, Col, Empty, Modal, Radio, Row, Select, Table, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../Components/css/Cart.css';
import CONFIG from '../../config';

const { Option } = Select;

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [user, setUser] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(''); //
  const [paymentStatus, setPaymentStatus] = useState(''); // "success" hoặc "cancelled"
  const [paymentOption, setPaymentOption] = useState(''); // "cash" hoặc "vnpay"

  //kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);

    setUser(user);
    setIsLoggedIn(!!user);
    // Nếu chưa đăng nhập, hiển thị modal thông báo
    if (!user) {
      setShowModal(true);
    }

    const handleStorageChange = () => {
      const user = localStorage.getItem('user');

      setIsLoggedIn(!!user);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  //lấy thông tin giỏ hàng từ người dùng
  useEffect(() => {
    // Lấy thông tin giỏ hàng từ server nếu đã đăng nhập
    if (isLoggedIn) {
      const userId = user._id;

      axios
        .get(`${CONFIG.API_URL}cart/${userId}/get`)
        .then((response) => {
          setCartItems(response.data.cartItems);
          setTotalBill(response.data.totalBill);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    // Điều hướng đến trang đăng nhập
    navigate('/login', { state: { returnTo: location.pathname } });
  };

  const handleCancel = () => {
    // Ẩn modal khi người dùng không đồng ý
    setShowModal(false);
  };

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl, record) => (
        // Sửa đoạn mã render để thêm key cho img tag
        <img
          // Sử dụng một giá trị duy nhất từ dữ liệu làm key
          src={imageUrl}
          alt="product"
          style={{ height: '100px', width: 'auto' }}
        />
      ),
    },
    {
      title: 'Số lượng sản phẩm',
      dataIndex: 'sizeAndQuantitySizeWant',
      key: 'sizeAndQuantitySizeWant',
      render: (sizes, record) => (
        <>
          {sizes.map((size, index) => {
            return (
              <div key={index}>
                {/* Sử dụng một giá trị duy nhất từ dữ liệu làm key */}
                <p>{`Size: ${size.sizeName} - Số lượng : ${size.quantity}`}</p>
              </div>
            );
          })}
        </>
      ),
    },
    {
      title: 'Giá (giá trên mỗi sản phẩm)',
      dataIndex: 'price',
      key: 'price', // Đảm bảo rằng key là duy nhất
      align: 'center',
      render: (price) => <span style={{ whiteSpace: 'nowrap' }}>{price?.toLocaleString()} đ</span>,
    },
    {
      title: 'Giá ',
      dataIndex: 'productTotal',
      key: 'productTotal', // Sửa key thành "productTotal", đảm bảo key là duy nhất
      align: 'center',
      render: (price) => <span style={{ whiteSpace: 'nowrap' }}>{price?.toLocaleString()} đ</span>,
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <>
          <Button type="danger" onClick={() => handleDeleteItem(record)}>
            Xóa
          </Button>

          <Button type="primary" onClick={() => handleEditItem(record)}>
            Sửa
          </Button>
        </>
      ),
    },
  ];

  const orderData = useMemo(() => {
    return {
      userId: user ? user._id : null,
      cartItems,
      totalBill,
      selectedAddress,
      paymentMethod: paymentOption,
    };
  }, [cartItems, totalBill, selectedAddress, paymentOption, user]);

  // xử lý edit , xóa sản phẩm
  const handleDeleteItem = (record) => {
    const productId = record.productId; // Lấy productId từ record (hoặc thông tin khác cần thiết)

    // Gửi yêu cầu xóa sản phẩm từ giỏ hàng đến máy chủ
    axios
      .delete(`${CONFIG.API_URL}cart/${user._id}/remove`, {
        data: { productId }, // Sử dụng productId để xác định sản phẩm cần xóa
      })
      .then((response) => {
        if (response.status === 200) {
          // Xóa sản phẩm khỏi state cartItems sau khi đã xóa thành công trên máy chủ
          const updatedCartItems = cartItems.filter((item) => item.productId !== productId);
          setCartItems(updatedCartItems);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleEditItem = (itemToEdit) => {
    // Chuyển hướng đến trang ViewProduct của sản phẩm với id tương ứng
    navigate(`/products/${itemToEdit.productId}`);
  };

  // xử lý thanh toán

  const handlePaymentOptionChange = (option) => {
    setPaymentOption(option);
  };

  const handlePayment = async () => {
    try {
      const paymentData = {
        amount: totalBill,
        orderDescription: 'Thanh toán đơn hàng',
        bankCode: '', // Mã ngân hàng (tuỳ chọn)
        language: 'vn', // Ngôn ngữ (tuỳ chọn)
        orderType: 'normal',
      };

      const response = await axios.post(`${CONFIG.API_URL}payment/create_payment_url`, paymentData);
      return response.data.paymentUrl; // Trả về URL để chuyển hướng người dùng
    } catch (error) {
      console.error('Lỗi xử lý thanh toán:', error);
      throw error;
    }
  };

  const handlePaymentSuccess = async (orderData) => {
    try {
      // Gửi thông tin đơn hàng lên server để admin xử lý

      const response = await axios.post(`${CONFIG.API_URL}orders/create`, orderData);
    } catch (error) {
      console.error(error);
      message.error('Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      if (!paymentOption) {
        message.error('Vui lòng chọn phương thức thanh toán trước khi đặt đơn hàng.');

        return;
      }

      if (!selectedAddress) {
        message.error('Vui lòng chọn địa chỉ giao hàng trước khi đặt đơn hàng.');

        return;
      }

      let paymentUrl;

      if (paymentOption === 'vnpay') {
        // Thực hiện thanh toán và lấy URL
        paymentUrl = await handlePayment();
      }

      if (paymentUrl) {
        // Lưu thông tin đơn hàng vào localStorage
        localStorage.setItem('orderData', JSON.stringify(orderData));

        // Chuyển hướng người dùng đến trang thanh toán
        window.location.href = paymentUrl;
      } else {
        // Xử lý khi chọn thanh toán bằng tiền mặt
        handlePaymentSuccess(orderData);
        navigate(`/order/success`);
        console.log(orderData);
        localStorage.removeItem('orderData'); // Truyền orderData vào hàm handlePaymentSuccess
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Xử lý khi trang trả về sau khi thanh toán

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const vnpResponseCode = queryParams.get('vnp_ResponseCode');

    if (vnpResponseCode === '00') {
      // Thanh toán thành công

      const orderData = JSON.parse(localStorage.getItem('orderData'));
      handlePaymentSuccess(orderData);
      navigate(`/order/success`);
    } else if (vnpResponseCode === 'xx') {
      // Thanh toán bị hủy
      setPaymentStatus('cancelled');
    }
    // Xử lý theo ý muốn cho các trạng thái khác của vnpResponseCode
  }, []);

  const records = useMemo(() => {
    return cartItems.map((item, index) => {
      return {
        ...item,
        index,
      };
    });
  }, [cartItems]);

  return (
    <div style={{ minHeight: '500px' }}>
      {/* Hiển thị Empty khi chưa đăng nhập */}
      {!isLoggedIn && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '500px',
          }}
        >
          <Empty description="Bạn cần đăng nhập trước khi truy cập vào giỏ hàng.">
            <Button type="primary">
              <Link to="/login">Đăng nhập</Link>
            </Button>
          </Empty>
        </div>
      )}

      {/* Render div riêng khi đã đăng nhập */}
      {isLoggedIn && (
        <div className="cart-container">
          {/* gio hang */}
          {cartItems.length > 0 ? (
            <>
              <Row style={{ marginTop: '36px' }}>
                <Col span={24}>
                  <Table dataSource={records} columns={columns} pagination={false} rowKey={'index'} />
                </Col>
              </Row>
              <Row style={{ marginTop: '36px' }}>
                <Col span={24}>
                  <Card>
                    <h4>Thông tin người dùng</h4>

                    <p>Tên: {user.name}</p>
                    <p>Số điện thoại: {user.phone}</p>
                    <div>
                      <span> Địa chỉ: </span>
                      <Select defaultValue="" style={{ width: 200 }} onChange={setSelectedAddress}>
                        {user.address.map((address, index) => (
                          <Option key={index} value={address}>
                            {address}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <Link to="/user-info" className="edit-link">
                        Sửa
                      </Link>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row style={{ marginTop: '36px' }}>
                <Col span={24}>
                  <Card>
                    <Row gutter={16}>
                      <Col span={12}>
                        <h4>Chọn phương thức thanh toán</h4>
                        <div>
                          <Radio checked={paymentOption === 'cash'} onChange={() => handlePaymentOptionChange('cash')}>
                            Thanh toán khi nhận hàng
                          </Radio>
                        </div>
                        <div>
                          <Radio checked={paymentOption === 'vnpay'} onChange={() => handlePaymentOptionChange('vnpay')}>
                            Thanh toán qua VNPay
                          </Radio>
                        </div>
                      </Col>
                      <Col span={12}>
                        <h4
                          style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                          }}
                        >
                          Tổng bill: {totalBill?.toLocaleString()} đ
                        </h4>
                        <Button type="primary" onClick={handlePlaceOrder}>
                          Đặt đơn hàng
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px',
              }}
            >
              <Empty description="Giỏ hàng của bạn đang trống." />
            </div>
          )}

          {/* user */}
        </div>
      )}

      {/* Modal thông báo */}
      <Modal
        visible={showModal}
        title="Thông báo"
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="login" type="primary" onClick={handleLogin}>
            Đăng nhập
          </Button>,
        ]}
        centered
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          <p>Bạn cần đăng nhập trước khi truy cập vào giỏ hàng.</p>
          <p>Bạn có muốn đăng nhập ngay?</p>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
