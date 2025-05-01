import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { getAllProducts } from '../api/productApi';
import { getCategories } from '../api/categoryApi';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
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

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [fetchProducts, fetchCategories]);

    return (
        <Box p={2} sx={{ backgroundColor: '#eee', minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ p: 3, maxWidth: '100%', margin: 'auto' }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Danh sách sản phẩm
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên</TableCell>
                                <TableCell>Giá</TableCell>
                                <TableCell>Đã bán</TableCell>
                                <TableCell>Đánh giá</TableCell>
                                <TableCell>Số lượng</TableCell>
                                <TableCell>Kích cỡ</TableCell>
                                <TableCell>Màu sắc</TableCell>
                                <TableCell>Danh mục</TableCell>
                                <TableCell>Ảnh</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow
                                    key={product._id}
                                    style={{
                                        backgroundColor: product.quantity < 10 ? '#f8d7da' : 'transparent',
                                    }}
                                >
                                    <TableCell>{product.name_product}</TableCell>
                                    <TableCell>{product.price}₫</TableCell>
                                    <TableCell>{product.sold}</TableCell>
                                    <TableCell>{product.rating}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell>{product.size?.join(", ")}</TableCell>
                                    <TableCell>{product.color?.join(", ")}</TableCell>
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
