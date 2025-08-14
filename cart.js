document.addEventListener('DOMContentLoaded', function() {
    // Productos combinados de los tres archivos
    const products = [
        // Productos de sueño.js
        { id: 1, name: "ResMed AirFit N30i", type: "nasal", price: 129.99, image: "/placeholder.svg?height=200&width=200" },
        { id: 2, name: "Philips Respironics DreamWear", type: "nasal", price: 149.99, image: "/placeholder.svg?height=200&width=200" },
        { id: 3, name: "Fisher & Paykel Vitera", type: "facial", price: 189.99, image: "/placeholder.svg?height=200&width=200" },
        { id: 4, name: "ResMed AirFit P10", type: "nasal-pillow", price: 109.99, image: "/placeholder.svg?height=200&width=200" },
        { id: 5, name: "Philips Respironics Amara View", type: "facial", price: 169.99, image: "/placeholder.svg?height=200&width=200" },
        { id: 6, name: "Fisher & Paykel Brevida", type: "nasal-pillow", price: 119.99, image: "/placeholder.svg?height=200&width=200" },
        // Productos de accessories.js
        { id: 7, name: "Filtros desechables", category: "limpieza", price: 19.99, image: "img/filtrodes.jpg?height=200&width=200" },
        { id: 8, name: "Almohadilla de gel", category: "confort", price: 29.99, image: "img/almuadilla.jpg?height=200&width=200" },
        { id: 9, name: "Tubo de repuesto", category: "repuesto", price: 39.99, image: "img/tuborepuesto.jpg?height=200&width=200" },
        { id: 10, name: "Limpiador de máscaras", category: "limpieza", price: 14.99, image: "img/limpiadormas.jpg?height=200&width=200" },
        { id: 11, name: "Funda para máquina CPAP", category: "confort", price: 24.99, image: "img/funda.jpg?height=200&width=200" },
        { id: 12, name: "Correas de repuesto", category: "repuesto", price: 17.99, image: "img/correas.jpg?height=200&width=200" },
        // Productos de mascaras.js
        { id: 13, name: "Almohada Cervical Anti-Apnea", category: "Almohadas", price: 79.99, image: "img/almohada_apnea.jpg?height=200&width=200" },
        { id: 14, name: "Almohada para Cuello Ajustable", category: "Almohadas", price: 59.99, image: "/placeholder.svg?height=200&width=200" },
        { id: 15, name: "Humidificador ClimateControl", category: "Aromaterapia", price: 189.99, image: "img/humificador_integrado.jpg?height=200&width=200" },
        { id: 16, name: "Cobertor de Cama Ultra Suave", category: "Cubiertas", price: 79.99, image: "/placeholder.svg?height=200&width=200" }
    ];

    let cart = [];

    const productGrid = document.getElementById('productGrid');
    const cartContainer = document.getElementById('cartContainer');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutButton = document.getElementById('checkoutButton');

    // Función para renderizar productos
    function renderProducts() {
        productGrid.innerHTML = products.map(product => `
            <div class="col-12 col-md-4 mb-4">
                <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">Categoría: ${product.category}</p>
                        <p class="card-text">Precio: $${product.price.toFixed(2)}</p>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">Añadir al carrito</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Función para añadir productos al carrito
    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCartUI();
        }
    }

    // Función para actualizar la UI del carrito
    function updateCartUI() {
        const cartItemsContainer = document.getElementById('cartItems');
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item d-flex justify-content-between mb-2">
                <span>${item.name} - ${item.quantity} x $${item.price.toFixed(2)}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">Eliminar</button>
            </div>
        `).join('');
        
        // Mostrar total del carrito
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `Total: $${total.toFixed(2)}`;

        // Guardar carrito en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Función para eliminar productos del carrito
    window.removeFromCart = function(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartUI();
    }

    // Cargar carrito desde localStorage
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
    }

    // Acción de pagar
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            alert("¡Gracias por tu compra! Procesando pago...");
            cart = [];
            updateCartUI();
        } else {
            alert("Tu carrito está vacío.");
        }
    });

    // Cargar el carrito desde localStorage y los productos
    loadCart();
    renderProducts();
});
