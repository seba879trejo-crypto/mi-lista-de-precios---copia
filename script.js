// =====================================================================
//  GMS.PAPELERÍA - script.js
//  Necesita que productos.js esté cargado ANTES (ver el final del index.html).
// =====================================================================


// ---------------------------------------------------------------------
//  1. CONFIGURACIÓN (lo único que probablemente tengas que tocar acá)
// ---------------------------------------------------------------------

// Número de WhatsApp de la tienda, en formato internacional:
// 54 + 9 + código de área sin 0 + número sin 15.
// Es el ÚNICO lugar donde se cambia: botones, carrito y arrepentimiento lo leen de acá.
const NUMERO_WHATSAPP = "5493855966415";

// Cuántos productos se muestran por página en el catálogo
const PRODUCTOS_POR_PAGINA = 12;


// ---------------------------------------------------------------------
//  2. DATOS Y HERRAMIENTAS GENERALES
// ---------------------------------------------------------------------

// Si productos.js falla o no carga, la página no se rompe: solo queda sin productos
const LISTA_COMPLETA = (typeof PRODUCTOS !== 'undefined') ? PRODUCTOS : [];
if (LISTA_COMPLETA.length === 0) {
    console.error('No se encontró la lista de productos. Revisá que productos.js esté cargado antes que script.js.');
}

const PRODUCTOS_ACTIVOS = LISTA_COMPLETA.filter(p => p.activo !== false);
const PRODUCTOS_POR_ID = new Map(PRODUCTOS_ACTIVOS.map(p => [p.id, p]));
const COMBOS = PRODUCTOS_ACTIVOS.filter(p => p.combo);
const CATALOGO = PRODUCTOS_ACTIVOS.filter(p => !p.combo);

// Arma el link de WhatsApp con el mensaje ya codificado
function urlWhatsApp(texto) {
    return 'https://wa.me/' + NUMERO_WHATSAPP + '?text=' + encodeURIComponent(texto);
}

// 2500 -> "$2.500"
function formatearPrecio(valor) {
    return '$' + valor.toLocaleString('es-AR');
}

// ¿El producto tiene un precio válido para poder comprarse?
function tienePrecio(producto) {
    return typeof producto.precio === 'number' && producto.precio > 0;
}

// Evita que comillas o símbolos en un nombre rompan el HTML
function escaparHTML(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Pasa a minúsculas y saca tildes: "Lápiz" -> "lapiz"
function normalizarTexto(texto) {
    return String(texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Los botones/links con data-wpp="mensaje" toman el número de la configuración
function configurarEnlacesWhatsApp() {
    document.querySelectorAll('[data-wpp]').forEach(enlace => {
        enlace.href = urlWhatsApp(enlace.getAttribute('data-wpp'));
    });
}


// ---------------------------------------------------------------------
//  3. CONTROL DE PESTAÑAS (Inicio, Catálogo, Ofertas, Nosotros)
// ---------------------------------------------------------------------
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


// ---------------------------------------------------------------------
//  4. TARJETAS DE PRODUCTO (se dibujan desde productos.js)
// ---------------------------------------------------------------------
function crearTarjetaHTML(p, cargaDiferida) {
    const consulta = urlWhatsApp('Hola! Quiero consultar por ' + p.nombre);
    const conPrecio = tienePrecio(p);
    const textoPrecio = conPrecio ? formatearPrecio(p.precio) : 'Consultar precio';
    const botonCarrito = conPrecio
        ? `<button onclick="agregarAlCarrito('${p.id}')" class="btn-add-cart">Agregar al Carrito 🛒</button>`
        : '';

    return `
        <div class="product-card">
            <img ${cargaDiferida ? 'loading="lazy" ' : ''}src="${escaparHTML(p.imagen)}" alt="${escaparHTML(p.nombre)}">
            <div class="product-info">
                <h3>${escaparHTML(p.nombre)}</h3>
                <p>${escaparHTML(p.descripcion || '')}</p>
                <span class="product-price">${textoPrecio}</span>
                <a href="${consulta}" target="_blank" class="btn-wpp">Consultar por WhatsApp</a>
                ${botonCarrito}
            </div>
        </div>`;
}

// Combos de la pestaña Inicio
function renderizarCombos() {
    const contenedor = document.getElementById('grid-combos');
    if (!contenedor) return;
    contenedor.innerHTML = COMBOS.map(p => crearTarjetaHTML(p, false)).join('');
}


// ---------------------------------------------------------------------
//  5. CATÁLOGO: BUSCADOR + CATEGORÍAS + PAGINACIÓN
// ---------------------------------------------------------------------
let categoriaActual = 'todos';
let busquedaActual = '';
let paginaActual = 1;

// ¿El producto coincide con lo que se escribió en el buscador?
// Mira nombre, descripción, categorías y palabras extra. "resaltadores" también encuentra "resaltador".
function coincideConBusqueda(p, consulta) {
    if (!consulta) return true;

    const texto = normalizarTexto(
        [p.nombre, p.descripcion, (p.categorias || []).join(' '), p.buscar].filter(Boolean).join(' ')
    );

    return consulta.split(/\s+/).every(palabra => {
        let raiz = palabra;
        if (raiz.length > 4 && raiz.endsWith('es')) {
            raiz = raiz.slice(0, -2);
        } else if (raiz.length > 3 && raiz.endsWith('s')) {
            raiz = raiz.slice(0, -1);
        }
        return texto.includes(raiz);
    });
}

// Buscador en tiempo real
function filtrarProductos() {
    busquedaActual = normalizarTexto(document.getElementById('buscador').value.trim());
    paginaActual = 1; // Al buscar, siempre volvemos a la página 1
    actualizarVista();
}

// Filtro por categoría (menú lateral)
// Abre y cierra la lista de categorías (solo se usa en celular)
function toggleCategorias() {
    const lista = document.getElementById('lista-categorias');
    const boton = document.getElementById('btn-categorias');
    const abierta = lista.classList.toggle('abierta');
    boton.setAttribute('aria-expanded', abierta ? 'true' : 'false');
}

// Cierra la lista de categorías
function cerrarCategorias() {
    const lista = document.getElementById('lista-categorias');
    const boton = document.getElementById('btn-categorias');
    if (lista) lista.classList.remove('abierta');
    if (boton) boton.setAttribute('aria-expanded', 'false');
}

// Filtro por categoría (menú lateral)
function filtrarCategoria(categoria) {
    categoriaActual = categoria.toLowerCase();
    paginaActual = 1; // Al cambiar de categoría, volvemos a la página 1
    actualizarVista();

    // El botón muestra qué categoría se está viendo: "Categorías: Lapiceras"
    const texto = document.getElementById('texto-categorias');
    if (texto) {
        const enlace = Array.from(document.querySelectorAll('.category-list a'))
            .find(a => (a.getAttribute('onclick') || '').includes("'" + categoria + "'"));
        texto.textContent = (categoria === 'todos' || !enlace)
            ? 'Categorías'
            : 'Categorías: ' + enlace.textContent.trim();
    }

    // En celular, la lista se cierra sola para que el cliente vea los productos
    cerrarCategorias();
}

// Aplica búsqueda + categoría, corta en páginas y dibuja las tarjetas
function actualizarVista() {
    const contenedor = document.getElementById('grid-productos');
    if (!contenedor) return;

    const filtrados = CATALOGO.filter(p => {
        const coincideCategoria = categoriaActual === 'todos' || (p.categorias || []).includes(categoriaActual);
        return coincideCategoria && coincideConBusqueda(p, busquedaActual);
    });

    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PRODUCTOS_POR_PAGINA));
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;

    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const paginaDeProductos = filtrados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);

    if (paginaDeProductos.length === 0) {
        contenedor.innerHTML = '<div class="sin-resultados">No encontramos productos con esa búsqueda. ¡Escribinos por WhatsApp y te ayudamos!</div>';
    } else {
        contenedor.innerHTML = paginaDeProductos.map(p => crearTarjetaHTML(p, true)).join('');
    }

    renderizarPaginacion(filtrados.length);
}

// Dibuja los botones "Anterior / 1 2 3 / Siguiente"
function renderizarPaginacion(totalProductos) {
    const totalPaginas = Math.ceil(totalProductos / PRODUCTOS_POR_PAGINA);
    const contenedor = document.getElementById('paginacion');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    // Si hay una sola página (o ninguna), no mostramos botones
    if (totalPaginas <= 1) return;

    const btnAnterior = document.createElement('button');
    btnAnterior.textContent = '← Anterior';
    btnAnterior.className = 'btn-pagina';
    btnAnterior.disabled = paginaActual === 1;
    btnAnterior.onclick = () => cambiarPagina(paginaActual - 1);
    contenedor.appendChild(btnAnterior);

    for (let i = 1; i <= totalPaginas; i++) {
        const btnPagina = document.createElement('button');
        btnPagina.textContent = i;
        btnPagina.className = i === paginaActual ? 'btn-pagina btn-pagina-activa' : 'btn-pagina';
        btnPagina.onclick = () => cambiarPagina(i);
        contenedor.appendChild(btnPagina);
    }

    const btnSiguiente = document.createElement('button');
    btnSiguiente.textContent = 'Siguiente →';
    btnSiguiente.className = 'btn-pagina';
    btnSiguiente.disabled = paginaActual === totalPaginas;
    btnSiguiente.onclick = () => cambiarPagina(paginaActual + 1);
    contenedor.appendChild(btnSiguiente);
}

// Cambia de página y vuelve a dibujar
function cambiarPagina(numeroPagina) {
    paginaActual = numeroPagina;
    actualizarVista();

    // Sube hasta el inicio del catálogo para que no quede "perdido" abajo
    document.getElementById('grid-productos').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Muestra la cantidad total de productos del catálogo (menú lateral)
function actualizarContadorProductos() {
    ['total-menu', 'total-productos'].forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.innerText = CATALOGO.length;
    });
}


// ---------------------------------------------------------------------
//  6. CARRITO DE COMPRAS
//  El carrito guarda solo el id y la cantidad. El nombre, la foto y el PRECIO
//  se leen siempre de productos.js, así que no se pueden alterar desde el navegador.
// ---------------------------------------------------------------------
let carrito = [];

// Recupera el carrito guardado en el navegador (y convierte el formato viejo si hace falta)
try {
    const guardado = JSON.parse(localStorage.getItem('carrito-gms') || '[]');
    carrito = guardado.map(item => {
        // Formato nuevo: { id, cantidad }  |  Formato viejo: { nombre, precio, cantidad, imagen }
        const producto = PRODUCTOS_POR_ID.get(item.id) || PRODUCTOS_ACTIVOS.find(p => p.nombre === item.nombre);
        if (!producto || !tienePrecio(producto)) return null;
        return { id: producto.id, cantidad: Math.max(1, parseInt(item.cantidad, 10) || 1) };
    }).filter(Boolean);
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

function agregarAlCarrito(id) {
    const producto = PRODUCTOS_POR_ID.get(id);
    if (!producto || !tienePrecio(producto)) return;

    const existente = carrito.find(item => item.id === id);
    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ id: id, cantidad: 1 });
    }

    guardarCarrito();
    actualizarCarritoUI();
    // El carrito no se abre solo: el cliente lo abre cuando quiere
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    actualizarCarritoUI();
}

// Suma (+1) o resta (-1) unidades. Si llega a 0, se quita del carrito.
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
        const producto = PRODUCTOS_POR_ID.get(item.id);
        if (!producto) return;

        const subtotal = producto.precio * item.cantidad;
        totalGeneral += subtotal;
        totalItems += item.cantidad;

        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item-row';
        itemRow.innerHTML = `
            <img src="${escaparHTML(producto.imagen)}" alt="${escaparHTML(producto.nombre)}" class="cart-item-img">
            <div class="cart-item-info">
                <span class="cart-item-title">${escaparHTML(producto.nombre)}</span>
                <span class="cart-item-price">${formatearPrecio(subtotal)}</span>
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
    cartTotalPrice.innerText = formatearPrecio(totalGeneral);
}

function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de enviar el pedido.");
        return;
    }

    let mensaje = '¡Hola! GMS.Papelería 👋 Quiero realizar el siguiente pedido:\n\n';
    let totalGeneral = 0;

    carrito.forEach(item => {
        const producto = PRODUCTOS_POR_ID.get(item.id);
        if (!producto) return;

        const subtotal = producto.precio * item.cantidad;
        totalGeneral += subtotal;
        mensaje += `• ${producto.nombre} x${item.cantidad} - Subtotal: ${formatearPrecio(subtotal)}\n`;
    });

    mensaje += `\n*TOTAL ESTIMADO: ${formatearPrecio(totalGeneral)}*\n\nAguardo confirmación de stock y pago. ¡Gracias!`;

    window.open(urlWhatsApp(mensaje), '_blank');
}


// ---------------------------------------------------------------------
//  7. BOTÓN DE ARREPENTIMIENTO (ventana emergente que envía por WhatsApp)
// ---------------------------------------------------------------------
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

    // Código de referencia (fecha y hora) para identificar la solicitud
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

    window.open(urlWhatsApp(mensaje), '_blank');

    cerrarModalArrepentimiento();
    document.getElementById('form-arrepentimiento').reset();
}

// Cerrar la ventana con la tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModalArrepentimiento();
});


// ---------------------------------------------------------------------
//  8. VIDEO DE FONDO
//  - Celulares: no se descarga. Queda la imagen fija (poster) del <video>.
//  - Computadoras: se carga recién cuando la página terminó de cargar.
//  - Se pausa al bajar y se reanuda al volver arriba.
//  (Necesita <video id="bg-video" data-src="i.mp4" poster="..."> en el index.html)
// ---------------------------------------------------------------------

// Decide si conviene cargar el video. Si no, el cliente ve solo la imagen fija.
function cargarVideoDeFondo() {
    const video = document.getElementById('bg-video');
    if (!video || video.hasAttribute('src')) return;

    const pantallaGrande = window.matchMedia('(min-width: 769px)').matches;
    const conexion = navigator.connection || {};
    const ahorroDeDatos = conexion.saveData === true                    // modo "ahorro de datos" activado
        || conexion.type === 'cellular'                                 // conectado por datos móviles
        || /(^|-)2g$/.test(conexion.effectiveType || '');               // conexión muy lenta
    const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!pantallaGrande || ahorroDeDatos || menosMovimiento) return;

    video.src = video.getAttribute('data-src');

    // Si ya estaba scrolleado más abajo, no lo arrancamos (se activa al volver arriba)
    if (window.scrollY <= 300) {
        video.play().catch(error => {
            console.log("Reproducción automática evitada por el navegador:", error);
        });
    }
}

// Espera a que termine de cargar toda la página (fotos incluidas) antes de pedir el video
function programarVideoDeFondo() {
    if (document.readyState === 'complete') {
        cargarVideoDeFondo();
    } else {
        window.addEventListener('load', cargarVideoDeFondo);
    }
}

function controlarVideoPorScroll() {
    const video = document.getElementById('bg-video');
    if (!video) return;

    window.addEventListener('scroll', () => {
        // Si el video no se cargó (celulares), no hay nada que pausar ni reanudar
        if (!video.hasAttribute('src')) return;

        if (window.scrollY > 300) {
            if (!video.paused) {
                video.pause();
            }
        } else {
            if (video.paused) {
                video.play().catch(error => {
                    console.log("Reproducción automática evitada por el navegador:", error);
                });
            }
        }
    }, { passive: true });
}


// ---------------------------------------------------------------------
//  9. AL CARGAR LA PÁGINA
// ---------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    renderizarCombos();
    actualizarVista();
    actualizarCarritoUI();
    actualizarContadorProductos();
    configurarEnlacesWhatsApp();
    controlarVideoPorScroll();
    programarVideoDeFondo();
});