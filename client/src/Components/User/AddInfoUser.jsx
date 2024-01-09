import axios from 'axios';
import React, { useState } from 'react';
import CONFIG from '../../config';

const AddInfoPage = () => {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Gửi yêu cầu POST đến server
    axios
      .post(`${CONFIG.API_URL}auth/user/customer-info`, { phone, address })
      .then((response) => {
        // Xử lý kết quả từ server
        console.log(response.data); // Log dữ liệu từ server
        // Chuyển hướng người dùng đến trang chủ hoặc trang trước đó
        // Thực hiện logic chuyển hướng tại đây
      })
      .catch((error) => {
        console.error('Lỗi:', error);
      });
  };

  return (
    <div>
      <h1>Add Info</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="phone">Phone:</label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        /><br /><br />

        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        /><br /><br />

        <input type="submit" value="Save" />
      </form>
    </div>
  );
};

export default AddInfoPage;
