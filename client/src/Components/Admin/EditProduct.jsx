import { Button, Checkbox, Form, Input, InputNumber, Upload, Select, message } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CONFIG from '../../config';

function EditProduct() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [product, setProduct] = useState([]);
  const { id } = useParams(); // Lấy giá trị `id` từ URL
  const [sizes, setSizes] = useState({});
  const [initialImageUrls, setInitialImageUrls] = useState([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState([]);
  const [sizeQuantities, setSizeQuantities] = useState({});
  useEffect(() => {
    axios
      .get(`${CONFIG.API_URL}products/${id}/edit`) // Sử dụng `id` để truy vấn sản phẩm cần sửa đổi
      .then((response) => {
        setProduct(response.data.productById);

        const dataProductId = response.data.productById;

        form.setFieldsValue({
          name: dataProductId.name,
          price: dataProductId.price,
          description: dataProductId.description,
          category: dataProductId.category,
          brand: dataProductId.brand,
          imageUrl: dataProductId.imageUrl,
        });

        const existingSizes = dataProductId.sizes;
        const result = existingSizes.reduce((obj, item) => {
          obj[item.name] = item.quantity;
          return obj;
        }, {});
        setSizes(result);

        const existingImg = dataProductId.imageUrl;
        const fileListFromServer = existingImg.map((image, index) => ({
          url: image, // Assume `image` là URL của ảnh
        }));
        setFileList(fileListFromServer);

        const initialImageUrls = existingImg;
        setInitialImageUrls(initialImageUrls);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  //Lấy ra các Url vừa xóa

  useEffect(() => {
    const deletedImageUrls = initialImageUrls.filter((url) => !fileList.some((file) => file.url === url));

    setDeletedImageUrls(deletedImageUrls);
  }, [fileList, initialImageUrls]);

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleCheckboxChange = (sizeName, checked) => {
    if (checked) {
      setSizeQuantities((prevQuantities) => ({
        ...prevQuantities,
        [sizeName]: 0,
      }));
    } else {
      setSizeQuantities((prevQuantities) => {
        const { [sizeName]: deletedQuantity, ...newQuantities } = prevQuantities;
        return newQuantities;
      });
    }
  };

  const handleQuantityChange = (sizeName, value) => {
    setSizeQuantities((prevQuantities) => ({
      ...prevQuantities,
      [sizeName]: value,
    }));
  };

  const isChecked = (sizeName) => {
    return sizeQuantities.hasOwnProperty(sizeName);
  };

  // Xử lý submit
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // data xử lý ảnh
      const data = { ...values, sizes: sizeQuantities };
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append('images', file.originFileObj);
      });

      formData.append('data', JSON.stringify(data));

      formData.append('deletedImages', JSON.stringify(deletedImageUrls));
      console.log(deletedImageUrls);
      console.log([...formData]);
      await axios.put(`${CONFIG.API_URL}products/${id}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log([...formData]);
      message.success('Product updated successfully');

      form.resetFields();
    } catch (error) {
      console.error(error);
      // show error message
    } finally {
      setLoading(false);
      navigate('/admin/quan-ly-san-pham');
    }
  };

  return (
    <div>
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input the name of the product!',
            },
          ]}
        >
          <Input placeholder="Tên sản phẩm" />
        </Form.Item>

        <Form.Item
          label="Giá"
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
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            {
              required: true,
              message: 'Please input the description of the product!',
            },
          ]}
        >
          <Input.TextArea placeholder="Nhập mô tả" />
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

        {/* <Form.Item
          label="Thương hiệu"
          name="brand"
          rules={[
            {
              required: true,
              message: 'Please input the brand of the product!',
            },
          ]}
        >
          <Input placeholder=" Nhập thương hiệu" />
        </Form.Item> */}

        <Form.Item label="Số lượng">
          <ul style={{ listStyle: 'none' }}>
            {Object.entries(sizes).map(([sizeName, sizeQuantity]) =>
              sizeQuantity > 0 ? (
                <li key={sizeName}>
                  <Checkbox onChange={(e) => handleCheckboxChange(sizeName, e.target.checked)} checked={isChecked(sizeName)}>
                    {'Thay đổi '}{' '}
                    <span style={{ marginLeft: '10px' }}>
                      {' '}
                      ( <span style={{ color: 'blue' }}> Số lượng </span>: {sizeQuantity} )
                    </span>
                  </Checkbox>
                  {isChecked(sizeName) && (
                    <div style={{ marginLeft: '20px', padding: '10px 0px' }}>
                      <span>Số sản phẩm hiện có </span>
                      <InputNumber
                        // value={sizeQuantities[sizeName]}

                        defaultValue={sizeQuantity}
                        onChange={(value) => handleQuantityChange(sizeName, value)}
                        style={{ marginLeft: '10px' }}
                      />
                    </div>
                  )}
                </li>
              ) : (
                <></>
              ),
            )}
          </ul>
        </Form.Item>

        <Form.Item label="Image">
          <Upload name="image" listType="picture-card" fileList={fileList} onChange={handleImageChange} multiple={false}>
            {fileList.length < 5 && '+ Upload'}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật thông tin
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default EditProduct;
