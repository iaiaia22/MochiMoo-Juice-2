feather.replace();

// HAMBURGER
const hamburger = document.getElementById('hamburger-menu');
const navbarNav = document.querySelector('.navbar-nav');
hamburger.addEventListener('click', () => {
  navbarNav.classList.toggle('active');
});

// SLIDER
const slides = document.querySelectorAll('.slide-img');
const titles = ['Mochiiee Daifuku', 'MochiMoo Juice'];
const descs = ['One bite and you\'re hooked', 'Fresh, cool, and delicious'];
const btns = ['#menu', '#menu'];
let current = 0;

function goTo(index) {
  slides[current].classList.remove('active');
  slides[current].classList.add('exit');
  setTimeout(() => slides[current].classList.remove('exit'), 500);

  current = (index + slides.length) % slides.length;
  slides[current].classList.add('active');

  document.getElementById('slide-title').textContent = titles[current];
  document.getElementById('slide-desc').textContent = descs[current];
  document.getElementById('slide-btn').href = btns[current];

  // 👉 TAMBAHAN INI
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');

  if (current === 0) {
    // Mochi → cuma kanan
    nextBtn.style.display = 'flex';
    prevBtn.style.display = 'none';
  } else {
    // Jus → cuma kiri
    nextBtn.style.display = 'none';
    prevBtn.style.display = 'flex';
  }
} window.addEventListener('load', () => {
  goTo(0);
});

document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));
document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));

// CART
const cart = {};
const prices = {
  'Strawberry Choco': 7000,
  'Strawberry Cream': 7000,
  'Manggo Cream': 7000,
  'Choco Crunchy': 7000,
  'Jus Alpukat': 8000,
  'Jus Jambu': 7000,
};

document.querySelectorAll('.order-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const name = btn.closest('.menu-item').querySelector('p').textContent.trim().replace(/\s*\(\d+K\)/, '');
    cart[name] = (cart[name] || 0) + 1;
    updateCartCount();

    // animasi feedback
    btn.textContent = '✓ Added!';
    setTimeout(() => btn.textContent = 'ORDER', 1000);
  });
});

function updateCartCount() {
  const total = Object.values(cart).reduce((a, b) => a + b, 0);
  document.getElementById('cart-count').textContent = total;
}

function renderCart() {
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total-section');
  const keys = Object.keys(cart).filter(k => cart[k] > 0);

  if (keys.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Keranjang masih kosong </p>';
    totalEl.innerHTML = '';
    return;
  }

  let total = 0;
  itemsEl.innerHTML = keys.map(name => {
    const subtotal = (prices[name] || 0) * cart[name];
    total += subtotal;
    return `
      <div class="cart-item-row">
        <span>${name}</span>
        <div class="qty-control">
          <button onclick="changeQty('${name}', -1)">−</button>
          <span>${cart[name]}</span>
          <button onclick="changeQty('${name}', 1)">+</button>
        </div>
        <span>Rp${subtotal.toLocaleString('id-ID')}</span>
      </div>`;
  }).join('');

  totalEl.innerHTML = `Total: Rp${total.toLocaleString('id-ID')}`;
  feather.replace();
}

function changeQty(name, delta) {
  cart[name] = (cart[name] || 0) + delta;
  if (cart[name] <= 0) delete cart[name];
  updateCartCount();
  renderCart();
}

// Buka & tutup cart
document.getElementById('cart-icon').addEventListener('click', (e) => {
  e.preventDefault();
  renderCart();
  document.getElementById('cartOverlay').classList.add('active');
  feather.replace();
});

document.getElementById('closeCart').addEventListener('click', () => {
  document.getElementById('cartOverlay').classList.remove('active');
});

document.getElementById('cartOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('cartOverlay')) {
    document.getElementById('cartOverlay').classList.remove('active');
  }
});

// ORDER via WhatsApp
document.getElementById('orderWa').addEventListener('click', () => {
  const nama = document.getElementById('nama').value.trim();
  const kelas = document.getElementById('kelas').value.trim();
  const keys = Object.keys(cart).filter(k => cart[k] > 0);

  if (!nama || !kelas) {
    alert('Isi nama dan kelas dulu ya! ');
    return;
  }
  if (keys.length === 0) {
    alert('Keranjang masih kosong!');
    return;
  }

  let total = 0;
  const pesananList = keys.map(name => {
    const subtotal = (prices[name] || 0) * cart[name];
    total += subtotal;
    return `  - ${name} x${cart[name]} = Rp${subtotal.toLocaleString('id-ID')}`;
  }).join('\n');

  const pesan = `Halo, saya mau order MochiMoo Juice! 🧁\n\nNama: ${nama}\nKelas: ${kelas}\nPesanan:\n${pesananList}\nTotal: Rp${total.toLocaleString('id-ID')}`;

  window.open(`https://wa.me/62895326168143?text=${encodeURIComponent(pesan)}`, '_blank');
});