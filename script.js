document.addEventListener('DOMContentLoaded', function() {
    const featuredProducts = [
        { id: 1, name: "CPAP Avanzado Pro", description: "Máquina CPAP de última generación con ajuste automático", price: 799.99, image: "img/cpap_avanzado.jpg" },
        { id: 2, name: "Mascarilla Nasal Comfort+", description: "Mascarilla nasal ultraligera con almohadillas de gel", price: 129.99, image: "img/mascarilla_nasal.jpg" },
        { id: 3, name: "Humidificador ClimateControl", description: "Humidificador inteligente con control de temperatura", price: 189.99, image: "img/humificador_integrado.jpg" },
        { id: 4, name: "Almohada Cervical Anti-Apnea", description: "Diseño ergonómico para mejorar la posición durante el sueño", price: 79.99, image: "img/almohada_apnea.jpg" }
    ];

    function renderFeaturedProducts() {
        const container = document.getElementById('featured-products-container');
        if (!container) return;

        container.innerHTML = featuredProducts.map(product => `
            <div class="col-md-6 col-lg-3">
                <div class="card h-100 border-0 shadow-sm" data-product-id="${product.id}">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text flex-grow-1">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="h5 mb-0">$${product.price.toFixed(2)}</span>
                            <button class="btn btn-primary btn-sm">Añadir al carrito</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderFeaturedProducts();

    let cart = [];

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartUI();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartUI();
    }

    function updateCartUI() {
        const cartItemsElement = document.getElementById('cartItems');
        const cartBadgeElement = document.getElementById('cartBadge');
        const cartTotalElement = document.getElementById('cartTotal');

        cartItemsElement.innerHTML = '';
        let totalItems = 0;
        let totalPrice = 0;

        cart.forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;

            const itemElement = document.createElement('li');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div>
                        <p class="cart-item-name">${item.name}</p>
                        <p class="cart-item-price">${item.quantity} x $${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="bi bi-trash"></i>
                </button>
            `;
            cartItemsElement.appendChild(itemElement);
        });

        cartBadgeElement.textContent = totalItems;
        cartTotalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
    }


    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-primary') && e.target.textContent === 'Añadir al carrito') {
            e.preventDefault();
            const productElement = e.target.closest('.card');
            const productId = parseInt(productElement.dataset.productId);
            const product = featuredProducts.find(p => p.id === productId);
            if (product) {
                addToCart(product);
                showAddToCartToast();
            }
        }
    });


    window.removeFromCart = removeFromCart;

    function showAddToCartToast() {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '11';
        toastContainer.innerHTML = `
            <div id="addToCartToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto">Producto añadido</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    El producto se ha añadido correctamente a tu carrito.
                </div>
            </div>
        `;
        document.body.appendChild(toastContainer);

        const toast = new bootstrap.Toast(document.getElementById('addToCartToast'));
        toast.show();

        setTimeout(() => {
            toastContainer.remove();
        }, 3000);
    }


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    function showPurchaseConfirmationToast() {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '11';
        toastContainer.innerHTML = `
            <div id="purchaseToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto">Compra realizada</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ¡Tu compra se ha realizado con éxito!
                </div>
            </div>
        `;
        document.body.appendChild(toastContainer);

        const toast = new bootstrap.Toast(document.getElementById('purchaseToast'));
        toast.show();

        setTimeout(() => {
            toastContainer.remove();
        }, 3000);
    }

    document.getElementById('buyButton').addEventListener('click', function() {
        showPurchaseConfirmationToast();
    });


    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    const newsletterForm = document.querySelector('footer form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert(`Gracias por suscribirte con el email: ${email}`);
            this.reset();
        });
    }
});
