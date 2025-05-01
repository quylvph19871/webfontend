import React, { useEffect, useState } from 'react';
import { updateProduct } from '../api/productApi';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axiosClient';
import '../styles/FormAddEdit.css';

const ProductEdit = () => {
    const [product, setProduct] = useState(null);
    const [newImages, setNewImages] = useState([]); // file mới
    const [imageLinks, setImageLinks] = useState([]); // link thủ công
    const [loading, setLoading] = useState(true); // Thêm state để theo dõi trạng thái tải sản phẩm

    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProduct(res.data);
                setLoading(false); // Dữ liệu đã tải, cập nhật trạng thái
            } catch (err) {
                console.error(err);
                alert('Lỗi khi tải sản phẩm!');
                setLoading(false); // Cập nhật trạng thái lỗi khi không thể tải sản phẩm
            }
        };
        fetchProduct();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (product) { // Kiểm tra product có dữ liệu
            if (['size', 'color'].includes(name)) {
                setProduct({ ...product, [name]: value.split(',').map(item => item.trim()) });
            } else {
                setProduct({ ...product, [name]: value });
            }
        }
    };

    const handleUploadImages = async () => {
        const uploaded = [];
        for (const file of newImages) {
            const formData = new FormData();
            formData.append('image', file);
            try {
                const res = await axios.post('/upload', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                uploaded.push(res.data.url);
            } catch (err) {
                alert('Lỗi upload ảnh');
            }
        }
        return uploaded;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const uploaded = await handleUploadImages();
        const allImages = [...product.images, ...uploaded, ...imageLinks];

        try {
            await updateProduct(id, { ...product, images: allImages }, token);
            alert('Cập nhật thành công!');
            navigate('/products');
        } catch (err) {
            alert('Lỗi cập nhật sản phẩm!');
        }
    };

    // Kiểm tra loading và product trước khi render form
    if (loading) return <p>Đang tải sản phẩm...</p>;
    if (!product) return <p>Không tìm thấy sản phẩm!</p>;

    return (
        <div className="form-wrapper">
            <h2>Sửa sản phẩm</h2>
            <form className="product-form" onSubmit={handleSubmit}>
                <input name="name_product" value={product.name_product} onChange={handleChange} placeholder="Tên sản phẩm" />
                <input name="price" type="number" value={product.price} onChange={handleChange} placeholder="Giá" />
                <input name="quantity" type="number" value={product.quantity} onChange={handleChange} placeholder="Số lượng" />
                <input name="size" value={product.size?.join(',')} onChange={handleChange} placeholder="Kích cỡ" />
                <input name="color" value={product.color?.join(',')} onChange={handleChange} placeholder="Màu sắc" />
                <input name="category" value={product.category} onChange={handleChange} placeholder="ID danh mục" />

                <label>Ảnh hiện tại:</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {product.images.map((url, index) => (
                        <img key={index} src={url} alt={`img-${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '6px' }} />
                    ))}
                </div>

                <label>Chọn thêm ảnh mới:</label>
                <input type="file" multiple onChange={(e) => setNewImages([...e.target.files])} />

                <label>Hoặc nhập link ảnh mới (ngăn cách bằng dấu phẩy):</label>
                <input
                    type="text"
                    onChange={(e) =>
                        setImageLinks(e.target.value.split(',').map(link => link.trim()))
                    }
                    placeholder="https://link1.jpg, https://link2.jpg"
                />

                <button type="submit">Cập nhật sản phẩm</button>
            </form>
        </div>
    );
};

export default ProductEdit;
