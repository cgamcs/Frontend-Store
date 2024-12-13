// Variables
const paginaActual = window.location.pathname;
const paginasBloqueada = ['/index.html', '/nosotros.html'];
const nombre = document.querySelector('#nombre');
const minimo = document.querySelector('#minimo');
const maximo = document.querySelector('#maximo');
const color = document.querySelector('#color');

// Contenedor para los resultados
const resultado = document.querySelector('#resultado');
const detalleProductoContainer = document.getElementById('detalle-producto');

const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#producto');
let articulosCarrito = [];

// Generar un objeto con la búsqueda
const datosBusqueda = {
    nombre: '',
    minimo: '',
    maximo: '',
    color: ''
}

// EventListeners
cargarEvenetListeners();
localStorage.getItem(carrito);
function cargarEvenetListeners() {

    // Muestra los cursos desde Local Storage
    document.addEventListener('DOMContentLoaded', () => {

        // Check which page we're on and call appropriate function
        if (document.getElementById('resultado')) {
            // This is the catalog/listing page
            mostrarCamisas(camisas);
        } else if (document.getElementById('detalle-producto')) {
            // This is the product detail page
            mostrarProducto();
        }

        articulosCarrito = JSON.parse( localStorage.getItem('carrito') ) || [];

        carritoHTML();
    })

    // Event listeners para los select de búsqueda
    if(paginasBloqueada.includes(paginaActual)) {
        nombre.addEventListener('change', (e) => { datosBusqueda.nombre = e.target.value; filtrarCamisa(); })
        minimo.addEventListener('change', (e) => { datosBusqueda.minimo = e.target.value; filtrarCamisa(); })
        maximo.addEventListener('change', (e) => { datosBusqueda.maximo = e.target.value; filtrarCamisa(); })
        color.addEventListener('change', (e) => { datosBusqueda.color = e.target.value; filtrarCamisa(); })
    }

    // Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    // Vaciar el carrito
    vaciarCarrito.addEventListener('click', () => {
        articulosCarrito = []; // Reseteamos el arreglo

        limpiarHTML(); // Eliminamos todo el HTML

        // Actualizar el carrito de compras al storage
        sincronizarStorage();
    })
}

// Funciones
function mostrarCamisas(camisas) {
    limpiarFiltro(); // Elimina el HTML previo

    camisas.forEach(camisa => {
        const camisaHTML = document.createElement('DIV');
        camisaHTML.classList.add('producto');

        const { id, imagen, nombre, precio, color } = camisa;
        camisaHTML.setAttribute('id', id);

        camisaHTML.innerHTML = `
            <div class="producto__link" data-id="${id}">
                <img class="producto__img" loading="lazy" src="${imagen}" alt="Imagen de camisa ${nombre}">
                <div class="producto__informacion">
                    <p class="producto__nombre">${nombre}</p>
                    <p class="producto__precio">$${precio}</p>
                    <input type="hidden" name="${color}">
                </div>
            </div>
        `;

        // Link para los detalles de la pagina
        camisaHTML.querySelector('.producto__link').addEventListener('click', (e) => {
            window.location.href = `producto.html?id=${id}`;
        });

        // Inserta en el HTML
        document.getElementById('resultado').appendChild(camisaHTML);
    });
}

function mostrarProducto() {
    // Consigue el ID de la pagina
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get("id");

    // Toma el producto de camisas
    const camisa = camisas.find(c => c.id === Number(productoId));

    if (!camisa) {
        document.getElementById('detalle-producto').innerHTML = `
            <h1>Producto no encontrado</h1>
            <p class="txt-center">Lo sentimos, el producto que está buscando no existe.</p>
        `;
        return;
    }

    const { imagen, nombre, precio, id } = camisa;

    const productoDetalles = document.createElement('DIV');
    productoDetalles.innerHTML = `
        <h1>${nombre}</h1>

        <div id="producto" class="camisa">
            <img class="camisa__img" src="${imagen}" alt="Imagen de ${nombre}">

            <div class="camisa__contenido">
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos quia fugiat dolor accusamus suscipit tenetur excepturi similique delectus nulla odio hic reiciendis non quasi consequuntur, maiores velit, ducimus ab labore? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit voluptatibus perspiciatis soluta eos neque vel, similique enim odit itaque quia eius quisquam, ea corrupti reiciendis ipsa ipsum voluptate in doloribus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur quam beatae, quo porro nam ea magnam quae assumenda ipsa officia cum rerum iste fuga sunt et voluptas, dignissimos itaque voluptates.</p>

                <p class="producto__precio-activo">Precio: $${precio}</p>
                
                <form class="formulario">
                    <select id="talla" class="formulario__campo" required>
                        <option value="" disabled selected>--Selecciona Talla--</option>
                        <option value="S">Chica</option>
                        <option value="M">Mediana</option>
                        <option value="L">Grande</option>
                    </select>
                    <input id="cantidad" class="formulario__campo" type="number" 
                           placeholder="Cantidad" min="1" max="10" required>
                    <input class="formulario__boton" type="submit" 
                           value="Agregar al carrito" data-id="${id}">
                </form>
            </div>
        </div>
    `;

    // Inserta en el HTML
    limpiarHTML();
    detalleProductoContainer.appendChild(productoDetalles);

    // Una vez que el producto se ha añadido al DOM, añade el event listener
    document.querySelector('#producto').addEventListener('click', agregarCurso);
}

function agregarCurso(e) {
    e.preventDefault();

    if (e.target.classList.contains('formulario__boton')) {
        const cursoSeleccionado = e.target.closest('#producto');

        // Obtener los elementos de talla y cantidad
        const tallaSelecionada = cursoSeleccionado.querySelector('#talla');
        const cantidadInput = cursoSeleccionado.querySelector('#cantidad');

        console.log(tallaSelecionada.value)

        // Validar que se haya seleccionado una talla
        if (!tallaSelecionada.value || tallaSelecionada.value === '--Selecciona Talla-') {
            mostararError('Debe seleccionar una talla');
            return;
        }

        // Validar que la cantidad sea mayor a 0
        if (cantidadInput.value <= 0) {
            mostararError('Debe ingresar una cantidad válida');
            return;
        }

        leerDatosCurso(cursoSeleccionado, tallaSelecionada.value, cantidadInput.value);

        // Mostrar el carrito al agregar un proucto
        mostrarCarrito();
    }
}

// Elimina un curso del carrito
function eliminarCurso(e) {
    if(e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');

        console.log(articulosCarrito.filter( curso => curso.id !== cursoId ));

        // Elimina del arreglo articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId );

        carritoHTML(); // Iterar sobre el carrito y mostrar su HTML
    }
}

// Lee el contenido del HTML al que le dimos click y extrae la informacion del curso
function leerDatosCurso(curso, talla, cantidad) {
    // Obtener el ID del producto
    const productoId = curso.querySelector('input[type="submit"]').getAttribute('data-id');
    
    // Buscar el producto en el arreglo `camisas`
    const producto = camisas.find(c => c.id == productoId);

    // Si el producto no se encuentra, manejar el error
    if (!producto) {
        console.error('Producto no encontrado en el arreglo de camisas:', productoId);
        return;
    }

    // Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: producto.imagen,
        titulo: producto.nombre,
        id: producto.id,
        cantidad: cantidad,
        talla: talla
    };

    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if (existe) {
        // Actualizamos la cantidad y talla
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad = cantidad;
                curso.talla = talla;
                return curso; // Retorna el objeto actualizado
            } else {
                return curso; // Retorna los objetos que no son duplicados
            }
        });
        articulosCarrito = [...cursos];
    } else {
        // Agrega elementos al arreglo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    console.log(articulosCarrito);

    carritoHTML();
}

// Muestra el carrito de compras en el HTML
function carritoHTML() {
    // Limpiar el HTML
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach( curso => {
        const { imagen, titulo, cantidad, talla, id } = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <td> ${titulo} </td>
            <td>
                <div class="txt-center cantidad">
                    <a class="carrito-storage" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path></svg>
                    </a>
                    <p>${cantidad}</p>
                    <a class="carrito-storage" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 11V13H19V11H5Z"></path></svg>
                    </a>
                </div>
            </td>
            <td> ${talla} </td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}">X</a>
            </td>
        `;

        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });

    // Agregar el carrito de compras al storage
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

function mostrarCarrito() {
    const carritoPadre = carrito.parentElement;
    carritoPadre.classList.add('hover');

    setTimeout(() => {
        carritoPadre.classList.remove('hover');
    }, 3000);
}

function mostararError(error) {
    const mensajeError = document.createElement('P');
    mensajeError.textContent = error;
    mensajeError.classList.add('error');

    // Insertar en el HTML
    const contenido = document.querySelector('.formulario');
    contenido.appendChild(mensajeError);

    // Elimana la alerta despues de 3s
    setTimeout(() => {
        mensajeError.remove();
    }, 3000);
}

// Elimina los cursos del tbody
function limpiarHTML() {
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}

// Limpiar HTML
function limpiarFiltro() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

// Funcion para filtrar segun la búsqueda
function filtrarCamisa() {
    const resultado = camisas.filter( filtrarNombre ).filter( filtrarMinimo ).filter( filtrarMaximo ).filter( filtrarColor )

    // console.log(resultado);

    if( resultado.length ){
        mostrarCamisas(resultado);
    } else {
        noResultado();
    }

}

function noResultado() {
    limpiarFiltro();

    const noResultado = document.createElement('DIV');
    noResultado.classList.add('alerta', 'error');
    noResultado.textContent = 'No se encontraron resultados, intenta con otras características de búsqueda';
    resultado.appendChild(noResultado);
}

function filtrarNombre(auto) {
    const { nombre } = datosBusqueda;
    if( nombre ){
        return auto.nombre === nombre;
    }

    return auto;
}

function filtrarMinimo(auto) {
    const { minimo } = datosBusqueda;
    if( minimo ){
        return auto.precio >= minimo;
    }

    return auto;
}

function filtrarMaximo(auto) {
    const { maximo } = datosBusqueda;
    if( maximo ){
        return auto.precio <= maximo;
    }

    return auto;
}

function filtrarColor(auto) {
    const { color } = datosBusqueda;
    if( color ){
        return auto.color === color;
    }

    return auto;
}