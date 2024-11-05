const products = [
    { id: 1, title: "Product 1", price: 19.99, image: "product1.jpg" },
    { id: 2, title: "Product 2", price: 29.99, image: "product1.jpg" },
    { id: 3, title: "Product 3", price: 39.99, image: "product1.jpg" },
];

if (document.getElementById('product-container')) {
    const productContainer = document.getElementById('product-container');
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h2 class="product-title">${product.title}</h2>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productContainer.appendChild(card);
    });
}

const cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        document.getElementById('clear-cart').style.display = 'none';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        const productImage = document.createElement('img');
        productImage.src = item.image;
        productImage.alt = item.title;
        productImage.classList.add('cart-item-image');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.setAttribute('data-id', item.id);

        cartItem.appendChild(productImage);
        cartItem.innerHTML += `
            ${item.title} - $${item.price.toFixed(2)}
        `;
        cartItem.appendChild(deleteButton);

        deleteButton.addEventListener('click', function() {
            deleteProductFromCart(item.id);
        });

        cartContainer.appendChild(cartItem);
    });

    document.getElementById('clear-cart').style.display = 'block';
}

function deleteProductFromCart(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
        cart.splice(productIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const product = products.find(p => p.id === productId);
        
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    }
});

if (document.getElementById('clear-cart')) {
    document.getElementById('clear-cart').addEventListener('click', function() {
        localStorage.removeItem('cart');
        cart.length = 0;
        updateCart();
    });

    updateCart();
}
