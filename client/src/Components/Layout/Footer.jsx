import { Col, Row } from 'antd';
import { FaCcMastercard, FaCcPaypal, FaCcVisa } from 'react-icons/fa';
import styles from "../css/Footer.module.css";
function FooterLayout() {
  return (
    <footer>
      <div className={styles.footerbody}>

      <Row gutter={[16, 16]}>
        {/* Cột 1 */}
        <Col xs={24} sm={12} md={6} lg={6}>
          <div className={styles.footerColumn}>
            <h4>Thông tin cửa hàng</h4>
            <ul>
              <li>Địa chỉ : Quang Trung/ Hà Đông/ Hà Nội</li>
              <li>Mở cửa : 8.00 Am - 20.00 Pm</li>
              <li>Liên lạc : 0961652001</li>
              {/* <li>Shop</li> */}
            </ul>
          </div>
        </Col>
        {/* Cột 2 */}
        <Col xs={24} sm={12} md={6} lg={6}>
          <div className={styles.footerColumn}>
            <h4>Hỗ trợ</h4>
            <ul>
              <li>Tìm kiếm sản phẩm </li>
              <li>Giỏ hàng</li>
              <li>Đăng ký tài khoản</li>
              <li>Kiểm tra tình trạng đơn hàng</li>
              {/* <li>FAQ</li> */}
            </ul>
          </div>
        </Col>
        {/* Cột 3 */}
        <Col xs={24} sm={12} md={6} lg={6}>
          <div className={styles.footerColumn}>
            <h4>Chính sách</h4>
            <ul>
              <li>Chính sách đổi trả</li>
              <li>Chính sách bảo mật<table></table></li>
              <li>Chính sách vận chuyển</li>
              <li>Quy định sử dụng</li>
            </ul>
          </div>
        </Col>
        {/* Cột 4 */}
        <Col xs={24} sm={12} md={6} lg={6}>
          <div className={styles.footerColumn}>
            <h4>JewelryE-Store</h4>
            <p>Hân hạnh phục vụ quý khách </p>
            <input type="email" placeholder="Enter your email" />
            
          </div>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        {/* Cột 1 */}
        <Col xs={24} sm={12} md={12} lg={12}>
          <div className={styles.footerColumn}>
            <h4>JewelryE-Store eCommerce</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
        </Col>
        {/* Cột 2 */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <div className={styles.footerColumn}>
            <h4>Accepted Payments</h4>
            <div className={styles.paymentIcons}>
              <FaCcVisa style={{ fontSize: 24, marginRight: 8 }} />
              <FaCcMastercard style={{ fontSize: 24, marginRight: 8 }} />
              <FaCcPaypal style={{ fontSize: 24, marginRight: 8 }} />
              {/* Thêm các biểu tượng thanh toán khác ở đây */}
            </div>
          </div>
        </Col>
      </Row>
      </div>
    </footer>
  );
}

export default FooterLayout;
