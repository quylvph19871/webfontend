import React, { useState, useEffect } from 'react';
import { createProduct } from '../api/productApi';
import { getCategories, createCategory } from '../api/categoryApi';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosClient';
import '../styles/FormAddEdit.css';

const ProductCreate = () => {
    const [product, setProduct] = useState({
        name_product: '',
        price: '',
        quantity: '',
        size: [],
        color: [],
        images: [],
        category: '',
        description: []
    });

    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showCategoryInput, setShowCategoryInput] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await getCategories(token);
            setCategories(res.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh mục:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'description') {
            const lines = value.split('\n').map(item => item.trim()).filter(Boolean);
            setProduct({ ...product, description: lines });
        } else if (['size', 'color'].includes(name)) {
            setProduct({ ...product, [name]: value.split(',').map(item => item.trim()) });
        } else {
            setProduct({ ...product, [name]: value });
        }
    };

    const handleImageUpload = async () => {
        if (imageFiles.length === 0) return [];

        const uploadedUrls = [];
        setUploading(true);

        for (const file of imageFiles) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const res = await axios.post('/upload', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                uploadedUrls.push(res.data.url);
            } catch (err) {
                console.error('Lỗi khi tải ảnh:', err);
                alert('Lỗi khi tải ảnh. Dừng tại: ' + file.name);
                break;
            }
        }

        setUploading(false);
        return uploadedUrls;
    };

    const validateForm = () => {
        const { name_product, price, quantity, category, description } = product;
        if (!name_product || !price || !quantity || !category || !description) {
            alert("Vui lòng nhập đầy đủ các trường bắt buộc!");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const uploadedImages = await handleImageUpload();
        const normalizedSizes = product.size.map(s => s.toUpperCase());

        const dataToSend = {
            ...product,
            price: Number(product.price),
            quantity: Number(product.quantity),
            size: normalizedSizes,
            images: uploadedImages
        };

        try {
            await createProduct(dataToSend, token);
            alert('Thêm sản phẩm thành công!');
            navigate('/products');
        } catch (err) {
            console.error("Lỗi khi thêm sản phẩm:", err);
            const errorMsg = err.response?.data?.message || err.message || "Lỗi không xác định";
            alert('Lỗi khi thêm sản phẩm: ' + errorMsg);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return alert("Vui lòng nhập tên danh mục");

        try {
            await createCategory(newCategoryName, token);
            alert("Thêm danh mục thành công!");
            setNewCategoryName('');
            fetchCategories();
        } catch (err) {
            console.error("Lỗi khi thêm danh mục:", err);
            alert(err.response?.data?.message || "Lỗi khi thêm danh mục");
        }
    };

    return (
        <div className="form-wrapper" style={{ maxWidth: '700px', margin: 'auto', padding: '2rem' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>🎯 Thêm Sản Phẩm Mới</h2>

            <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
                <button
                    type="button"
                    onClick={() => setShowCategoryInput(!showCategoryInput)}
                    style={{ padding: '6px 12px', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {showCategoryInput ? 'Đóng' : '➕ Thêm danh mục'}
                </button>
            </div>

            {showCategoryInput && (
                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Nhập tên danh mục mới"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        style={{ marginRight: '0.5rem' }}
                    />
                    <button type="button" onClick={handleAddCategory}>✔ Lưu</button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="product-form" style={{ display: 'grid', gap: '1rem' }}>
                <fieldset>
                    <label>Tên sản phẩm *</label>
                    <input type="text" name="name_product" onChange={handleChange} />
                </fieldset>

                <fieldset>
                    <label>Giá *</label>
                    <input type="number" name="price" onChange={handleChange} />
                </fieldset>

                <fieldset>
                    <label>Số lượng *</label>
                    <input type="number" name="quantity" onChange={handleChange} />
                </fieldset>

                <fieldset>
                    <label>Kích cỡ (ví dụ: S,M,L,XL)</label>
                    <input type="text" name="size" onChange={handleChange} />
                </fieldset>

                <fieldset>
                    <label>Màu sắc (ngăn cách bằng dấu phẩy)</label>
                    <input type="text" name="color" onChange={handleChange} />
                </fieldset>

                <fieldset>
                    <label>Danh mục *</label>
                    <select name="category" value={product.category} onChange={handleChange}>
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </fieldset>

                <fieldset>
                    <label>Mô tả sản phẩm (mỗi dòng là 1 đoạn mô tả)</label>
                    <textarea
                        name="description"
                        rows={6}
                        onChange={(e) => {
                            const lines = e.target.value
                                .split('\n')
                                .map(line => line.trim())
                                .filter(Boolean);
                            setProduct(prev => ({ ...prev, description: lines }));
                        }}
                    />
                </fieldset>

                <fieldset>
                    <label>Chọn ảnh sản phẩm:</label>
                    <input type="file" multiple onChange={(e) => setImageFiles([...e.target.files])} />
                </fieldset>

                <button type="submit" disabled={uploading}>
                    {uploading ? 'Đang tải ảnh...' : '✅ Thêm sản phẩm'}
                </button>
            </form>
        </div>
    );
};

export default ProductCreate;
