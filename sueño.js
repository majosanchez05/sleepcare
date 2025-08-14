document.addEventListener('DOMContentLoaded', function() {
    const products = [
        { id: 13, name: "Almohada Cervical Anti-Apnea", category: "Almohadas", price: 79.99, image: "img/almohada_apnea.jpg?height=200&width=200" },
        { id: 14, name: "Almohada para Cuello Ajustable", category: "Almohadas", price: 59.99, image: "img/almohada_ajustable.jpg?height=200&width=200" },
        { id: 15, name: "Humidificador ClimateControl", category: "Aromaterapia", price: 189.99, image: "img/humificador_integrado.jpg?height=200&width=200" },
        { id: 16, name: "Cobertor de Cama Ultra Suave", category: "Cubiertas", price: 79.99, image: "img/cobertor.jpg?height=200&width=200" }
    ];
    

    const itemsPerPage = 4;
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

    function updateCartUI() {
        // Esta función se implementaría si tuviéramos un carrito visible en la página
        console.log('Carrito actualizado:', cart);
    }

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
