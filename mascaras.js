document.addEventListener('DOMContentLoaded', function() {
    const products = [
        { id: 1, name: "ResMed AirFit N30i", type: "nasal", price: 129.99, image: "img/resmed30i.jpg?height=200&width=200" },
        { id: 2, name: "Philips Respironics DreamWear", type: "nasal", price: 149.99, image: "img/philips.jpg?height=200&width=200" },
        { id: 3, name: "Fisher & Paykel Vitera", type: "facial", price: 189.99, image: "img/fisher.jpg?height=200&width=200" },
        { id: 4, name: "ResMed AirFit P10", type: "nasal-pillow", price: 109.99, image: "img/resmedp10.jpg?height=200&width=200" },
        { id: 5, name: "Philips Respironics Amara View", type: "facial", price: 169.99, image: "img/philipsamara.jpg?height=200&width=200" },
        { id: 6, name: "Fisher & Paykel Brevida", type: "nasal-pillow", price: 119.99, image: "img/fisher_paykel.jpg?height=200&width=200" }
    ];

    const itemsPerPage = 6;
    let currentPage = 1;
    let filteredProducts = [...products];

    const productGrid = document.getElementById('productGrid');
    const pagination = document.getElementById('pagination');
    const filterForm = document.getElementById('filterForm');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const cartCount = document.getElementById('cart-count');  // Elemento para mostrar la cantidad de productos en el carrito.

    // Función para obtener el carrito desde el localStorage
    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    // Función para actualizar el carrito en el localStorage
    function updateCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI(cart);
    }

    // Función para actualizar la UI del carrito (mostrar la cantidad de productos)
    function updateCartUI(cart) {
        const cartTotal = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = cartTotal;
    }

    // Función para añadir un producto al carrito
    function addToCart(productId) {
        const cart = getCart();
        const product = products.find(p => p.id === productId);

        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            updateCart(cart);
            showAddToCartToast(product.name);
        }
    }

    // Función para mostrar un toast de "Añadido al carrito"
    function showAddToCartToast(productName) {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.innerHTML = `
            <div class="toast" role="alert">
                <div class="toast-header">
                    <strong class="me-auto">Producto añadido</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${productName} se ha añadido a tu carrito.
                </div>
            </div>
        `;
        document.body.appendChild(toastContainer);

        const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
        toast.show();

        setTimeout(() => {
            toastContainer.remove();
        }, 3000);
    }
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

    // Función para renderizar productos
    function renderProducts(page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageProducts = filteredProducts.slice(startIndex, endIndex);

        productGrid.innerHTML = pageProducts.map(product => `
            <div class="col">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">Tipo: ${product.type}</p>
                        <p class="card-text">Precio: $${product.price.toFixed(2)}</p>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">Añadir al carrito</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Función para renderizar la paginación
    function renderPagination() {
        const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
        let paginationHTML = '';

        for (let i = 1; i <= pageCount; i++) {
            paginationHTML += `
                <li class="page-item ${currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        pagination.innerHTML = paginationHTML;

        pagination.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = parseInt(e.target.dataset.page);
                renderProducts(currentPage);
                renderPagination();
            });
        });
    }

    // Función para aplicar filtros
    function applyFilters() {
        const selectedTypes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
        const maxPrice = parseInt(priceRange.value);

        filteredProducts = products.filter(product => 
            (selectedTypes.length === 0 || selectedTypes.includes(product.type)) &&
            product.price <= maxPrice
        );

        currentPage = 1;
        renderProducts(currentPage);
        renderPagination();
    }

    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyFilters();
    });

    priceRange.addEventListener('input', () => {
        priceValue.textContent = priceRange.value;
    });

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.type.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        renderProducts(currentPage);
        renderPagination();
    });

    // Inicialización
    renderProducts(currentPage);
    renderPagination();
    updateCartUI(getCart());
});
