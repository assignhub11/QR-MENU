// Menu data
const menuItems = [
  {
    id: 1,
    name: "Vegetable Samosa",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 120,
    image: "image/samosa.jpg",
    category: "starters",
    isVeg: true,
    spicyLevel: 1,
    bestSeller: true,
  },
  {
    id: 2,
    name: "Paneer Tikka",
    description: "Grilled cottage cheese marinated in yogurt and spices",
    price: 220,
    image: "image/paneer tikka.jpg",
    category: "starters",
    isVeg: true,
    spicyLevel: 2,
  },
  {
    id: 3,
    name: "Chicken Tikka",
    description:
      "Tender chicken pieces marinated in spices and grilled to perfection",
    price: 280,
    image: "image/chiken tikka.jpg",
    category: "starters",
    isVeg: false,
    spicyLevel: 2,
    bestSeller: true,
  },
  {
    id: 4,
    name: "Dal Makhani",
    description: "Black lentils cooked with butter and cream",
    price: 180,
    image: "image/dalmakhani.jpg",
    category: "main-course",
    isVeg: true,
    spicyLevel: 1,
  },
  {
    id: 5,
    name: "Butter Chicken",
    description: "Chicken in a rich tomato and butter gravy",
    price: 320,
    image: "image/butterchicken.jpg",
    category: "main-course",
    isVeg: false,
    spicyLevel: 2,
    bestSeller: true,
  },
  {
    id: 6,
    name: "Paneer Butter Masala",
    description: "Cottage cheese cubes in a rich tomato and butter gravy",
    price: 260,
    image: "image/pbm.jpg",
    category: "main-course",
    isVeg: true,
    spicyLevel: 2,
  },
  {
    id: 7,
    name: "Biryani",
    description:
      "Fragrant rice cooked with herbs, spices and your choice of protein",
    price: 280,
    image: "image/biryani.jpg",
    category: "main-course",
    isVeg: false,
    spicyLevel: 3,
    bestSeller: true,
  },
  {
    id: 8,
    name: "Gulab Jamun",
    description: "Soft milk solids balls soaked in rose-flavored sugar syrup",
    price: 120,
    image: "image/gulabjamun.jpg",
    category: "desserts",
    isVeg: true,
    spicyLevel: 0,
  },
  {
    id: 9,
    name: "Kulfi",
    description: "Traditional Indian ice cream with nuts and cardamom",
    price: 140,
    image: "image/kulfi.jpg",
    category: "desserts",
    isVeg: true,
    spicyLevel: 0,
    bestSeller: true,
  },
  {
    id: 10,
    name: "Mango Lassi",
    description: "Refreshing yogurt drink blended with mango pulp",
    price: 110,
    image: "image/mangolassi.jpg",
    category: "beverages",
    isVeg: true,
    spicyLevel: 0,
  },
  {
    id: 11,
    name: "Masala Chai",
    description: "Spiced Indian tea with milk",
    price: 60,
    image: "image/masalachai.jpg",
    category: "beverages",
    isVeg: true,
    spicyLevel: 0,
  },
];

// DOM elements
const menuContainer = document.getElementById("menuContainer");
const categoriesContainer = document.getElementById("categories");
const searchInput = document.getElementById("searchInput");
const cartIcon = document.getElementById("cartIcon");
const cartContainer = document.getElementById("cartContainer");
const overlay = document.getElementById("overlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const paymentMethods = document.querySelectorAll(".payment-method");

// Cart data
let cart = [];

// Initialize the app
function init() {
  // Load cart from localStorage first
  loadCartFromLocalStorage();

  // Create QR code section in the cart
  createQRCodeSection();

  renderMenu("all");
  setupEventListeners();

  // Add a Go Back button to the cart header
  const cartHeader = document.querySelector(".cart-header");
  const goBackButton = document.createElement("button");
  goBackButton.className = "go-back-btn";
  goBackButton.innerHTML = '<i class="fas fa-arrow-left"></i> Go Back';
  goBackButton.style.cssText = `
    background: rgba(24, 24, 24, 0.51);
    border: none;
    color: white;
    padding: 8px 15px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-right: auto;
    transition: background-color 0.3s;
  `;

  goBackButton.addEventListener("mouseenter", function () {
    this.style.backgroundColor = "rgb(15, 15, 15)";
  });

  goBackButton.addEventListener("mouseleave", function () {
    this.style.backgroundColor = "rgba(37, 37, 37, 0.66)";
  });

  // Add the button before the heading
  cartHeader.insertBefore(goBackButton, cartHeader.firstChild);

  // Add event listener for the go back button
  goBackButton.addEventListener("click", function () {
    cartContainer.classList.remove("open");
    overlay.classList.remove("active");
  });

  // Update cart UI after loading from localStorage
  updateCartUI();

  // Setup bill integration
  setupBillIntegration(); // Add this line

  loadQRCodeLibrary();
}

// Create QR code section inside the cart
function createQRCodeSection() {
  // Create QR code section to be displayed in the cart
  const qrCodeSection = document.createElement("div");
  qrCodeSection.id = "qrCodeSection";
  qrCodeSection.className = "qr-code-section";
  qrCodeSection.style.cssText = `
    display: none;
    padding: 20px;
    background: white;
    border-radius: 10px;
    margin-top: 15px;
    text-align: center;
  `;

  qrCodeSection.innerHTML = `
    <h3>Scan QR Code to Place Order</h3>
    <img id="qrCode" src="" style="max-width:200px;" />
    <p>Scan with any QR code scanner to fetch the order details.</p>
  `;

  // Find the cart footer and insert the QR code section
  const cartFooter = document.querySelector(".cart-footer");
  if (cartFooter) {
    cartFooter.insertBefore(qrCodeSection, cartFooter.firstChild);
  } else {
    console.error("Cart footer not found. QR code section cannot be added.");
  }
}

// Load QR code library dynamically
function loadQRCodeLibrary() {
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
  script.onload = function () {
    console.log("QR Code library loaded successfully");
  };
  script.onerror = function () {
    console.error("Failed to load QR Code library");
  };
  document.head.appendChild(script);
}

// Generate QR code with order details
function generateOrderQRCode() {
  const qrCodeSection = document.getElementById("qrCodeSection");
  const qrCodeImage = document.getElementById("qrCode");

  // Check if elements exist
  if (!qrCodeSection || !qrCodeImage) {
    console.error("QR code section or image not found.");
    return;
  }

  if (cart.length === 0) {
    qrCodeSection.style.display = "none";
    return;
  }

  // Prepare order data
  const orderData = {
    items: cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      isVeg: item.isVeg,
    })),
    subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    timestamp: new Date().toLocaleString(),
  };

  // Convert order data to JSON string
  const orderDataString = JSON.stringify(orderData);

  // Generate QR code
  qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    orderDataString
  )}`;
  qrCodeSection.style.display = "block";
}

async function generateQRCode() {
  const qrCodeSection = document.getElementById("qrCodeSection");
  const qrCodeImage = document.getElementById("qrCode");

  // Check if elements exist
  if (!qrCodeSection || !qrCodeImage) {
    console.error("QR code section or image not found.");
    return;
  }

  if (cart.length === 0) {
    qrCodeSection.style.display = "none";
    return;
  }

  // Prepare order data
  const orderData = {
    items: cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      isVeg: item.isVeg,
    })),
    subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    tax: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.18, // 18% GST
    total:
      cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.18, // Subtotal + GST
    timestamp: new Date().toLocaleString(),
  };

  // Convert order data to JSON string
  const orderDataString = JSON.stringify(orderData);

  // Generate QR code
  qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    orderDataString
  )}`;
  qrCodeSection.style.display = "block";
}

// Save cart to localStorage
function saveCartToLocalStorage() {
  localStorage.setItem("restaurantCart", JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem("restaurantCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// Render menu items based on category
function renderMenu(category) {
  menuContainer.innerHTML = "";
  let filteredItems = menuItems;

  // Filter by category if not "all"
  if (category !== "all") {
    filteredItems = menuItems.filter((item) => item.category === category);
  }

  // Get unique categories for display
  const uniqueCategories = [
    ...new Set(filteredItems.map((item) => item.category)),
  ];

  // If no items found
  if (filteredItems.length === 0) {
    menuContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No items found matching your search.</p>
                <p>Try different keywords or browse from our categories.</p>
            </div>
        `;
    return;
  }

  // Group items by category and render
  uniqueCategories.forEach((category) => {
    const categoryItems = filteredItems.filter(
      (item) => item.category === category
    );
    const categoryName = getCategoryName(category);

    const categorySection = document.createElement("section");
    categorySection.className = "category-section";
    categorySection.innerHTML = `
            <h2 class="category-title">${categoryName}</h2>
            <div class="menu-items" id="${category}-items"></div>
        `;

    menuContainer.appendChild(categorySection);

    const categoryItemsContainer = document.getElementById(`${category}-items`);
    categoryItems.forEach((item) => {
      categoryItemsContainer.appendChild(createMenuItemElement(item));
    });
  });
}

// Get formatted category name
function getCategoryName(category) {
  switch (category) {
    case "starters":
      return "Starters";
    case "main-course":
      return "Main Course";
    case "desserts":
      return "Desserts";
    case "beverages":
      return "Beverages";
    default:
      return "Menu Items";
  }
}

// Create menu item element
function createMenuItemElement(item) {
  const menuItem = document.createElement("div");
  menuItem.className = "menu-item";
  menuItem.dataset.id = item.id;

  // Show spicy level indicators
  let spicyIndicator = "";
  if (item.spicyLevel > 0) {
    spicyIndicator = `<div class="spicy-level">`;
    for (let i = 0; i < item.spicyLevel; i++) {
      spicyIndicator += `<i class="fas fa-pepper-hot"></i>`;
    }
    spicyIndicator += `</div>`;
  }

  // Check if item is in cart to show quantity
  const cartItem = cart.find((cartItem) => cartItem.id === item.id);
  const inCart = cartItem ? true : false;
  const cartQuantity = inCart ? cartItem.quantity : 0;

  let addButton = `<button class="add-to-cart-btn" data-id="${item.id}">Add to cart</button>`;

  // If item is already in cart, show quantity controls
  if (inCart) {
    addButton = `
            <div class="menu-quantity-control">
                <button class="menu-quantity-btn menu-quantity-decrease" data-id="${item.id}">-</button>
                <span class="menu-quantity-number">${cartQuantity}</span>
                <button class="menu-quantity-btn menu-quantity-increase" data-id="${item.id}">+</button>
            </div>
        `;
  }

  menuItem.innerHTML = `
        <div class="item-image" style="background-image: url('${item.image}')">
            ${item.bestSeller ? '<div class="item-badge">Bestseller</div>' : ""}
        </div>
        <div class="item-info">
            <h3 class="item-title">
                ${
                  item.isVeg
                    ? '<span class="veg-indicator"></span>'
                    : '<span class="non-veg-indicator"></span>'
                }
                ${item.name}
            </h3>
            <p class="item-description">${item.description}</p>
            ${spicyIndicator}
            <div class="item-footer">
                <div class="item-price">₹${item.price.toFixed(2)}</div>
                <div class="add-item">
                    ${addButton}
                </div>
            </div>
        </div>
    `;

  return menuItem;
}

// Set up event listeners
function setupEventListeners() {
  // Category buttons
  categoriesContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("category-btn")) {
      const category = e.target.dataset.category;

      // Update active class
      document.querySelectorAll(".category-btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      e.target.classList.add("active");

      // Render menu for selected category
      renderMenu(category);
    }
  });

  document
    .querySelector('.payment-method[data-method="qr"]')
    .addEventListener("click", function () {
      generateOrderQRCode();
    });

  // Search input
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase().trim();

    if (searchTerm.length > 0) {
      // Filter menu items
      const filteredItems = menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm)
      );

      // Clear the container
      menuContainer.innerHTML = "";

      // If no items found
      if (filteredItems.length === 0) {
        menuContainer.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <p>No items found matching your search.</p>
                        <p>Try different keywords or browse from our categories.</p>
                    </div>
                `;
        return;
      }

      // Group filtered items by category
      const categories = [
        ...new Set(filteredItems.map((item) => item.category)),
      ];
      categories.forEach((category) => {
        const categoryItems = filteredItems.filter(
          (item) => item.category === category
        );
        const categoryName = getCategoryName(category);

        const categorySection = document.createElement("section");
        categorySection.className = "category-section";
        categorySection.innerHTML = `
                    <h2 class="category-title">${categoryName}</h2>
                    <div class="menu-items" id="search-${category}-items"></div>
                `;

        menuContainer.appendChild(categorySection);

        const categoryItemsContainer = document.getElementById(
          `search-${category}-items`
        );
        categoryItems.forEach((item) => {
          categoryItemsContainer.appendChild(createMenuItemElement(item));
        });
      });
    } else {
      // If search is cleared, revert to "all" category
      const activeCategory = document.querySelector(".category-btn.active")
        .dataset.category;
      renderMenu(activeCategory);
    }
  });

  // Add to cart and quantity controls (delegated event)
  menuContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("add-to-cart-btn")) {
      e.preventDefault(); // Prevent any default behavior
      e.stopPropagation(); // Stop event bubbling
      const itemId = parseInt(e.target.dataset.id);
      addToCart(itemId);
    }

    // For quantity controls in menu items
    if (e.target.classList.contains("menu-quantity-decrease")) {
      e.preventDefault(); // Prevent any default behavior
      e.stopPropagation(); // Stop event bubbling
      const itemId = parseInt(e.target.dataset.id);
      updateCartItemQuantity(itemId, -1);
    }

    if (e.target.classList.contains("menu-quantity-increase")) {
      e.preventDefault(); // Prevent any default behavior
      e.stopPropagation(); // Stop event bubbling
      const itemId = parseInt(e.target.dataset.id);
      updateCartItemQuantity(itemId, 1);
    }
  });

  // Cart icon
  cartIcon.addEventListener("click", function () {
    cartContainer.classList.add("open");
    overlay.classList.add("active");

    // Hide QR code section initially when cart opens
    const qrCodeSection = document.getElementById("qrCodeSection");
    if (qrCodeSection) {
      qrCodeSection.style.display = "none";
    }
  });

  // Close cart
  closeCart.addEventListener("click", function () {
    cartContainer.classList.remove("open");
    overlay.classList.remove("active");
  });

  // Overlay click
  overlay.addEventListener("click", function () {
    cartContainer.classList.remove("open");
    overlay.classList.remove("active");
  });

  // Cart item quantity changes (delegation)
  cartItems.addEventListener("click", function (e) {
    if (e.target.classList.contains("quantity-btn")) {
      const itemId = parseInt(e.target.closest(".cart-item").dataset.id);

      if (e.target.classList.contains("quantity-decrease")) {
        e.preventDefault();
        e.stopPropagation();
        updateCartItemQuantity(itemId, -1);
      } else if (e.target.classList.contains("quantity-increase")) {
        e.preventDefault();
        e.stopPropagation();
        updateCartItemQuantity(itemId, 1);
      }
    }

    if (e.target.classList.contains("cart-item-remove")) {
      const itemId = parseInt(e.target.closest(".cart-item").dataset.id);
      removeFromCart(itemId);
    }
  });

  // Payment methods
  paymentMethods.forEach((method) => {
    method.addEventListener("click", async function () {
      paymentMethods.forEach((m) => m.classList.remove("active"));
      this.classList.add("active");

      // Show QR code only when QR payment method is selected
      const qrCodeSection = document.getElementById("qrCodeSection");
      if (qrCodeSection) {
        if (this.dataset.method === "qr") {
          await generateQRCode(); // Wait for QR code generation
        } else {
          qrCodeSection.style.display = "none";
        }
      }
    });
  });

  // Checkout button
  checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) {
      showToast("Please add items to your cart first");
      return;
    }

    // Simulate checkout process
    const paymentMethod = document.querySelector(".payment-method.active")
      .dataset.method;
    showToast(`Order placed successfully! Paid via ${paymentMethod}`);

    // Clear cart
    cart = [];
    saveCartToLocalStorage();
    updateCartUI();

    // Close cart
    setTimeout(() => {
      cartContainer.classList.remove("open");
      overlay.classList.remove("active");
    }, 2000);
  });
}

// Add item to cart - FIXED VERSION
function addToCart(itemId) {
  const item = menuItems.find((item) => item.id === itemId);

  // Check if item is already in cart
  const existingItem = cart.find((cartItem) => cartItem.id === itemId);

  if (existingItem) {
    // Instead of incrementing by 1, we explicitly set the new value
    // This prevents any potential issues with increment operations
    existingItem.quantity = existingItem.quantity + 1;
  } else {
    // Add the item with quantity 1 for first time
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      isVeg: item.isVeg,
    });
  }

  saveCartToLocalStorage();
  updateCartUI();
  showToast(`${item.name} added to cart`);

  // Re-render the menu to update quantity controls
  const activeCategory = document.querySelector(".category-btn.active").dataset
    .category;
  renderMenu(activeCategory);
}

// Update cart item quantity - FIXED VERSION
function updateCartItemQuantity(itemId, change) {
  const cartItem = cart.find((item) => item.id === itemId);

  // Ensure we only change by exactly the change value
  // Explicitly set the new value instead of using += to avoid any potential issues
  cartItem.quantity = cartItem.quantity + change;

  // Remove item if quantity is zero or less
  if (cartItem.quantity <= 0) {
    removeFromCart(itemId);
    return;
  }

  saveCartToLocalStorage();
  updateCartUI();

  // Re-render the menu to update quantity controls
  const activeCategory = document.querySelector(".category-btn.active").dataset
    .category;
  renderMenu(activeCategory);
}

// Remove item from cart
function removeFromCart(itemId) {
  cart = cart.filter((item) => item.id !== itemId);
  saveCartToLocalStorage();
  updateCartUI();

  // Re-render the menu to update quantity controls
  const activeCategory = document.querySelector(".category-btn.active").dataset
    .category;
  renderMenu(activeCategory);
}

// Update cart UI
function updateCartUI() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Render cart items
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-basket"></i>
        <p>Your cart is empty</p>
        <p>Add items from our menu to place an order</p>
      </div>
    `;

    // Hide QR code section when cart is empty
    const qrCodeSection = document.getElementById("qrCodeSection");
    if (qrCodeSection) {
      qrCodeSection.style.display = "none";
    }
  } else {
    cartItems.innerHTML = "";
    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.dataset.id = item.id;

      cartItem.innerHTML = `
        <div class="cart-item-img" style="background-image: url('${
          item.image
        }')"></div>
        <div class="cart-item-details">
          <div class="cart-item-name">
            ${
              item.isVeg
                ? '<span class="veg-indicator"></span>'
                : '<span class="non-veg-indicator"></span>'
            }
            ${item.name}
          </div>
          <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
          <div class="quantity-control">
            <button class="quantity-btn quantity-decrease">-</button>
            <span class="quantity-number">${item.quantity}</span>
            <button class="quantity-btn quantity-increase">+</button>
          </div>
        </div>
        <div class="cart-item-remove">
          <i class="fas fa-times"></i>
        </div>
      `;

      cartItems.appendChild(cartItem);
    });
  }

  // Update cart totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxRate = 0.18; // 18% GST
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
  cartTax.textContent = `₹${tax.toFixed(2)}`; // Add this line
  cartTotal.textContent = `₹${total.toFixed(2)}`;

  // Show QR code only if the QR payment method is selected
  const activePaymentMethod = document.querySelector(".payment-method.active");
  if (activePaymentMethod && activePaymentMethod.dataset.method === "qr") {
    generateOrderQRCode();
  } else {
    const qrCodeSection = document.getElementById("qrCodeSection");
    if (qrCodeSection) {
      qrCodeSection.style.display = "none";
    }
  }
}

// Show toast notification
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Add CSS for quantity controls in menu items and QR code
const style = document.createElement("style");
style.textContent = `
    .menu-quantity-control {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .menu-quantity-btn {
        background: #ff5722;
        color: white;
        border: none;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
    }
    
    .menu-quantity-btn:hover {
        background: #e64a19;
    }
    
    .menu-quantity-number {
        font-weight: 600;
        min-width: 25px;
        text-align: center;
    }
    
    .qr-code-section {
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin: 15px 0;
        text-align: center;
    }
    
    .qr-code-section h3 {
        color: #333;
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 18px;
    }
    
    .qr-code-display {
        margin: 15px auto;
        max-width: 200px;
    }
    
    .qr-code-section p {
        color: #666;
        font-size: 14px;
        margin-bottom: 5px;
    }
`;
document.head.appendChild(style);

// Get readable payment method label
function getPaymentMethodLabel(method) {
  const paymentMethodLabels = {
    card: "Credit/Debit Card",
    upi: "UPI Payment",
    paytm: "Paytm Wallet",
    cash: "Cash Payment",
  };
  return paymentMethodLabels[method] || method;
}

// Add a view bill button to the cart
// Continuing the addViewBillButton function
// Add a view bill button to the cart
function addViewBillButton() {
  const cartFooter = document.querySelector(".cart-footer");

  // Check if the button already exists
  if (document.querySelector(".view-bill-btn")) {
    return; // Exit if the button is already present
  }

  const viewBillButton = document.createElement("button");
  viewBillButton.className = "view-bill-btn";
  viewBillButton.innerHTML = '<i class="fas fa-file-invoice"></i> View Bill';

  // Style the button
  viewBillButton.style.cssText = `
        background: white;
        color: #ff5722;
        border: 1px solid #ff5722;
        padding: 10px 15px;
        border-radius: 25px;
        cursor: pointer;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 15px;
        transition: all 0.3s;
    `;

  viewBillButton.addEventListener("mouseenter", function () {
    this.style.backgroundColor = "#fff8f6";
  });

  viewBillButton.addEventListener("mouseleave", function () {
    this.style.backgroundColor = "white";
  });

  // Add click event to redirect to bill page
  viewBillButton.addEventListener("click", function () {
    if (cart.length === 0) {
      showToast("Your cart is empty");
      return;
    }
    window.location.href = "bill.html";
  });

  // Insert before the checkout button
  cartFooter.insertBefore(viewBillButton, checkoutBtn);
}

function loadQRCodeLibrary() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    script.onload = () => {
      console.log("QR Code library loaded successfully");
      resolve();
    };
    script.onerror = () => {
      console.error("Failed to load QR Code library");
      reject();
    };
    document.head.appendChild(script);
  });
}
// Call this function in the `init` function
// function init() {
//   loadCartFromLocalStorage();
//   createQRCodeSection();
//   renderMenu("all");
//   setupEventListeners();
//   setupBillIntegration();
//   // Add this line
// }

// Bill generation functions
function generateBill() {
  // Get cart data from localStorage
  const savedCart = localStorage.getItem("restaurantCart");
  if (!savedCart || JSON.parse(savedCart).length === 0) {
    // Handle empty cart case
    return {
      items: [],
      subtotal: 0,
      total: 0,
    };
  }

  const cartData = JSON.parse(savedCart);

  // Calculate totals
  const subtotal = cartData.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal; // No tax as per requirements

  return {
    items: cartData,
    subtotal: subtotal,
    total: total,
    timestamp: new Date().toLocaleString(),
    orderId: generateOrderId(),
    paymentMethod:
      localStorage.getItem("selectedPaymentMethod") || "Cash Payment",
  };
}

// Generate a unique order ID
function generateOrderId() {
  const timestamp = Date.now().toString();
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp.slice(-6)}-${randomNum}`;
}

// Function to render the bill page
function renderBillPage() {
  const billContainer = document.getElementById("billContainer");
  if (!billContainer) return; // Not on bill page

  const billData = generateBill();

  if (billData.items.length === 0) {
    billContainer.innerHTML = `
            <div class="empty-bill">
                <i class="fas fa-receipt"></i>
                <h3>No Order Found</h3>
                <p>There's no recent order to display</p>
                <a href="index.html" class="return-btn">Return to Menu</a>
            </div>
        `;
    return;
  }

  // Prepare items HTML
  let itemsHtml = "";
  billData.items.forEach((item) => {
    itemsHtml += `
            <tr>
                <td>
                    ${
                      item.isVeg
                        ? '<span class="veg-indicator"></span>'
                        : '<span class="non-veg-indicator"></span>'
                    }
                    ${item.name}
                </td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">₹${item.price.toFixed(2)}</td>
                <td class="text-right">₹${(item.price * item.quantity).toFixed(
                  2
                )}</td>
            </tr>
        `;
  });

  // Build bill HTML
  billContainer.innerHTML = `
        <div class="bill-header">
            <div class="restaurant-info">
                <h1>Flavor Fusion</h1>
                <p>123 Culinary Street, Foodville</p>
                <p>Phone: +91 98765 43210</p>
            </div>
            <div class="bill-details">
                <p><strong>Order ID:</strong> ${billData.orderId}</p>
                <p><strong>Date:</strong> ${billData.timestamp}</p>
                <p><strong>Payment Method:</strong> ${
                  billData.paymentMethod
                }</p>
            </div>
        </div>
        
        <div class="bill-content">
            <h2>Invoice</h2>
            <table class="bill-items">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th class="text-center">Qty</th>
                        <th class="text-right">Price</th>
                        <th class="text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" class="text-right"><strong>Subtotal:</strong></td>
                        <td class="text-right">₹${billData.subtotal.toFixed(
                          2
                        )}</td>
                    </tr>
                    <tr>
                        <td colspan="3" class="text-right"><strong>Total:</strong></td>
                        <td class="text-right total-amount">₹${billData.total.toFixed(
                          2
                        )}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        
        <div class="bill-footer">
            <p>Thank you for dining with us!</p>
            <div class="bill-actions">
                <button id="printBill" class="print-btn"><i class="fas fa-print"></i> Print Bill</button>
                <a href="index.html" class="return-btn"><i class="fas fa-arrow-left"></i> Return to Menu</a>
            </div>
        </div>
    `;

  // Add print functionality
  document.getElementById("printBill").addEventListener("click", function () {
    window.print();
  });
}

// Setup bill integration for the main menu page
function setupBillIntegration() {
  // Update checkout button to redirect to bill page
  checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) {
      showToast("Please add items to your cart first");
      return;
    }

    // Get the selected payment method
    const selectedPayment = document.querySelector(".payment-method.active")
      .dataset.method;
    // Store the payment method in localStorage
    localStorage.setItem(
      "selectedPaymentMethod",
      getPaymentMethodLabel(selectedPayment)
    );

    // Show checkout success message
    showToast(`Order placed successfully! Redirecting to bill...`);

    // Wait for toast to display before redirecting
    setTimeout(() => {
      // Redirect to bill page
      window.location.href = "bill.html?checkout=success";
    }, 1500);
  });

  // Add a dedicated "View Bill" button to the cart
  if (document.querySelector(".view-bill-btn")) {
    return; // Exit if the button is already present
  }
  addViewBillButton();
}

// Get readable payment method label
function getPaymentMethodLabel(method) {
  const paymentMethodLabels = {
    card: "Credit/Debit Card",
    upi: "UPI Payment",
    paytm: "Paytm Wallet",
    cash: "Cash Payment",
  };
  return paymentMethodLabels[method] || method;
}

// Initialize based on current page
document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on the main menu page
  if (document.getElementById("menuContainer")) {
    init();
    setupBillIntegration();
  }

  // Check if we're on the bill page
  if (document.getElementById("billContainer")) {
    renderBillPage();

    // If this is a success checkout (from URL param)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("checkout") === "success") {
      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className = "checkout-success";
      successMessage.innerHTML = `
        <div class="success-icon"><i class="fas fa-check-circle"></i></div>
        <h3>Order Placed Successfully!</h3>
        <p>Thank you for your order</p>
      `;
      document.body.appendChild(successMessage);

      // Remove after animation
      setTimeout(() => {
        successMessage.classList.add("show");

        setTimeout(() => {
          successMessage.classList.remove("show");
          setTimeout(() => {
            successMessage.remove();
          }, 500);
        }, 3000);
      }, 100);
    }
  }
});

// CSS for the bill page and success message
const billStyles = document.createElement("style");
billStyles.textContent = `
    .bill-container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .bill-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px dashed #ddd;
    }
    
    .restaurant-info h1 {
        font-size: 24px;
        color: #ff5722;
        margin: 0 0 10px 0;
    }
    
    .restaurant-info p {
        margin: 5px 0;
        color: #666;
    }
    
    .bill-details p {
        margin: 5px 0;
        text-align: right;
    }
    
    .bill-content h2 {
        font-size: 20px;
        margin-bottom: 15px;
        color: #333;
    }
    
    .bill-items {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
    }
    
    .bill-items th, .bill-items td {
        padding: 12px 8px;
        border-bottom: 1px solid #eee;
    }
    
    .bill-items th {
        background: #f9f9f9;
        font-weight: 600;
    }
    
    .text-center {
        text-align: center;
    }
    
    .text-right {
        text-align: right;
    }
    
    .total-amount {
        font-size: 18px;
        font-weight: 700;
        color: #ff5722;
    }
    
    .bill-footer {
        margin-top: 30px;
        text-align: center;
        color: #666;
    }
    
    .bill-actions {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 20px;
    }
    
    .print-btn, .return-btn {
        padding: 10px 20px;
        border-radius: 25px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.3s;
    }
    
    .print-btn {
        background: #ff5722;
        color: white;
        border: none;
    }
    
    .print-btn:hover {
        background: #e64a19;
    }
    
    .return-btn {
        background: white;
        color: #333;
        border: 1px solid #ddd;
    }
    
    .return-btn:hover {
        background: #f5f5f5;
    }
    
    .empty-bill {
        text-align: center;
        padding: 50px 20px;
        color: #666;
    }
    
    .empty-bill i {
        font-size: 50px;
        color: #ddd;
        margin-bottom: 20px;
    }
    
    .checkout-success {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 1000;
        opacity: 0;
        transition: all 0.5s;
    }
    
    .checkout-success.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
    
    .success-icon {
        font-size: 24px;
    }
    
    .checkout-success h3 {
        margin: 0;
        font-weight: 600;
    }
    
    .checkout-success p {
        margin: 0;
        opacity: 0.9;
    }
    
    @media print {
        body * {
            visibility: hidden;
        }
        
        .bill-container, .bill-container * {
            visibility: visible;
        }
        
        .bill-actions {
            display: none;
        }
        
        .bill-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none;
        }
    }
`;

document.head.appendChild(billStyles);
