const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Dữ liệu mẫu sản phẩm
const products = [
    { id: 1, title: 'iPhone 15 Pro', price: 999, slug: 'iphone-15-pro', category: 'Electronics' },
    { id: 2, title: 'Samsung Galaxy S24', price: 899, slug: 'samsung-galaxy-s24', category: 'Electronics' },
    { id: 3, title: 'MacBook Pro 14"', price: 1999, slug: 'macbook-pro-14', category: 'Computers' },
    { id: 4, title: 'AirPods Pro', price: 249, slug: 'airpods-pro', category: 'Accessories' },
    { id: 5, title: 'iPad Air', price: 599, slug: 'ipad-air', category: 'Tablets' },
];

// Type guard kiểm tra string
const isString = (value) => typeof value === 'string';

// GET /products - List products with query filters
app.get('/products', (req, res) => {
    const { title, maxPrice, minPrice, slug } = req.query;

    let result = [...products];

    // Lọc theo title (includes, không phân biệt hoa thường)
    if (title && isString(title)) {
        const keyword = title.toLowerCase();
        result = result.filter(p => p.title.toLowerCase().includes(keyword));
    }

    // Lọc theo maxPrice (nhỏ hơn hoặc bằng)
    if (maxPrice && isString(maxPrice)) {
        const max = Number(maxPrice);
        if (!Number.isNaN(max)) {
            result = result.filter(p => p.price <= max);
        }
    }

    // Lọc theo minPrice (lớn hơn hoặc bằng)
    if (minPrice && isString(minPrice)) {
        const min = Number(minPrice);
        if (!Number.isNaN(min)) {
            result = result.filter(p => p.price >= min);
        }
    }

    // Lọc theo slug (khớp chính xác, không phân biệt hoa thường)
    if (slug && isString(slug)) {
        const slugFilter = slug.toLowerCase();
        result = result.filter(p => p.slug.toLowerCase() === slugFilter);
    }

    res.json({
        success: true,
        count: result.length,
        data: result,
    });
});

// GET /products/:id - Get single product by ID
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    const productId = Number(id);

    if (Number.isNaN(productId)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid product ID',
        });
    }

    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({
            success: false,
            error: 'Product not found',
        });
    }

    res.json({
        success: true,
        data: product,
    });
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

