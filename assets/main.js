// Data Produk
const products = [
    {
        id: 1,
        name: "Banner",
        price: 20000,
        description: "Banner ukuran standar dengan kualitas tinggi untuk berbagai keperluan promosi.",
        image: "img/banner.jpg"
    },
    {
        id: 2,
        name: "Buku Yasin",
        price: 8500,
        description: "Buku Yasin dengan kertas berkualitas dan desain yang menarik, 1 pcs = Rp 8.500 .",
        image: "img/buku-yasin.jpg"
    },
    {
        id: 3,
        name: "Undangan",
        price: 1500,
        description: "Undangan dengan berbagai pilihan desain dan kertas berkualitas, Harga mulai dari Rp 1.500 - Rp 4.000.",
        image: "img/undangan.jpg"
    },
    {
        id: 4,
        name: "Stempel Kayu",
        price: 40000,
        description: "Stempel kayu dengan hasil cetak yang tajam dan tahan lama, Harga mulai dari Rp 40.000 - Rp 50.000.",
        image: "img/stempel-kayu.jpg"
    },
    {
        id: 5,
        name: "Stempel Flash",
        price: 90000,
        description: "Stempel flash dengan desain modern dan praktis digunakan, Harga mulai dari Rp 90.000 - Rp 150.000.",
        image: "img/stempel-flash.jpg"
    },
    {
        id: 6,
        name: "Nota",
        price: 150000,
        description: "Nota dengan berbagai ukuran dan kualitas kertas yang baik. 1 ply = Rp 150.000, 2 ply = Rp 290.000, 3 ply = Rp 420.000.",
        image: "img/nota.jpg"
    }
];

// DOM Elements (aman terhadap null)
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
const orderForm = document.getElementById('order-form-details');

// Initialize Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Helper: Show Notification (dibuat dinamis jika tidak ada #notification)
function showNotification(message) {
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            display: none;
        `;
        const msg = document.createElement('p');
        msg.textContent = message;
        notification.appendChild(msg);
        document.body.appendChild(notification);
    }
    
    const msgEl = notification.querySelector('p');
    if (msgEl) {
        msgEl.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

// Toggle Mobile Menu
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close Mobile Menu on Link Click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    });
});

// Load Products on Product Page
if (productsGrid) {
    loadProducts(products);
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );
            loadProducts(filteredProducts);
        });
    }
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
                <img src="${product.image}" alt="${product.name}" onerror="this.parentElement.innerHTML='<div class=\\'no-image\\'>Gambar tidak tersedia</div>'">
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
    if (!modalBody || !productModal) return;

    modalBody.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-img">
                <img src="${product.image}" alt="${product.name}" onerror="this.parentElement.innerHTML='<div class=\\'no-image\\'>Gambar tidak tersedia</div>'">
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <p class="product-price">Rp ${product.price.toLocaleString('id-ID')}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-form">
                    <div class="form-group">
                        <label for="modal-name">Nama Lengkap</label>
                        <input type="text" class="modal-name" placeholder="Nama Anda" required>
                    </div>
                    <div class="form-group">
                        <label for="modal-phone">Nomor WhatsApp</label>
                        <input type="tel" class="modal-phone" placeholder="Nomor Whatsapp Anda" required>
                    </div>

                    <!-- Pilihan Pengiriman -->
                    <div class="form-group">
                        <label>Pengiriman</label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;margin-top:6px;">
                            <span style="text-align:left;flex:1;">Diambil</span>
                            <input type="radio" name="modal-delivery" class="modal-delivery" value="pickup" checked>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;margin-top:6px;">
                            <span style="text-align:left;flex:1;">Diantar</span>
                            <input type="radio" name="modal-delivery" class="modal-delivery" value="delivery">
                        </label>
                    </div>

                    <!-- Tanggal & Waktu Ambil -->
                    <div class="pickup-fields">
                        <div class="form-group">
                            <label for="modal-pickup-date">Tanggal Ambil</label>
                            <input type="date" class="modal-pickup-date" required>
                        </div>
                        <div class="form-group">
                            <label for="modal-pickup-time">Waktu Ambil</label>
                            <input type="time" class="modal-pickup-time" required>
                        </div>
                    </div>

                    <!-- Alamat Pengiriman -->
                    <div class="delivery-fields" style="display:none;">
                        <div class="form-group">
                            <label for="modal-address">Alamat Lengkap</label>
                            <textarea class="modal-address" placeholder="Link Alamat Anda" required></textarea>
                        </div>
                        <div class="form-group">
                            <a href="https://maps.app.goo.gl/akf3aTENEpyTFo1A6" target="_blank" style="color:#1e90ff;text-decoration:underline;">Lihat Lokasi Toko</a>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="modal-quantity">Jumlah</label>
                        <input type="number" class="modal-quantity" min="1" value="1" required>
                    </div>
                    <div class="form-group">
                        <label for="modal-notes">Catatan (Opsional)</label>
                        <textarea class="modal-notes" placeholder="Warna, ukuran, dll."></textarea>
                    </div>

                    <!-- Pilihan Pembayaran -->
                    <div class="form-group">
                        <label>Metode Pembayaran</label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;margin-top:6px;">
                            <span style="text-align:left;flex:1;">COD (Bayar di Tempat)</span>
                            <input type="radio" name="modal-payment" class="modal-payment" value="cod" checked>
                        </label>
                        <label style="display:flex;align-items:center;gap:10px;cursor:pointer;margin-top:6px;">
                            <span style="text-align:left;flex:1;">Transfer Bank</span>
                            <input type="radio" name="modal-payment" class="modal-payment" value="transfer">
                        </label>
                    </div>

                    <button class="btn-primary modal-add-to-cart">Tambah ke Keranjang</button>
                    <button class="btn-primary modal-buy-now-whatsapp">Beli Sekarang</button>
                </div>
            </div>
        </div>
    `;
    
    productModal.style.display = 'flex';

    // Style radio button
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.style.margin = '0';
        radio.style.transform = 'scale(1.2)';
    });

    // Toggle tampilan field berdasarkan pilihan pengiriman
    const deliveryRadios = document.querySelectorAll('.modal-delivery');
    const pickupFields = document.querySelector('.pickup-fields');
    const deliveryFields = document.querySelector('.delivery-fields');

    deliveryRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'pickup') {
                pickupFields.style.display = 'block';
                deliveryFields.style.display = 'none';
            } else {
                pickupFields.style.display = 'none';
                deliveryFields.style.display = 'block';
            }
        });
    });

    // Tambah ke Keranjang
    const addToCartBtn = document.querySelector('.modal-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            handleAddToCart(product);
        });
    }

    // Beli Sekarang via WhatsApp
    const buyNowWA = document.querySelector('.modal-buy-now-whatsapp');
    if (buyNowWA) {
        buyNowWA.addEventListener('click', () => {
            const name = document.querySelector('.modal-name')?.value?.trim();
            const phone = document.querySelector('.modal-phone')?.value?.replace(/\D/g, '');
            const deliveryMethod = document.querySelector('input[name="modal-delivery"]:checked')?.value;
            const paymentMethod = document.querySelector('input[name="modal-payment"]:checked')?.value;
            const quantity = parseInt(document.querySelector('.modal-quantity')?.value) || 1;
            const notes = document.querySelector('.modal-notes')?.value?.trim() || '-';

            if (!name || !phone) {
                showNotification('Harap lengkapi semua data wajib!');
                return;
            }

            if (phone.length < 10) {
                showNotification('Nomor WhatsApp tidak valid!');
                return;
            }

            let pickupDate = '', pickupTime = '', address = '';

            if (deliveryMethod === 'pickup') {
                pickupDate = document.querySelector('.modal-pickup-date')?.value;
                pickupTime = document.querySelector('.modal-pickup-time')?.value;
                if (!pickupDate || !pickupTime) {
                    showNotification('Harap isi tanggal dan waktu pengambilan');
                    return;
                }
                const selectedDateTime = new Date(`${pickupDate}T${pickupTime}`);
                if (selectedDateTime < new Date()) {
                    showNotification('Tanggal dan waktu tidak boleh di masa lalu!');
                    return;
                }
            } else {
                address = document.querySelector('.modal-address')?.value?.trim();
                if (!address) {
                    showNotification('Harap isi alamat pengiriman');
                    return;
                }
            }

            const dateObj = deliveryMethod === 'pickup' ? new Date(pickupDate) : null;
            const indonesianDate = dateObj ? dateObj.toLocaleDateString('id-ID') : '';
            const paymentText = paymentMethod === 'cod' ? 'COD (Bayar di Tempat)' : 'Transfer Bank';
            const deliveryText = deliveryMethod === 'pickup' 
                ? `Tanggal ambil: ${indonesianDate}\nWaktu ambil: ${pickupTime}`
                : `Alamat pengiriman: ${address}`;

            const message = `Halo, saya ingin pesan *${product.name}* sebanyak *${quantity} pcs*.\n` +
                            `${deliveryText}\n` +
                            `Catatan: ${notes}\n` +
                            `Metode pembayaran: ${paymentText}\n\n` +
                            `Nama: ${name}\n` +
                            `No HP: ${phone}`;

            const whatsappNumber = '6281335997984';
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`; // ✅ tanpa spasi

            productModal.style.display = 'none';
            window.open(whatsappUrl, '_blank');
        });
    }
}

// ✅ DIPERBAIKI: Simpan SEMUA data ke keranjang
function handleAddToCart(product) {
    const name = document.querySelector('.modal-name')?.value?.trim();
    const phone = document.querySelector('.modal-phone')?.value?.replace(/\D/g, '');
    const deliveryMethod = document.querySelector('input[name="modal-delivery"]:checked')?.value;
    const paymentMethod = document.querySelector('input[name="modal-payment"]:checked')?.value;
    const quantity = parseInt(document.querySelector('.modal-quantity')?.value) || 1;
    const notes = document.querySelector('.modal-notes')?.value?.trim() || '-';

    if (!name || !phone) {
        showNotification('Harap lengkapi nama dan nomor WhatsApp!');
        return;
    }

    if (phone.length < 10) {
        showNotification('Nomor WhatsApp tidak valid!');
        return;
    }

    let pickupDate = '', pickupTime = '', address = '';

    if (deliveryMethod === 'pickup') {
        pickupDate = document.querySelector('.modal-pickup-date')?.value;
        pickupTime = document.querySelector('.modal-pickup-time')?.value;
        if (!pickupDate || !pickupTime) {
            showNotification('Harap isi tanggal dan waktu pengambilan');
            return;
        }
        const selectedDateTime = new Date(`${pickupDate}T${pickupTime}`);
        if (selectedDateTime < new Date()) {
            showNotification('Tanggal dan waktu tidak boleh di masa lalu!');
            return;
        }
    } else {
        address = document.querySelector('.modal-address')?.value?.trim();
        if (!address) {
            showNotification('Harap isi alamat pengiriman');
            return;
        }
    }

    // Simpan SEMUA ke keranjang
    const cartItem = {
        ...product,
        customerName: name,
        customerPhone: phone,
        quantity,
        notes,
        delivery: deliveryMethod,
        payment: paymentMethod,
        pickupDate,
        pickupTime,
        address
    };

    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Produk berhasil ditambahkan ke keranjang');
}

// Close Modal
if (closeModal && productModal) {
    closeModal.addEventListener('click', () => {
        productModal.style.display = 'none';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.style.display = 'none';
    }
});

// Cart Functionality
if (cartToggle && cartSidebar) {
    cartToggle.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('active');
        updateCartDisplay();
    });
}

if (closeCart && cartSidebar) {
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });
}

// Update Cart Count
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Update Cart Display — Tampilkan semua info
function updateCartDisplay() {
    if (!cartItems || !cartTotalPrice) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Keranjang belanja kosong</p>';
        cartTotalPrice.textContent = 'Rp 0';
        return;
    }
    
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        let deliveryInfo = '';
        if (item.delivery === 'delivery') {
            deliveryInfo = `<p>Diantar ke: ${item.address}</p>`;
        } else {
            deliveryInfo = `<p>Ambil: ${item.pickupDate} ${item.pickupTime}</p>`;
        }

        const paymentText = item.payment === 'transfer' ? 'Transfer Bank' : 'COD (Bayar di Tempat)';
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</p>
                ${deliveryInfo}
                <p>Pembayaran: ${paymentText}</p>
            </div>
            <div class="cart-item-actions">
                <button class="buy-now-wa-cart btn-primary" 
                        data-name="${item.name}"
                        data-quantity="${item.quantity}"
                        data-notes="${item.notes}"
                        data-delivery="${item.delivery}"
                        data-payment="${item.payment}"
                        data-date="${item.pickupDate || ''}"
                        data-time="${item.pickupTime || ''}"
                        data-address="${item.address || ''}"
                        data-customer-name="${item.customerName}"
                        data-customer-phone="${item.customerPhone}"
                        style="margin-bottom:6px;padding:6px 10px;font-size:12px;">Beli Sekarang</button>
                <button class="remove-item" 
                        data-id="${item.id}"
                        data-date="${item.pickupDate || ''}"
                        data-time="${item.pickupTime || ''}">❌</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotalPrice.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    
    // Hapus item
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const date = e.target.dataset.date;
            const time = e.target.dataset.time;

            cart = cart.filter(item => 
                !(item.id === id && 
                  ((item.delivery === 'delivery') || 
                   (item.pickupDate === date && item.pickupTime === time)))
            );

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay();
        });
    });

    // ✅ PESAN SAMA PERSIS DENGAN YANG DI MODAL
    document.querySelectorAll('.buy-now-wa-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const name = e.target.dataset.name;
            const quantity = e.target.dataset.quantity;
            const notes = e.target.dataset.notes;
            const delivery = e.target.dataset.delivery;
            const payment = e.target.dataset.payment;
            const pickupDate = e.target.dataset.date;
            const pickupTime = e.target.dataset.time;
            const address = e.target.dataset.address;
            const customerName = e.target.dataset.customerName;
            const customerPhone = e.target.dataset.customerPhone;

            const paymentText = payment === 'transfer' ? 'Transfer Bank' : 'COD (Bayar di Tempat)';
            let deliveryText = '';
            if (delivery === 'delivery') {
                deliveryText = `Alamat pengiriman: ${address}\n`;
            } else {
                const dateObj = new Date(pickupDate);
                const indonesianDate = dateObj.toLocaleDateString('id-ID');
                deliveryText = `Tanggal ambil: ${indonesianDate}\nWaktu ambil: ${pickupTime}\n`;
            }

            const message = `Halo, saya ingin pesan *${name}* sebanyak *${quantity} pcs*.\n` +
                            `${deliveryText}` +
                            `Catatan: ${notes}\n` +
                            `Metode pembayaran: ${paymentText}\n\n` +
                            `Nama: ${customerName}\n` +
                            `No HP: ${customerPhone}`;

            const whatsappNumber = '6281335997984';
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
        });
    });
}

// Checkout Button
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Keranjang belanja kosong');
            return;
        }
        
        const orderFormEl = document.getElementById('order-form');
        if (orderFormEl) {
            orderFormEl.scrollIntoView({ behavior: 'smooth' });
            if (cartSidebar) cartSidebar.classList.remove('active');
        } else {
            window.location.href = 'product.html#order-form';
        }
    });
}

// Review Form Submission
if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('review-name')?.value;
        const email = document.getElementById('review-email')?.value;
        const message = document.getElementById('review-message')?.value;
        
        if (!name || !email || !message) {
            showNotification('Semua kolom ulasan harus diisi');
            return;
        }
        
        console.log('Review submitted:', { name, email, message });
        showNotification('Terima kasih atas ulasan Anda!');
        reviewForm.reset();
    });
}

// Order Form Submission
if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('customer-name')?.value;
        const phone = document.getElementById('customer-phone')?.value;
        
        if (!name || !phone) {
            showNotification('Nama dan nomor telepon wajib diisi');
            return;
        }

        console.log('Order submitted:', { name, phone, cart });
        
        showNotification('Pesanan Anda telah berhasil dikonfirmasi!');
        
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        orderForm.reset();
        window.location.href = 'index.html';
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (cartItems) {
        updateCartDisplay();
    }
});

// ========== ANIMASI & INTERAKSI TAMBAHAN ==========

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    const featureItems = document.querySelectorAll(".feature-item");
    const animatables = document.querySelectorAll("[data-animate]");

    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);

    featureItems.forEach(item => {
        if (item.getBoundingClientRect().top < window.innerHeight - 100) {
            item.classList.add("visible");
        }
    });

    animatables.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 80) {
            el.classList.add("visible");
        }
    });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    });
});

window.addEventListener("load", () => {
    const hero = document.querySelector(".hero");
    if (hero) hero.classList.add("fade-in");
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Terima kasih atas pesan Anda!');
        this.reset();
    });
}
