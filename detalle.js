// =====================================================================
//  GMS.PAPELERÍA - detalle.js
//  Página de detalle del producto: miniaturas, foto grande con zoom,
//  precio, cantidad, agregar al carrito, descripción y productos relacionados.
//  Va en el index.html DESPUÉS de script.js (usa sus funciones).
//
//  Campos OPCIONALES que podés agregar a un producto en productos.js:
//    imagenes: ["Img-Productos/a.jpg", "Img-Productos/b.jpg"]   -> muestra miniaturas
//    detalle:  "Texto más largo con medidas, material, etc."     -> se ve debajo de la descripción
// =====================================================================

let detalleProducto = null;   // producto que se está viendo
let detalleCantidad = 1;      // cantidad elegida
let detalleZoom = false;      // ¿la foto está ampliada?
let detalleTimer = null;      // para el aviso "Agregado"
let seccionAnterior = 'seccion-inicio'; // dónde estaba el cliente antes de entrar
let scrollAnterior = 0;                 // y a qué altura de la página

// ¿Es una compu con mouse? (ahí el zoom se hace pasando el mouse; en celular, tocando)
const PUEDE_HOVER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const dp = {}; // referencias a los elementos de la página (se completan al crearla)

// ---------------------------------------------------------------------
//  1. CREAR LA SECCIÓN (se arma sola, no hace falta tocar el HTML)
// ---------------------------------------------------------------------
function crearPaginaDetalle() {
    const seccion = document.createElement('section');
    seccion.id = 'seccion-detalle';
    seccion.className = 'seccion-contenido';
    seccion.innerHTML = `
        <div class="dp-pagina">
            <button type="button" class="dp-volver" id="dp-volver">← Volver</button>
            <nav class="dp-migas" id="dp-migas" aria-label="Ubicación"></nav>

            <div class="dp-top" id="dp-top">
                <div class="dp-thumbs" id="dp-thumbs"></div>

                <div class="dp-galeria">
                    <div class="dp-foto" id="dp-foto"><img id="dp-img" src="" alt=""></div>
                    <p class="dp-ayuda" id="dp-ayuda"></p>
                </div>

                <div class="dp-info">
                    <h2 id="dp-nombre"></h2>
                    <div class="dp-precio" id="dp-precio"></div>

                    <div class="dp-compra" id="dp-compra">
                        <div class="dp-cantidad">
                            <button type="button" id="dp-menos" aria-label="Restar una unidad">−</button>
                            <span id="dp-cant">1</span>
                            <button type="button" id="dp-mas" aria-label="Sumar una unidad">+</button>
                        </div>
                        <button type="button" class="dp-btn-agregar" id="dp-agregar">Agregar al carrito 🛒</button>
                    </div>
                    <p class="dp-aviso" id="dp-aviso"></p>

                    <a class="dp-btn-wpp" id="dp-consulta" href="#" target="_blank">Consultar por WhatsApp</a>

                    <ul class="dp-beneficios">
                        <li>Pagás en efectivo, por transferencia o con MercadoPago.</li>
                        <li>Envíos solo en Santiago del Estero Capital.</li>
                        <li>Atendemos de lunes a sábados de 8 a 21 hs.</li>
                    </ul>
                </div>
            </div>

            <div class="dp-descripcion">
                <h3>Descripción</h3>
                <p id="dp-desc"></p>
                <p id="dp-detalle"></p>
            </div>
        </div>

        <!-- Bloque aparte, fuera de la tarjeta del producto -->
        <div class="dp-relacionados" id="dp-relacionados">
            <h3>También te puede interesar</h3>
            <div class="product-grid" id="grid-relacionados"></div>
        </div>`;

    // Se coloca justo después de la sección del catálogo
    document.getElementById('seccion-productos').insertAdjacentElement('afterend', seccion);

    dp.seccion = seccion;
    dp.top = seccion.querySelector('#dp-top');
    dp.migas = seccion.querySelector('#dp-migas');
    dp.thumbs = seccion.querySelector('#dp-thumbs');
    dp.foto = seccion.querySelector('#dp-foto');
    dp.img = seccion.querySelector('#dp-img');
    dp.ayuda = seccion.querySelector('#dp-ayuda');
    dp.nombre = seccion.querySelector('#dp-nombre');
    dp.precio = seccion.querySelector('#dp-precio');
    dp.compra = seccion.querySelector('#dp-compra');
    dp.cant = seccion.querySelector('#dp-cant');
    dp.agregar = seccion.querySelector('#dp-agregar');
    dp.aviso = seccion.querySelector('#dp-aviso');
    dp.consulta = seccion.querySelector('#dp-consulta');
    dp.desc = seccion.querySelector('#dp-desc');
    dp.detalle = seccion.querySelector('#dp-detalle');
    dp.relacionados = seccion.querySelector('#dp-relacionados');
    dp.gridRelacionados = seccion.querySelector('#grid-relacionados');

    seccion.querySelector('#dp-volver').addEventListener('click', volverDelDetalle);
    seccion.querySelector('#dp-menos').addEventListener('click', () => cambiarCantidadDetalle(-1));
    seccion.querySelector('#dp-mas').addEventListener('click', () => cambiarCantidadDetalle(1));
    dp.agregar.addEventListener('click', agregarDesdeDetalle);

    // Zoom: en compu se amplía al pasar el mouse; en celular, al tocar la foto
    if (PUEDE_HOVER) {
        dp.foto.addEventListener('mouseenter', ponerZoom);
        dp.foto.addEventListener('mouseleave', quitarZoom);
        dp.foto.addEventListener('mousemove', moverZoom);
    } else {
        dp.foto.addEventListener('click', e => { moverZoom(e); alternarZoom(); });
        dp.foto.addEventListener('touchmove', e => {
            if (!detalleZoom) return;
            e.preventDefault(); // la página no se mueve mientras recorrés la foto ampliada
            moverZoom(e);
        }, { passive: false });
    }

    // Si el cliente toca una pestaña del menú (Inicio, Catálogo...), se cierra el detalle
    document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', ocultarDetalle));

    // Botón "atrás" del celular / navegador
    window.addEventListener('popstate', alCambiarHistorial);
}

// ---------------------------------------------------------------------
//  2. ABRIR / CERRAR
// ---------------------------------------------------------------------

// Lo llaman las tarjetas: abrirDetalle('id-del-producto')
function abrirDetalle(id) {
    const producto = PRODUCTOS_POR_ID.get(id);
    if (!producto) return;

    mostrarDetalle(producto);
    // Se guarda en el historial: así el botón "atrás" vuelve al catálogo y el link se puede compartir
    history.pushState({ detalle: id }, '', '#producto-' + encodeURIComponent(id));
}

function mostrarDetalle(producto) {
    // Recordamos dónde estaba el cliente para devolverlo ahí
    const activa = document.querySelector('.seccion-contenido.active');
    if (activa && activa.id !== 'seccion-detalle') {
        seccionAnterior = activa.id;
        scrollAnterior = window.scrollY;
    }

    detalleProducto = producto;
    detalleCantidad = 1;
    dp.cant.textContent = '1';
    clearTimeout(detalleTimer);
    dp.aviso.textContent = '';
    dp.agregar.textContent = 'Agregar al carrito 🛒';
    dp.agregar.disabled = false;

    // Fotos (una sola, o varias si el producto tiene "imagenes")
    const fotos = (Array.isArray(producto.imagenes) && producto.imagenes.length) ? producto.imagenes : [producto.imagen];
    dp.thumbs.innerHTML = '';
    if (fotos.length > 1) {
        fotos.forEach((src, i) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'dp-thumb' + (i === 0 ? ' activa' : '');
            b.setAttribute('aria-label', 'Ver foto ' + (i + 1));
            const im = document.createElement('img');
            im.src = src;
            im.alt = '';
            b.appendChild(im);
            b.addEventListener('click', () => {
                quitarZoom();
                dp.img.src = src;
                dp.thumbs.querySelectorAll('.dp-thumb').forEach(t => t.classList.remove('activa'));
                b.classList.add('activa');
            });
            dp.thumbs.appendChild(b);
        });
    }
    dp.top.classList.toggle('sin-miniaturas', fotos.length <= 1);

    dp.img.src = fotos[0];
    dp.img.alt = producto.nombre;
    dp.ayuda.textContent = PUEDE_HOVER ? 'Pasá el mouse sobre la foto para ampliarla' : 'Tocá la foto para ampliarla';
    quitarZoom();

    // Textos (se escriben como texto, así no se rompen con símbolos raros)
    dp.nombre.textContent = producto.nombre;
    dp.desc.textContent = producto.descripcion || 'Escribinos por WhatsApp y te contamos más de este producto.';
    dp.detalle.textContent = producto.detalle || '';
    dp.detalle.style.display = producto.detalle ? '' : 'none';
    dp.consulta.href = urlWhatsApp('Hola! Quiero consultar por ' + producto.nombre);

    if (tienePrecio(producto)) {
        dp.precio.textContent = formatearPrecio(producto.precio);
        dp.compra.style.display = '';
    } else {
        dp.precio.textContent = 'Consultar precio';
        dp.compra.style.display = 'none'; // sin precio no se puede agregar al carrito
    }

    armarMigas(producto);
    armarRelacionados(producto);

    // Mostrar esta página y ocultar las demás
    document.querySelectorAll('.seccion-contenido').forEach(s => s.classList.remove('active'));
    dp.seccion.classList.add('active');
    window.scrollTo({ top: Math.max(0, dp.seccion.getBoundingClientRect().top + window.scrollY - 70), behavior: 'auto' });
}

// Cierra el detalle y deja al cliente donde estaba
function cerrarYRestaurar() {
    ocultarDetalle();
    const anterior = document.getElementById(seccionAnterior);
    if (anterior) anterior.classList.add('active');
    window.scrollTo({ top: scrollAnterior, behavior: 'auto' });
}

// Solo oculta el detalle (lo usa también el menú de pestañas) y limpia el link
function ocultarDetalle() {
    if (!dp.seccion) return;
    dp.seccion.classList.remove('active');
    quitarZoom();
    if (location.hash.indexOf('#producto-') === 0) {
        history.replaceState(null, '', location.pathname + location.search);
    }
}

// Botón "← Volver"
function volverDelDetalle() {
    if (history.state && history.state.detalle && !history.state.inicial) {
        history.back(); // el "atrás" del navegador hace el resto (ver alCambiarHistorial)
    } else {
        cerrarYRestaurar();
    }
}

// Se ejecuta cuando el cliente usa el botón "atrás" del celular o del navegador
function alCambiarHistorial(e) {
    if (e.state && e.state.detalle) {
        const producto = PRODUCTOS_POR_ID.get(e.state.detalle);
        if (producto) mostrarDetalle(producto);
    } else if (dp.seccion.classList.contains('active')) {
        const anterior = document.getElementById(seccionAnterior);
        dp.seccion.classList.remove('active');
        if (anterior) anterior.classList.add('active');
        quitarZoom();
        window.scrollTo({ top: scrollAnterior, behavior: 'auto' });
    }
}

// Si alguien entra con un link directo a un producto (...#producto-ID), se abre solo
function abrirDesdeLink() {
    const m = location.hash.match(/^#producto-(.+)$/);
    if (!m) return;
    const id = decodeURIComponent(m[1]);
    const producto = PRODUCTOS_POR_ID.get(id);
    if (!producto) return;

    irAPestana(producto.combo ? 'inicio' : 'productos');
    seccionAnterior = producto.combo ? 'seccion-inicio' : 'seccion-productos';
    scrollAnterior = 0;
    mostrarDetalle(producto);
    history.replaceState({ detalle: id, inicial: true }, '', location.hash);
}

// ---------------------------------------------------------------------
//  3. MIGAS DE PAN ("Inicio › Catálogo › Lapiceras › Producto") Y RELACIONADOS
// ---------------------------------------------------------------------

// Hace clic en el botón del menú para ir a esa pestaña (reusa tu función cambiarPestana)
function irAPestana(nombre) {
    const boton = Array.from(document.querySelectorAll('.tab-btn'))
        .find(b => (b.getAttribute('onclick') || '').includes("'" + nombre + "'"));
    if (boton) boton.click();
}

// "goma-de-borrar" -> "Goma de Borrar" (lo lee del menú de categorías)
function nombreCategoria(slug) {
    const enlace = Array.from(document.querySelectorAll('.category-list a'))
        .find(a => (a.getAttribute('onclick') || '').includes("'" + slug + "'"));
    return enlace ? enlace.textContent.trim() : slug;
}

function armarMigas(producto) {
    dp.migas.innerHTML = '';

    const agregarLink = (texto, accion) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'dp-miga-link';
        b.textContent = texto;
        b.addEventListener('click', accion);
        dp.migas.appendChild(b);
    };
    const agregarSeparador = () => {
        const s = document.createElement('span');
        s.className = 'dp-miga-sep';
        s.textContent = '›';
        dp.migas.appendChild(s);
    };

    agregarLink('Inicio', () => { irAPestana('inicio'); window.scrollTo({ top: 0 }); });

    if (!producto.combo) {
        agregarSeparador();
        agregarLink('Catálogo', () => { irAPestana('productos'); filtrarCategoria('todos'); window.scrollTo({ top: 0 }); });

        const categoria = (producto.categorias || [])[0];
        if (categoria) {
            agregarSeparador();
            agregarLink(nombreCategoria(categoria), () => { irAPestana('productos'); filtrarCategoria(categoria); window.scrollTo({ top: 0 }); });
        }
    }

    agregarSeparador();
    const actual = document.createElement('span');
    actual.className = 'dp-miga-actual';
    actual.textContent = producto.nombre;
    dp.migas.appendChild(actual);
}

// Hasta 4 productos parecidos (misma categoría). Si no hay, se oculta el bloque.
function armarRelacionados(producto) {
    const grupo = producto.combo ? COMBOS : CATALOGO;
    const categorias = producto.categorias || [];

    let parecidos = grupo.filter(p => p.id !== producto.id &&
        (producto.combo || (p.categorias || []).some(c => categorias.includes(c))));
    parecidos = parecidos.slice(0, 4);

    dp.relacionados.style.display = parecidos.length ? '' : 'none';
    dp.gridRelacionados.innerHTML = parecidos.map(p => crearTarjetaHTML(p, true)).join('');
}

// ---------------------------------------------------------------------
//  4. ZOOM (la "lupa")
// ---------------------------------------------------------------------
function alternarZoom() {
    if (detalleZoom) { quitarZoom(); } else { ponerZoom(); }
}

function ponerZoom() {
    detalleZoom = true;
    dp.foto.classList.add('con-zoom');
}

function quitarZoom() {
    detalleZoom = false;
    if (!dp.foto) return;
    dp.foto.classList.remove('con-zoom');
    dp.img.style.transformOrigin = '50% 50%';
}

// La parte ampliada es la que está debajo del mouse / dedo
function moverZoom(e) {
    const punto = (e.touches && e.touches[0]) ? e.touches[0] : e;
    const caja = dp.foto.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, (punto.clientX - caja.left) / caja.width * 100));
    const y = Math.min(100, Math.max(0, (punto.clientY - caja.top) / caja.height * 100));
    dp.img.style.transformOrigin = x + '% ' + y + '%';
}

// ---------------------------------------------------------------------
//  5. CANTIDAD Y CARRITO
// ---------------------------------------------------------------------
function cambiarCantidadDetalle(cambio) {
    detalleCantidad = Math.min(99, Math.max(1, detalleCantidad + cambio));
    dp.cant.textContent = detalleCantidad;
}

function agregarDesdeDetalle() {
    if (!detalleProducto || !tienePrecio(detalleProducto)) return;

    // Usa la misma función que los botones de las tarjetas, una vez por unidad
    for (let i = 0; i < detalleCantidad; i++) {
        agregarAlCarrito(detalleProducto.id);
    }

    // Aviso con acceso directo al carrito
    dp.aviso.textContent = '✔ Agregado al carrito. ';
    const ver = document.createElement('button');
    ver.type = 'button';
    ver.className = 'dp-miga-link';
    ver.textContent = 'Ver carrito';
    ver.addEventListener('click', toggleCart);
    dp.aviso.appendChild(ver);

    clearTimeout(detalleTimer);
    detalleTimer = setTimeout(() => { dp.aviso.textContent = ''; }, 5000);
}

// ---------------------------------------------------------------------
//  6. ARRANQUE
// ---------------------------------------------------------------------
// Tocar una tarjeta (foto, título, espacios) abre el detalle.
// Los botones y links de la tarjeta (WhatsApp, Agregar al carrito) siguen funcionando normal.
document.addEventListener('click', e => {
    const tarjeta = e.target.closest('.product-card[data-id]');
    if (!tarjeta) return;
    if (e.target.closest('a, button')) return;
    abrirDetalle(tarjeta.dataset.id);
});

crearPaginaDetalle();
abrirDesdeLink();
