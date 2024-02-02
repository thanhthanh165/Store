import React, { useState, useEffect } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import styles from '../css/Header.module.css';

const items = [
  {
    isLoggedIn: false,
    label: (
      <Link to="/" className={styles.menuItem}>
        Trang chủ
      </Link>
    ),
    key: 'home',
    // icon: <HomeOutlined />,
  },
  {
    isLoggedIn: false,
    label: 'Sản phẩm',
    children: [
      {
        label: (
          <Link to="/products" className={styles.menuItem}>
            Tất cả sản phẩm
          </Link>
        ),
        key: 'products',
      },
      {
        label: (
          <Link to="/products/ring" className={styles.menuItem}>
            Nhẫn
          </Link>
        ),
        key: 'ring',
      },
      {
        label: (
          <Link to="/products/necklace" className={styles.menuItem}>
            Dây chuyền
          </Link>
        ),
        key: 'necklace',
      },
    ],
  },
  {
    isLoggedIn: false,
    label: (
      <Link to="/contact" className={styles.menuItem}>
        Liên hệ
      </Link>
    ),
    key: 'contact',
  },
  {
    isLoggedIn: true,
    label: (
      <Link to="/order-info" className={styles.menuItem}>
        Quản lý đơn hàng
      </Link>
    ),
    key: 'order-info',
  },
];
const Menu_custom = ({ isLoggedIn, setMenuVisible }) => {
  const { pathname } = useLocation();
  const [current, setCurrent] = useState('');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
    setMenuVisible(false);
  };
  useEffect(() => {
    console.log(pathname);
    // Nếu URL chứa "cart" thì setCurrent('cart')
    items.forEach((item) => {
      console.log(item.key);
      if (pathname.includes(item.key)) {
        setCurrent(item.key);
      } else if (item.children) {
        item.children.forEach((child) => {
          if (pathname.includes(child.key)) {
            setCurrent(child.key);
          }
        });
      }
      if (pathname === '/') {
        setCurrent('home');
      }
    });
  }, [current]);
  return (
    <Menu
      style={{ borderBottom: 'none', color: 'Peru' }}
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items.filter((item) => !item.isLoggedIn || isLoggedIn)}
    />
  );
};
export default Menu_custom;
