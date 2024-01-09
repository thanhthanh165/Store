import { Col, DatePicker, List, Row, Typography } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CONFIG from '../../config';

const { Title } = Typography;

function SalesStatistics() {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [soldProducts, setSoldProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchSoldProducts();
  }, [selectedDate]);

  useEffect(() => {
    calculateTotalRevenue();
  }, [soldProducts]);

  const fetchSoldProducts = async () => {
    try {
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      const response = await axios.get(
        `${CONFIG.API_URL}statistics/sold-products/${formattedDate}`
      );
      setSoldProducts(response.data);
    } catch (error) {
      console.error('Error fetching sold products:', error);
    }
  };

  const calculateTotalRevenue = () => {
    const total = soldProducts.reduce((total, product) => {
      if (product.productId && product.productId.price) {
        return total + product.productId.price * getTotalSoldQuantity(product);
      }
      return total;
    }, 0);
    setTotalRevenue(total);
  };

  // const calculateTotalRevenue = () => {
  //   const total = soldProducts.reduce(
  //     (total, product) =>
  //       total + product.productId.price * getTotalSoldQuantity(product),
  //     0
  //   );
  //   setTotalRevenue(total);
  // };

  const getTotalSoldQuantity = (product) => {
    const soldEntriesInDate = product.sales.filter((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getFullYear() === selectedDate.year() &&
        entryDate.getMonth() === selectedDate.month() &&
        entryDate.getDate() === selectedDate.date()
      );
    });

    return soldEntriesInDate.reduce((total, entry) => total + entry.quantity, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const soldProductData = soldProducts.map((product) => {
    const totalSoldQuantity = getTotalSoldQuantity(product);
    return {
      name: product.productId?.name,
      soldQuantity: totalSoldQuantity,
    };
  });

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <div>
            <Title level={2}>Thống Kê Sản Phẩm Đã Bán</Title>
            <DatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
            <List
              dataSource={soldProducts}
              renderItem={(product) => (
                <List.Item>
                  {product.productId?.name} - Số lượng đã bán:{' '}
                  {getTotalSoldQuantity(product)}
                </List.Item>
              )}
            />
            <Title level={4}>
              Tổng doanh thu: {formatCurrency(totalRevenue)}
            </Title>
          </div>
        </Col>
        <Col span={12}>
          <div>
            <Title level={2}>Biểu Đồ Thống Kê Sản Phẩm Đã Bán</Title>
            <BarChart width={500} height={350} data={soldProductData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                interval={0}
                angle={-45}
                textAnchor="end"
                tick={{ fontSize: 10 }}
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="soldQuantity" fill="#8884d8" />
            </BarChart>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default SalesStatistics;
