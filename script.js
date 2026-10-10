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
// Carga el carrito guardado en el navegador (si existe). Si algo falla, arranca vacío.
let carrito = [];
try {
    const carritoGuardado = localStorage.getItem('carrito-gms');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
} catch (error) {
    carrito = [];
}

// Guarda el carrito actual en el navegador
function guardarCarrito() {
    try {
        localStorage.setItem('carrito-gms', JSON.stringify(carrito));
    } catch (error) {
        // Si el navegador no permite guardar, el carrito sigue funcionando igual
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('open');
}

// Cierra el panel del carrito (para "Seguir viendo productos")
function cerrarCarrito() {
    document.getElementById('cart-sidebar').classList.remove('open');
}

// Vacía todo el carrito, pidiendo confirmación para evitar borrados por error
function vaciarCarrito() {
    if (carrito.length === 0) return;

    if (confirm('¿Querés vaciar todo el carrito?')) {
        carrito = [];
        guardarCarrito();
        actualizarCarritoUI();
    }
}

// Busca la foto del producto que se está agregando (la misma que se ve en su tarjeta)
function obtenerImagenProducto(nombre) {
    try {
        const evento = window.event;
        if (evento && evento.target) {
            const tarjeta = evento.target.closest('.product-card');
            const img = tarjeta ? tarjeta.querySelector('img') : null;
            if (img) return img.getAttribute('src');
        }
    } catch (error) {
    }
    // 2) Si no, busca la tarjeta cuyo título coincida con el nombre
    const tarjetas = document.querySelectorAll('.product-card');
    for (const tarjeta of tarjetas) {
        const titulo = tarjeta.querySelector('h3');
        if (titulo && titulo.textContent.trim() === nombre) {
            const img = tarjeta.querySelector('img');
            if (img) return img.getAttribute('src');
        }
    }

    return ''; // Si no encuentra foto, el producto se agrega igual, sin imagen
}

function agregarAlCarrito(nombre, precio) {
    // Buscar si el producto ya está en el carrito
    let productoExistente = carrito.find(item => item.nombre === nombre);
    let imagen = obtenerImagenProducto(nombre);

    if (productoExistente) {
        productoExistente.cantidad += 1;
        // Si el producto venía de un carrito guardado antes de existir las fotos, se la agregamos
        if (!productoExistente.imagen && imagen) {
            productoExistente.imagen = imagen;
        }
    } else {
        carrito.push({ nombre: nombre, precio: precio, cantidad: 1, imagen: imagen });
    }

    guardarCarrito();
    actualizarCarritoUI();
    // El carrito ya no se abre solo: el cliente lo abre cuando quiere
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarritoUI();
}

// Suma (+1) o resta (-1) unidades de un producto. Si llega a 0, se quita del carrito.
function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    guardarCarrito();
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
        let imagenHTML = item.imagen
            ? `<img src="${item.imagen}" alt="${item.nombre}" class="cart-item-img">`
            : '';

        itemRow.innerHTML = `
            ${imagenHTML}
            <div class="cart-item-info">
                <span class="cart-item-title">${item.nombre}</span>
                <span class="cart-item-price">$${subtotal.toLocaleString('es-AR')}</span>
                <div class="cart-qty-controls">
                    <button onclick="cambiarCantidad(${index}, -1)" class="btn-qty" aria-label="Restar una unidad">−</button>
                    <span class="cart-qty-number">${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${index}, 1)" class="btn-qty" aria-label="Sumar una unidad">+</button>
                </div>
            </div>
            <button onclick="eliminarDelCarrito(${index})" class="btn-remove-item" aria-label="Quitar producto">🗑️</button>
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


// --- 4. BOTÓN DE ARREPENTIMIENTO (ventana emergente que envía por WhatsApp) ---
// Formato internacional para WhatsApp: 54 + 9 + código de área (sin 0) + número (sin 15)
const NUMERO_WHATSAPP_ARREPENTIMIENTO = "5493855966415";

function abrirModalArrepentimiento() {
    const modal = document.getElementById('modal-arrepentimiento');
    if (!modal) return;
    modal.classList.add('open');
    document.getElementById('arr-nombre').focus();
}

function cerrarModalArrepentimiento() {
    const modal = document.getElementById('modal-arrepentimiento');
    if (modal) modal.classList.remove('open');
}

function enviarArrepentimientoWhatsApp(evento) {
    evento.preventDefault(); // Evita que el formulario recargue la página

    const nombre = document.getElementById('arr-nombre').value.trim();
    const pedido = document.getElementById('arr-pedido').value.trim();
    const motivo = document.getElementById('arr-motivo').value.trim(); // Opcional

    // Código de referencia (fecha y hora) para que ambos puedan identificar la solicitud
    const ahora = new Date();
    const dos = n => String(n).padStart(2, '0');
    const codigo = 'ARR-' + ahora.getFullYear() + dos(ahora.getMonth() + 1) + dos(ahora.getDate())
                 + '-' + dos(ahora.getHours()) + dos(ahora.getMinutes());

    let mensaje = 'Hola GMS.Papelería, quiero cancelar un pedido (botón de arrepentimiento).\n\n'
                + 'Código de referencia: ' + codigo + '\n'
                + 'Nombre: ' + nombre + '\n'
                + 'Pedido a cancelar: ' + pedido + '\n';

    if (motivo) {
        mensaje += 'Motivo: ' + motivo + '\n';
    }

    // encodeURIComponent protege el mensaje si el cliente escribe &, #, tildes, etc.
    const url = 'https://wa.me/' + NUMERO_WHATSAPP_ARREPENTIMIENTO + '?text=' + encodeURIComponent(mensaje);
    window.open(url, '_blank');

    cerrarModalArrepentimiento();
    document.getElementById('form-arrepentimiento').reset();
}

// Cerrar la ventana con la tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModalArrepentimiento();
});


// --- 5. INICIALIZAR EL CATÁLOGO CON PAGINACIÓN AL CARGAR LA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    actualizarVista();
    actualizarCarritoUI(); // Muestra el carrito guardado (y el contador) al abrir la página
});
// --- CONTADOR AUTOMÁTICO DE PRODUCTOS ---
function actualizarContadorProductos() {
    // Busca todas las tarjetas de productos que hay en la grilla
    const totalCards = document.querySelectorAll('.product-grid .product-card').length;
    
    // Actualiza el número en el menú lateral ("Ver Todos")
    const contadorMenu = document.getElementById('total-menu');
    if (contadorMenu) {
        contadorMenu.innerText = totalCards;
    }

    // Actualiza el número en el párrafo del catálogo
    const contadorTexto = document.getElementById('total-productos');
    if (contadorTexto) {
        contadorTexto.innerText = totalCards;
    }
}

// Ejecutar la función automáticamente cuando carga la página
window.addEventListener('DOMContentLoaded', actualizarContadorProductos);
// --- CONTROL DE REPRODUCCIÓN DEL VIDEO POR SCROLL ---
function controlarVideoPorScroll() {
    const video = document.getElementById('bg-video');
    if (!video) return;

    window.addEventListener('scroll', () => {
        // Si el usuario baja más de 300 píxeles, pausamos el video
        if (window.scrollY > 300) {
            if (!video.paused) {
                video.pause();
            }
        } else {
            // Si vuelve arriba del todo, se vuelve a reproducir
            if (video.paused) {
                video.play().catch(error => {
                    console.log("Reproducción automática evitada por el navegador:", error);
                });
            }
        }
    });
}

// Ejecutar cuando cargue la página
window.addEventListener('DOMContentLoaded', controlarVideoPorScroll);
