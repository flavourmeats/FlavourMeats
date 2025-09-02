// Cart functionality
let cart = [];
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const miniCart = document.getElementById('mini-cart');
const miniCartTotal = document.getElementById('mini-cart-total');

// Check for saved address
const savedAddress = localStorage.getItem('deliveryAddress');
if (savedAddress) {
    document.getElementById('address').value = savedAddress);
}

function addToCart(productId, name, price) {
    // Hide the add button and show quantity controls
    document.getElementById(`button-${productId.split('-')[1]}`).style.display = 'none';
    document.getElementById(`controls-${productId.split('-')[1]}`).style.display = 'flex';
    
    // Check if item already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, name, price, quantity: 1 });
    }
    
    updateCart();
    updateMiniCart();
    updateProductDisplay(productId);
}

function updateQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            // Remove item if quantity is 0
            cart.splice(itemIndex, 1);
            // Hide controls and show add button
            document.getElementById(`button-${productId.split('-')[1]}`).style.display = 'block';
            document.getElementById(`controls-${productId.split('-')[1]}`).style.display = 'none';
        } else {
            // Update product display
            updateProductDisplay(productId);
        }
        
        updateCart();
        updateMiniCart();
    }
}

function updateProductDisplay(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const productNum = productId.split('-')[1];
        document.getElementById(`quantity-${productNum}`).textContent = item.quantity;
        document.getElementById(`price-${productNum}`).textContent = `₹${(item.price * item.quantity).toFixed(0)}`;
    }
}

function updateCart() {
    // Update cart items display
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">₹${item.price.toFixed(2)} / kg</div>
            </div>
            <div class="item-quantity">
                <button class="cart-item-quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="cart-item-quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                <span class="remove-item" onclick="removeItem('${item.id}')">❌</span>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Update total
    cartTotal.textContent = `Total: ₹${total.toFixed(2)}`;
}

function updateMiniCart() {
    if (cart.length === 0) {
        miniCart.style.display = 'none';
        return;
    }
    
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    miniCartTotal.textContent = `₹${totalAmount.toFixed(2)}`;
    miniCart.style.display = 'flex';
}

function removeItem(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        
        // Hide controls and show add button
        document.getElementById(`button-${productId.split('-')[1]}`).style.display = 'block';
        document.getElementById(`controls-${productId.split('-')[1]}`).style.display = 'none';
        
        updateCart();
        updateMiniCart();
    }
}

function openCart() {
    cartModal.style.display = 'flex';
    setTimeout(() => {
        cartModal.classList.add('open');
    }, 10);
}

function closeCart() {
    cartModal.classList.remove('open');
    setTimeout(() => {
        cartModal.style.display = 'none';
    }, 300);
}

function checkout(paymentMethod) {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const address = document.getElementById('address').value;
    if (!address) {
        alert('Please provide your delivery address');
        return;
    }
    
    // Save address for future orders
    localStorage.setItem('deliveryAddress', address);
    
    // Create order summary for WhatsApp with proper formatting
    let message = "Hello! 👋 ";
    
    if (paymentMethod === 'upi') {
        message += "I have made a payment for an order:%0A%0A";
    } else {
        message += "I'd like to place an order:%0A%0A";
    }
    
    cart.forEach(item => {
        message += `🛵 *${item.quantity}x ${item.name}* – ₹${(item.price * item.quantity).toFixed(2)}%0A`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `%0A💰 *Total:* \`₹${total.toFixed(2)}\`%0A`;
    message += `📌 *Address:* ${address}%0A`;
    
    if (paymentMethod === 'upi') {
        message += "💳 *Payment:* UPI (Paid)";
    } else {
        message += "💵 *Payment:* Cash on Delivery";
    }
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/918264457734?text=${message}`, '_blank');
    
    // Clear cart after order
    cart = [];
    updateCart();
    updateMiniCart();
    closeCart();
    
    // Reset all product controls
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`button-${i}`).style.display = 'block';
        document.getElementById(`controls-${i}`).style.display = 'none';
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target == cartModal) {
        closeCart();
    }
};

// Initialize
updateMiniCart();
