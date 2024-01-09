import { Button, Form, Input, List, Modal, Select, Upload, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CONFIG from '../../config';
const { Option } = Select;

const UserInfo = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formKey, setFormKey] = useState(1);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  const [showAdditionalAddress, setShowAdditionalAddress] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteAddressIndex, setDeleteAddressIndex] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        try {
          const response = await axios.get(`${CONFIG.API_URL}auth/user/${parsedUser._id}`);
          const { user } = response.data;
          setUserData(user);
        } catch (error) {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      setFormKey((prevKey) => prevKey + 1);
    }
  }, [userData]);

  useEffect(() => {
    axios
      .get('https://provinces.open-api.vn/api/?depth=3')
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedDistrict('');
    setDistricts([]);
    setSelectedWard('');
    setWards([]);

    const selectedProvinceData = provinces.find((province) => province.code === value);
    if (selectedProvinceData && selectedProvinceData.districts) {
      setDistricts(selectedProvinceData.districts);
    }
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setSelectedWard('');
    setWards([]);

    const selectedDistrictData = districts.find((district) => district.code === value);
    if (selectedDistrictData && selectedDistrictData.wards) {
      setWards(selectedDistrictData.wards);
    }
  };

  const handleAddAddress = () => {
    setShowAdditionalAddress(true);
  };

  const handleDeleteAddress = (index) => {
    setDeleteModalVisible(true);
    setDeleteAddressIndex(index);
  };

  const confirmDeleteAddress = async () => {
    try {
      const response = await axios.delete(`${CONFIG.API_URL}auth/user/${userData._id}/address/${deleteAddressIndex}/delete`);

      if (response.status === 200) {
        setUserData(response.data.user);
        message.info('Xóa địa chỉ thành công!');
      } else {
        message.error('Đã xảy ra lỗi khi xóa địa chỉ');
      }
    } catch (error) {
      console.error('Lỗi khi xóa địa chỉ:', error);
      message.error('Đã xảy ra lỗi khi xóa địa chỉ');
    }

    setDeleteModalVisible(false);
    setDeleteAddressIndex(null);
  };

  const handleFinish = async (values) => {
    setLoading(true);

    const { homeAddress, ...otherValues } = values;

    const selectedProvinceData = provinces.find((province) => province.code === selectedProvince);
    const selectedDistrictData = districts.find((district) => district.code === selectedDistrict);
    const selectedWardData = wards.find((ward) => ward.code === selectedWard);

    const fullAddress = `${homeAddress} / ${selectedWardData?.name || ''} / ${selectedDistrictData?.name || ''} / ${
      selectedProvinceData?.name || ''
    }`;
    console.log(fullAddress);

    try {
      const updatedData = {
        userId: userData._id,
        updatedData: {
          ...otherValues,
          address: fullAddress,
        },
      };

      const response = await axios.post(`${CONFIG.API_URL}auth/user/update`, updatedData);
      setLoading(false);
      setUserData(response.data.user);

      localStorage.setItem('user', JSON.stringify(response.data.user));
      message.info('Lưu thông tin thành công!');
    } catch (error) {
      setLoading(false);
      console.error('Lỗi khi cập nhật thông tin người dùng:', error);
    }
  };

  return (
    <div style={{ width: 400, margin: '0 auto', marginTop: 100 }}>
      <h2>Thông tin người dùng</h2>

      <Form key={formKey} onFinish={handleFinish} initialValues={userData}>
        <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập địa chỉ email!' },
            { type: 'email', message: 'Địa chỉ email không hợp lệ!' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Ảnh đại diện">
          <Upload
            name="image"
            listType="picture-card"
            maxCount={1}
            // onChange={handleImageChange}
            multiple={false}
          >
            {"+ Tải ảnh lên"}
          </Upload>
        </Form.Item>
        {userData && userData.address && userData.address.length > 0 && (
          <Form.Item label="Danh sách địa chỉ">
            <List
              dataSource={userData.address}
              renderItem={(address, index) => (
                <List.Item>
                  <span>{address}</span>
                  <Button type="link" onClick={() => handleDeleteAddress(index)}>
                    Xóa
                  </Button>
                </List.Item>
              )}
            />
          </Form.Item>
        )}
        {showAdditionalAddress ? (
          <>
            <Form.Item name="province" label="Tỉnh/thành phố" rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}>
              <Select placeholder="Chọn quận/huyện" onChange={handleProvinceChange} value={selectedProvince} style={{ width: 200 }}>
                {provinces.map((province) => (
                  <Option key={province.code} value={province.code}>
                    {province.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="district" label="Quận/huyện" rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}>
              <Select
                placeholder="Chọn quận/huyện"
                onChange={handleDistrictChange}
                value={selectedDistrict}
                style={{ width: 200 }}
                disabled={!selectedProvince}
              >
                {districts.map((district) => (
                  <Option key={district.code} value={district.code}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="ward" label="Phường/xã" rules={[{ required: true, message: 'Vui lòng chọn phường/xã!' }]}>
              <Select
                placeholder="Chọn phường/xã"
                style={{ width: 200 }}
                value={selectedWard}
                onChange={setSelectedWard}
                disabled={!selectedDistrict}
              >
                {wards.map((ward) => (
                  <Option key={ward.code} value={ward.code}>
                    {ward.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="homeAddress" label="Địa chỉ tận nơi" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ tận nơi!' }]}>
              <Input />
            </Form.Item>

            <Form.Item>
              <Button onClick={() => setShowAdditionalAddress(false)}>Hủy</Button>
            </Form.Item>
          </>
        ) : (
          <Form.Item>
            <Button onClick={handleAddAddress}>Thêm địa chỉ mới</Button>
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>

      <Modal title="Xóa địa chỉ" visible={deleteModalVisible} onOk={confirmDeleteAddress} onCancel={() => setDeleteModalVisible(false)}>
        <p>Bạn có chắc chắn muốn xóa địa chỉ này?</p>
      </Modal>
    </div>
  );
};

export default UserInfo;
