// --- 1. CONTROL DE PESTAÑAS (Inicio, Catálogo, Ofertas) ---
function cambiarPestana(pestana) {
    // Ocultar todas las secciones
    document.getElementById('seccion-inicio').classList.remove('active');
    document.getElementById('seccion-productos').classList.remove('active');
    document.getElementById('seccion-ofertas').classList.remove('active');

    // Quitar la clase 'active' de todos los botones del menú
    const botones = document.querySelectorAll('.tab-btn');
    botones.forEach(btn => btn.classList.remove('active'));

    // Mostrar la sección seleccionada y activar su respectivo botón
    if (pestana === 'inicio') {
        document.getElementById('seccion-inicio').classList.add('active');
        event.currentTarget.classList.add('active');
    } else if (pestana === 'productos') {
        document.getElementById('seccion-productos').classList.add('active');
        event.currentTarget.classList.add('active');
    } else if (pestana === 'ofertas') {
        document.getElementById('seccion-ofertas').classList.add('active');
        event.currentTarget.classList.add('active');
    }
}


// --- 2. BUSCADOR EN TIEMPO REAL (Catálogo) ---
function filtrarProductos() {
    let input = document.getElementById('buscador').value.toLowerCase();
    let productos = document.querySelectorAll('#grid-productos .product-card');

    productos.forEach(card => {
        let nombre = card.getAttribute('data-nombre');
        if (nombre.includes(input)) {
            card.style.display = "flex"; // Muestra si coincide
        } else {
            card.style.display = "none"; // Oculta si no coincide
        }
    });
}


function filtrarCategoria(categoria) {
    let productos = document.querySelectorAll('.product-card');

    productos.forEach(card => {
        let catAttr = card.getAttribute('data-categoria') || '';
        let listaCategorias = catAttr.trim().toLowerCase().split(',').map(c => c.trim());

        if (categoria === 'todos' || listaCategorias.includes(categoria.toLowerCase())) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}


// --- 4. LÓGICA DEL CARRITO DE COMPRAS ---
let carrito = [];

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('open');
}

function agregarAlCarrito(nombre, precio) {
    // Buscar si el producto ya está en el carrito
    let productoExistente = carrito.find(item => item.nombre === nombre);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
    }
    
    actualizarCarritoUI();
    
    // Abre el carrito automáticamente al agregar un producto
    document.getElementById('cart-sidebar').classList.add('open');
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    cartItemsContainer.innerHTML = '';
    
    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-text">Tu carrito está vacío.</p>';
        cartCount.innerText = '0';
        cartTotalPrice.innerText = '$0';
        return;
    }
    
    let totalGeneral = 0;
    let totalItems = 0;
    
    carrito.forEach((item, index) => {
        let subtotal = item.precio * item.cantidad;
        totalGeneral += subtotal;
        totalItems += item.cantidad;
        
        let itemRow = document.createElement('div');
        itemRow.className = 'cart-item-row';
        itemRow.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-title">${item.nombre} (x${item.cantidad})</span>
                <span class="cart-item-price">$${subtotal.toLocaleString('es-AR')}</span>
            </div>
            <button onclick="eliminarDelCarrito(${index})" class="btn-remove-item">🗑️</button>
        `;
        cartItemsContainer.appendChild(itemRow);
    });
    
    cartCount.innerText = totalItems;
    cartTotalPrice.innerText = `$${totalGeneral.toLocaleString('es-AR')}`;
}

function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de enviar el pedido.");
        return;
    }
    
    let mensaje = "¡Hola! GMS.Papelería 👋 Quiero realizar el siguiente pedido:%0A%0A";
    let totalGeneral = 0;
    
    carrito.forEach(item => {
        let subtotal = item.precio * item.cantidad;
        totalGeneral += subtotal;
        mensaje += `• ${item.nombre} x${item.cantidad} - Subtotal: $${subtotal.toLocaleString('es-AR')}%0A`;
    });
    
    mensaje += `%0A*TOTAL ESTIMADO: $${totalGeneral.toLocaleString('es-AR')}*%0A%0AAguardo confirmación de stock y pago. ¡Gracias!`;
    
    // Tu número de WhatsApp
    let numeroWhatsApp = "3855960415";
    let urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    
    window.open(urlWhatsApp, '_blank');
}
