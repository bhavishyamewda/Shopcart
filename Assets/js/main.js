// Safely share or declare the INR formatting function without crashing
if (typeof formatINR === 'undefined') {
    window.formatINR = (amount) => '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

document.addEventListener('DOMContentLoaded', () => {
    setupHeroSlider();
    setupCountdownTimer();
    renderProductGrid();
    setupProductDetailsPage();
    setupFilters();
    setupNewsletterPopup();

    window.addEventListener('scroll', () => {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 50) header.classList.add('sticky');
        else header.classList.remove('sticky');
        
        const btt = document.getElementById('back-to-top');
        if (btt) {
            if (window.scrollY > 300) btt.style.display = 'block';
            else btt.style.display = 'none';
        }
    });
});

function setupHeroSlider() {
    const slider = document.getElementById('hero-slider-inner');
    if (!slider) return;
    let index = 0;
    setInterval(() => {
        index = (index + 1) % 3;
        slider.style.transform = `translateX(-${index * 100}%)`;
    }, 5000);
}

function setupCountdownTimer() {
    const timer = document.getElementById('offer-countdown');
    if (!timer) return;
    let time = 86400 * 2; 
    setInterval(() => {
        time--;
        let days = Math.floor(time / 86400);
        let hours = Math.floor((time % 86400) / 3600);
        let mins = Math.floor((time % 3600) / 60);
        let secs = time % 60;
        timer.textContent = `${days}d : ${hours}h : ${mins}m : ${secs}s`;
    }, 1000);
}

function renderProductGrid(filteredProducts = products) {
    const grid = document.getElementById('products-showcase-grid');
    if (!grid) return;
    
    let html = '';
    filteredProducts.forEach(product => {
        html += `
        <div class="col-lg-4 col-md-6 col-sm-12 animate__animated animate__fadeIn">
            <div class="product-card card">
                <span class="badge position-absolute top-0 start-0 m-2 bg-warning text-dark font-weight-bold">${product.badge}</span>
                <div class="img-container p-3 text-center">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid image-standard">
                </div>
                <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                        <h5 class="card-title text-truncate">${product.name}</h5>
                        <div class="mb-2 text-warning small">
                            ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}
                            <span class="text-muted text-small">(${product.reviewsCount})</span>
                        </div>
                        <p class="card-text text-muted small text-clamp-2">${product.description}</p>
                    </div>
                    <div class="mt-3">
                        <div class="price-wrapper mb-2">
                            <span class="fs-4 fw-bold text-primary">${formatINR(product.price)}</span>
                            <span class="text-decoration-line-through text-muted ms-2">${formatINR(product.oldPrice)}</span>
                        </div>
                        <div class="btn-group-grid d-flex gap-1">
                            <button onclick="addToCart(${product.id})" class="btn btn-primary btn-sm flex-grow-1"><i class="fas fa-shopping-cart"></i> Add</button>
                            <a href="product-details.html?id=${product.id}" class="btn btn-outline-secondary btn-sm"><i class="fas fa-eye"></i></a>
                            <button onclick="buyNow(${product.id})" class="btn btn-orange btn-sm text-white fw-bold">Buy</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });
    grid.innerHTML = html === '' ? `<div class="col-12 text-center p-5"><h4>No products match your search.</h4></div>` : html;
}

function buyNow(id) {
    addToCart(id, 1);
    window.location.href = 'cart.html';
}

function setupProductDetailsPage() {
    const detailContainer = document.getElementById('product-detail-view-mount');
    if (!detailContainer) return;
    
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id')) || 1;
    const item = products.find(p => p.id === id);
    
    if(!item) return;

    let specsHtml = '';
    for(let key in item.specs) {
        specsHtml += `<tr><th>${key}</th><td>${item.specs[key]}</td></tr>`;
    }

    detailContainer.innerHTML = `
        <div class="row">
            <div class="col-md-6 mb-4 text-center">
                <div class="card p-3 shadow-sm">
                    <img src="${item.image}" alt="${item.name}" class="img-fluid rounded" style="max-height: 450px; object-fit: contain;">
                </div>
            </div>
            <div class="col-md-6">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                        <li class="breadcrumb-item"><a href="products.html">Products</a></li>
                        <li class="breadcrumb-item active">${item.name}</li>
                    </ol>
                </nav>
                <h1 class="fw-bold mb-2">${item.name}</h1>
                <div class="mb-3 text-warning">
                    ${'<i class="fas fa-star"></i>'.repeat(Math.floor(item.rating))} 
                    <span class="text-muted">(${item.rating} / 5 from ${item.reviewsCount} reviews)</span>
                </div>
                <div class="mb-3">
                    <span class="fs-2 fw-bold text-primary">${formatINR(item.price)}</span>
                    <span class="text-decoration-line-through text-muted fs-5 ms-3">${formatINR(item.oldPrice)}</span>
                </div>
                <p class="lead">${item.description}</p>
                <div class="d-flex gap-3 align-items-center mb-4 mt-4">
                    <input type="number" id="detail-qty-input" class="form-control text-center" value="1" min="1" style="width: 80px;">
                    <button onclick="addToCart(${item.id}, document.getElementById('detail-qty-input').value)" class="btn btn-primary btn-lg px-4"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
                    <button onclick="buyNow(${item.id})" class="btn btn-orange text-white fw-bold btn-lg px-4">Buy Now</button>
                </div>
                <hr>
                <h4 class="mt-4">Technical Specifications</h4>
                <table class="table table-striped mt-2">${specsHtml}</table>
            </div>
        </div>`;
}

function setupFilters() {
    const searchInp = document.getElementById('global-search-input');
    const categorySel = document.getElementById('category-filter-select');
    
    if(!searchInp && !categorySel) return;

    const performFilter = () => {
        let text = searchInp ? searchInp.value.toLowerCase() : '';
        let cat = categorySel ? categorySel.value : 'all';

        let results = products.filter(p => {
            let matchText = p.name.toLowerCase().includes(text) || p.description.toLowerCase().includes(text);
            let matchCat = cat === 'all' || p.category === cat;
            return matchText && matchCat;
        });
        renderProductGrid(results);
    };

    if(searchInp) searchInp.addEventListener('input', performFilter);
    if(categorySel) categorySel.addEventListener('change', performFilter);
}

function setupNewsletterPopup() {
    if(localStorage.getItem('news_subscribed') || !document.getElementById('newsletter-modal')) return;
    setTimeout(() => {
        const modal = new bootstrap.Modal(document.getElementById('newsletter-modal'));
        modal.show();
    }, 7000);
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    localStorage.setItem('news_subscribed', 'true');
    alert("Thank you for joining our newsletter circle!");
    bootstrap.Modal.getInstance(document.getElementById('newsletter-modal')).hide();
}

function scrolltoTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Responsive Mobile Navigation Drawer Actions Logic
function toggleMobileSidebar(shouldOpen) {
    const sidebar = document.getElementById('mobile-nav-sidebar-drawer') || document.getElementById('mobile-sidebar-drawer');
    const backdrop = document.getElementById('sidebar-backdrop-overlay');
    
    if (!sidebar) return;
    
    if (shouldOpen) {
        sidebar.classList.add('open-active');
        if (backdrop) {
            backdrop.style.display = 'block';
            setTimeout(() => backdrop.classList.add('open-active'), 10);
        }
    } else {
        sidebar.classList.remove('open-active');
        if (backdrop) {
            backdrop.classList.remove('open-active');
            setTimeout(() => backdrop.style.display = 'none', 300);
        }
    }
}