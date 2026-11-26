// STATE
let currentTab = 'home';
let loadedProducts = 0;
const BATCH_SIZE = 24;
let currentCategory = "All";
let isLoggedIn = false;
let currentSlide = 0;
let slideInterval;

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  renderStories();
  renderHomeReels();
  renderTrendingProducts();
  renderCategories();
  loadMoreProducts();
  setupInfiniteScroll();
  setupNavigation();
  setupReelAutoplay();
  initSlideshow();
});

// SLIDESHOW
function initSlideshow() {
  const slides = document.getElementById('slides');
  const dotsContainer = document.getElementById('slide-dots');
  
  // Create dots
  for (let i = 0; i < 5; i++) {
    const dot = document.createElement('div');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  }
  
  // Auto-slide every 4 seconds
  slideInterval = setInterval(() => changeSlide(1), 4000);
  
  // Touch swipe support
  let touchStartX = 0;
  slides.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
  slides.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      changeSlide(diff > 0 ? 1 : -1);
    }
  });
}

function changeSlide(direction) {
  currentSlide = (currentSlide + direction + 5) % 5;
  updateSlide();
  resetSlideTimer();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlide();
  resetSlideTimer();
}

function updateSlide() {
  const slides = document.getElementById('slides');
  slides.style.transform = `translateX(-${currentSlide * 100}%)`;
  
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function resetSlideTimer() {
  clearInterval(slideInterval);
  slideInterval = setInterval(() => changeSlide(1), 4000);
}

// NAVIGATION
function setupNavigation() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      switchTab(target);
    });
  });
}

function switchTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${tabName}`).classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabName);
  });
  window.scrollTo(0, 0);
  
  if (tabName === 'reel') {
    setTimeout(checkReelVisibility, 300);
  }
}

// HOME RENDER
function renderStories() {
  const container = document.getElementById('stories');
  const names = ["Your Story", "Alex", "Jordan", "Taylor", "Morgan"];
  container.innerHTML = names.map((name, i) => `
    <div class="story">
      <div class="story-ring"><div>${i === 0 ? '➕' : name[0]}</div></div>
      <span>${name}</span>
    </div>
  `).join('');
}

function renderHomeReels() {
  const container = document.getElementById('home-reels');
  container.innerHTML = REELS.slice(0, 5).map(reel => `
    <div class="reel-card" onclick="switchTab('reel')">
      <video src="${reel.video}" muted loop playsinline></video>
      <div class="overlay">
        <div style="font-weight:bold">${reel.title}</div>
        <div>▶ ${reel.views} views</div>
      </div>
    </div>
  `).join('');
}

function renderTrendingProducts() {
  const container = document.getElementById('trending-products');
  const trending = PRODUCTS.slice(0, 6);
  container.innerHTML = trending.map(p => `
    <div class="trending-card" onclick="orderViaWhatsApp('${p.id}', '${p.name}')">
      <div class="trending-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%22 height=%22100%22 fill=%22%23eee%22/><text x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22>No Image</text></svg>'">
      </div>
      <div class="trending-info">
        <h4>${p.name}</h4>
        <div class="price">RM ${p.price}</div>
      </div>
    </div>
  `).join('');
}

// SHOP RENDER & INFINITE SCROLL
function renderCategories() {
  const container = document.getElementById('category-chips');
  container.innerHTML = CATEGORIES.map(cat => `
    <button class="chip ${cat === 'All' ? 'active' : ''}" onclick="filterCategory('${cat}', this)">${cat}</button>
  `).join('');
}

function filterCategory(cat, btn) {
  currentCategory = cat;
  loadedProducts = 0;
  document.getElementById('product-grid').innerHTML = '';
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  loadMoreProducts();
}

function loadMoreProducts() {
  const grid = document.getElementById('product-grid');
  const loader = document.getElementById('shop-loader');
  loader.style.display = 'block';

  setTimeout(() => {
    const filtered = currentCategory === 'All' 
      ? PRODUCTS 
      : PRODUCTS.filter(p => p.category === currentCategory);
    
    const batch = filtered.slice(loadedProducts, loadedProducts + BATCH_SIZE);
    
    batch.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-img">
          <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%22 height=%22100%22 fill=%22%23eee%22/><text x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22>No Image</text></svg>'">
        </div>
        <div class="product-info">
          <h4>${p.name}</h4>
          <div class="price">RM ${p.price}</div>
          <button class="wa-btn" onclick="orderViaWhatsApp('${p.id}', '${p.name}')">
            💬 Order via WhatsApp
          </button>
        </div>
      `;
      grid.appendChild(card);
    });

    loadedProducts += batch.length;
    if (loadedProducts >= filtered.length) {
      loader.innerText = "No more products";
    } else {
      loader.style.display = 'block';
    }
  }, 300);
}

function setupInfiniteScroll() {
  const loader = document.getElementById('shop-loader');
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && currentTab === 'shop') {
      const filtered = currentCategory === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === currentCategory);
      if (loadedProducts < filtered.length) {
        loadMoreProducts();
      }
    }
  }, { rootMargin: '200px' });
  observer.observe(loader);
}

// REEL AUTOPLAY
function setupReelAutoplay() {
  const feed = document.getElementById('reels-feed');
  feed.innerHTML = REELS.map(reel => `
    <div class="reel-item" data-id="${reel.id}">
      <video src="${reel.video}" muted loop playsinline preload="metadata"></video>
      <div class="reel-actions">
        <span>❤️</span><small>${reel.views}</small>
        <span>💬</span><small>Chat</small>
        <span>↗️</span><small>Share</small>
      </div>
      <div class="reel-info">
        <h4>${reel.title}</h4>
        <small>IT World Jersey · Original Sound</small>
      </div>
    </div>
  `).join('');

  const reelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video');
      if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
        video.play().catch(e => console.log("Autoplay blocked, needs interaction"));
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.reel-item').forEach(item => reelObserver.observe(item));
}

function checkReelVisibility() {
  window.dispatchEvent(new Event('scroll'));
}

// WHATSAPP ORDER
function orderViaWhatsApp(id, name) {
  const message = `Hello IT World Jersey! 👋\n\nI want to order:\n👕 *${name}*\n💰 Price: RM 49.99\n\nPlease confirm availability. Thank you!`;
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

function orderCustom(type) {
  const message = `Hello! I am interested in *${type}*. Can you share more details and pricing?`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// PROFILE TOGGLE
function toggleLogin() {
  isLoggedIn = !isLoggedIn;
  document.getElementById('guest-profile').classList.toggle('hidden', isLoggedIn);
  document.getElementById('logged-profile').classList.toggle('hidden', !isLoggedIn);
        }
