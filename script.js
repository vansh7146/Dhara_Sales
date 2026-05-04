// Dhara Sells & Service - Main JavaScript

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function () {
  loadProducts();
  initCart();
  initForms();
  updateCartUI();

  window.addEventListener('productsUpdated', function () {
    loadProducts(currentFilter);
  });
});

// ── Products ──────────────────────────────────────────────────

function loadProducts(filter) {
  filter = filter || 'all';
  currentFilter = filter;
  var grid = document.getElementById('products-grid');
  if (!grid) return;

  var products = window.productManager.getProductsByCategory(filter);

  if (products.length === 0) {
    grid.innerHTML = '<p class="text-center text-gray-500 col-span-full py-12">No products found.</p>';
    return;
  }

  grid.innerHTML = products.map(function (product) {
    var discount = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
    return '<div class="product-card" data-category="' + product.category + '">' +
      '<div class="relative">' +
        '<img src="' + product.image + '" alt="' + product.name + '" onerror="this.src=\'https://via.placeholder.com/300x200?text=No+Image\'">' +
        (discount > 0 ? '<div class="discount">' + discount + '% OFF</div>' : '') +
      '</div>' +
      '<div class="content">' +
        '<h3>' + product.name + '</h3>' +
        '<p>' + product.description + '</p>' +
        '<div class="rating">' +
          '<div class="stars">' +
            [0,1,2,3,4].map(function(i){ return '<i class="fas fa-star ' + (i < Math.floor(product.rating || 4.5) ? '' : 'opacity-30') + '"></i>'; }).join('') +
          '</div>' +
          '<span class="count">' + (product.rating || 4.5) + ' (' + (product.reviews || 0) + ')</span>' +
        '</div>' +
        '<div class="flex items-center justify-between mb-4"><div>' +
          '<span class="price">&#8377;' + product.price.toLocaleString() + '</span>' +
          (product.originalPrice ? '<span class="original-price">&#8377;' + product.originalPrice.toLocaleString() + '</span>' : '') +
        '</div></div>' +
        '<div class="buttons">' +
          '<button class="btn-secondary" onclick="viewProduct(' + product.id + ')">' +
            '<i class="fas fa-eye mr-1"></i>View' +
          '</button>' +
          '<button class="btn-primary" onclick="addToCart(' + product.id + ')">' +
            '<i class="fas fa-cart-plus mr-1"></i>Add to Cart' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function filterProducts(category, el) {
  currentFilter = category;
  loadProducts(category);
  document.querySelectorAll('.filter-btn').forEach(function (btn) { btn.classList.remove('active'); });
  if (el) el.classList.add('active');
}

function viewProduct(productId) {
  localStorage.setItem('selectedProductId', productId);
  window.location.href = 'product-details.html';
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

function addToCart(productId) {
  var product = window.productManager.getProduct(productId);
  if (!product) return;
  var existing = cart.find(function (i) { return i.id === productId; });
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  showMessage(product.name + ' added to cart!', 'success');
}

function removeFromCart(productId) {
  cart = cart.filter(function (i) { return i.id !== productId; });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  showMessage('Item removed from cart', 'info');
}

function updateQuantity(productId, change) {
  var item = cart.find(function (i) { return i.id === productId; });
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) { removeFromCart(productId); return; }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  var cartCount   = document.getElementById('cart-count');
  var cartItems   = document.getElementById('cart-items');
  var cartTotal   = document.getElementById('cart-total');
  var checkoutBtn = document.getElementById('checkout-btn');
  if (!cartCount || !cartItems || !cartTotal || !checkoutBtn) return;

  var totalItems = cart.reduce(function (s, i) { return s + i.quantity; }, 0);
  var totalPrice = cart.reduce(function (s, i) { return s + i.price * i.quantity; }, 0);

  if (totalItems > 0) {
    cartCount.textContent = totalItems;
    cartCount.classList.remove('hidden');
  } else {
    cartCount.classList.add('hidden');
  }

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="text-gray-500 text-center">Your cart is empty</p>';
  } else {
    cartItems.innerHTML = cart.map(function (item) {
      return '<div class="cart-item">' +
        '<img src="' + item.image + '" alt="' + item.name + '">' +
        '<div class="details">' +
          '<div class="name">' + item.name + '</div>' +
          '<div class="price">&#8377;' + item.price.toLocaleString() + '</div>' +
          '<div class="quantity">' +
            '<button onclick="updateQuantity(' + item.id + ', -1)"><i class="fas fa-minus"></i></button>' +
            '<span>' + item.quantity + '</span>' +
            '<button onclick="updateQuantity(' + item.id + ', 1)"><i class="fas fa-plus"></i></button>' +
          '</div>' +
        '</div>' +
        '<div class="remove" onclick="removeFromCart(' + item.id + ')"><i class="fas fa-trash"></i></div>' +
      '</div>';
    }).join('');
  }

  cartTotal.textContent = '&#8377;' + totalPrice.toLocaleString();
  checkoutBtn.disabled = cart.length === 0;
}

function checkout() {
  if (cart.length === 0) return;
  var totalItems = cart.reduce(function (s, i) { return s + i.quantity; }, 0);
  var totalPrice = cart.reduce(function (s, i) { return s + i.price * i.quantity; }, 0);
  var message = '\uD83D\uDED2 *NEW ORDER*\n\n\uD83D\uDCCB *Order Details:*\n' +
    cart.map(function (i) {
      return '\u2022 ' + i.name + '\n  Qty: ' + i.quantity + ' x \u20B9' + i.price.toLocaleString() + ' = \u20B9' + (i.price * i.quantity).toLocaleString();
    }).join('\n\n') +
    '\n\n\uD83D\uDCCA *Total Items:* ' + totalItems +
    '\n\uD83D\uDCB5 *Total Amount:* \u20B9' + totalPrice.toLocaleString() +
    '\n\n\uD83D\uDCDE *Please provide:*\n\u2022 Full Name\n\u2022 Phone Number\n\u2022 Delivery Address\n\u2022 Preferred Delivery Date\n\n*Order Time:* ' + new Date().toLocaleString();
  window.open('https://wa.me/919898670727?text=' + encodeURIComponent(message), '_blank');
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  closeCart();
  showMessage('Order sent to WhatsApp!', 'success');
}

// ── Forms ─────────────────────────────────────────────────────

function initForms() {

  // Service Booking Form — sends via WhatsApp
  var serviceForm = document.getElementById('service-form');
  if (serviceForm) {
    serviceForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name        = document.getElementById('service-name').value;
      var phone       = document.getElementById('service-phone').value;
      var location    = document.getElementById('service-location').value;
      var type        = document.getElementById('service-type').value;
      var applianceEl = document.getElementById('appliance-type');
      var appliance   = applianceEl ? applianceEl.value : '';
      var description = document.getElementById('service-description').value;
      var message = '\uD83D\uDD27 *SERVICE BOOKING*\n\n' +
        '\uD83D\uDC64 *Name:* ' + name + '\n' +
        '\uD83D\uDCDE *Phone:* ' + phone + '\n' +
        '\uD83D\uDCCD *Location:* ' + location + '\n' +
        '\uD83D\uDEE0\uFE0F *Service Type:* ' + type + '\n' +
        (appliance ? '\uD83D\uDD27 *Appliance:* ' + appliance + '\n' : '') +
        '\uD83D\uDCDD *Description:* ' + description + '\n\n' +
        '*Booking Time:* ' + new Date().toLocaleString();
      window.open('https://wa.me/919898670727?text=' + encodeURIComponent(message), '_blank');
      serviceForm.reset();
      showMessage('Service booking sent to WhatsApp!', 'success');
    });
  }

  // Contact Form — calls process-contact.php, falls back to WhatsApp
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name      = (document.getElementById('contact-name').value || '').trim();
      var phoneEl   = document.getElementById('contact-phone');
      var phone     = phoneEl ? phoneEl.value.trim() : '';
      var email     = (document.getElementById('contact-email').value || '').trim();
      var subjectEl = document.getElementById('contact-subject');
      var subject   = subjectEl ? subjectEl.value.trim() : 'General Inquiry';
      var message   = (document.getElementById('contact-message').value || '').trim();

      var btn    = document.getElementById('contact-submit-btn');
      var result = document.getElementById('contact-result');

      // Show loading state
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
      }

      function showResult(success, msg) {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Send Message';
        }
        if (result) {
          result.className = 'text-center py-2 px-4 rounded-lg font-medium text-sm ' +
            (success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800');
          result.textContent = msg;
          result.classList.remove('hidden');
        }
        showMessage(msg, success ? 'success' : 'error');
      }

      function sendViaWhatsApp() {
        var wa = '\uD83D\uDCAC *CONTACT MESSAGE*\n\n' +
          '\uD83D\uDC64 *Name:* ' + name + '\n' +
          (phone ? '\uD83D\uDCDE *Phone:* ' + phone + '\n' : '') +
          '\uD83D\uDCE7 *Email:* ' + email + '\n' +
          '\uD83D\uDCCB *Subject:* ' + subject + '\n' +
          '\uD83D\uDCAC *Message:* ' + message + '\n\n' +
          '*Sent:* ' + new Date().toLocaleString();
        window.open('https://wa.me/919898670727?text=' + encodeURIComponent(wa), '_blank');
        contactForm.reset();
        showResult(true, 'Message sent via WhatsApp!');
      }

      // Try PHP backend first; fall back to WhatsApp if unavailable
      fetch('process-contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name, phone: phone, email: email,
          subject: subject, message: message
        })
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          contactForm.reset();
          showResult(true, data.message || 'Message sent successfully!');
        } else {
          showResult(false, data.message || 'Failed to send. Please try again.');
        }
      })
      .catch(function () {
        // PHP not available (file:// or no server) — use WhatsApp
        sendViaWhatsApp();
      });
    });
  }
}

// ── Utility ───────────────────────────────────────────────────

function showMessage(text, type) {
  type = type || 'info';
  var el = document.createElement('div');
  el.className = 'message ' + type;
  el.innerHTML = '<span>' + text + '</span><button onclick="this.parentElement.remove()" class="ml-4 text-lg">&times;</button>';
  document.body.appendChild(el);
  setTimeout(function () { if (el.parentElement) el.remove(); }, 5000);
}

// ── Globals ───────────────────────────────────────────────────
window.filterProducts = filterProducts;
window.viewProduct    = viewProduct;
window.addToCart      = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
