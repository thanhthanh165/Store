import { Button, Checkbox, Form, Input, InputNumber, Select, Upload, message } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import CONFIG from '../../config';

const defaultSizes = ['S'];

const { Option } = Select;

function FormCreateProduct() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [sizes, setSizes] = useState(defaultSizes);

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const sizeQuantities = sizes.map((size) => ({
        name: size,
        quantity: values[size] ?? 0,
      }));

      const data = { ...values, sizes: sizeQuantities };
      console.log(data);

      //data xử lý ảnh
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append('images', file.originFileObj);
      });

      const fileNames = fileList.map((file) => file.name);

      formData.append('data', JSON.stringify(data));

      console.log([...formData]);
      await axios.post(`${CONFIG.API_URL}products/create`, formData);
      console.log([...formData]);
      message.success('Images uploaded successfully');

      form.resetFields();
    } catch (error) {
      console.error(error);
      // show error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Tên"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input the name of the product!',
            },
          ]}
        >
          <Input placeholder="Nhập tên sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Loại"
          name="category"
          rules={[
            {
              required: true,
              message: 'Please input the category of the product!',
            },
          ]}
        >
          <Select
            type="select"
            defaultValue={'Chọn loại sản phẩm'}
            options={[
              {
                value: '1',
                label: 'Nhẫn',
              },
              {
                value: '2',
                label: 'Dây chuyền',
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Giá (Nghìn đồng)"
          name="price"
          rules={[
            {
              required: true,
              message: 'Please input the price of the product!',
            },
          ]}
        >
          <InputNumber
            defaultValue={0}
            min={0}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>
        {/* <Form.Item
          label="Số lượng sản phẩm"
          name="number"
          rules={[
            {
              required: true,
              message: 'Please input the number product!',
            },
          ]}
        >
          <InputNumber
            defaultValue={0}
            min={0}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item> */}

        <Form.Item
          label="Mô Tả"
          name="description"
          rules={[
            {
              required: true,
              message: 'Please input the description of the product!',
            },
          ]}
        >
          <Input.TextArea placeholder="Nhập Mô Tả" />
        </Form.Item>

        {/* <Form.Item
          label="Thương Hiệu"
          name="brand"
          rules={[
            {
              required: true,
              message: 'Please input the brand of the product!',
            },
          ]}
        >
          <Input placeholder="Nhập Thương Hiệu" />
          {showNewBrandInput ? ( // Hiển thị ô input khi trạng thái là true
            <>
              <Input
                placeholder="Enter a new brand"
                value={form.getFieldValue('newBrand')}
                onChange={(e) => form.setFieldsValue({ newBrand: e.target.value })}
                style={{ marginTop: '8px', width: '60%' }}
              />
              <Button onClick={handleAddNewBrand} style={{ marginLeft: '8px' }}>
                Add New Brand
              </Button>
            </>
          ) : (
            <Button onClick={handleAddBrand} style={{ marginLeft: '8px' }}>
              Add Brand
            </Button>
          )}
        </Form.Item> */}

        <Form.Item label="Số lượng">
          {sizes.map((size) => (
            <Form.Item key={size} label={`${''}`} name={size}>
              <InputNumber min={1} defaultValue={1} />
            </Form.Item>
          ))}
          {/* <Checkbox.Group options={defaultSizes} value={sizes} onChange={(checkedSizes) => setSizes(checkedSizes)} /> */}
        </Form.Item>

        <Form.Item label="Ảnh">
          <Upload name="image" listType="picture-card" fileList={fileList} onChange={handleImageChange} multiple={false}>
            {fileList.length < 5 && '+ Upload'}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default FormCreateProduct;
