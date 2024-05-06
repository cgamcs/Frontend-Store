const datos = {
    talla : '',
    cantidad : ''
}

const talla = document.querySelector('#talla');
const cantidad = document.querySelector('#cantidad');
const formulario = document.querySelector('.formulario');

talla.addEventListener('input', leerCompra);
cantidad.addEventListener('input', leerCompra);

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const { talla, cantidad } = datos;

    if(talla === '' || cantidad === '') {
        mostrarAlerta('Todos los campos son necesarios', 'error');

        return;
    }

    mostrarAlerta('Se agrego correctamente al carrito');
})

function mostrarAlerta(mensaje, error = null) {
    const alerta = document.createElement('P');
    alerta.textContent = mensaje;

    if(error) {
        alerta.classList.add('error');
    } else {
        alerta.classList.add('correcto');
    }
    formulario.appendChild( alerta );

    setTimeout(() => {
        alerta.remove()
    }, 3000);
}

function leerCompra(evento) {
    datos[evento.target.id] = evento.target.value;
    console.log(datos);
}