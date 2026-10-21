// =====================================================================
//  LISTA DE PRODUCTOS DE GMS.PAPELERÍA
//  Acá se cambian precios, nombres, fotos y categorías. Es el ÚNICO lugar.
//  La página arma sola las tarjetas, el carrito y los filtros desde esta lista.
//
//  Cómo agregar un producto: copiá uno entero (de { a },), pegalo y cambiá los datos.
//
//  Campos:
//    id          -> identificador único. Sin espacios, tildes ni comillas (ej: "lapicera-azul")
//    nombre      -> título que se ve en la tarjeta y en el pedido de WhatsApp
//    descripcion -> texto chico debajo del título (puede quedar vacío: "")
//    precio      -> número sin $ ni puntos (ej: 2500). Si es null, se muestra "Consultar precio"
//                   y no aparece el botón de agregar al carrito.
//    categorias  -> una o varias, entre comillas y separadas por coma (ej: ["oficina", "escolares"])
//    imagen      -> ruta de la foto
//    buscar      -> (opcional) palabras extra para que el buscador lo encuentre
//    combo       -> (opcional) true = aparece en Inicio como combo, no en el catálogo
//    activo      -> (opcional) false = oculta el producto sin borrarlo (ej: se agotó)
// =====================================================================

const PRODUCTOS = [

  // ---------------- COMBOS (se ven en Inicio) ----------------
  {
    id: "combo-escolar-inicial",
    nombre: "Combo Escolar Inicial",
    descripcion: "",
    precio: null,
    categorias: [],
    imagen: "Img-Productos/images.png",
    combo: true
  },
  {
    id: "combo-universitario",
    nombre: "Combo Universitario",
    descripcion: "",
    precio: null,
    categorias: [],
    imagen: "Img-Productos/combo-universitario.jpeg",
    combo: true
  },
  {
    id: "combo-sorpresa",
    nombre: "Combo Sorpresa",
    descripcion: "Combo de 5 productos sorpresa variados.",
    precio: null,
    categorias: [],
    imagen: "Img-Productos/Combo-sorpresa.jpg",
    combo: true
  },
  {
    id: "combo-a-eleccion",
    nombre: "Combo a Eleccion",
    descripcion: "Elegi los productos que quieras y te armamos un combo. (Minimo requerido 5 productos variados)",
    precio: null,
    categorias: [],
    imagen: "Img-Productos/Combo-a-eleccion.jpg",
    combo: true
  },
  {
    id: "combo-de-oficina",
    nombre: "Combo de oficina",
    descripcion: "",
    precio: null,
    categorias: [],
    imagen: "Img-Productos/images.png",
    combo: true
  },
  {
    id: "combo-infantil",
    nombre: "Combo infantil",
    descripcion: "",
    precio: null,
    categorias: [],
    imagen: "Img-Productos/images.png",
    combo: true
  },

  // ---------------- CATÁLOGO ----------------
  {
    id: "cuadernillo-a4-con-espiral-cuadriculado",
    nombre: "Cuadernillo A4 Con Espiral cuadriculado",
    descripcion: "Cuadernillo Húsares cuadriculado.",
    precio: 2500,
    categorias: ["cuadernos"],
    imagen: "Img-Productos/Cuadernillo-Husares-A4.jpg"
  },
  {
    id: "cuadernillo-a4-con-espiral-rayado",
    nombre: "Cuadernillo A4 Con Espiral Rayado",
    descripcion: "Cuadernillo Húsares rayado .",
    precio: 2500,
    categorias: ["cuadernos"],
    imagen: "Img-Productos/Cuadernillo-Husares-A4.jpg"
  },
  {
    id: "resaltador-pastel-rosa",
    nombre: "Resaltador Pastel Rosa",
    descripcion: "Resaltador rosa pastel Filgo.",
    precio: 800,
    categorias: ["resaltadores"],
    imagen: "Img-Productos/Filgo-pastel-rosa.jpg"
  },
  {
    id: "resaltador-pastel-verde",
    nombre: "Resaltador Pastel Verde",
    descripcion: "Resaltador verde pastel Filgo.",
    precio: 800,
    categorias: ["resaltadores"],
    imagen: "Img-Productos/Filgo-pastel-verde.jpg"
  },
  {
    id: "resaltador-pastel-amarillo",
    nombre: "Resaltador Pastel Amarillo",
    descripcion: "Resaltador amarillo pastel Filgo.",
    precio: 800,
    categorias: ["resaltadores"],
    imagen: "Img-Productos/Filgo-pastel-amarillo.jpg"
  },
  {
    id: "resaltador-pastel-celeste",
    nombre: "Resaltador Pastel celeste",
    descripcion: "Resaltador pastel celeste Filgo.",
    precio: 800,
    categorias: ["resaltadores"],
    imagen: "Img-Productos/Filgo-pastel-celeste.jpg"
  },
  {
    id: "corrector",
    nombre: "Corrector",
    descripcion: "Liquid Paper Blanco/Corrector Intro.",
    precio: 800,
    categorias: ["corrector"],
    imagen: "Img-Productos/Corrector-Intro.jpg"
  },
  {
    id: "goma-de-borrar",
    nombre: "Goma de Borrar",
    descripcion: "Borrador Blanco Filgo.",
    precio: 250,
    categorias: ["goma-de-borrar", "oficina"],
    imagen: "Img-Productos/Borrador-Filgo.jpg"
  },
  {
    id: "sacapuntas",
    nombre: "Sacapuntas",
    descripcion: "Sacapuntas Filgo.",
    precio: 250,
    categorias: ["sacapuntas", "escolares"],
    imagen: "Img-Productos/Sacapuntas-Filgo.jpg"
  },
  {
    id: "reglas",
    nombre: "Reglas",
    descripcion: "Reglas Filgo 15cm.",
    precio: 800,
    categorias: ["reglas"],
    imagen: "Img-Productos/Regla-15cm-Filgo.jpg"
  },
  {
    id: "lapices",
    nombre: "Lapices",
    descripcion: "Lapices Filgo x 12 Gama completa de colores suaves.",
    precio: 2000,
    categorias: ["lapices"],
    imagen: "Img-Productos/Lapices-de-colores-filgo-x12.jpg"
  },
  {
    id: "lapices",
    nombre: "Lapices + 2 Lapices HB",
    descripcion: "Lapices Filgo x 12 + 2 Lapices HB.",
    precio: 2300,
    categorias: ["lapices", "escolares"],
    imagen: "Img-Productos/Lapiz-Filgo-2HB.jpg"
  },
  {
    id: "lapicera-negra",
    nombre: "Lapicera Negra",
    descripcion: "Lapicera Negra Filgo Trazo Fino.",
    precio: 400,
    categorias: ["lapiceras"],
    imagen: "Img-Productos/Lapicera-Negra.jpg"
  },
  {
    id: "lapicera-azul",
    nombre: "Lapicera Azul",
    descripcion: "Lapicera azul Filgo Trazo Grueso.",
    precio: 400,
    categorias: ["lapiceras"],
    imagen: "Img-Productos/Lapicera-Azul.jpg"
  },
  {
    id: "lapicera-roja",
    nombre: "Lapicera Roja",
    descripcion: "Lapicera Roja Filgo Trazo Fino.",
    precio: 400,
    categorias: ["lapiceras"],
    imagen: "Img-Productos/Lapicera-Roja.jpg"
  },
  {
    id: "lapicera-verde",
    nombre: "Lapicera Verde",
    descripcion: "Lapicera Verde Filgo Trazo Fino.",
    precio: 400,
    categorias: ["lapiceras"],
    imagen: "Img-Productos/Lapicera-verde.jpg"
  },
  {
    id: "marcadores",
    nombre: "Marcadores",
    descripcion: "Marcadores Benabi.",
    precio: 3000,
    categorias: ["marcadores"],
    imagen: "Img-Productos/Marcadores-Benabi.jpeg"
  },
  {
    id: "folios-x-10-n3",
    nombre: "Folios x 10 N3",
    descripcion: "Folios escolares standard Luma.",
    precio: 1800,
    categorias: ["folios", "oficina"],
    imagen: "Img-Productos/Folios-Escolares-Luma.jpg"
  },
  {
    id: "papel-satinado-metalizado",
    nombre: "Papel Satinado Metalizado",
    descripcion: "Papel Satinado Metalizado Luma.",
    precio: 500,
    categorias: ["oficina"],
    imagen: "Img-Productos/Papel-metalizado.jpg"
  },
  {
    id: "papel-satinado-glase-lustre",
    nombre: "Papel Satinado Glase/Lustre",
    descripcion: "Papel Satinado glase/lustre Luma",
    precio: 300,
    categorias: ["oficina"],
    imagen: "Img-Productos/Papel-Glacé-Luma.jpeg"
  },
  {
    id: "anillo-de-carpeta",
    nombre: "Anillo de Carpeta",
    descripcion: "",
    precio: 500,
    categorias: ["escolares"],
    imagen: "Img-Productos/Anillos-de-Carpeta.jpg"
  },
  {
    id: "set-de-reglas",
    nombre: "Set de Reglas",
    descripcion: "Set de Reglas Filgo Escolar.",
    precio: 1600,
    categorias: ["reglas"],
    imagen: "Img-Productos/Kit-Geometria-Benabi.jpeg"
  },
  {
    id: "marcadores-p-pizarra",
    nombre: "Marcadores p/pizarra",
    descripcion: "Marcador Negro Filgo.",
    precio: 1500,
    categorias: ["escolares","oficina"],
    imagen: "Img-Productos/Marcador-para-Pizarra-Filgo.jpg"
  },
  {
    id: "papel-crepe",
    nombre: "Papel Crepe",
    descripcion: "Papel creepe variedad de colores.",
    precio: 500,
    categorias: ["oficina"],
    imagen: "Img-Productos/Papel-Crepé-Luma.jpeg"
  },
  {
    id: "papel-afiche",
    nombre: "Papel Afiche",
    descripcion: "Papel afiche variedad de colores.",
    precio: 800,
    categorias: ["oficina"],
    imagen: "Img-Productos/Papel-Afiche-Luma.jpeg"
  },
  {
    id: "carpeta-n3-c-anillos",
    nombre: "Carpeta N3 c/anillos",
    descripcion: "Carpetas Basicas Tapa Dura.",
    precio: 4000,
    categorias: ["escolares"],
    imagen: "Img-Productos/Carpetas-lisas-N°3.jpeg"
  },
  {
    id: "repuesto-de-hojas-rivadavia",
    nombre: "Repuesto de Hojas Rivadavia",
    descripcion: "Respuesto 96 hojas N3 Rivadavia",
    precio: 9000,
    categorias: ["oficina"],
    imagen: "Img-Productos/Repuesto-Rivadavia-N°3.jpg"
  },
  {
    id: "cartulinas",
    nombre: "Cartulinas",
    descripcion: "Cartulinas Luma varieadad de colores.",
    precio: 500,
    categorias: ["escolares"],
    imagen: "Img-Productos/Cartulinas-Luma.jpg"
  },
  {
    id: "voligoma",
    nombre: "Voligoma",
    descripcion: "Adhesivo sintetico Ezco (Tipo Voligoma).",
    precio: 1500,
    categorias: ["escolares"],
    imagen: "Img-Productos/Adhesivo-Sintetico-Ezco.jpg"
  },
  {
    id: "separadores",
    nombre: "Separadores",
    descripcion: "Separador Skycolor N3",
    precio: 1100,
    categorias: ["escolares"],
    imagen: "Img-Productos/Separadores-de-Carpeta N°3.jpg"
  },
  {
    id: "etiquetas-autoadhesivos",
    nombre: "Etiquetas Autoadhesivos",
    descripcion: "Etiquetas Autoadhesivas Ori-Tec",
    precio: 600,
    categorias: ["oficina"],
    imagen: "Img-Productos/Etiquetas-Adhesivas-Ori-Tec.jpg"
  },
  {
    id: "papel-carbonico-pelikan-x-10",
    nombre: "Papel Carbonico Pelikan x 10",
    descripcion: "",
    precio: 3800,
    categorias: ["oficina"],
    imagen: "Img-Productos/Papel-Carbonico-Pelikan.jpg"
  },
  {
    id: "resaltador-vintage",
    nombre: "Resaltador Vintage",
    descripcion: "Resaltadores Trabi Vintage.",
    precio: 3200,
    categorias: ["resaltadores"],
    imagen: "Img-Productos/Resaltadores-Vintage x4.jpg"
  },
  {
    id: "libros-interactivos",
    nombre: "Libros Interactivos",
    descripcion: "Libros interactivos infantiles para todas las edades",
    precio: 2900,
    categorias: ["infantil"],
    imagen: "Img-Productos/Libros-Lectura-Interactiva.jpeg"
  },
  {
    id: "lapicera-borrable",
    nombre: "Lapicera borrable",
    descripcion: "Lapicera azul borrable Simball.",
    precio: 1200,
    categorias: ["escolares"],
    imagen: "Img-Productos/Lapiceras-Borrables.jpeg"
  },
  {
    id: "repuesto-lapicera-borrable",
    nombre: "Repuesto lapicera borrable",
    descripcion: "Repuesto lapicera azul borrable Simball",
    precio: 600,
    categorias: ["escolares"],
    imagen: "Img-Productos/Repuesto-Lapicera-Borrable.jpeg"
  },
  {
    id: "libro-p-pintar-c-crayones",
    nombre: "Libro p/pintar c/crayones",
    descripcion: "Libros didacticos para pintar con crayones incluidos Juega y Modela.",
    precio: 3900,
    categorias: ["infantil"],
    imagen: "Img-Productos/Libros-para-Colorear-+-crayones.jpeg"
  },
  {
    id: "papel-crepe-bandera",
    nombre: "Papel crepe bandera",
    descripcion: "",
    precio: 1300,
    categorias: ["oficina"],
    imagen: "Img-Productos/Papel-Crepe-Bandera.jpg"
  },
  {
    id: "escarapela",
    nombre: "Escarapela",
    descripcion: "Escarapela Argentina.",
    precio: 400,
    categorias: ["escolares"],
    imagen: "Img-Productos/escarapela-lista.jpg"
  },
  {
    id: "minas-faber-castell",
    nombre: "Minas Faber Castell",
    descripcion: "Minas 0.5 HB Faber Castell.",
    precio: 1500,
    categorias: ["oficina"],
    imagen: "Img-Productos/Minas-05-HB-FaberCastell.jpg"
  },
  {
    id: "libros-de-mandalas-36-hojas",
    nombre: "Libros de Mandalas 36 hojas",
    descripcion: "Mandalas estilo Hindú para colorear",
    precio: 5000,
    categorias: ["libros"],
    imagen: "Img-Productos/Libro-mandalas-36.jpg"
  },
  {
    id: "libros-de-mandalas-12-hojas",
    nombre: "Libros de Mandalas 12 hojas",
    descripcion: "Mandalas estilo Hindú para colorear",
    precio: 2200,
    categorias: ["libros"],
    imagen: "Img-Productos/Libro-mandalas-36.jpg"
  },
  {
    id: "libros-de-actividades-fantasia",
    nombre: "Libros de Actividades Fantasia",
    descripcion: "Libros didacticos de lectura infantil Biblioteca Interactiva.",
    precio: 2700,
    categorias: ["infantil"],
    imagen: "Img-Productos/Libros-Lectura-Interactiva.jpeg"
  },
  {
    id: "libro-coleccion-juegos",
    nombre: "Libro Coleccion Juegos",
    descripcion: "Coleccion de libros Tripulante de juegos.",
    precio: 2800,
    categorias: ["infantil"],
    imagen: "Img-Productos/Libros-pasatiempo-juegos.jpg"
  },
  {
    id: "libros-de-animales",
    nombre: "Libros de Animales",
    descripcion: "Libros de Animales Alegria de Crear",
    precio: 3300,
    categorias: ["infantil"],
    imagen: "Img-Productos/ADC_LIBRO-AMOPINTAR_ANIMALES-DE-LA-SELVA_Tapa.jpg"
  },
  {
    id: "cinta-adhesiva",
    nombre: "Cinta Adhesiva",
    descripcion: "Cinta adhesiva Stiko",
    precio: 400,
    categorias: ["oficina"],
    imagen: "Img-Productos/Cinta-Adhesiva-Stiko.jpg"
  },
  {
    id: "cuentos-infantiles",
    nombre: "Cuentos Infantiles",
    descripcion: "Cuentos clasicos infantiles Tripulante.",
    precio: 1500,
    categorias: ["infantil"],
    imagen: "Img-Productos/Libritos-de-Cuestos-Clasicos.jpeg"
  },
  {
    id: "crayones",
    nombre: "Crayones",
    descripcion: "Crayones Trabi colores varios .",
    precio: 750,
    categorias: ["escolares"],
    imagen: "Img-Productos/Crayones-Cera-Trabi.jpg"
  },
  {
    id: "aprendo-pintando",
    nombre: "Aprendo Pintando",
    descripcion: "Libros didacticos para pintar Aprendo Pintando",
    precio: 2600,
    categorias: ["infantil"],
    imagen: "Img-Productos/Libros-Lectura-Interactiva.jpeg",
    buscar: "colorear"
  },
  {
    id: "pinceles-p-tempera",
    nombre: "Pinceles p/tempera",
    descripcion: "",
    precio: 400,
    categorias: ["escolares"],
    imagen: "Img-Productos/Pincel-Tempera.jpg"
  },
  {
    id: "adhesivo-en-barra",
    nombre: "Adhesivo en Barra",
    descripcion: "Adhesivo en barra Simball.",
    precio: 400,
    categorias: ["oficina"],
    imagen: "Img-Productos/Adhesivo-en-Barra-8gr-simball.jpg"
  },
  {
    id: "lapiz-negro",
    nombre: "Lapiz Negro",
    descripcion: "Lapiz negro HB N2 Filgo",
    precio: 300,
    categorias: ["lapices"],
    imagen: "Img-Productos/Lapiz-negro-Filgo.jpg"
  },
  {
    id: "tijera",
    nombre: "Tijera",
    descripcion: "Tijeras para niños Filgo",
    precio: 1300,
    categorias: ["tijeras", "escolares"],
    imagen: "Img-Productos/Tijeras-Filgo.jpg"
  },
  {
    id: "resaltadores-fluo-x-4",
    nombre: "Resaltadores Fluo x 4",
    descripcion: "Resaltadores fluo Filgo.",
    precio: 2000,
    categorias: ["resaltadores", "escolares"],
    imagen: "Img-Productos/Resaltadores-Filgo-Fluo.jpg"
  },
  {
    id: "resaltador-fluo-verde",
    nombre: "Resaltador Fluo Verde",
    descripcion: "Resaltador verde fluo Filgo.",
    precio: 700,
    categorias: ["resaltadores", "escolares"],
    imagen: "Img-Productos/resaltador-verde-fluo.jpg"
  },
  {
    id: "resaltador-fluo-violeta",
    nombre: "Resaltador Fluo Violeta",
    descripcion: "Resaltador violeta fluo Filgo.",
    precio: 700,
    categorias: ["resaltadores", "escolares"],
    imagen: "Img-Productos/resaltador-violeta-fluo.jpg"
  },
  {
    id: "resaltador-fluo-rosa",
    nombre: "Resaltador Fluo Rosa",
    descripcion: "Resaltador rosa fluo Filgo.",
    precio: 700,
    categorias: ["resaltadores", "escolares"],
    imagen: "Img-Productos/resaltador-lighter-fine-rosa-669fbb5f40de0-O.jpg"
  },
  {
    id: "resaltador-fluo-celeste",
    nombre: "Resaltador Fluo Celeste",
    descripcion: "Resaltador celeste fluo Filgo.",
    precio: 700,
    categorias: ["resaltadores", "escolares"],
    imagen: "Img-Productos/Resaltador-celeste-fluo.jpg"
  },
  {
    id: "resaltadores-pastel-x4",
    nombre: "Resaltadores Pastel x4",
    descripcion: "Resaltadores pastel Trabi.",
    precio: 3000,
    categorias: ["resaltadores", "escolares"],
    imagen: "Img-Productos/Resaltadores-Trabi-pastel-x4.webp"
  },
  {
    id: "folios",
    nombre: "Folios",
    descripcion: "Folio escolares x unidad Luma",
    precio: 300,
    categorias: ["folios", "escolares"],
    imagen: "Img-Productos/Folios-Escolares-Luma.jpg"
  },
  {
    id: "folios-a4",
    nombre: "Folios A4",
    descripcion: "Folios A4 x unidad Luma",
    precio: 500,
    categorias: ["folios", "escolares"],
    imagen: "Img-Productos/Folios-A4-Luma.jpg"
  },
  {
    id: "compas",
    nombre: "Compas",
    descripcion: "Compas Ezco",
    precio: 3500,
    categorias: ["escolares"],
    imagen: "Img-Productos/compas-ezco.jpg"
  },
  {
    id: "marcador-negro-permanente",
    nombre: "Marcador Negro Permanente",
    descripcion: "Marcador permanente negro Trabi",
    precio: 1500,
    categorias: ["marcadores", "escolares", "oficina"],
    imagen: "Img-Productos/Marcador-Permanente.jpg"
  },
  {
    id: "cuadernos-potosi-24-hojas",
    nombre: "Cuadernos Potosi 24 Hojas",
    descripcion: "Cuaderno Potosi tapa blanda rayado",
    precio: 950,
    categorias: ["cuadernos"],
    imagen: "Img-Productos/Cuaderno-Potosi-24.jpg"
  },
  {
    id: "cuadernos-potosi-48-hojas",
    nombre: "Cuadernos Potosi 48 Hojas",
    descripcion: "Cuaderno Potosi tapa blanda rayado",
    precio: 1300,
    categorias: ["cuadernos"],
    imagen: "Img-Productos/Cuaderno-Potosi-48-Hojas.jpg"
  },
  {
    id: "marcador-permanente-411-plus-x4-unidades",
    nombre: "Marcador Permanente 411 Plus x4 Unidades",
    descripcion: "Marcador Permanente 411 Plus Trabi",
    precio: 4400,
    categorias: ["marcadores"],
    imagen: "Img-Productos/Marcadores-x4-trabi.jpg",
    buscar: "permanentes"
  },
  {
    id: "broche-n-10-para-abrochadora",
    nombre: "Broche N°10 para Abrochadora",
    descripcion: "Broche 2010 flexibles Skycolor",
    precio: 1000,
    categorias: ["oficina"],
    imagen: "Img-Productos/Broches-N10.jpeg"
  },
  {
    id: "temperas-colores-varios",
    nombre: "Temperas Colores Varios",
    descripcion: "Tempera Señoritas variedad de colores.",
    precio: 300,
    categorias: ["escolares"],
    imagen: "Img-Productos/Temperas-señorita.jpg"
  },
  {
    id: "resaltador-pastel-violeta",
    nombre: "Resaltador Pastel Violeta",
    descripcion: "Resaltador violeta pastel Filgo.",
    precio: 800,
    categorias: ["resaltadores"],
    imagen: "Img-Productos/Filgo-pastel-violeta.jpg"
  },
  {
    id: "resaltador-pastel-naranja",
    nombre: "Resaltador Pastel Naranja",
    descripcion: "Resaltador naranja Pastel Filgo.",
    precio: 800,
    categorias: ["resaltadores"],
    imagen: "Img-Productos/Filgo-pastel-naranja.jpg"
  },
  {
    id: "resaltador-fluo-amarillo",
    nombre: "Resaltador Fluo Amarillo",
    descripcion: "Resaltador amarillo fluo Filgo.",
    precio: 800,
    categorias: ["resaltadores"],
    imagen: "Img-Productos/resaltador-amarillo-fluo.jpg"
  },
  {
    id: "resaltador-fluo-naranja",
    nombre: "Resaltador Fluo Naranja",
    descripcion: "Resaltador naranja fluo Filgo.",
    precio: 800,
    categorias: ["resaltadores"],
    imagen: "Img-Productos/resaltador-naranja-fluo.jpg"
  },
  {
    id: "repuesto-color-n5",
    nombre: "Repuesto Color N5",
    descripcion: "Gama completa de colores.",
    precio: 1200,
    categorias: ["escolares"],
    imagen: "Img-Productos/Repuesto-dibujo-N°3.jpg"
  },
  {
    id: "repuesto-blanco-n5",
    nombre: "Repuesto Blanco N5",
    descripcion: "",
    precio: 870,
    categorias: ["escolares"],
    imagen: "Img-Productos/Repuestos-Hojas-Dibujo-N5-blanco.jpg"
  },
  {
    id: "cuadernos-a5-con-espiral-rayadas",
    nombre: "Cuadernos A5 Con Espiral rayadas",
    descripcion: "Cuadernos A5 rayado Húsares.",
    precio: 1900,
    categorias: ["cuadernos"],
    imagen: "Img-Productos/Cuadernillo-Husares-A4.jpg"
  },
  {
    id: "cuadernos-a5-con-espiral-cuadriculado",
    nombre: "Cuadernos A5 Con Espiral cuadriculado",
    descripcion: "Cuadernos A5 cuadriculado Húsares.",
    precio: 1900,
    categorias: ["cuadernos"],
    imagen: "Img-Productos/Cuadernillo-Husares-A4.jpg"
  },
  {
    id: "Marcador-azul-permanente",
    nombre: "Marcador Permanente Trabi",
    descripcion: "Marcador permanente azul Trabi",
    precio: 1500,
    categorias: ["marcadores", "oficina", "escolares"],
    imagen: "Img-Productos/marcador-trabi-azul.png"
  },
  {
    id: "Marcador-rojo-permanente",
    nombre: "Marcador Permanente Trabi",
    descripcion: "Marcador permanente rojo Trabi",
    precio: 1500,
    categorias: ["marcadores", "oficina", "escolares"],
    imagen: "Img-Productos/marcador-trabi-rojo.jpg"
  },
  {
    id: "Marcador-verde-permanente",
    nombre: "Marcador Permanente Trabi",
    descripcion: "Marcador permanente verde Trabi",
    precio: 1500,
    categorias: ["marcadores", "oficina", "escolares"],
    imagen: "Img-Productos/Marcador-trabi-verde.jpg"
  },
  {
    id: "goma-de-borrar",
    nombre: "Goma de Borrar",
    descripcion: "Borrador Blanco/Azul Silmball.",
    precio: 300,
    categorias: ["goma-de-borrar", "oficina"],
    imagen: "Img-Productos/borrador-simball.jpg"
  },
  {
    id: "fibras",
    nombre: "Fibras",
    descripcion: "Marcadores escolares 2210 x10 .",
    precio: 1500,
    categorias: ["fibras", "escolares"],
    imagen: "Img-Productos/Fibras-Filgo-x10.jpg"
  },
 {
    id: "notas-adhesivas-transparentes",
    nombre: "Notas Adhesivas Skycolor Transparentes",
    descripcion: "Notas adhesivas Skycolor trasparentes 50 hojas/75x75mm.",
    precio: 1800,
    categorias: ["notas-adhesivas", "escolares", "oficina"],
    imagen: "Img-Productos/Notas-Transp.jpg"
  },
  {
    id: "notas-adhesivas-verdes",
    nombre: "Notas Adhesivas Skycolor Verde",
    descripcion: "Notas adhesivas Skycolor trasparentes verde 50 hojas/75x75mm.",
    precio: 1800,
    categorias: ["notas-adhesivas", "escolares", "oficina"],
    imagen: "Img-Productos/Notas-verde.jpg"
  },
  {
    id: "notas-adhesivas-amarillo",
    nombre: "Notas Adhesivas Skycolor Amarillo",
    descripcion: "Notas adhesivas Skycolor trasparentes amarillo 50 hojas/75x75mm.",
    precio: 1800,
    categorias: ["notas-adhesivas", "escolares", "oficina"],
    imagen: "Img-Productos/Notas-amarilla.jpg"
  },
  {
    id: "notas-adhesivas-azul",
    nombre: "Notas Adhesivas Skycolor Azul",
    descripcion: "Notas adhesivas Skycolor trasparentes azul 50 hojas/75x75mm.",
    precio: 1800,
    categorias: ["notas-adhesivas", "escolares", "oficina"],
    imagen: "Img-Productos/Notas-azul.jpg"
  },
  {
    id: "notas-adhesivas-naranja",
    nombre: "Notas Adhesivas Skycolor Naranja",
    descripcion: "Notas adhesivas Skycolor trasparentes naranja 50 hojas/75x75mm.",
    precio: 1800,
    categorias: ["notas-adhesivas", "escolares", "oficina"],
    imagen: "Img-Productos/Notas-Naranja.jpg"
  },
  {
    id: "notas-adhesivas-rosa",
    nombre: "Notas Adhesivas Skycolor Rosa",
    descripcion: "Notas adhesivas Skycolor trasparentes rosa 50 hojas/75x75mm.",
    precio: 1800,
    categorias: ["notas-adhesivas", "escolares", "oficina"],
    imagen: "Img-Productos/Notas-Rosa.jpg"
  },
  {
    id: "señaladores",
    nombre: "Señaladores Medoro",
    descripcion: "Señaladores Medoro colores varios 5x25, 1.2x4.5cm",
    precio: 1800,
    categorias: ["señaladores", "escolares", "oficina"],
    imagen: "Img-Productos/Señalador-Medoro.jpg"
  },
];
