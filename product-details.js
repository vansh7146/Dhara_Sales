// product-details.js — always reads fresh from localStorage

var cart = JSON.parse(localStorage.getItem('cart')) || [];
var currentProductId = null;

document.addEventListener('DOMContentLoaded', function () {
  initializePage();

  // Fires every 500ms when admin changes anything
  window.addEventListener('productsUpdated', function () {
    if (currentProductId) {
      var updated = window.productManager.getProduct(currentProductId);
      if (updated) {
        displayProductDetails(updated);
      }
    }
    loadRelatedProducts();
  });
});

function initializePage() {
  loadProductDetails();
  initCart();
  updateCartUI();
}

function loadProductDetails() {
  var urlParams  = new URLSearchParams(window.location.search);
  var productId  = parseInt(urlParams.get('id')) || parseInt(localStorage.getItem('selectedProductId'));
  if (!productId) { window.location.href = 'index.html'; return; }

  // Always read fresh from localStorage
  var product = window.productManager.getProduct(productId);
  if (!product) { window.location.href = 'index.html'; return; }

  currentProductId = productId;
  displayProductDetails(product);
  loadRelatedProducts();
  document.title = product.name + ' - Dhara Sells & Service';
}

function displayProductDetails(product) {
  var discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  var specs    = product.specifications || {};
  var features = product.features || [];
  var specKeys = Object.keys(specs);

  var html = '<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 product-detail-grid">' +
    '<div class="space-y-4">' +
      '<div class="relative bg-white rounded-xl shadow-lg overflow-hidden">' +
        '<img src="' + product.image + '" alt="' + product.name + '" class="w-full h-96 object-cover" onerror="this.src=\'https://via.placeholder.com/600x400?text=No+Image\'">' +
        (discount > 0 ? '<div class="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-full font-bold">' + discount + '% OFF</div>' : '') +
      '</div>' +
    '</div>' +
    '<div class="space-y-6">' +
      '<div>' +
        '<h1 class="text-4xl font-bold text-gray-800 mb-4">' + product.name + '</h1>' +
        '<div class="flex items-center space-x-4 mb-4">' +
          '<div class="flex items-center bg-yellow-50 px-3 py-1 rounded-full">' +
            '<div class="flex text-yellow-400 mr-2">' +
              [0,1,2,3,4].map(function(i){ return '<i class="fas fa-star ' + (i < Math.floor(product.rating || 4.5) ? '' : 'opacity-30') + '"></i>'; }).join('') +
            '</div>' +
            '<span class="text-gray-700 font-medium">' + (product.rating || 4.5) + ' (' + (product.reviews || 0) + ' reviews)</span>' +
          '</div>' +
          '<span class="' + (product.inStock ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50') + ' font-medium px-3 py-1 rounded-full">' +
            '<i class="fas fa-' + (product.inStock ? 'check' : 'times') + '-circle mr-1"></i>' + (product.inStock ? 'In Stock' : 'Out of Stock') +
          '</span>' +
        '</div>' +
      '</div>' +
      '<div class="border-b pb-6">' +
        '<div class="flex items-center space-x-4 mb-4">' +
          '<span class="text-5xl font-bold text-blue-600">₹' + product.price.toLocaleString() + '</span>' +
          (product.originalPrice
            ? '<div class="flex flex-col"><span class="text-xl text-gray-500 line-through">₹' + product.originalPrice.toLocaleString() + '</span>' +
              '<span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">Save ₹' + (product.originalPrice - product.price).toLocaleString() + '</span></div>'
            : '') +
        '</div>' +
        '<p class="text-gray-600 text-lg">' + product.description + '</p>' +
      '</div>' +
      (features.length > 0
        ? '<div class="border-b pb-6"><h3 class="text-xl font-bold mb-4">Key Features</h3>' +
          '<ul class="grid grid-cols-1 md:grid-cols-2 gap-3">' +
          features.map(function(f){ return '<li class="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg"><i class="fas fa-check-circle text-green-500 mr-3"></i><span>' + f + '</span></li>'; }).join('') +
          '</ul></div>'
        : '') +
      ((product.installation || product.warranty)
        ? '<div class="border-b pb-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-4">' +
          (product.installation ? '<div class="bg-blue-50 p-4 rounded-xl"><h4 class="font-bold text-blue-800 mb-2"><i class="fas fa-tools mr-2"></i>Installation</h4><p class="text-gray-700 text-sm">' + product.installation + '</p></div>' : '') +
          (product.warranty ? '<div class="bg-green-50 p-4 rounded-xl"><h4 class="font-bold text-green-800 mb-2"><i class="fas fa-shield-alt mr-2"></i>Warranty</h4><p class="text-gray-700 text-sm">' + product.warranty + '</p></div>' : '') +
          '</div></div>'
        : '') +
      '<div class="space-y-4">' +
        '<div class="flex items-center space-x-4">' +
          '<div class="flex items-center border-2 border-gray-200 rounded-xl bg-white">' +
            '<button onclick="updateQty(-1)" class="px-4 py-3 text-gray-600 hover:text-blue-600"><i class="fas fa-minus"></i></button>' +
            '<input type="number" id="quantity" value="1" min="1" max="10" class="w-16 text-center border-0 focus:ring-0 font-bold">' +
            '<button onclick="updateQty(1)" class="px-4 py-3 text-gray-600 hover:text-blue-600"><i class="fas fa-plus"></i></button>' +
          '</div>' +
        '</div>' +
        '<div class="flex space-x-4 product-action-btns">' +
          '<button onclick="addToCartFromDetails()" class="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-bold hover:bg-blue-700 transition"' + (!product.inStock ? ' disabled style="opacity:0.5"' : '') + '>' +
            '<i class="fas fa-cart-plus mr-2"></i>Add to Cart' +
          '</button>' +
          '<button onclick="buyNow()" class="flex-1 bg-green-600 text-white py-4 px-6 rounded-xl font-bold hover:bg-green-700 transition"' + (!product.inStock ? ' disabled style="opacity:0.5"' : '') + '>' +
            '<i class="fas fa-bolt mr-2"></i>Buy Now' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<div class="mt-16 tab-nav">' +
    '<div class="border-b border-gray-200 bg-white rounded-t-xl">' +
      '<nav class="flex space-x-8 px-6">' +
        '<button onclick="showTab(\'description\', event)" class="tab-btn active py-6 px-2 border-b-2 border-blue-500 font-bold text-blue-600">Description</button>' +
        (specKeys.length > 0 ? '<button onclick="showTab(\'specifications\', event)" class="tab-btn py-6 px-2 border-b-2 border-transparent font-bold text-gray-500 hover:text-gray-700">Specifications</button>' : '') +
      '</nav>' +
    '</div>' +
    '<div class="bg-white rounded-b-xl shadow-lg p-8">' +
      '<div id="description-tab" class="tab-content">' +
        '<h3 class="text-2xl font-bold mb-6">Product Description</h3>' +
        '<p class="text-gray-700 leading-relaxed text-lg">' + (product.longDescription || product.description) + '</p>' +
      '</div>' +
      (specKeys.length > 0
        ? '<div id="specifications-tab" class="tab-content hidden">' +
          '<h3 class="text-2xl font-bold mb-6">Technical Specifications</h3>' +
          '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' +
          specKeys.map(function(k){ return '<div class="flex justify-between items-center py-3 px-5 bg-gray-50 rounded-lg"><span class="font-bold text-gray-700">' + k + '</span><span class="text-gray-600">' + specs[k] + '</span></div>'; }).join('') +
          '</div></div>'
        : '') +
    '</div>' +
  '</div>';

  document.getElementById('product-details').innerHTML = html;
}

function loadRelatedProducts() {
  if (!currentProductId) return;
  // Always read fresh
  var current = window.productManager.getProduct(currentProductId);
  if (!current) return;
  var related = window.productManager.getAllProducts()
    .filter(function (p) { return p.id !== current.id && p.category === current.category; })
    .slice(0, 4);
  var container = document.getElementById('related-products');
  if (!container) return;
  if (related.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500 col-span-full">No related products available</p>';
    return;
  }
  container.innerHTML = related.map(function (product) {
    var discount = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
    return '<div class="product-card">' +
      '<div class="relative">' +
        '<img src="' + product.image + '" alt="' + product.name + '" onerror="this.src=\'https://via.placeholder.com/300x200\'">' +
        (discount > 0 ? '<div class="discount">' + discount + '% OFF</div>' : '') +
      '</div>' +
      '<div class="content">' +
        '<h3>' + product.name + '</h3>' +
        '<p>' + product.description + '</p>' +
        '<div class="rating">' +
          '<div class="stars">' + [0,1,2,3,4].map(function(i){ return '<i class="fas fa-star ' + (i < Math.floor(product.rating || 4.5) ? '' : 'opacity-30') + '"></i>'; }).join('') + '</div>' +
          '<span class="count">' + (product.rating || 4.5) + '</span>' +
        '</div>' +
        '<div class="flex items-center justify-between mb-4"><div>' +
          '<span class="price">₹' + product.price.toLocaleString() + '</span>' +
          (product.originalPrice ? '<span class="original-price">₹' + product.originalPrice.toLocaleString() + '</span>' : '') +
        '</div></div>' +
        '<div class="buttons">' +
          '<button class="btn-secondary" onclick="viewRelated(' + product.id + ')"><i class="fas fa-eye mr-1"></i>View</button>' +
          '<button class="btn-primary" onclick="addRelatedToCart(' + product.id + ')"><i class="fas fa-cart-plus mr-1"></i>Add to Cart</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function viewRelated(id) {
  localStorage.setItem('selectedProductId', id);
  window.location.href = 'product-details.html';
}

function addRelatedToCart(productId) {
  var product = window.productManager.getProduct(productId);
  if (!product) return;
  var existing = cart.find(function (i) { return i.id === productId; });
  if (existing) { existing.quantity += 1; }
  else { cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }); }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  showMessage(product.name + ' added to cart!', 'success');
}

function updateQty(change) {
  var input = document.getElementById('quantity');
  if (!input) return;
  input.value = Math.min(10, Math.max(1, parseInt(input.value || 1) + change));
}

function addToCartFromDetails() {
  var product = window.productManager.getProduct(currentProductId);
  if (!product || !product.inStock) return;
  var qty = parseInt(document.getElementById('quantity').value) || 1;
  var existing = cart.find(function (i) { return i.id === product.id; });
  if (existing) { existing.quantity += qty; }
  else { cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: qty }); }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  showMessage(product.name + ' added to cart!', 'success');
}

function buyNow() {
  var product = window.productManager.getProduct(currentProductId);
  if (!product || !product.inStock) return;
  var qty = parseInt(document.getElementById('quantity').value) || 1;
  var msg = '🛒 *BUY NOW*\n\n' +
    '📦 *Product:* ' + product.name + '\n' +
    '💰 *Price:* ₹' + product.price.toLocaleString() + '\n' +
    '🔢 *Quantity:* ' + qty + '\n' +
    '💵 *Total:* ₹' + (product.price * qty).toLocaleString() + '\n\n' +
    '📞 *Please provide:*\n• Full Name: \n• Phone Number: \n• Delivery Address: \n\n' +
    '*Order Time:* ' + new Date().toLocaleString();
  window.open('https://wa.me/919898670727?text=' + encodeURIComponent(msg), '_blank');
}

function showTab(tab, e) {
  document.querySelectorAll('.tab-content').forEach(function (el) { el.classList.add('hidden'); });
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.classList.remove('border-blue-500', 'text-blue-600');
    btn.classList.add('border-transparent', 'text-gray-500');
  });
  var tabEl = document.getElementById(tab + '-tab');
  if (tabEl) tabEl.classList.remove('hidden');
  if (e && e.target) {
    e.target.classList.add('border-blue-500', 'text-blue-600');
    e.target.classList.remove('border-transparent', 'text-gray-500');
  }
}

// ── Cart ──────────────────────────────────────────────────────

function initCart() {
  var cartBtn     = document.getElementById('cart-btn');
  var closeBtn    = document.getElementById('close-cart');
  var overlay     = document.getElementById('cart-overlay');
  var checkoutBtn = document.getElementById('checkout-btn');
  if (cartBtn)     cartBtn.addEventListener('click', openCart);
  if (closeBtn)    closeBtn.addEventListener('click', closeCart);
  if (overlay)     overlay.addEventListener('click', closeCart);
  if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
}

function openCart() {
  document.getElementById('cart-sidebar').classList.remove('translate-x-full');
  document.getElementById('cart-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.add('translate-x-full');
  document.getElementById('cart-overlay').classList.add('hidden');
  document.body.style.overflow = '';
}

function updateCartUI() {
  var cartCount   = document.getElementById('cart-count');
  var cartItems   = document.getElementById('cart-items');
  var cartTotal   = document.getElementById('cart-total');
  var checkoutBtn = document.getElementById('checkout-btn');
  if (!cartCount || !cartItems || !cartTotal || !checkoutBtn) return;

  var totalItems = cart.reduce(function (s, i) { return s + i.quantity; }, 0);
  var totalPrice = cart.reduce(function (s, i) { return s + i.price * i.quantity; }, 0);

  if (totalItems > 0) { cartCount.textContent = totalItems; cartCount.classList.remove('hidden'); }
  else { cartCount.classList.add('hidden'); }

  cartItems.innerHTML = cart.length === 0
    ? '<p class="text-gray-500 text-center">Your cart is empty</p>'
    : cart.map(function (item) {
        return '<div class="cart-item">' +
          '<img src="' + item.image + '" alt="' + item.name + '">' +
          '<div class="details">' +
            '<div class="name">' + item.name + '</div>' +
            '<div class="price">₹' + item.price.toLocaleString() + '</div>' +
            '<div class="quantity">' +
              '<button onclick="changeQty(' + item.id + ', -1)"><i class="fas fa-minus"></i></button>' +
              '<span>' + item.quantity + '</span>' +
              '<button onclick="changeQty(' + item.id + ', 1)"><i class="fas fa-plus"></i></button>' +
            '</div>' +
          '</div>' +
          '<div class="remove" onclick="removeItem(' + item.id + ')"><i class="fas fa-trash"></i></div>' +
        '</div>';
      }).join('');

  cartTotal.textContent = '₹' + totalPrice.toLocaleString();
  checkoutBtn.disabled = cart.length === 0;
}

function changeQty(id, change) {
  var item = cart.find(function (i) { return i.id === id; });
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) { removeItem(id); return; }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

function removeItem(id) {
  cart = cart.filter(function (i) { return i.id !== id; });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

function checkout() {
  if (!cart.length) return;
  var totalItems = cart.reduce(function (s, i) { return s + i.quantity; }, 0);
  var totalPrice = cart.reduce(function (s, i) { return s + i.price * i.quantity; }, 0);
  var msg = '🛒 *NEW ORDER*\n\n📋 *Order Details:*\n' +
    cart.map(function (i) {
      return '• ' + i.name + '\n  Qty: ' + i.quantity + ' x ₹' + i.price.toLocaleString() + ' = ₹' + (i.price * i.quantity).toLocaleString();
    }).join('\n\n') +
    '\n\n📊 *Total Items:* ' + totalItems +
    '\n💵 *Total Amount:* ₹' + totalPrice.toLocaleString() +
    '\n\n📞 *Please provide:*\n• Full Name:\n• Phone Number:\n• Delivery Address:\n\n*Order Time:* ' + new Date().toLocaleString();
  window.open('https://wa.me/919898670727?text=' + encodeURIComponent(msg), '_blank');
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  closeCart();
  showMessage('Order sent to WhatsApp!', 'success');
}

function showMessage(text, type) {
  type = type || 'info';
  var el = document.createElement('div');
  el.className = 'message ' + type;
  el.innerHTML = '<span>' + text + '</span><button onclick="this.parentElement.remove()" class="ml-4 text-lg">&times;</button>';
  document.body.appendChild(el);
  setTimeout(function () { if (el.parentElement) el.remove(); }, 5000);
}
