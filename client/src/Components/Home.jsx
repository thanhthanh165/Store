import React from 'react';
import { default as banner1, default as banner5 } from '../Img/new collection banner.png';
import banner2 from '../Img/sale banner.png';
import banner6 from '../Img/Black Friday.png';
import banner7 from '../Img/Sale.png'


import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import { Button, Card, Carousel, Col, Row, Typography } from 'antd';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import CONFIG from '../config';
import styles from './css/Home.module.css';

import { IoCartOutline, IoChatbubbleEllipsesOutline, IoLockClosedOutline, IoRefreshOutline } from 'react-icons/io5';
const { Title } = Typography;
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 1000,
  slidesToShow: 4,
  slidesToScroll: 4,
  autoplay: true,
  autoplaySpeed: 4000,
};
function Home() {
  //xu ly banner
  const carouselRef = useRef(null);

  const nextBanner = () => {
    carouselRef.current.next();
  };

  const prevBanner = () => {
    carouselRef.current.prev();
  };

  //xu ly new arial
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  //xu ly onclick khi an vo card

  const navigate = useNavigate();

  // Xử lý sự kiện khi nhấp vào card

  const handleCardClick = (productId) => {
    console.log(productId);
    // Điều hướng đến trang chi tiết sản phẩm với productId

    navigate(`/products/${productId}`);
  };

  useEffect(() => {
    console.log(CONFIG);
    // gọi new prd
    axios
      .get(`${CONFIG.API_URL}homepage`)
      .then((response) => {
        setNewProducts(response.data.products);
        console.log(response.data.products);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });

    // gọi best selling
    axios
      .get(`${CONFIG.API_URL}homepage/products/best-selling-products`)
      .then((response) => {
        setBestSellingProducts(response.data.bestSellingProducts);
        console.log(response.data.bestSellingProducts);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <div className={styles.banner}>
        <Carousel ref={carouselRef} autoplay={true} autoplaySpeed={4000}>
          <div>
            <img src={banner1} alt="Banner 1" className={styles.bannerImage} />
          </div>
          <div>
            <img src={banner2} alt="Banner 2" className={styles.bannerImage} />
          </div>
          <div>
            <img src={banner7} alt="Banner 7" className={styles.bannerImage} />
          </div>
        </Carousel>

        <Button className={styles.prevButton} onClick={prevBanner} icon={<LeftCircleOutlined />} />
        <Button className={styles.nextButton} onClick={nextBanner} icon={<RightCircleOutlined />} />
      </div>

      <div className={styles.newArrivals}>
        <Title level={2}>Sản phẩm bán chạy</Title>
        <p className={styles.newArrivalsTitle_h6}>Xem ngay</p>
        <Row gutter={[16, 16]} justify="center" className="newArrivals_row_img">
          {loading ? (
            <p>Loading...</p>
          ) : (
            newProducts.slice(0, 8).map((product) => (
              <Col key={product._id} xs={12} sm={8} md={6} lg={6}>
                <Card
                  cover={<img src={product.imageUrl[0]} alt={product.name} />}
                  onClick={() => handleCardClick(product._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Meta title={product.name} description={`Giá: ${product.price?.toLocaleString("en-US")}`} />

                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>

      <div className={styles.benefit}>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={6} lg={6}>
            <Card className={styles.benefitCard}>
              <div className={styles.benefitContent}>
                <div className={`${styles.benefitIcon} ${styles.freeShippingIcon}`}>
                  <IoCartOutline size={40} /> {/* Đặt kích thước của icon */}
                </div>
                <div className={styles.benefitTextContainer}>
                  <Title level={5} style={{color: '#D2691E'}}>Free Ship</Title>
                  <p className={styles.benefitText}>Hỗ trợ freeship từ đơn hàng từ 500.000 vnd</p> {/* Tùy chỉnh kích thước chữ */}
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6} lg={6}>
            <Card className={styles.benefitCard}>
              <div className={styles.benefitContent}>
                <div className={`${styles.benefitIcon} ${styles.freeShippingIcon}`}>
                  <IoChatbubbleEllipsesOutline size={40} /> {/* Đặt kích thước của icon */}
                </div>
                <div className={styles.benefitTextContainer}>
                  
                  <Title level={5} style={{color: '#D2691E'}}>Hỗ Trợ 24/7</Title>
                  <p className={styles.benefitText}>
                    Đội ngũ hỗ trợ của chúng tôi sẽ luôn có mặt để hỗ trợ bạn<nav></nav>
                  </p>{' '}
                  {/* Tùy chỉnh kích thước chữ */}
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6} lg={6}>
            <Card className={styles.benefitCard}>
              <div className={styles.benefitContent}>
                <div className={`${styles.benefitIcon} ${styles.freeShippingIcon}`}>
                  <IoRefreshOutline size={40} /> {/* Đặt kích thước của icon */}
                </div>
                <div className={styles.benefitTextContainer}>
                  <Title level={5} style={{color: '#D2691E'}}>Đổi trả</Title>
                  <p className={styles.benefitText}>Hỗ trợ khách hàng đổi trả lên tới 7 ngày </p> {/* Tùy chỉnh kích thước chữ */}
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6} lg={6}>
            <Card className={styles.benefitCard}>
              <div className={styles.benefitContent}>
                <div className={`${styles.benefitIcon} ${styles.freeShippingIcon}`}>
                  <IoLockClosedOutline size={40} /> {/* Đặt kích thước của icon */}
                </div>
                <div className={styles.benefitTextContainer}>
                <Title level={5} style={{color: '#D2691E'}}>Kiểm tra thanh toán</Title>
                  <p className={styles.benefitText}>Hỗ trợ kiểm tra hàng trước khi thanh toán </p> {/* Tùy chỉnh kích thước chữ */}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      

      <div className={styles.promo}>
        <div
          className={`${styles.promoSection} ${styles.firstSection}`}
          // style={{ backgroundImage: `url(${promoBackgroundImage})` }}
        >
          {/* <h3 className={styles.promoTitle}>Peace of Mind</h3>
          <p className={styles.promoText}>
            A one-stop platform for all your fashion needs, hassle-free. Buy with a peace of mind.
          </p>
          <Button className={styles.promoButton} type="primary">
            Buy Now
          </Button> */}
        </div>
        <div className={`${styles.promoSection} ${styles.secondSection}`}>
          {/* <h3 className={styles.promoTitle}>Buy 2 Get 1 Free</h3>
          <p className={styles.promoText}>End of season sale. Buy any 2 items of your choice and get 1 free.</p>
          <Button className={styles.promoButton} type="primary">
            Buy Now
          </Button> */}
        </div>
      </div>
            {/* // đây là best seller */}
      <div className={styles.newArrivals}>
      <Title level={2}>Sản phẩm bán chạy</Title>
        <p className={styles.newArrivalsTitle_h6}>Nhanh tay để trải nghiệm những sản phẩm HOT nhất của nhà NorthStarr bạn nhé </p>

        <Slider {...sliderSettings}>
          {bestSellingProducts.map((product) => (
            <div key={product._id} onClick={() => handleCardClick(product._id)}>
              <div
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px',
                  margin: '0 8px',
                  cursor: 'pointer',
                }}
                // Thêm sự kiện onClick vào sản phẩm
              >
                <div style={{ textAlign: 'center' }}>
                  <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100%', borderRadius: '8px' }} />
                </div>
                <div>
                  <h5 style={{ fontSize: '18px', color: '#333', marginTop: '20px' }}>{product.name}</h5>
                  <p style={{ color: '#666' }}>
                    <strong>Giá:</strong> {product.price?.toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className={styles.bannerFooter}>
      <Title level={2} style={{textAlign:'center'}}>NorthStar </Title>
        
        <p className={styles.newArrivalsTitle} style={{ color: 'rgb(168, 178, 186)' }}>
          Mua hàng trên NorthStar luôn là một trải nghiệm ấn tượng,Dù bạn đang có nhu cầu mua bất kỳ mặt hàng nào thì 
         
        </p>

        <p className={styles.newArrivalsTitle} style={{ color: 'rgb(168, 178, 186)', marginBottom: '40px' }}>
          {' '}
          NorthStar cũng sẽ đảm bảo cung cấp cho bạn những sản phẩm ưng ý.
        </p>

        <button
          onClick={() => navigate('/products')}
          style={{
            backgroundColor: 'Black', // Màu nền mặc định
            color: 'white', // Màu chữ mặc định
            padding: '10px 20px', // Kích thước padding
            borderRadius: '10px', // Độ cong viền
            border: 'none', // Loại bỏ viền
            cursor: 'pointer', // Đổi con trỏ khi di chuột qua
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Hiệu ứng bóng đổ
            display: 'block', // Hiển thị là block để căn giữa theo chiều ngang
            margin: '0 auto', // Margin tự động để căn giữa theo chiều ngang
            transition: 'background-color 0.3s, color 0.3s', // Thêm hiệu ứng transition
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'White'; // Màu nền khi hover
            e.target.style.color = 'Black'; // Màu chữ khi hover
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'Black'; // Màu nền khi không hover
            e.target.style.color = 'white'; // Màu chữ khi không hover
          }}
        >
          Đi Tới Shop
        </button>

        <Row gutter={16} style={{ marginTop: '40px' }}>
          <Col xs={24} sm={24} md={16} className={`${styles.bannerColumn} ${styles.largeBannerColumn}`}>
            {/* Cột đầu - có một ảnh lớn */}
            <img src={banner2} alt="Large Banner" className={styles.largeBanner} />
          </Col>
          <Col xs={24} sm={12} md={8} className={`${styles.bannerColumn} ${styles.smallBannerColumn}`}>
            {/* Cột thứ hai - có hai ảnh nhỏ cân đối */}
            <div className={styles.smallBannerContainer}>
              <img src={banner5} alt="Small Banner 1" className={styles.smallBanner} />
              <img src={banner6} alt="Small Banner 2" className={styles.smallBanner} />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Home;
