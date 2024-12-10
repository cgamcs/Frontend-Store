// Variables
const paginaActual = window.location.pathname;
const paginasBloqueada = ['/index.html', '/nosotros.html']
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#producto');
let articulosCarrito = [];

// EventListeners
cargarEvenetListeners();
localStorage.getItem(carrito);
function cargarEvenetListeners() {
    // Muestra los cursos desde Local Storage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse( localStorage.getItem('carrito') ) || [];

        carritoHTML();
    })

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
    })
}

// Funciones
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

        // Aactualizar el carrito de compras al storage
        sincronizarStorage();
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