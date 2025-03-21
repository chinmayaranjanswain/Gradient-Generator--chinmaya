// Sample product data (in a real application, this would come from your API)
const products = [
    {
        id: 1,
        name: "Luxury Chronograph Watch",
        price: 1299.99,
        description: "Premium chronograph watch with genuine leather strap and sapphire crystal",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500",
        category: "Luxury",
        features: ["Swiss Movement", "Sapphire Crystal", "Genuine Leather", "Water Resistant"],
        stock: 5
    },
    {
        id: 2,
        name: "Diamond-Encrusted Gold Watch",
        price: 2499.99,
        description: "18K gold-plated watch with genuine diamond indices",
        image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500",
        category: "Luxury",
        features: ["Diamond Indices", "18K Gold Plating", "Automatic Movement", "Limited Edition"],
        stock: 3
    },
    {
        id: 3,
        name: "Smart Watch Pro",
        price: 699.99,
        description: "Advanced smartwatch with health monitoring and premium finish",
        image: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=500",
        category: "Smart",
        features: ["Heart Rate Monitor", "GPS", "AMOLED Display", "5-Day Battery"],
        stock: 10
    },
    {
        id: 4,
        name: "Classic Skeleton Watch",
        price: 899.99,
        description: "Elegant skeleton watch showcasing intricate mechanical movement",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500",
        category: "Luxury",
        features: ["Visible Movement", "Stainless Steel", "Automatic Winding", "Exhibition Case Back"],
        stock: 7
    },
    {
        id: 5,
        name: "Vintage Pilot Watch",
        price: 1599.99,
        description: "Classic pilot watch with vintage-inspired design and reliable movement",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500",
        category: "Luxury",
        features: ["Vintage Design", "Luminous Hands", "Chronograph", "Water Resistant"],
        stock: 4
    },
    {
        id: 6,
        name: "Modern Minimalist Watch",
        price: 599.99,
        description: "Clean and contemporary design with premium materials",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500",
        category: "Luxury",
        features: ["Minimalist Design", "Japanese Movement", "Sapphire Crystal", "Date Display"],
        stock: 8
    }
];

// Cart state
let cart = [];
let isCartOpen = false;

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartCount = document.querySelector('.cart-count');
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');
const cartIcon = document.querySelector('.cart-icon');

// Create cart modal
const cartModal = document.createElement('div');
cartModal.className = 'cart-modal';
cartModal.innerHTML = `
    <div class="cart-modal-header">
        <h2>Your Cart</h2>
        <button class="close-cart">&times;</button>
    </div>
    <div class="cart-items"></div>
    <div class="cart-total">
        <h3>Total: $<span class="total-amount">0.00</span></h3>
        <button class="checkout-btn">Proceed to Checkout</button>
    </div>
`;
document.body.appendChild(cartModal);

// Cart functionality
function toggleCart() {
    isCartOpen = !isCartOpen;
    cartModal.classList.toggle('active');
    if (isCartOpen) {
        updateCartDisplay();
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity++;
                showNotification('Product quantity updated in cart!');
            } else {
                showNotification('Maximum stock limit reached!', 'error');
                return;
            }
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
            showNotification('Product added to cart!');
        }
        updateCartCount();
        updateCartDisplay();
        saveCartToLocalStorage();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
    saveCartToLocalStorage();
    showNotification('Product removed from cart!');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0 && newQuantity <= product.stock) {
            item.quantity = newQuantity;
            updateCartDisplay();
            saveCartToLocalStorage();
            showNotification('Cart updated!');
        } else if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            showNotification('Maximum stock limit reached!', 'error');
        }
    }
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = cartModal.querySelector('.cart-items');
    const totalElement = cartModal.querySelector('.total-amount');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalElement.textContent = '0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">&times;</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalElement.textContent = total.toFixed(2);
}

// Display products with premium features
function displayProducts(productsToShow = products) {
    productGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="quick-view-btn" onclick="quickView(${product.id})">Quick View</button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-features">
                    ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})"
                    ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `).join('');
}

// Quick view functionality
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-quick-view">&times;</button>
            <div class="quick-view-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="quick-view-details">
                <h2>${product.name}</h2>
                <p class="quick-view-category">${product.category}</p>
                <p class="quick-view-description">${product.description}</p>
                <div class="quick-view-features">
                    ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="quick-view-price">$${product.price.toFixed(2)}</div>
                <div class="quick-view-stock ${product.stock === 0 ? 'out-of-stock' : ''}">
                    ${product.stock > 0 ? `In Stock: ${product.stock} units` : 'Out of Stock'}
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})"
                    ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Add active class after a small delay to trigger animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);

    // Close quick view
    const closeBtn = modal.querySelector('.close-quick-view');
    closeBtn.onclick = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    };

    // Close on background click
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    };

    // Close on escape key
    document.addEventListener('keydown', function closeQuickView(e) {
        if (e.key === 'Escape') {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                document.removeEventListener('keydown', closeQuickView);
            }, 300);
        }
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Local Storage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Event Listeners
cartIcon.addEventListener('click', toggleCart);

const closeCart = cartModal.querySelector('.close-cart');
closeCart.addEventListener('click', toggleCart);

const checkoutBtn = cartModal.querySelector('.checkout-btn');
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    showNotification('Proceeding to checkout...', 'success');
    // Add checkout logic here
});

searchButton.addEventListener('click', () => {
    searchProducts(searchInput.value);
});

searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchProducts(searchInput.value);
    }
});

// Search functionality
function searchProducts(query) {
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.features.some(feature => feature.toLowerCase().includes(query.toLowerCase()))
    );
    displayProducts(filtered);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    displayProducts();
}); 