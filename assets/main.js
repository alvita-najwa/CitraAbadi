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
const orderForm = document.getElementById('order-form-details');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Helper: Show Notification
function showNotification(message) {
    let el = document.getElementById('notif-toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'notif-toast';
        Object.assign(el.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#4CAF50',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '4px',
            zIndex: '10000',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'none',
            fontSize: '14px'
        });
        document.body.appendChild(el);
    }
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 3000);
}

// Mobile menu toggle
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
    });
});

// Load products
if (productsGrid) {
    loadProducts(products);
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            const term = e.target.value.toLowerCase();
            const filtered = products.filter(p => p.name.toLowerCase().includes(term));
            loadProducts(filtered);
        });
    }
}

function loadProducts(arr) {
    if (!productsGrid) return;
    productsGrid.innerHTML = '';
    arr.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img">
                <img src="${p.image}" alt="${p.name}" onerror="this.parentElement.innerHTML='<div class=\\'no-image\\'>Gambar tidak tersedia</div>'">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p>Rp ${p.price.toLocaleString('id-ID')}</p>
            </div>
        `;
        card.addEventListener('click', () => showProductDetail(p));
        productsGrid.appendChild(card);
    });
}

function showProductDetail(product) {
    if (!modalBody || !productModal) return;

    modalBody.innerHTML = `
        <div class="product-detail" style="display:flex;gap:20px;max-width:800px;">
            <div class="product-detail-img" style="flex:1;min-width:200px;">
                <img src="${product.image}" alt="${product.name}" 
                    style="width:100%;height:auto;border-radius:8px;object-fit:cover;"
                    onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\'display:flex;align-items:center;justify-content:center;height:200px;background:#f0f0f0;color:#666;border-radius:8px;\'>Gambar tidak tersedia</div>'">
            </div>
            <div class="product-detail-info" style="flex:2;">
                <h2 style="margin:0 0 12px 0;">${product.name}</h2>
                <p style="color:#e74c3c;font-weight:bold;margin:0 0 16px 0;">Rp ${product.price.toLocaleString('id-ID')}</p>
                <p style="margin:0 0 20px 0;color:#555;">${product.description}</p>

                <div class="product-form" style="display:flex;flex-direction:column;gap:16px;">
                    <!-- Nama -->
                    <div>
                        <label style="display:block;margin-bottom:6px;font-size:14px;font-weight:600;">Nama Lengkap</label>
                        <input type="text" class="modal-name" placeholder="Nama Anda" required
                            style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;">
                    </div>

                    <!-- WhatsApp -->
                    <div>
                        <label style="display:block;margin-bottom:6px;font-size:14px;font-weight:600;">Nomor WhatsApp</label>
                        <input type="tel" class="modal-phone" placeholder="081234567890" required
                            style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;">
                    </div>

                    <!-- Pengiriman -->
                    <div>
                        <label style="display:block;margin-bottom:8px;font-size:14px;font-weight:600;">Pengiriman</label>
                        <div style="display:flex;flex-direction:column;gap:8px;">
                            <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
                                <span style="flex:1;text-align:left;">Diambil</span>
                                <input type="radio" name="delivery" value="pickup" checked style="margin:0;transform:scale(1.2);">
                            </label>
                            <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
                                <span style="flex:1;text-align:left;">Diantar</span>
                                <input type="radio" name="delivery" value="delivery" style="margin:0;transform:scale(1.2);">
                            </label>
                        </div>
                    </div>

                    <!-- Tanggal & Waktu Ambil -->
                    <div class="pickup-fields">
                        <div>
                            <label style="display:block;margin-bottom:6px;font-size:14px;font-weight:600;">Tanggal Ambil</label>
                            <input type="date" class="modal-pickup-date" required
                                style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;">
                        </div>
                        <div>
                            <label style="display:block;margin-bottom:6px;font-size:14px;font-weight:600;">Waktu Ambil</label>
                            <input type="time" class="modal-pickup-time" required
                                style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;">
                        </div>
                    </div>

                    <!-- Alamat (sembunyi default) -->
                    <div class="delivery-fields" style="display:none;">
                        <div>
                            <label style="display:block;margin-bottom:6px;font-size:14px;font-weight:600;">Alamat Lengkap</label>
                            <textarea class="modal-address" placeholder="Contoh: Jl. Merdeka No. 123..." required
                                style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;height:80px;"></textarea>
                        </div>
                        <div>
                            <a href="https://maps.app.goo.gl/GANTI_DENGAN_LINK_ANDA" target="_blank"
                                style="color:#1e88e5;text-decoration:underline;font-size:14px;display:inline-block;margin-top:4px;">
                                Lihat Lokasi Toko
                            </a>
                        </div>
                    </div>

                    <!-- Jumlah -->
                    <div>
                        <label style="display:block;margin-bottom:6px;font-size:14px;font-weight:600;">Jumlah</label>
                        <input type="number" class="modal-quantity" min="1" value="1" required
                            style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;">
                    </div>

                    <!-- Catatan -->
                    <div>
                        <label style="display:block;margin-bottom:6px;font-size:14px;font-weight:600;">Catatan (Opsional)</label>
                        <textarea class="modal-notes" placeholder="Warna, ukuran, dll."
                            style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;height:60px;"></textarea>
                    </div>

                    <!-- Pembayaran -->
                    <div>
                        <label style="display:block;margin-bottom:8px;font-size:14px;font-weight:600;">Metode Pembayaran</label>
                        <div style="display:flex;flex-direction:column;gap:8px;">
                            <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
                                <span style="flex:1;text-align:left;">COD (Bayar di Tempat)</span>
                                <input type="radio" name="payment" value="cod" checked style="margin:0;transform:scale(1.2);">
                            </label>
                            <label style="display:flex;align-items:center;gap:10px;cursor:pointer;">
                                <span style="flex:1;text-align:left;">Transfer Bank</span>
                                <input type="radio" name="payment" value="transfer" style="margin:0;transform:scale(1.2);">
                            </label>
                        </div>
                    </div>

                    <!-- Tombol -->
                    <div style="display:flex;gap:10px;margin-top:10px;">
                        <button class="modal-add-to-cart"
                            style="flex:1;padding:12px;background:#3498db;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:bold;">
                            Tambah ke Keranjang
                        </button>
                        <button class="modal-buy-now-whatsapp"
                            style="flex:1;padding:12px;background:#25D366;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:bold;">
                            Beli Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    productModal.style.display = 'flex';
    productModal.style.justifyContent = 'center';
    productModal.style.alignItems = 'center';
    productModal.style.padding = '20px';

    // Toggle fields
    const radios = document.querySelectorAll('input[name="delivery"]');
    const pickupDiv = document.querySelector('.pickup-fields');
    const deliveryDiv = document.querySelector('.delivery-fields');

    radios.forEach(r => {
        r.addEventListener('change', () => {
            if (r.value === 'pickup') {
                pickupDiv.style.display = 'block';
                deliveryDiv.style.display = 'none';
            } else {
                pickupDiv.style.display = 'none';
                deliveryDiv.style.display = 'block';
            }
        });
    });

    // Tambah ke keranjang
    document.querySelector('.modal-add-to-cart')?.addEventListener('click', () => {
        const date = document.querySelector('.modal-pickup-date')?.value;
        const time = document.querySelector('.modal-pickup-time')?.value;
        const qty = parseInt(document.querySelector('.modal-quantity')?.value) || 1;
        if (!date || !time) return showNotification('Isi tanggal & waktu ambil');
        if (new Date(`${date}T${time}`) < new Date()) return showNotification('Waktu tidak boleh di masa lalu');
        addToCart(product, qty, date, time);
        showNotification('✅ Ditambahkan ke keranjang!');
    });

    // Beli via WhatsApp
    document.querySelector('.modal-buy-now-whatsapp')?.addEventListener('click', () => {
        const name = document.querySelector('.modal-name')?.value?.trim();
        const phone = document.querySelector('.modal-phone')?.value?.replace(/\D/g, '');
        const delivery = document.querySelector('input[name="delivery"]:checked')?.value;
        const payment = document.querySelector('input[name="payment"]:checked')?.value;
        const qty = parseInt(document.querySelector('.modal-quantity')?.value) || 1;
        const notes = document.querySelector('.modal-notes')?.value?.trim() || '-';

        if (!name || !phone || phone.length < 10) return showNotification('Periksa nama & nomor WhatsApp');

        let msg = `Halo, saya ingin pesan *${product.name}* sebanyak *${qty} pcs*.\n`;

        if (delivery === 'pickup') {
            const d = document.querySelector('.modal-pickup-date')?.value;
            const t = document.querySelector('.modal-pickup-time')?.value;
            if (!d || !t) return showNotification('Isi tanggal & waktu ambil');
            if (new Date(`${d}T${t}`) < new Date()) return showNotification('Waktu tidak boleh di masa lalu');
            const fmtDate = new Date(d).toLocaleDateString('id-ID');
            msg += `Tanggal ambil: ${fmtDate}\nWaktu ambil: ${t}\n`;
        } else {
            const addr = document.querySelector('.modal-address')?.value?.trim();
            if (!addr) return showNotification('Isi alamat pengiriman');
            msg += `Alamat pengiriman: ${addr}\n`;
        }

        const payText = payment === 'cod' ? 'COD (Bayar di Tempat)' : 'Transfer Bank';
        msg += `Catatan: ${notes}\nMetode pembayaran: ${payText}\n\nNama: ${name}\nNo HP: ${phone}`;

        const WA = '6281335997984'; // ← GANTI!
        window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
        productModal.style.display = 'none';
    });
}

function addToCart(product, qty, date, time) {
    const existing = cart.find(i => i.id === product.id && i.pickupDate === date && i.pickupTime === time);
    if (existing) existing.quantity += qty;
    else cart.push({ ...product, quantity: qty, pickupDate: date, pickupTime: time });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const total = cart.reduce((s, i) => s + i.quantity, 0);
    if (cartCount) cartCount.textContent = total;
}

// Close modal
if (closeModal) closeModal.addEventListener('click', () => productModal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === productModal) productModal.style.display = 'none'; });

// Cart sidebar
if (cartToggle) cartToggle.addEventListener('click', e => {
    e.preventDefault();
    cartSidebar?.classList.add('active');
    updateCartDisplay();
});
if (closeCart) closeCart.addEventListener('click', () => cartSidebar?.classList.remove('active'));

function updateCartDisplay() {
    if (!cartItems || !cartTotalPrice) return;
    cartItems.innerHTML = cart.length ? '' : '<p style="padding:20px;color:#777;">Keranjang kosong</p>';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const el = document.createElement('div');
        el.innerHTML = `
            <div style="padding:12px;border-bottom:1px solid #eee;">
                <div style="display:flex;justify-content:space-between;">
                    <strong>${item.name}</strong>
                    <span>Rp ${item.price.toLocaleString('id-ID')}</span>
                </div>
                <div style="font-size:13px;color:#666;margin:4px 0;">x${item.quantity}</div>
                <div style="font-size:13px;color:#888;">Ambil: ${item.pickupDate} ${item.pickupTime}</div>
                <button class="remove-cart" data-id="${item.id}" data-date="${item.pickupDate}" data-time="${item.pickupTime}"
                    style="margin-top:8px;background:#e74c3c;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:12px;">
                    Hapus
                </button>
            </div>
        `;
        cartItems.appendChild(el);
    });
    if (cartTotalPrice) cartTotalPrice.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    document.querySelectorAll('.remove-cart').forEach(btn => {
        btn.addEventListener('click', e => {
            const { id, date, time } = e.target.dataset;
            cart = cart.filter(i => !(i.id == id && i.pickupDate === date && i.pickupTime === time));
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDisplay();
        });
    });
}

if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return showNotification('Keranjang kosong');
    const form = document.getElementById('order-form');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth' });
        cartSidebar?.classList.remove('active');
    } else window.location.href = 'product.html#order-form';
});

if (reviewForm) reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('review-name')?.value;
    const email = document.getElementById('review-email')?.value;
    const msg = document.getElementById('review-message')?.value;
    if (!name || !email || !msg) return showNotification('Lengkapi semua kolom');
    showNotification('Terima kasih atas ulasan Anda!');
    reviewForm.reset();
});

if (orderForm) orderForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('customer-name')?.value;
    const phone = document.getElementById('customer-phone')?.value;
    if (!name || !phone) return showNotification('Nama dan nomor wajib diisi');
    showNotification('✅ Pesanan dikonfirmasi!');
    cart = [];
    localStorage.setItem('cart', '[]');
    updateCartCount();
    orderForm.reset();
    setTimeout(() => window.location.href = 'index.html', 1000);
});

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (cartItems) updateCartDisplay();
});

// Animasi scroll (tetap dari kode asli)
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
});
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
        e.preventDefault();
        document.querySelector(a.getAttribute("href"))?.scrollIntoView({ behavior: "smooth" });
    });
});
