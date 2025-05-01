import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Chip,
    Grid,
    MenuItem,
    Paper,
    Select,
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
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
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

    const filteredProducts = products.filter(product => {
        const categoryMatch = categoryFilter
            ? product.category === categoryFilter || product.category?._id === categoryFilter
            : true;

        const statusMatch =
            statusFilter !== ''
                ? product.is_active === (statusFilter === 'active')
                : true;

        return categoryMatch && statusMatch;
    });

    return (
        <Box p={2} sx={{ backgroundColor: '#eee', minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Quản lý sản phẩm
                </Typography>

                <Grid container spacing={2} mb={2}>
                    <Grid item xs={6} md={6}>
                        <Select
                            fullWidth
                            displayEmpty
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <MenuItem value="">Tất cả danh mục</MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat._id} value={cat._id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <Select
                            fullWidth
                            displayEmpty
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="">Tất cả trạng thái</MenuItem>
                            <MenuItem value="active">Đang bán</MenuItem>
                            <MenuItem value="inactive">Ngừng bán</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button variant="contained" color="success" fullWidth onClick={() => navigate('/products/create')}>
                            + Thêm
                        </Button>
                    </Grid>
                </Grid>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên</TableCell>
                                <TableCell>Giá</TableCell>
                                <TableCell>Danh mục</TableCell>
                                <TableCell>Ảnh</TableCell>
                                <TableCell>Trạng thái</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.map((product) => (
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
