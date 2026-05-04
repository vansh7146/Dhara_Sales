# Easy Product Management Guide

## 📝 How to Modify Products

### 1. **Edit Product Details**
Open `product-config.js` file and modify any product:

```javascript
ro_premium: {
  name: "Your Product Name",           // Change product name
  price: 12999,                       // Change price
  originalPrice: 15999,               // Change original price
  image: "your-image-url",            // Change main image
  description: "Your description",     // Change short description
  features: ["Feature 1", "Feature 2"], // Change features list
  // ... modify any field
}
```

### 2. **Add New Product**
Add a new product to `PRODUCT_CONFIG`:

```javascript
your_new_product: {
  id: 13,                            // Use next available ID
  name: "New Product Name",
  category: "water",                 // water, kitchen, cooling, laundry
  price: 9999,
  originalPrice: 12999,
  image: "product-image-url",
  description: "Product description",
  features: ["Feature 1", "Feature 2"],
  specifications: {
    "Spec 1": "Value 1",
    "Spec 2": "Value 2"
  },
  installation: "Installation details",
  warranty: "Warranty details",
  inStock: true,
  rating: 4.5,
  reviews: 100
}
```

### 3. **Update Business Settings**
Modify `BUSINESS_CONFIG` in `product-config.js`:

```javascript
const BUSINESS_CONFIG = {
  whatsappNumber: "919898670727",     // Your WhatsApp number
  businessName: "Your Business Name",
  businessEmail: "your@email.com",
  businessPhone: "+91 XXXXXXXXXX",
  // ... other settings
}
```

### 4. **Categories Available**
- `water` - RO plants, geysers, water heaters
- `kitchen` - Refrigerators, atta chakki
- `cooling` - AC, air coolers
- `laundry` - Washing machines

### 5. **Quick Changes**

**Change Price:**
```javascript
price: 15999,        // New price
originalPrice: 19999, // Old price (for discount calculation)
```

**Update Features:**
```javascript
features: [
  "New Feature 1",
  "New Feature 2", 
  "New Feature 3"
]
```

**Change Images:**
```javascript
image: "https://your-new-image-url.jpg"
```

**Update Stock Status:**
```javascript
inStock: true,  // true = available, false = out of stock
```

### 6. **After Making Changes**
1. Save the `product-config.js` file
2. Refresh your website
3. Changes will appear automatically

### 7. **WhatsApp Integration**
When customers click "Buy Now":
- Opens WhatsApp with your number: `919898670727`
- Sends product details automatically
- Includes customer form for details

### 8. **Common Modifications**

**Seasonal Discounts:**
```javascript
price: 8999,         // Discounted price
originalPrice: 11999, // Original price
```

**New Product Launch:**
```javascript
// Add to PRODUCT_CONFIG
new_product: {
  id: 14,
  name: "Latest Model XYZ",
  // ... other details
}
```

**Update Contact Info:**
```javascript
// In BUSINESS_CONFIG
whatsappNumber: "919898670727",
businessPhone: "+91 98765 43210",
```

## 🚀 That's It!
No database needed - just edit the config file and save!