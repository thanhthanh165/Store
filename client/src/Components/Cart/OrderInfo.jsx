import { SmallDashOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Modal, Row, notification } from 'antd';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import { IoCartOutline, IoChatbubbleEllipsesOutline, IoLockClosedOutline, IoRefreshOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import CONFIG from '../../config';
import '../css/OrderInfo.css';
const orderStatuses = [
  'Chờ xác nhận',
  'Đã xác nhận',
  'Đã gửi hàng',
  'Hoàn tất',
  // "Hủy",
];
function OrderInfo() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Chờ xác nhận');
  const [orderStatus, setOrderStatus] = useState('Chờ xác nhận');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCancelingOrder, setIsCancelingOrder] = useState(false);
  const [isRatingOrder, setIsRatingOrder] = useState(false);

  const userJson = localStorage.getItem('user');
  const user = JSON.parse(userJson);
  const userId = user ? user._id : null;

  useEffect(() => {
    // Gọi API để lấy danh sách các đơn hàng của người dùng

    axios
      .get(`${CONFIG.API_URL}orders/${userId}`)
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userId, orderStatus]);

  useEffect(() => {
    // Lọc các đơn hàng theo trạng thái được chọn
    const filteredOrders = orders.filter((order) => order.status === selectedStatus);
    setSelectedOrders(filteredOrders);
  }, [selectedStatus, orders]);

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsCancelingOrder(order.status === 'Chờ xác nhận');
    setIsRatingOrder(order.status === 'Hoàn tất');
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const isNoOrders = selectedOrders.length === 0;

  const handleCancelOrder = (order) => {
    // Thực hiện logic hủy đơn hàng ở đây, có thể gửi yêu cầu đến máy chủ
    // để cập nhật trạng thái đơn hàng và xử lý các tác vụ khác liên quan đến hủy đơn hàng.
    axios
      .post(`${CONFIG.API_URL}orders/cancel`, { orderId: order._id })
      .then((response) => {
        // Xử lý kết quả từ máy chủ (nếu cần)
        console.log(response.data.message);
        notification.success({
          message: 'Hủy đơn hàng thành công',
          duration: 3, // Thời gian hiển thị thông báo (giây)
        });
        setOrderStatus('Hủy thành công'); // Cập nhật trạng thái
      })
      .catch((error) => {
        // Xử lý lỗi từ máy chủ (nếu cần)
        console.error(error);
      });
  };
  const sortedOrders = [...selectedOrders].sort((a, b) => {
    // Sắp xếp đơn hàng theo thời gian tạo từ mới đến cũ
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div>
      <h2  style={{ marginLeft: '5%', marginBottom: '20px', marginTop: '40px' }}>Đơn hàng của bạn</h2>

      <div style={{ marginLeft: '5%', marginRight: '5%' }}>
        <Row gutter={[16, 16]} justify="center">
          {orderStatuses.map((status) => (
            <Col xs={24} sm={12} md={6} lg={6} key={status}>
              <Card onClick={() => setSelectedStatus(status)} className={`custom-card ${selectedStatus === status ? 'selected' : ''}`}>
                <div className="card-content">
                  <div className="icon">
                    {status === 'Chờ xác nhận' && <IoCartOutline size={40} />}
                    {status === 'Đã xác nhận' && <IoChatbubbleEllipsesOutline size={40} />}
                    {status === 'Đã gửi hàng' && <IoRefreshOutline size={40} />}
                    {status === 'Hoàn tất' && <IoLockClosedOutline size={40} />}
                  </div>
                  <h5 className="status">{status}</h5>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div style={{ marginLeft: '5%', marginRight: '5%', marginTop: '40px', minHeight: '400px' }}>
        {/* Kiểm tra nếu không có đơn hàng nào trong trạng thái đã chọn */}
        {isNoOrders ? (
          <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Empty description={<span>Không có đơn hàng nào trong trạng thái đã chọn.</span>} />
          </div>
        ) : (
          sortedOrders.map((order) => (
            <div
              key={order._id}
              style={{
                border: '1px solid #ccc',
                padding: '20px',
                marginBottom: '20px',
                alignItems: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                backgroundColor: '#fff',
              }}
            >
              <div style={{ display: 'flex' }}>
                <div style={{ flex: '1', display: 'flex', alignItems: 'center' }}>
                  <div style={{ flex: '0 0 120px', marginRight: '20px' }}>
                    <img
                      src={order.cartItems[0].imageUrl}
                      alt={order.cartItems[0].name}
                      style={{ maxWidth: '100%', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#333',
                      }}
                    >
                      {order.cartItems[0].name}
                    </p>
                    <p style={{ color: '#666' }}>
                      <strong>Giá:</strong> {order.cartItems[0].price?.toLocaleString('en-US')}
                    </p>
                    <p style={{ color: '#666' }}>
                      <strong>Số lượng:</strong> {order.cartItems[0].sizeAndQuantitySizeWant[0].quantity}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'self-end',
                    marginRight: '60px',
                  }}
                >
                  <p style={{ fontSize: '16px', color: '#444' }}>Tổng tiền thanh toán: {order.totalBill?.toLocaleString('en-US')} đ</p>
                  <p style={{ fontSize: '16px', color: '#444' }}>Trạng thái: {order.status}</p>
                  <p style={{ fontSize: '14px', color: '#888' }}>
                    Ngày tạo: {moment(order.createdAt).locale('vi').format('DD/MM/YYYY - HH:mm')}
                  </p>

                  <div>
                    <Button type="primary" onClick={() => showOrderDetails(order)} style={{ marginTop: '15px' }}>
                      Xem chi tiết đơn hàng
                    </Button>
                    {/* Nút "Hủy đơn hàng" */}
                    {order.status === 'Chờ xác nhận' && (
                      <Button danger onClick={() => handleCancelOrder(order)} style={{ marginTop: '15px', marginLeft: '15px' }}>
                        Hủy đơn hàng
                      </Button>
                    )}

                    {order.status === 'Hoàn tất' && (
                      <Link to={`/review?orderId=${order._id}`} key={order._id}>
                        <Button style={{ marginTop: '15px', marginLeft: '15px' }}>Đánh giá</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  textAlign: 'center',
                  marginTop: '10px',
                  fontSize: '32px',
                }}
              >
                <SmallDashOutlined />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal hiển thị chi tiết đơn hàng */}
      <Modal title="Thông tin đơn hàng" visible={!!selectedOrder} onCancel={closeModal} footer={null} width={1000}>
        {selectedOrder && (
          <div>
            <p>
              <strong> ID:</strong> {selectedOrder._id}
            </p>
            <p>
              <strong>Tổng tiền:</strong> {selectedOrder.totalBill?.toLocaleString('en-US')}
            </p>
            <p>
              <strong>Địa chỉ người nhận:</strong> {selectedOrder.selectedAddress}
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong> {selectedOrder.paymentMethod}
            </p>
            <p>
              <strong>Trạng thái:</strong> {selectedOrder.status}
            </p>

            <h4>Sản phẩm trong đơn hàng</h4>
            {selectedOrder.cartItems.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <div style={{ flex: '0 0 100px', marginRight: '20px' }}>
                  <img src={item.imageUrl} alt={item.name} style={{ maxWidth: '100px' }} />
                </div>
                <div>
                  <p>
                    <strong>Tên sản phẩm:</strong> {item.name}
                  </p>
                  <p>
                    <strong>Giá:</strong> {item.price?.toLocaleString('en-US')}
                  </p>
                  <p>
                    <strong>Số lượng:</strong> {item.sizeAndQuantitySizeWant[0].quantity}
                  </p>
                  {/* Thêm chi tiết khác nếu cần */}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default OrderInfo;
