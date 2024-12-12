// Variables
const paginaActual = window.location.pathname;
const paginasBloqueada = ['/index.html', '/nosotros.html'];
const nombre = document.querySelector('#nombre');
const minimo = document.querySelector('#minimo');
const maximo = document.querySelector('#maximo');
const color = document.querySelector('#color');

// Contenedor para los resultados
const resultado = document.querySelector('#resultado');

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
        mostrarCamisas(camisas); // Muestra los autos a cargar

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

    // Cuando agregar un curso al carrito presionando "Agregar al carrito"
    if(!paginasBloqueada.includes(paginaActual)) {
        listaCursos.addEventListener('click', agregarCurso);
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
    limpiarFiltro() // Elimina el HTML previo

    camisas.forEach( camisa => {
        const camisaHTML = document.createElement('DIV');
        camisaHTML.classList.add('producto');

        const { imagen, nombre, precio, color, link } = camisa
        camisaHTML.innerHTML = `
            <a href="productos/${link}">
                <img class="producto__img" loading="lazy" src="${imagen}" alt="Imagen Camisa">
                <div class="producto__informacion">
                    <p class="producto__nombre">${nombre}</p>
                    <p class="producto__precio">$${precio}</p>
                    <input type="hidden" name="${color}">
                </div>
            </a>
        `;

        // Inserta em el HTML
        resultado.appendChild(camisaHTML);
    });
}

function agregarCurso(e) {
    e.preventDefault();

    if (e.target.classList.contains('formulario__boton')) {
        const cursoSeleccionado = e.target.parentElement.parentElement.parentElement.parentElement;

        // Obtener los elementos de talla y cantidad
        const tallaSelecionada = cursoSeleccionado.querySelector('#talla');
        const cantidadInput = cursoSeleccionado.querySelector('#cantidad').value;

        console.log(tallaSelecionada.value)

        // Validar que se haya seleccionado una talla
        if (tallaSelecionada.value === '--Selecciona Talla-') {
            mostararError('Debe seleccionar una talla');
            return;
        }

        // Validar que la cantidad sea mayor a 0
        if (cantidadInput.value <= 0) {
            mostararError('Debe ingresar una cantidad válida');
            return;
        }

        leerDatosCurso(cursoSeleccionado, tallaSelecionada.value, cantidadInput);

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
    // Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h1').textContent,
        id: curso.querySelector('input[type="submit"]').getAttribute('data-id'),
        cantidad: cantidad,
        talla: talla
    }


    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id );
    if(existe) {
        // Actualizamos la cantidad
        const cursos = articulosCarrito.map( curso => {
            if( curso.id === infoCurso.id ) {
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
        const { imagen, titulo, cantidad, id } = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${imagen}" width="100">
            </td>
            <td> ${titulo} </td>
            <td> ${cantidad} </td>
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