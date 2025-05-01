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
    TextField,
    Typography,
} from '@mui/material';
import { getAllProducts, searchProducts, toggleProductStatus } from '../api/productApi';
import { getCategories } from '../api/categoryApi';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [query, setQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortOrder, setSortOrder] = useState(null); // 'asc' | 'desc' | null
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchProducts = useCallback(async () => {
        try {
            const res = await getAllProducts(token);
            console.log("Sản phẩm lấy được:", res.data);
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

    const handleSearch = async () => {
        try {
            if (!query.trim()) {
                fetchProducts();
                return;
            }
            const res = await searchProducts(query, token);
            setProducts(res.data);
        } catch (err) {
            console.error("Lỗi tìm kiếm:", err);
        }
    };

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
        console.log("Danh sách sản phẩm đang hiển thị:", products);
    }, [fetchProducts, fetchCategories]);

    const toggleSortOrder = () => {
        setSortOrder((prev) =>
            prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'
        );
    };

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


    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOrder === 'asc') return a.sold - b.sold;
        if (sortOrder === 'desc') return b.sold - a.sold;
        return 0;
    });

    return (
        <Box p={2} sx={{ backgroundColor: '#eee', minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ p: 3, maxWidth: '100%', margin: 'auto' }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Quản lý sản phẩm
                </Typography>

                <Grid container spacing={2} alignItems="center" mb={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Tìm kiếm sản phẩm"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
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
                    <Grid item xs={6} md={3}>
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
                    <Grid item xs={6} md={1.5}>
                        <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
                            Tìm
                        </Button>
                    </Grid>
                    <Grid item xs={6} md={1.5}>
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
                                <TableCell
                                    onClick={toggleSortOrder}
                                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Đã bán {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : ''}
                                </TableCell>
                                <TableCell>Đánh giá</TableCell>
                                <TableCell>Số lượng</TableCell>
                                <TableCell>Kích cỡ</TableCell>
                                <TableCell>Màu sắc</TableCell>
                                <TableCell>Danh mục</TableCell>
                                <TableCell>Ảnh</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedProducts.map((product) => (
                                <TableRow
                                    key={product._id}
                                    style={{
                                        backgroundColor: product.quantity < 10 ? '#f8d7da' : 'transparent', // Đổi màu nếu quantity < 10
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
