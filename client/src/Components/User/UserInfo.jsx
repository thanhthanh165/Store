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
  const [file_, setFile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        try {
          const response = await axios.get(`${CONFIG.API_URL}auth/user/${parsedUser._id}`);
          const { user } = response.data;
          setUserData(user);
          setFile(`${CONFIG.HOST}` + user.picture);
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
      .get('https://vapi.vnappmob.com/api/province')
      .then((response) => {
        console.log('results', response.data['results']);
        setProvinces(response.data['results']);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleFileChange = (info) => {
    if (info.file.status === 'done') {
      // Xử lý khi tải lên thành công, lưu đường dẫn ảnh vào state hoặc dispatch action
      console.log(info.file);
    } else if (info.file.status === 'error') {
      // Xử lý khi có lỗi
      console.error('Upload failed:', info.file.error);
    }
  };
  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post(`${CONFIG.API_URL}auth/user/update-avatar/${userData._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Gọi onSuccess để thông báo thành công
      onSuccess();

      setFile(CONFIG.HOST + response.data.path);
      // Lưu đường dẫn ảnh vào state hoặc dispatch action nếu cần
      console.log(response.data, file);
    } catch (error) {
      // Gọi onError để thông báo lỗi
      onError(error);
      console.error('Error uploading avatar:', error);
    }
  };

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedDistrict('');
    setDistricts([]);
    setSelectedWard('');
    setWards([]);

    const selectedProvinceData = provinces.find((province) => province.province_id === value);
    selectedProvinceData &&
      axios
        .get('https://vapi.vnappmob.com/api/province/district/' + selectedProvinceData.province_id)
        .then((response) => {
          console.log('results', response.data['results']);
          setDistricts(response.data['results']);
        })
        .catch((error) => {
          console.log(error);
        });
    // if (selectedProvinceData && selectedProvinceData.districts) {
    //   setDistricts(selectedProvinceData.districts);
    // }
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setSelectedWard('');
    setWards([]);

    const selectedDistrictData = districts.find((district) => district.district_id === value);

    selectedDistrictData &&
      axios
        .get('https://vapi.vnappmob.com/api/province/ward/' + selectedDistrictData.district_id)
        .then((response) => {
          console.log('results', response.data['results']);
          setWards(response.data['results']);
        })
        .catch((error) => {
          console.log(error);
        });
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

    const selectedProvinceData = provinces.find((province) => province.province_id === selectedProvince);
    const selectedDistrictData = districts.find((district) => district.district_id === selectedDistrict);
    const selectedWardData = wards.find((ward) => ward.ward_id === selectedWard);

    const fullAddress = `${homeAddress} / ${selectedWardData?.ward_name || ''} / ${selectedDistrictData?.district_name || ''} / ${
      selectedProvinceData?.province_name || ''
    }`;
    console.log(fullAddress);

    try {
      const updatedData = {
        userId: userData._id,
        updatedData: {
          ...otherValues,
          address: homeAddress ? fullAddress : '',
        },
      };

      const response = await axios.post(`${CONFIG.API_URL}auth/user/update`, updatedData);
      setLoading(false);
      setUserData(response.data.user);
      console.log(userData);
      //   setFile(CONFIG.HOST + userData.picture);

      localStorage.setItem('user', JSON.stringify(response.data.user));
      message.info('Lưu thông tin thành công!');
      setSelectedProvince('');
      setDistricts([]);
      setSelectedDistrict('');
      setWards([]);
      setSelectedWard('');
      window.location.reload();
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
            customRequest={customRequest}
            onChange={handleFileChange}
            defaultFileList={file_ ? [{ uid: '1', name: 'avatar.jpg', status: 'done', url: file_ }] : []}
            // onChange={handleImageChange}
            multiple={false}
          >
            {'+ Tải ảnh lên'}
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
              <Select placeholder="Chọn tỉnh/thành phố" onChange={handleProvinceChange} value={selectedProvince} style={{ width: 200 }}>
                {provinces.map((province) => (
                  <Option key={province.province_id} value={province.province_id}>
                    {province.province_name}
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
                  <Option key={district.district_id} value={district.district_id}>
                    {district.district_name}
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
                  <Option key={ward.ward_id} value={ward.ward_id}>
                    {ward.ward_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="homeAddress" label="Địa chỉ tận nơi" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ tận nơi!' }]}>
              <Input disabled={!selectedWard} />
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

      <Modal title="Xóa địa chỉ" open={deleteModalVisible} onOk={confirmDeleteAddress} onCancel={() => setDeleteModalVisible(false)}>
        <p>Bạn có chắc chắn muốn xóa địa chỉ này?</p>
      </Modal>
    </div>
  );
};

export default UserInfo;
