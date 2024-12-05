// const datos = {
//     talla : '',
//     cantidad : ''
// }

// const talla = document.querySelector('#talla');
// const cantidad = document.querySelector('#cantidad');
// const formulario = document.querySelector('.formulario');

const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#producto');
let articulosCarrito = [];

// talla.addEventListener('input', leerCompra);
// cantidad.addEventListener('input', leerCompra);

// formulario.addEventListener('submit', function(evento) {
//     evento.preventDefault();

//     const { talla, cantidad } = datos;

//     if(talla === '' || cantidad === '') {
//         mostrarAlerta('Todos los campos son necesarios', 'error');

//         return;
//     }

//     mostrarAlerta('Se agrego correctamente al carrito');
// })

// Cuando agregar un curso al carrito presionando "Agregar al carrito"
listaCursos.addEventListener('click', agregarCurso);

// Elimina cursos del carrito
carrito.addEventListener('click', eliminarCurso);

// Vaciar el carrito
vaciarCarrito.addEventListener('click', () => {
    articulosCarrito = []; // Reseteamos el arreglo

    limpiarHTML(); // Eliminamos todo el HTML
})

// function mostrarAlerta(mensaje, error = null) {
//     const alerta = document.createElement('P');
//     alerta.textContent = mensaje;

//     if(error) {
//         alerta.classList.add('error');
//     } else {
//         alerta.classList.add('correcto');
//     }
//     formulario.appendChild( alerta );

//     setTimeout(() => {
//         alerta.remove()
//     }, 3000);
// }

// function leerCompra(evento) {
//     datos[evento.target.id] = evento.target.value;
//     console.log(datos);
// }

// Funciones
function agregarCurso(e) {
    e.preventDefault();

    if (e.target.classList.contains('formulario__boton')) {
        const cursoSeleccionado = e.target.parentElement.parentElement.parentElement.parentElement;

        leerDatosCurso(cursoSeleccionado);
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
function leerDatosCurso(curso) {
    // Crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h1').textContent,
        id: curso.querySelector('input[type="submit"]').getAttribute('data-id'),
        cantidad: 1
    }


    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id );
    if(existe) {
        // Actualizamos la cantidad
        const cursos = articulosCarrito.map( curso => {
            if( curso.id === infoCurso.id ) {
                curso.cantidad++;
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
    })
}

// Elimina los cursos del tbody
function limpiarHTML() {
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}