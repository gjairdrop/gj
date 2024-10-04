let cart = [];
let products = [
    { name: '0x000', price: 1 }, { name: '0x111', price: 1 }, { name: '0x222', price: 1 },
    { name: '0x333', price: 1 }, { name: '0x444', price: 1 }, { name: '0x555', price: 1 },
    { name: '0x666', price: 1 }, { name: '0x777', price: 1 }, { name: '0x888', price: 1 },
    { name: '0x999', price: 1 }, { name: '0x012', price: 1 }, { name: '0x123', price: 1 },
    { name: '0x234', price: 1 }, { name: '0x345', price: 1 }, { name: '0x456', price: 1 },
    { name: '0x567', price: 1 }, { name: '0x678', price: 1 }, { name: '0x789', price: 1 },
    { name: '0x000', price: 5 }, { name: '0x1111', price: 5 }, { name: '0x2222', price: 5 },
    { name: '0x3333', price: 5 }, { name: '0x4444', price: 5 }, { name: '0x5555', price: 5 },
    { name: '0x6666', price: 5 }, { name: '0x7777', price: 5 }, { name: '0x8888', price: 5 },
    { name: '0x9999', price: 5 }, { name: '0x0000', price: 15 }, { name: '0x11111', price: 15 },
    { name: '0x22222', price: 15 }, { name: '0x33333', price: 15 }, { name: '0x44444', price: 15 },
    { name: '0x55555', price: 15 }, { name: '0x66666', price: 15 }, { name: '0x77777', price: 15 },
    { name: '0x88888', price: 15 }, { name: '0x99999', price: 15 }, { name: '0x000000', price: 50 },
    { name: '0x111111', price: 50 }, { name: '0x222222', price: 50 }, { name: '0x333333', price: 50 },
    { name: '0x444444', price: 50 }, { name: '0x555555', price: 50 }, { name: '0x666666', price: 50 },
    { name: '0x777777', price: 50 }, { name: '0x888888', price: 50 }, { name: '0x999999', price: 50 },
];

// Hiển thị sản phẩm trên trang
function displayProducts() {
    const productsSection = document.querySelector('.products');
    productsSection.innerHTML = ''; // Xóa sản phẩm hiện tại

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.setAttribute('data-price', product.price); // Gán data-price

        productElement.innerHTML = `
            <h2>${product.name}</h2>
            <p>$${product.price}</p>
            <button class="add-to-cart">Add to Cart</button>
        `;

        productsSection.appendChild(productElement);
    });

    // Gán sự kiện cho các nút sau khi sản phẩm được tạo
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Gọi hàm lọc giá ngay sau khi hiển thị sản phẩm
    applyPriceFilter();
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(event) {
    const productElement = event.target.parentElement;
    const product = {
        name: productElement.querySelector('h2').textContent,
        price: parseFloat(productElement.querySelector('p').textContent.replace('$', ''))
    };

    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart)); // Lưu giỏ hàng vào localStorage
    alert('Item added to cart!');
}

// Hiển thị giỏ hàng
function displayCart() {
    const cartSection = document.querySelector('.cart');
    cartSection.innerHTML = ''; // Xóa giỏ hàng hiện tại

    if (cart.length === 0) {
        cartSection.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        let total = 0;

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <h2>${item.name}</h2>
                <p>$${item.price}</p>
                <button class="remove-from-cart" data-index="${index}">Remove</button>
            `;
            cartSection.appendChild(cartItem);
            total += item.price; // Tính tổng giá
        });

        const totalElement = document.createElement('div');
        totalElement.classList.add('cart-total');
        totalElement.innerHTML = `<h2>Total: $${total}</h2>`;
        cartSection.appendChild(totalElement);

        // Nút thanh toán
        const checkoutButton = document.createElement('button');
        checkoutButton.textContent = 'Checkout';
        checkoutButton.addEventListener('click', checkout);
        cartSection.appendChild(checkoutButton);
    }

    // Gán sự kiện cho nút xóa sản phẩm
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(event) {
    const index = event.target.getAttribute('data-index');
    cart.splice(index, 1); // Xóa sản phẩm tại vị trí đã chỉ định
    localStorage.setItem('cart', JSON.stringify(cart)); // Cập nhật giỏ hàng trong localStorage
    displayCart(); // Cập nhật giỏ hàng hiển thị
}

// Thanh toán
function checkout() {
    alert('Thank you for your purchase!');
    cart = []; // Xóa giỏ hàng
    localStorage.setItem('cart', JSON.stringify(cart)); // Cập nhật giỏ hàng trong localStorage
    displayCart(); // Cập nhật giỏ hàng hiển thị
}

// Hiển thị giá sản phẩm khi nhập tên sản phẩm
document.getElementById('product-name')?.addEventListener('input', function() {
    const nameLength = this.value.length;
    let price = '';

    switch (nameLength) {
        case 4:
            price = 5;
            break;
        case 5:
            price = 15;
            break;
        case 6:
            price = 50;
            break;
        case 7:
            price = 100;
            break;
        default:
            price = 'Invalid length';
    }

    document.getElementById('product-price-display').textContent = `Product Price: $${price}`;
});

// Tính năng lọc sản phẩm theo giá
function applyPriceFilter() {
    const priceFilter = document.getElementById('price-filter');
    const productElements = document.querySelectorAll('.product');

    priceFilter.addEventListener('change', function() {
        const filterValue = this.value;

        productElements.forEach(product => {
            const productPrice = parseFloat(product.getAttribute('data-price'));

            if (filterValue === 'all') {
                product.style.display = 'block';
            } else if (filterValue === '1-10' && productPrice >= 1 && productPrice <= 10) {
                product.style.display = 'block';
            } else if (filterValue === '10-20' && productPrice > 10 && productPrice <= 20) {
                product.style.display = 'block';
            } else if (filterValue === '20-50' && productPrice > 20 && productPrice <= 50) {
                product.style.display = 'block';
            } else if (filterValue === '50-100' && productPrice > 50 && productPrice <= 100) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });
}

// Phần mã JavaScript trước đó...
const requestForm = document.getElementById('request-form');
if (requestForm) {
    requestForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const productName = document.getElementById('product-name').value;
        const productNote = document.getElementById('product-note').value;
        const productPrice = parseFloat(document.getElementById('product-price').value); // Lấy giá từ trường input

        // Kiểm tra giá sản phẩm có hợp lệ không
        if (isNaN(productPrice) || productPrice <= 0) {
            alert('Please enter a valid price greater than 0.');
            return; // Dừng lại nếu giá không hợp lệ
        }

        const newProduct = {
            name: productName,
            price: productPrice,
            note: productNote
        };

        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products)); // Lưu danh sách sản phẩm vào localStorage
        alert('Product requested successfully!');
        requestForm.reset(); // Đặt lại form sau khi gửi yêu cầu

        // Hiển thị lại sản phẩm sau khi thêm sản phẩm mới
        displayProducts();
    });
}

// Khởi động hiển thị sản phẩm
displayProducts();
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    
    if (window.scrollY > 50) { // Nếu cuộn xuống quá 50px
        header.classList.add('hidden'); // Thêm lớp để làm mờ tiêu đề
    } else {
        header.classList.remove('hidden'); // Xóa lớp khi cuộn lên
    }
});
// Theo dõi vị trí cuộn
window.addEventListener('scroll', () => {
    const productElements = document.querySelectorAll('.product');
    const windowHeight = window.innerHeight;

    productElements.forEach(product => {
        const productRect = product.getBoundingClientRect();

        // Kiểm tra nếu sản phẩm đã lướt qua phần hiển thị
        if (productRect.top < 0 && Math.abs(productRect.top) < windowHeight) {
            product.classList.add('faded');
        } else {
            product.classList.remove('faded');
        }
    });
});
