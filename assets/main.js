// Data Produk
const products = [
    {
        id: 1,
        name: "Banner",
        price: 50000,
        description: "Banner ukuran standar dengan kualitas tinggi untuk berbagai keperluan promosi.",
        image: "img/banner.jpg"
    },
    {
        id: 2,
        name: "Buku Yasin",
        price: 15000,
        description: "Buku Yasin dengan kertas berkualitas dan desain yang menarik.",
        image: "img/buku-yasin.jpg"
    },
    {
        id: 3,
        name: "Undangan",
        price: 25000,
        description: "Undangan dengan berbagai pilihan desain dan kertas berkualitas.",
        image: "img/undangan.jpg"
    },
    {
        id: 4,
        name: "Stempel Kayu",
        price: 75000,
        description: "Stempel kayu dengan hasil cetak yang tajam dan tahan lama.",
        image: "img/stempel-kayu.jpg"
    },
    {
        id: 5,
        name: "Stempel Flash",
        price: 100000,
        description: "Stempel flash dengan desain modern dan praktis digunakan.",
        image: "img/stempel-flash.jpg"
    },
    {
        id: 6,
        name: "Nota",
        price: 20000,
        description: "Nota dengan berbagai ukuran dan kualitas kertas yang baik.",
        image: "img/nota.jpg"
    }
];

// DOM Elements
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const searchInput = document.getElementById('search-input');
const productsGrid = document.getElementById('products-grid');
const productModal = document.getElementById('product-modal');
const closeModal = document.getElementById('close-modal');
const modalBody = document.getElementById('modal-body');
const cartSidebar = document.getElementById('cart-sidebar');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const reviewForm = document.getElementById('review-form');
const notification = document.getElementById('notification');
const orderForm = document.getElementById('order-form-details');

// Initialize Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Toggle Mobile Menu
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close Mobile Menu on Link Click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Load Products on Product Page
if (productsGrid) {
    loadProducts(products);
    
    // Search Functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
        loadProducts(filteredProducts);
    });
}

// Load Products to Grid
function loadProducts(productsArray) {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    productsArray.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>Rp ${product.price.toLocaleString('id-ID')}</p>
            </div>
        `;
        
        productCard.addEventListener('click', () => {
            showProductDetail(product);
        });
        
        productsGrid.appendChild(productCard);
    });
}

// Show Product Detail Modal
function showProductDetail(product) {
    modalBody.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-img">
                <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <p class="product-price">Rp ${product.price.toLocaleString('id-ID')}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-form">
                    <div class="form-group">
                        <label for="pickup-date">Tanggal Ambil</label>
                        <input type="date" id="pickup-date" required>
                    </div>
                    <div class="form-group">
                        <label for="pickup-time">Waktu Ambil</label>
                        <input type="time" id="pickup-time" required>
                    </div>
                    <div class="form-group">
                        <label for="quantity">Jumlah</label>
                        <input type="number" id="quantity" min="1" value="1" required>
                    </div>
                    <button class="btn-primary" id="add-to-cart">Tambah ke Keranjang</button>
                    <button class="btn-primary" id="buy-now">Beli Sekarang</button>
                </div>
            </div>
        </div>
    `;
    
    productModal.style.display = 'flex';
    
    // Add to Cart Button
    document.getElementById('add-to-cart').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        const pickupDate = document.getElementById('pickup-date').value;
        const pickupTime = document.getElementById('pickup-time').value;
        
        if (!pickupDate || !pickupTime) {
            alert('Harap isi tanggal dan waktu pengambilan');
            return;
        }
        
        addToCart(product, quantity, pickupDate, pickupTime);
        productModal.style.display = 'none';
    });
    
    // Buy Now Button
    document.getElementById('buy-now').addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        const pickupDate = document.getElementById('pickup-date').value;
        const pickupTime = document.getElementById('pickup-time').value;
        
        if (!pickupDate || !pickupTime) {
            alert('Harap isi tanggal dan waktu pengambilan');
            return;
        }
        
        addToCart(product, quantity, pickupDate, pickupTime);
        productModal.style.display = 'none';
        
        // Scroll to order form
        if (document.getElementById('order-form')) {
            document.getElementById('order-form').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Close Modal
closeModal.addEventListener('click', () => {
    productModal.style.display = 'none';
});

// Close Modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.style.display = 'none';
    }
});

// Cart Functionality
cartToggle.addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.add('active');
    updateCartDisplay();
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
});

// Add to Cart
function addToCart(product, quantity, pickupDate, pickupTime) {
    const existingItem = cart.find(item => 
        item.id === product.id && 
        item.pickupDate === pickupDate && 
        item.pickupTime === pickupTime
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity,
            pickupDate,
            pickupTime
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Produk berhasil ditambahkan ke keranjang');
}

// Update Cart Count
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update Cart Display
function updateCartDisplay() {
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Keranjang belanja kosong</p>';
        cartTotalPrice.textContent = 'Rp 0';
        return;
    }
    
    let totalPrice = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</p>
                <p>Ambil: ${item.pickupDate} ${item.pickupTime}</p>
            </div>
            <div class="cart-item-actions">
                <button class="remove-item" data-index="${index}">❌</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotalPrice.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay();
        });
    });
}

// Checkout Button
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Keranjang belanja kosong');
            return;
        }
        
        if (document.getElementById('order-form')) {
            document.getElementById('order-form').scrollIntoView({ behavior: 'smooth' });
            cartSidebar.classList.remove('active');
        } else {
            window.location.href = 'product.html#order-form';
        }
    });
}

// Review Form Submission
if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('review-name').value;
        const email = document.getElementById('review-email').value;
        const message = document.getElementById('review-message').value;
        
        // In a real application, you would send this data to a server
        console.log('Review submitted:', { name, email, message });
        
        // Show notification
        showNotification('Terima kasih atas ulasan Anda!');
        
        // Reset form
        reviewForm.reset();
    });
}

// Order Form Submission
if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('customer-name').value;
        const phone = document.getElementById('customer-phone').value;
        const pickupDate = document.getElementById('pickup-date').value;
        const pickupTime = document.getElementById('pickup-time').value;
        const notes = document.getElementById('notes').value;
        
        // In a real application, you would send this data to a server
        console.log('Order submitted:', { name, phone, pickupDate, pickupTime, notes, cart });
        
        // Show confirmation
        alert('Pesanan Anda telah berhasil dikonfirmasi!');
        
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Reset form
        orderForm.reset();
        
        // Redirect to home page
        window.location.href = 'index.html';
    });
}

// Show Notification
function showNotification(message) {
    if (!notification) return;
    
    notification.querySelector('p').textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // If on product page, update cart display
    if (cartItems) {
        updateCartDisplay();
    }
});

// Navbar scroll + animasi fitur + animasi umum
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  const featureItems = document.querySelectorAll(".feature-item");
  const animatables = document.querySelectorAll("[data-animate]");

  // Navbar scroll effect
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);

  // Animasi fitur
  featureItems.forEach(item => {
    if (item.getBoundingClientRect().top < window.innerHeight - 100) {
      item.classList.add("visible");
    }
  });

  // Efek muncul umum
  animatables.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 80) {
      el.classList.add("visible");
    }
  });
});

// Smooth scroll link
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector(link.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Hero fade saat load
window.addEventListener("load", () => {
  const hero = document.querySelector(".hero");
  if (hero) hero.classList.add("fade-in");
});
<!-- JAVASCRIPT -->
  <script>
    document.getElementById('contactForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Terima kasih atas ulasan Anda!');
      this.reset();
    });
// contact
document.getElementById('contactForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Terima kasih atas ulasan Anda!');
      this.reset();
    });
  </script>

