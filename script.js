// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5X9VwkILBgMp76NUxOonRMuGAczBdXMU",
  authDomain: "swaad-qr.firebaseapp.com",
  projectId: "swaad-qr",
  storageBucket: "swaad-qr.appspot.com",
  messagingSenderId: "330570799980",
  appId: "1:330570799980:web:e0486d5a560ec64bd3b149",
  measurementId: "G-KC4P9YWCC1",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const menuCollection = db.collection("menuItems");
const categoryCollection = db.collection("categories");

// Global variables
let currentCategory = "all";
let allMenuItems = [];
let categories = [];
let filteredItems = [];
let isSearchActive = false;
let cart = [];

// Function to load categories
function loadCategories() {
  return categoryCollection
    .get()
    .then((querySnapshot) => {
      const categoryList = [];

      querySnapshot.forEach((doc) => {
        categoryList.push({
          id: doc.id,
          name: doc.data().name,
        });
      });

      return categoryList;
    })
    .catch((error) => {
      console.error("Error loading categories: ", error);
      return [];
    });
}

// Function to update category tabs
function updateCategoryTabs(categoriesList) {
  categories = categoriesList;
  const tabsContainer = document.getElementById("category-tabs");

  // Clear existing tabs except "All Items"
  tabsContainer.innerHTML =
    '<button class="nav-tab active" data-category="all">All Items</button>';

  categoriesList.forEach((category) => {
    // Add tab
    const tab = document.createElement("button");
    tab.classList.add("nav-tab");
    tab.setAttribute("data-category", category.id);
    tab.textContent = category.name;
    tab.onclick = () => filterMenuByCategory(category.id);
    tabsContainer.appendChild(tab);
  });
}

// Function to load menu items
function loadMenu() {
  const menuList = document.getElementById("menu-list");
  menuList.innerHTML = '<div class="loader"></div>';

  return menuCollection
    .get()
    .then((querySnapshot) => {
      allMenuItems = [];
      menuList.innerHTML = "";

      // Store all items
      querySnapshot.forEach((doc) => {
        allMenuItems.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Display items based on current category
      displayMenuItems();
      return allMenuItems;
    })
    .catch((error) => {
      console.error("Error loading menu: ", error);
      menuList.innerHTML = `
                        <div class="empty-state">
                            <h3>Error Loading Menu</h3>
                            <p>There was a problem connecting to the database.</p>
                        </div>
                    `;
      return [];
    });
}

// Function to filter menu by category
function filterMenuByCategory(categoryId) {
  // Update active tab
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.remove("active");
    if (tab.getAttribute("data-category") === categoryId) {
      tab.classList.add("active");
    }
  });

  // Set current category
  currentCategory = categoryId;

  // If "All Items" is selected, reset filtered items
  if (currentCategory === "all") {
    filteredItems = allMenuItems; // Reset filtered items to all menu items
  }

  // Display items based on the selected category
  displayMenuItems();
}

// Function to search menu items
function searchMenu(event) {
  // If Enter key pressed or button clicked
  if (event && event.key && event.key !== "Enter") {
    return;
  }

  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim();

  if (searchTerm === "") {
    // If search cleared, revert to category view
    isSearchActive = false;
    displayMenuItems();
    return;
  }

  isSearchActive = true;

  // Filter items by search term
  filteredItems = allMenuItems.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchTerm) ||
      (item.description && item.description.toLowerCase().includes(searchTerm))
    );
  });

  // Display search results
  displayMenuItems(true);
}

// Function to display menu items based on current category or search
function displayMenuItems(isSearchResult = false) {
  const menuList = document.getElementById("menu-list");
  menuList.innerHTML = "";

  // Determine which items to display
  let displayItems = isSearchResult ? filteredItems : allMenuItems;

  // Filter by category if not searching and not "all" category
  if (!isSearchResult && currentCategory !== "all") {
    displayItems = displayItems.filter(
      (item) => item.categoryId === currentCategory
    );
  }

  // Check if there are items to display
  if (displayItems.length === 0) {
    menuList.innerHTML = `
      <div class="no-results">
        <h3>${
          isSearchResult ? "No search results found" : "No items found"
        }</h3>
        <p>${
          isSearchResult
            ? "Try different keywords or browse our menu categories"
            : "There are no items in this category yet"
        }</p>
      </div>
    `;
    return;
  }

  // Display items
  displayItems.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("menu-item");

    // Find category name
    let categoryName = "Uncategorized";
    const category = categories.find((cat) => cat.id === item.categoryId);
    if (category) {
      categoryName = category.name;
    }

    div.innerHTML = `
      <img src="${item.image || "/api/placeholder/400/320"}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>₹${item.price}</p>
      <div style="color:#666;margin-bottom:10px;font-size:14px;">
        ${item.description || ""}
        <br>
        <span style="color:#999;">${categoryName}</span>
      </div>
      <button onclick="addToCart('${item.id}', '${item.name}', ${
      item.price
    })">Add to Cart</button>
    `;
    menuList.appendChild(div);
  });
}

// Function to add an item to the cart
function addToCart(id, name, price) {
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      quantity: 1,
    });
  }

  updateCartUI();
  showNotification(`Added ${name} to cart!`);
}

// Function to remove an item from the cart
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCartUI();
  showNotification("Item removed from cart");
}

// Function to update cart quantity
function updateCartQuantity(id, quantity) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity = parseInt(quantity);
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartUI();
    }
  }
}

// Function to update the cart UI
function updateCartUI() {
  const cartItems = document.getElementById("cart-items");
  const cartBadge = document.getElementById("cart-badge");
  const totalAmount = document.getElementById("cart-total-amount");
  let total = 0;
  let itemCount = 0;

  // Clear current cart display
  cartItems.innerHTML = "";

  // Check if cart is empty
  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-state">Your cart is empty</div>';
    cartBadge.textContent = "0";
    totalAmount.textContent = "₹0";
    return;
  }

  // Display cart items
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    itemCount += item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
                    <div>
                        <div><strong>${item.name}</strong></div>
                        <div>₹${item.price} × 
                            <input type="number" min="1" value="${item.quantity}" 
                                onchange="updateCartQuantity('${item.id}', this.value)" style="width:40px;"> 
                            = ₹${itemTotal}
                        </div>
                    </div>
                    <button onclick="removeFromCart('${item.id}')" style="background:none;border:none;cursor:pointer;font-size:18px;">🗑️</button>
                `;
    cartItems.appendChild(div);
  });

  // Update total
  cartBadge.textContent = itemCount;
  totalAmount.textContent = `₹${total}`;

  // Generate QR code if the QR payment method is selected
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

// Function to toggle cart visibility
function toggleCart() {
  document.getElementById("cart").classList.toggle("active");
}

// Show notification
function showNotification(message, isError = false) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.backgroundColor = isError ? "#ff3333" : "#4CAF50";
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// Create QR code section inside the cart
function createQRCodeSection() {
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
    <div id="qrCode"></div>
    <p>Scan with any QR code scanner to fetch the order details.</p>
  `;

  const cartFooter = document.querySelector(".cart-footer");
  if (cartFooter) {
    cartFooter.insertBefore(qrCodeSection, cartFooter.firstChild);
  } else {
    console.error("Cart footer not found. QR code section cannot be added.");
  }
}

// Function to set up real-time updates for menu and categories
function setupRealTimeUpdates() {
  // Listen for menu item changes
  menuCollection.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (
        change.type === "added" ||
        change.type === "modified" ||
        change.type === "removed"
      ) {
        // Reload menu data
        loadMenu();
      }
    });
  });

  // Listen for category changes
  categoryCollection.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (
        change.type === "added" ||
        change.type === "modified" ||
        change.type === "removed"
      ) {
        // Reload categories
        loadCategories().then(updateCategoryTabs);
      }
    });
  });
}

// Generate QR code with order details
function generateOrderQRCode() {
  const qrCodeSection = document.getElementById("qrCodeSection");
  const qrCodeElement = document.getElementById("qrCode");

  if (!qrCodeSection || !qrCodeElement) {
    console.error("QR code section or element not found.");
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
    })),
    subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    tax: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.18, // 18% GST
    total:
      cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.18, // Subtotal + GST
    timestamp: new Date().toLocaleString(),
  };

  // Convert order data to JSON string
  const orderDataString = JSON.stringify(orderData);

  // Clear previous QR code
  qrCodeElement.innerHTML = "";

  // Generate QR code using qrcode.js library
  new QRCode(qrCodeElement, {
    text: orderDataString,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  qrCodeSection.style.display = "block";
}

// Load QR code library dynamically
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

// Initialize the app
function init() {
  loadCategories()
    .then((categoriesList) => {
      updateCategoryTabs(categoriesList);
      return loadMenu();
    })
    .then(() => {
      // Setup real-time updates
      setupRealTimeUpdates();
      // Create QR code section
      createQRCodeSection();
      // Load QR code library
      return loadQRCodeLibrary();
    })
    .catch((error) => {
      console.error("Error initializing app: ", error);
      showNotification("Error loading menu data", true);
    });
}

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  init();
});
