/**
 * DHARA PRODUCT STORE — v10
 * SEED_VERSION controls which products show by default.
 * Bumping SEED_VERSION forces ALL browsers/origins to reset to SEED_PRODUCTS.
 */
(function () {

  var STORAGE_KEY  = 'dhara_products';
  var VERSION_KEY  = 'dhara_products_ver';
  var SEED_VER_KEY = 'dhara_seed_ver';
  var SEED_VERSION = '1'; // bump this to force-reset all browsers

  // ── EXACT ADMIN PRODUCTS (from admin panel screenshot) ──────
  var SEED_PRODUCTS = [
    {
      id: 1,
      name: 'AquaFresh RO Premium Kent',
      category: 'water',
      price: 9999,
      originalPrice: 12999,
      image: 'https://m.media-amazon.com/images/I/51PJlh5BXVL._SL1000_.jpg',
      description: 'Advanced 7-stage purification with TDS control and UV sterilization',
      longDescription: 'Our premium RO water purifier combines advanced technology with reliable performance to deliver pure, safe drinking water for your family.',
      features: ['7-stage purification', 'TDS controller', 'UV sterilization', '1-year warranty'],
      specifications: { 'Capacity': '9 Liters', 'Purification': 'RO+UV+UF+TDS', 'Power': '25 Watts', 'Warranty': '1 Year' },
      installation: 'Free installation included',
      warranty: '1 year comprehensive',
      rating: 4.8, reviews: 156, inStock: true
    },
    {
      id: 2,
      name: 'LG - Front Load Washing Machine',
      category: 'laundry',
      price: 35499,
      originalPrice: 38999,
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600',
      description: 'Energy efficient 7kg capacity with smart wash programs',
      longDescription: 'Experience superior washing performance with LG front-load washing machine.',
      features: ['7kg capacity', 'Smart wash programs', '5-star energy rating', '2-year warranty'],
      specifications: { 'Capacity': '7 kg', 'Energy': '5 Star', 'RPM': '1200', 'Warranty': '2 Years' },
      installation: 'Free installation and demo',
      warranty: '2 years comprehensive',
      rating: 4.7, reviews: 89, inStock: true
    },
    {
      id: 3,
      name: 'LG - Split Air Conditioner 1.5 Ton',
      category: 'cooling',
      price: 36999,
      originalPrice: 42999,
      image: 'https://www.lg.com/content/dam/channel/wcms/ma/images/ac/features/rac-eu-w12ti-inverter-ac-w-05-2-1-ac-with-dual-sensing.jpg',
      description: 'Dual Inverter technology with smart cooling and energy saving',
      longDescription: 'Experience superior cooling with LG Dual Inverter AC.',
      features: ['Dual Inverter', '5-star rating', 'Smart cooling', '3-year warranty'],
      specifications: { 'Capacity': '1.5 Ton', 'Energy': '5 Star', 'Technology': 'Dual Inverter', 'Warranty': '3 Years' },
      installation: 'Professional installation with copper piping',
      warranty: '3 years comprehensive',
      rating: 4.8, reviews: 298, inStock: true
    },
    {
      id: 4,
      name: 'Samsung - Double Door Refrigerator 330 L',
      category: 'kitchen',
      price: 36990,
      originalPrice: 48999,
      image: 'https://m.media-amazon.com/images/I/81R74fqNPVL._SL1500_.jpg',
      description: 'Frost-free 330L with smart inverter technology and digital inverter',
      longDescription: 'Keep your food fresh with Samsung advanced double door refrigerator.',
      features: ['330L capacity', 'Frost-free', 'Digital Inverter', '3-year warranty'],
      specifications: { 'Capacity': '330 Liters', 'Type': 'Frost Free', 'Energy': '3 Star', 'Warranty': '3 Years' },
      installation: 'Free installation and demo',
      warranty: '3 years comprehensive',
      rating: 4.7, reviews: 187, inStock: true
    },
    {
      id: 5,
      name: 'Crompton - Desert Air Cooler 75 Liters',
      category: 'cooling',
      price: 11999,
      originalPrice: 18999,
      image: 'https://www.epoddar.com/wp-content/uploads/2025/07/Crompton-Ozone-75-Liters-Desert-Air-Cooler-2.jpg',
      description: 'Large 75L tank with powerful cooling and remote control',
      longDescription: 'Beat the heat with Crompton powerful desert air cooler.',
      features: ['75L water tank', 'Remote control', '4-way air deflection', '2-year warranty'],
      specifications: { 'Tank': '75 Liters', 'Area': '400-500 sq ft', 'Power': '180 Watts', 'Warranty': '2 Years' },
      installation: 'Free delivery and setup',
      warranty: '2 years comprehensive',
      rating: 4.4, reviews: 145, inStock: true
    },
    {
      id: 6,
      name: 'Home Atta Chakki - Darshan',
      category: 'kitchen',
      price: 12999,
      originalPrice: 19999,
      image: 'https://m.media-amazon.com/images/I/81uIVN5sz0L._SL1500_.jpg',
      description: 'Automatic Domestic Flour Mill with Stainless Steel Grinder, Hopper and Container, Aata Maker',
      longDescription: '● Flour Mill – Premium Automatic Domestic Atta Chakki. 1 Year Warranty on product mother board, 5 Years warranty on motor, 5 Years Warranty On Grinding Chamber, Except Damages, Consumables, Plastic, wooden and rubber part. <br> ● Extra Energy Saving - The atta chakki utilizes approx 0.75 units of energy per hour to grind approx 10 to 12 kgs (Depends on the sieve number and the thickness of flour), With the motor power of 1 H.P. and a speed of 2800 RPM the machine even works perfectly even at a low voltage of 180V. <br> ● The atta chakki can grind wheat, dal, masala, maize, haldi, kali mirchi, coffee, jawar, bajra, ragi and corn. For an effective grind make sure the contents that you wish to grind are dry and should not contain oil.',
      features: ['Type - Wood', 'Free Cover', 'Smart Sensers', '1-year warranty'],
      specifications: { 'Output Capacity': '10 Kilograms', 'Voltage': '180 Volts', 'Weight': '40 Kilograms', 'Dimensions': '47 x 33.7 x 82.4 cm', 'Power Source': 'AC adapter', 'Material': 'Wood' },
      installation: 'Free delivery and setup',
      warranty: '1 years comprehensive',
      rating: 4.9, reviews: 215, inStock: true
    },
    {
      id: 7,
      name: 'Havells - Electric Water Heater(Geyser) 10L',
      category: 'water',
      price: 8900,
      originalPrice: 12200,
      image: 'https://m.media-amazon.com/images/I/51O6MX29r1L._SL1080_.jpg',
      description: 'Faster Heating | Safer to use | Saves electricity | Engineered for Hard Water | LED Indicator',
      longDescription: '● Capacity: 10 Litres; Wattage: 2000 Watts; Pressure: 8 Bars ; BEE Rating: 4 Star; Waterproof Degree : IPX-4 Protection for longer product life. <br> ● Suitable for high-rise buildings and pressure pump applications.  <br> ● It is made of ultra-thick super cold rolled steel plates that provides higher resistance to corrosion resulting in longer life than standard inner tank designs. <br> ● Whirlpool Technology: It avoids direct contact between cold and hot water flow for faster heating and optimized energy saving resulting in 20 % more hot water output.',
      features: ['75', 'Remote', 'deflection', 'warranty'],
      specifications: { 'Brand': 'Havells - Instanio', 'Capacity': '10 litres', 'Voltag': '230 Volts', 'Dimensions': '36.9 x 36.9 cm', 'Weight': '10500 Grams', 'Warranty': '2 Years' },
      installation: 'Free delivery and setup',
      warranty: '2 years comprehensive',
      rating: 4.6, reviews: 165, inStock: true
    },
    {
      id: 8,
      name: 'Bajaj - GAS Water Heater(Geyser) 6L',
      category: 'water',
      price: 6916,
      originalPrice: 9950,
      image: 'https://s3b.cashify.in/gpro/uploads/2023/07/17121656/bajaj-gas-geyser.jpg',
      description: 'Summer or winter, heating water to an optimal temperature according to the weather condition.',
      longDescription: 'Hot water, in the blink of an eye!, Elegant Body Shell - Adds aesthetic value to the bathroom, Thermoplastic outer body - prevents rusting and corrosion, Neon indicator for Power On and Heating - gives status of water heating and readiness, ISI certification - assurance of product quality, Fire retardant cable - Additional safety from hazards, Suitable for High-Rise Buildings - Pressure withstanding capacity of 8 bars, Product Warranty - 2 years.',
      features: ['6L Capacity' , 'ISI certification' , 'Gas Type - LPG', '1-year warranty'],
      specifications: { 'Brand': 'BAJAJ - MAJESTY DUETTO', 'Dimensions': '56 x 33 x 19 cm', 'Weight': '5.3 kg', 'Body Material': 'Steel' , 'Water Flow Rate': '360 L/hr', 'Warranty': '1 Years' },
      installation: 'Free delivery and setup',
      warranty: '1 years comprehensive',
      rating: 4.8, reviews: 189, inStock: true
    }
  ];

  // ── STORAGE HELPERS ─────────────────────────────────────────

  function readFromStorage() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return null;
  }

  function writeToStorage(products) {
    try {
      var ver = String(Date.now());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      localStorage.setItem(VERSION_KEY, ver);
      localStorage.setItem(SEED_VER_KEY, SEED_VERSION);
      return ver;
    } catch (e) { return null; }
  }

  // ── FORCE RESET if seed version is outdated ─────────────────
  // This clears stale data from ALL origins (file://, http://127.0.0.1, etc.)
  var storedSeedVer = localStorage.getItem(SEED_VER_KEY);
  if (storedSeedVer !== SEED_VERSION) {
    // Old or missing version — wipe everything and re-seed
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VERSION_KEY);
    writeToStorage(SEED_PRODUCTS);
    console.log('[ProductStore] Reset to v' + SEED_VERSION + ' — ' + SEED_PRODUCTS.length + ' products loaded');
  } else if (!readFromStorage()) {
    // Version matches but data is missing — re-seed
    writeToStorage(SEED_PRODUCTS);
    console.log('[ProductStore] Seeded v' + SEED_VERSION + ' — ' + SEED_PRODUCTS.length + ' products');
  }

  // ── SYNC ENGINE ─────────────────────────────────────────────
  var _lastVer = localStorage.getItem(VERSION_KEY) || '0';

  function _triggerUpdate() {
    _lastVer = localStorage.getItem(VERSION_KEY) || '0';
    try { window.dispatchEvent(new Event('productsUpdated')); } catch (e) {}
  }

  setInterval(function () {
    var v = localStorage.getItem(VERSION_KEY) || '0';
    if (v !== _lastVer) _triggerUpdate();
  }, 300);

  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY || e.key === VERSION_KEY) _triggerUpdate();
  });

  var _bc = null;
  try {
    _bc = new BroadcastChannel('dhara_product_sync');
    _bc.onmessage = function () { _triggerUpdate(); };
  } catch (e) {}

  function _saveAndBroadcast(products) {
    var ver = writeToStorage(products);
    if (ver) {
      _lastVer = ver;
      _triggerUpdate();
      if (_bc) { try { _bc.postMessage({ ver: ver }); } catch (e) {} }
    }
  }

  // ── PUBLIC API ───────────────────────────────────────────────
  window.productManager = {

    getAll:                function () { return readFromStorage() || SEED_PRODUCTS.slice(); },
    getAllProducts:         function () { return this.getAll(); },
    loadProducts:          function () { return this.getAll(); },

    getById: function (id) {
      var list = this.getAll();
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === +id) return list[i];
      }
      return null;
    },
    getProduct: function (id) { return this.getById(id); },

    getByCategory: function (cat) {
      var list = this.getAll();
      if (!cat || cat === 'all') return list;
      var match = (cat === 'Home') ? ['Home', 'kitchen'] : [cat];
      return list.filter(function (p) { return match.indexOf(p.category) !== -1; });
    },
    getProductsByCategory: function (cat) { return this.getByCategory(cat); },

    add: function (data) {
      var list = this.getAll();
      var maxId = 0;
      for (var i = 0; i < list.length; i++) { if (list[i].id > maxId) maxId = list[i].id; }
      var product = { id: maxId + 1 };
      for (var k in data) { if (data.hasOwnProperty(k)) product[k] = data[k]; }
      list.push(product);
      _saveAndBroadcast(list);
      return product.id;
    },
    addProduct: function (data) { return this.add(data); },

    update: function (id, data) {
      var list = this.getAll();
      var found = false;
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === +id) {
          for (var k in data) { if (data.hasOwnProperty(k)) list[i][k] = data[k]; }
          list[i].id = +id;
          found = true;
          break;
        }
      }
      if (!found) return false;
      _saveAndBroadcast(list);
      return true;
    },
    updateProduct: function (id, data) { return this.update(id, data); },

    remove: function (id) {
      var list = this.getAll();
      var next = list.filter(function (p) { return p.id !== +id; });
      if (next.length === list.length) return false;
      _saveAndBroadcast(next);
      return true;
    },
    deleteProduct: function (id) { return this.remove(id); },

    debug: function () {
      var data = readFromStorage();
      console.log('=== ProductManager Debug ===');
      console.log('Origin:', window.location.origin);
      console.log('SEED_VERSION:', SEED_VERSION, '| Stored:', localStorage.getItem(SEED_VER_KEY));
      console.log('Products:', data ? data.length : 0);
      if (data) data.forEach(function (p, i) {
        console.log('  [' + i + '] id=' + p.id + ' | ' + p.name + ' | ' + p.category);
      });
      return data;
    },

    forceSync: function () {
      var list = this.getAll();
      _saveAndBroadcast(list);
      return list.length;
    }
  };

  console.log('[ProductStore] Ready v' + SEED_VERSION + ' | ' + window.location.origin + ' | Products: ' + (readFromStorage() || []).length);

})();
