import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { getAllProducts, toggleProductStatus } from '../api/productApi';
import { getCategories } from '../api/categoryApi';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchProducts = useCallback(async () => {
        try {
            const res = await getAllProducts(token);
            setProducts(res.data);
        } catch (err) {
            console.error("Lỗi khi tải sản phẩm:", err);
        }
    }, [token]);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await getCategories(token);
            setCategories(res.data);
        } catch (err) {
            console.error("Lỗi khi tải danh mục:", err);
        }
    }, [token]);

    const handleToggleStatus = async (productId, currentStatus) => {
        try {
            await toggleProductStatus(productId, !currentStatus, token);
            fetchProducts();
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [fetchProducts, fetchCategories]);

    return (
        <Box p={2} sx={{ backgroundColor: '#eee', minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Quản lý sản phẩm
                </Typography>

                <Button
                    variant="contained"
                    color="success"
                    onClick={() => navigate('/products/create')}
                    sx={{ mb: 2 }}
                >
                    + Thêm sản phẩm
                </Button>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên</TableCell>
                                <TableCell>Giá</TableCell>
                                <TableCell>Danh mục</TableCell>
                                <TableCell>Ảnh</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>{product.name_product}</TableCell>
                                    <TableCell>{product.price}₫</TableCell>
                                    <TableCell>
                                        {
                                            typeof product.category === 'object'
                                                ? product.category.name
                                                : categories.find(cat => cat._id === product.category)?.name || 'N/A'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <img
                                            src={product.images[0]}
                                            alt="product"
                                            width="50"
                                            height="50"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={product.is_active ? 'Đang bán' : 'Ngừng bán'}
                                            color={product.is_active ? 'success' : 'error'}
                                            onClick={() => handleToggleStatus(product._id, product.is_active)}
                                            clickable
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={() => navigate(`/products/edit/${product._id}`)}
                                        >
                                            Sửa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default ProductList;
