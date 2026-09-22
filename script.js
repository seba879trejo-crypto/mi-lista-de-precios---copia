// --- 1. CONTROL DE PESTAÑAS (Inicio, Catálogo, Ofertas, Nosotros) ---
function cambiarPestana(pestana) {
    // Ocultar todas las secciones
    document.getElementById('seccion-inicio').classList.remove('active');
    document.getElementById('seccion-productos').classList.remove('active');
    document.getElementById('seccion-ofertas').classList.remove('active');
    document.getElementById('seccion-nosotros').classList.remove('active');

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
    } else if (pestana === 'nosotros') {
        document.getElementById('seccion-nosotros').classList.add('active');
        event.currentTarget.classList.add('active');
    }
}


// --- 2. FILTRADO + PAGINACIÓN (Catálogo) ---

const PRODUCTOS_POR_PAGINA = 12; // Ajustá este número si querés mostrar más o menos por página

let categoriaActual = 'todos';
let busquedaActual = '';
let paginaActual = 1;

// Buscador en tiempo real
function filtrarProductos() {
    busquedaActual = document.getElementById('buscador').value.toLowerCase();
    paginaActual = 1; // Al buscar, siempre volvemos a la página 1
    actualizarVista();
}

// Filtro por categoría (sidebar)
function filtrarCategoria(categoria) {
    categoriaActual = categoria.toLowerCase();
    paginaActual = 1; // Al cambiar de categoría, volvemos a la página 1
    actualizarVista();
}

// Función central: aplica búsqueda + categoría, y después pagina el resultado
function actualizarVista() {
    let productos = Array.from(document.querySelectorAll('#grid-productos .product-card'));

    // 1. Filtrar por categoría y búsqueda al mismo tiempo
    let filtrados = productos.filter(card => {
        let nombre = card.getAttribute('data-nombre') || '';
        let catAttr = card.getAttribute('data-categoria') || '';
        let listaCategorias = catAttr.trim().toLowerCase().split(',').map(c => c.trim());

        let coincideCategoria = categoriaActual === 'todos' || listaCategorias.includes(categoriaActual);
        let coincideBusqueda = nombre.includes(busquedaActual);

        return coincideCategoria && coincideBusqueda;
    });

    // 2. Ocultar todas las tarjetas primero
    productos.forEach(card => card.style.display = 'none');

    // 3. Mostrar solo las que corresponden a la página actual
    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const fin = inicio + PRODUCTOS_POR_PAGINA;
    const productosDeEstaPagina = filtrados.slice(inicio, fin);

    productosDeEstaPagina.forEach(card => card.style.display = 'flex');

    // 4. Dibujar los botones de paginación según cuántos resultados hay en total
    renderizarPaginacion(filtrados.length);
}

// Dibuja los botones "Anterior / 1 2 3 / Siguiente"
function renderizarPaginacion(totalProductos) {
    const totalPaginas = Math.ceil(totalProductos / PRODUCTOS_POR_PAGINA);
    const contenedor = document.getElementById('paginacion');

    contenedor.innerHTML = '';

    // Si hay una sola página (o ninguna), no mostramos botones
    if (totalPaginas <= 1) return;

    // Botón "Anterior"
    const btnAnterior = document.createElement('button');
    btnAnterior.textContent = '← Anterior';
    btnAnterior.className = 'btn-pagina';
    btnAnterior.disabled = paginaActual === 1;
    btnAnterior.onclick = () => cambiarPagina(paginaActual - 1);
    contenedor.appendChild(btnAnterior);

    // Un botón por cada número de página
    for (let i = 1; i <= totalPaginas; i++) {
        const btnPagina = document.createElement('button');
        btnPagina.textContent = i;
        btnPagina.className = i === paginaActual ? 'btn-pagina btn-pagina-activa' : 'btn-pagina';
        btnPagina.onclick = () => cambiarPagina(i);
        contenedor.appendChild(btnPagina);
    }

    // Botón "Siguiente"
    const btnSiguiente = document.createElement('button');
    btnSiguiente.textContent = 'Siguiente →';
    btnSiguiente.className = 'btn-pagina';
    btnSiguiente.disabled = paginaActual === totalPaginas;
    btnSiguiente.onclick = () => cambiarPagina(paginaActual + 1);
    contenedor.appendChild(btnSiguiente);
}

// Cambia de página y vuelve a dibujar todo
function cambiarPagina(numeroPagina) {
    paginaActual = numeroPagina;
    actualizarVista();

    // Sube el scroll hasta el inicio del catálogo, para que no quede "perdido" abajo
    document.getElementById('grid-productos').scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// --- 3. LÓGICA DEL CARRITO DE COMPRAS ---
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
    let numeroWhatsApp = "3855966415";
    let urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;

    window.open(urlWhatsApp, '_blank');
}


// --- 4. INICIALIZAR EL CATÁLOGO CON PAGINACIÓN AL CARGAR LA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    actualizarVista();
});