
let cart = [];
let products = [];


// Đặt mật khẩu cho người dùng có quyền thêm sản phẩm
const adminPassword = "admin123";
// Thay đổi mật khẩu tại đây
let isAdmin = false;
// Hàm kiểm tra quyền truy cập của người dùng
function checkAdminPassword(inputPassword) {
    if (inputPassword === adminPassword) {
        isAdmin = true; // Đặt isAdmin thành true nếu mật khẩu đúng
        alert('Access granted!');
    } else {
        alert('Incorrect password!'); // Thông báo nếu mật khẩu sai
    }
}


// Tải sản phẩm từ localStorage và giỏ hàng khi trang được tải
window.addEventListener('load', function() {
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }

    if (localStorage.getItem('products')) {
        products = JSON.parse(localStorage.getItem('products'));
    } else {
        // Không tạo sản phẩm tự động nữa
    }

    if (window.location.pathname.includes('product.html')) {
        displayProducts(); // Hiển thị sản phẩm trên trang product.html
    }

    if (window.location.pathname.includes('cart.html')) {
        displayCart(); // Hiển thị giỏ hàng trên trang cart.html
    }

    // Gán sự kiện cho nút "Add to Cart" nếu đang ở product.html
    if (window.location.pathname.includes('product.html')) {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
        applyPriceFilter(); // Áp dụng bộ lọc giá
    }
});

// Hiển thị sản phẩm trên trang
function displayProducts() {
    const productsSection = document.querySelector('.products');
    productsSection.innerHTML = ''; // Xóa sản phẩm hiện tại

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.setAttribute('data-price', product.price);

        productElement.innerHTML = `
            <h2>${product.name}</h2>
            <p>$${product.price}</p>
            <p>Note: ${product.note ? product.note : 'No note'}</p>
            <button class="add-to-cart">Add to Cart</button>
        `;

        productsSection.appendChild(productElement);
    });

    // Gán sự kiện cho các nút sau khi sản phẩm được tạo
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
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

//AAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// Thêm sản phẩm yêu cầu vào danh sách sản phẩm
const requestForm = document.getElementById('product-request-form');
const productPriceDisplay = document.getElementById('product-price-display');
if (requestForm) {
    requestForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // Khi người dùng nhập mật khẩu từ form

       
        // Kiểm tra mật khẩu
        const passwordInput = document.getElementById('admin-password').value;
        if (passwordInput !== adminPassword) {
            alert('Incorrect password. You do not have permission to add products.');
            return; // Dừng lại nếu mật khẩu không đúng
        } else {
            isAdmin = true; // Người dùng đã xác thực thành công
        }

        const productName = document.getElementById('product-name').value;
        const productNote = document.getElementById('product-note').value;

        // Xác định giá sản phẩm dựa trên số ký tự của tên sản phẩm
        let productPrice;
        switch (productName.length) {
            case 4:
                productPrice = 5;
                break;
            case 5:
                productPrice = 15;
                break;
            case 6:
                productPrice = 50;
                break;
            case 7:
                productPrice = 100;
                break;
            default:
                alert('Product name must be 4, 5, 6, or 7 characters long.');
                return; // Dừng lại nếu không thỏa điều kiện
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
    });

    // Hiển thị giá sản phẩm khi nhập tên sản phẩm
    document.getElementById('product-name').addEventListener('input', function() {
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

        productPriceDisplay.textContent = `Product Price: $${price}`;
    });
}

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
// Xử lý yêu cầu xóa sản phẩm
const removeForm = document.getElementById('product-remove-form');
if (removeForm) {
    removeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const productName = document.getElementById('remove-product-name').value;
        const adminPassword = document.getElementById('admin-password-remove').value; // Có thể thay đổi điều kiện xác thực mật khẩu

        // Kiểm tra mật khẩu admin (có thể thay đổi theo yêu cầu)
        if (adminPassword !== 'gj205') {
            alert('Incorrect admin password!');
            return;
        }

        // Tìm và xóa sản phẩm
        const productIndex = products.findIndex(product => product.name === productName);
        if (productIndex > -1) {
            products.splice(productIndex, 1); // Xóa sản phẩm tại vị trí chỉ định
            localStorage.setItem('products', JSON.stringify(products)); // Cập nhật sản phẩm trong localStorage
            alert('Product removed successfully!');
        } else {
            alert('Product not found!');
        }

        removeForm.reset(); // Đặt lại form sau khi gửi yêu cầu
    });
}
// Thêm sự kiện cho nút "Add/Remove Product"
document.getElementById('toggle-form-button').addEventListener('click', function() {
    const formContainer = document.getElementById('form-container');
    // Chuyển đổi trạng thái hiển thị của form
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block'; // Hiện form
    } else {
        formContainer.style.display = 'none'; // Ẩn form
    }
});

// Phần mã JavaScript trước đó...
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
    });
}

// Khởi tạo Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCZTpNGJmrIt2e26gi518vmrfiNUi7SO3k",
    authDomain: "gjproject-d2e54.firebaseapp.com",
    databaseURL: "https://gjproject-d2e54.firebaseio.com",
    projectId: "gjproject-d2e54",
    storageBucket: "gjproject-d2e54.appspot.com",
    messagingSenderId: "620937597723",
    appId: "1:620937597723:web:4fdae7978c7f32343539be"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Hàm thêm sản phẩm
function addProduct(product) {
    const productsRef = db.ref('products');
    productsRef.push(product);
}

// Hàm lấy sản phẩm
function getProducts() {
    const productsRef = db.ref('products');
    productsRef.on('value', (snapshot) => {
        const products = snapshot.val();
        displayProducts(products);
    });
}

// Hàm hiển thị sản phẩm
function displayProducts(products) {
    const displayArea = document.getElementById('product-price-display');
    displayArea.innerHTML = ''; // Xóa nội dung cũ
    for (const key in products) {
        if (products.hasOwnProperty(key)) {
            const product = products[key];
            displayArea.innerHTML += `<p>${product.name}: ${product.note}</p>`;
        }
    }
}

// Gọi hàm để lấy sản phẩm khi trang được tải
window.addEventListener('load', function() {
    getProducts();
});

// Sự kiện thêm sản phẩm
const requestForm = document.getElementById('product-request-form');
if (requestForm) {
    requestForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const productName = document.getElementById('product-name').value;
        const productNote = document.getElementById('product-note').value;
        const product = {
            name: productName,
            note: productNote
        };
        addProduct(product); // Gọi hàm để thêm sản phẩm
        requestForm.reset(); // Đặt lại form sau khi thêm sản phẩm
    });
}
