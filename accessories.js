document.addEventListener('DOMContentLoaded', function() {
    const products = [
        { id: 7, name: "Filtros desechables", category: "limpieza", price: 19.99, image: "img/filtrodes.jpg?height=200&width=200" },
        { id: 8, name: "Almohadilla de gel", category: "confort", price: 29.99, image: "img/almuadilla.jpg?height=200&width=200" },
        { id: 9, name: "Tubo de repuesto", category: "repuesto", price: 39.99, image: "img/tuborepuesto.jpg?height=200&width=200" },
        { id: 10, name: "Limpiador de máscaras", category: "limpieza", price: 14.99, image: "img/limpiadormas.jpg?height=200&width=200" },
        { id: 11, name: "Funda para máquina CPAP", category: "confort", price: 24.99, image: "img/funda.jpg?height=200&width=200" },
        { id: 12, name: "Correas de repuesto", category: "repuesto", price: 17.99, image: "img/correas.jpg?height=200&width=200" }
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

    function renderProducts(page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageProducts = filteredProducts.slice(startIndex, endIndex);

        productGrid.innerHTML = pageProducts.map(product => `
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">Categoría: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                        <p class="card-text">Precio: $${product.price.toFixed(2)}</p>
                        <button class="btn btn-outline-primary w-100" onclick="addToCart(${product.id})">Añadir al carrito</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

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

    function applyFilters() {
        const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
        const maxPrice = parseInt(priceRange.value);

        filteredProducts = products.filter(product => 
            (selectedCategories.length === 0 || selectedCategories.includes(product.category)) &&
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
            product.category.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        renderProducts(currentPage);
        renderPagination();
    });

    // Carrito de compras
    let cart = [];

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
            showAddToCartToast(product.name);
        }
    }

    function updateCartUI() {
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        const cartDisplay = document.getElementById('cartCount');
        if (cartDisplay) {
            cartDisplay.textContent = cartCount;
        }
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

    function showAddToCartToast(productName) {
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
                    ${productName} se ha añadido correctamente a tu carrito.
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

    // Inicialización
    renderProducts(currentPage);
    renderPagination();
});
