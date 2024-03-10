import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Layout, Menu, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import logoImage from '../../Img/Logo store.png';
import styles from '../css/Header.module.css';
import Menu_custom from './menu';
import CONFIG from '../../config';

const { Header } = Layout;

const HeaderLayout = () => {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const [isloggedin, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsLoggedIn(true); // Đánh dấu đã đăng nhập
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      } else {
        setIsLoggedIn(false); // Đánh dấu chưa đăng nhập
        setUser(null); // Xóa thông tin người dùng trong state
      }
    };

    handleStorageChange(); // Xử lý trạng thái ban đầu khi component được tạo (refresh trang)

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleUserClick = () => {
    setMenuVisible(!menuVisible);
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'login') {
      navigate('/login');
    } else if (key === 'register') {
      navigate('/register');
    } else if (key === 'user-info') {
      navigate('/user-info');
    }

    setMenuVisible(false);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Xóa thông tin người dùng khỏi local storage
    setIsLoggedIn(false); // Đánh dấu chưa đăng nhập
    setUser(null); // Xóa thông tin người dùng trong state
    navigate('/');
    window.location.reload();
  };

  return (
    <div>
      <Header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 999,
          marginBottom: '60px',
          backgroundColor: '#fff',
          padding: '0',
          paddingLeft: '5%',
          paddingRight: '5%',
        }}
      >
        <Row align="middle" style={{ alignItems: 'stretch' }}>
          <Col flex={1} style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/">
              <img src={logoImage} alt="Logo" style={{ maxHeight: '64px', display: 'block', maxWidth: '100%' }} />
            </Link>
          </Col>
          <Col flex={1}>
            <Menu_custom isloggedin={isloggedin} setMenuVisible={setMenuVisible} />
          </Col>
          <Col flex={1} style={{ textAlign: 'right' }}>
            {isloggedin ? (
              <>
                <div>
                  <span style={{ marginRight: 14 }}>Xin chào {user.name.split(' ')[0] + ' ! '} </span>
                  <Button
                    shape="circle"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleCartClick}
                    style={{ marginRight: 5, verticalAlign: 'middle' }}
                  />
                  <span className="avatar-wrapper" onClick={handleUserClick}>
                    {user?.picture ? <Avatar src={`${CONFIG.HOST}${user.picture}`} /> : <Avatar icon={<UserOutlined />} />}
                    {console.log(`${CONFIG.HOST}${user.picture}`)}
                  </span>

                  {menuVisible && (
                    <Menu
                      onClick={handleMenuClick}
                      style={{
                        position: 'absolute',
                        right: 0,
                        zIndex: 4,
                        border: '1px solid #ddd',
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
                        borderRadius: '10px', // Đường viền cho 4 góc
                      }}
                    >
                      <Menu.Item key="user-info">
                        <Link to="/user-info" className={styles.menuItem}>
                          Xem thông tin người dùng
                        </Link>
                      </Menu.Item>
                      <Menu.Item key="order-info">
                        <Link to="/order-info" className={styles.menuItem}>
                          Xem đơn hàng
                        </Link>
                      </Menu.Item>
                      <Menu.Item key="logout" onClick={handleLogout}>
                        <span className={styles.menuItem}>Đăng xuất</span>
                      </Menu.Item>
                    </Menu>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button shape="circle" icon={<ShoppingCartOutlined />} onClick={handleCartClick} style={{ marginRight: 5 }} />
                <Button shape="circle" icon={<UserOutlined />} onClick={handleUserClick} />
                {menuVisible && (
                  <Menu
                    onClick={handleMenuClick}
                    style={{
                      position: 'absolute',
                      right: 0,
                      zIndex: 999,
                      border: '1px solid #ddd',
                      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
                      borderRadius: '10px',
                    }}
                  >
                    <Menu.Item key="login">
                      <Link to="/login" className={styles.menuItem}>
                        Đăng nhập
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="register">
                      <Link to="/register" className={styles.menuItem}>
                        Đăng ký
                      </Link>
                    </Menu.Item>
                  </Menu>
                )}
              </>
            )}
          </Col>
        </Row>
      </Header>
      <div style={{ height: '55px' }}></div>
    </div>
  );
};

export default HeaderLayout;
