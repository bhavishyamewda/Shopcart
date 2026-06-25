// Cart and LocalStorage Engine
let cart = JSON.parse(localStorage.getItem('shopkart_cart')) || [];

// Safely share or declare the INR formatting function without crashing
if (typeof formatINR === 'undefined') {
    window.formatINR = (amount) => '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function initCartSystem() {
    updateCartCount();
    renderCartPage();
    renderCheckoutSummary();
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification animate__animated animate__fadeInUp';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.replace('animate__fadeInUp', 'animate__fadeOutDown');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += parseInt(quantity);
    } else {
        cart.push({ ...product, quantity: parseInt(quantity) });
    }
    
    saveCart();
    showToast(`${product.name} added to cart successfully!`);
}

function updateQuantity(productId, element) {
    const item = cart.find(i => i.id === parseInt(productId));
    if (item) {
        let value = parseInt(element.value);
        if (value < 1) value = 1;
        item.quantity = value;
        saveCart();
        renderCartPage();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== parseInt(productId));
    saveCart();
    renderCartPage();
}

function saveCart() {
    localStorage.setItem('shopkart_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const counters = document.querySelectorAll('.cart-count');
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    counters.forEach(counter => counter.textContent = totalCount);
}

function renderCartPage() {
    const cartWrapper = document.getElementById('cart-items-wrapper');
    const summaryCard = document.getElementById('cart-summary-card');
    const mainRow = cartWrapper ? cartWrapper.parentElement : null;
    
    if (!cartWrapper) return;
    
    if (cart.length === 0) {
        // Break out of the col-md-8 split to give the empty card a premium full-width look
        if (mainRow) {
            mainRow.innerHTML = `
                <div class="col-12">
                    <div class="empty-cart-container">
                        <i class="fas fa-shopping-basket fa-4x mb-3"></i>
                        <h3>Your shopping cart is empty!</h3>
                        <p>Explore our premium product selections to find top-tier tech items.</p>
                        <a href="products.html" class="btn btn-primary">Shop Our Collection</a>
                    </div>
                </div>`;
        }
        if (summaryCard) summaryCard.style.display = 'none';
        return;
    }
    
    if (summaryCard) summaryCard.style.display = 'block';
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        html += `
            <div class="cart-item-row card mb-3 p-3">
                <div class="row align-items-center">
                    <div class="col-md-2 col-4"><img src="${item.image}" alt="${item.name}" class="img-fluid rounded"></div>
                    <div class="col-md-4 col-8">
                        <h5 class="mb-1">${item.name}</h5>
                        <p class="text-muted small mb-0">Category: ${item.category}</p>
                    </div>
                    <div class="col-md-2 col-4 mt-2 mt-md-0">
                        <span class="fw-bold text-primary">${formatINR(item.price)}</span>
                    </div>
                    <div class="col-md-2 col-4 mt-2 mt-md-0">
                        <input type="number" class="form-control form-control-sm text-center" min="1" value="${item.quantity}" onchange="updateQuantity(${item.id}, this)">
                    </div>
                    <div class="col-md-2 col-4 text-end mt-2 mt-md-0">
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>`;
    });
    
    cartWrapper.innerHTML = html;
    
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;
    
    const subtotalEl = document.getElementById('subtotal-val');
    const taxEl = document.getElementById('tax-val');
    const totalEl = document.getElementById('total-val');
    
    if (subtotalEl) subtotalEl.textContent = formatINR(subtotal);
    if (taxEl) taxEl.textContent = formatINR(tax);
    if (totalEl) totalEl.textContent = formatINR(total);
}

function renderCheckoutSummary() {
    const checkoutSummary = document.getElementById('checkout-summary-wrapper');
    if (!checkoutSummary) return;
    
    let subtotal = 0;
    let html = '<ul class="list-group mb-3">';
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        html += `
            <li class="list-group-item d-between lh-sm">
                <div>
                    <h6 class="my-0">${item.name} <span class="text-muted">x${item.quantity}</span></h6>
                </div>
                <span class="text-muted">${formatINR(item.price * item.quantity)}</span>
            </li>`;
    });
    
    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    
    html += `
        <li class="list-group-item d-between bg-light"><span>GST (18%)</span> <strong>${formatINR(tax)}</strong></li>
        <li class="list-group-item d-between text-primary"><span>Total Amount (INR)</span> <strong>${formatINR(total)}</strong></li>
    </ul>`;
    
    checkoutSummary.innerHTML = html;
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    const orderId = 'SKP-' + Math.floor(Math.random() * 900000 + 100000);
    localStorage.setItem('last_order_id', orderId);
    localStorage.removeItem('shopkart_cart');
    
    window.location.href = `tracking.html?orderId=${orderId}&placed=true`;
}

document.addEventListener('DOMContentLoaded', initCartSystem);