function renderizarTabla () {

    // Limpiar el tbody
    tbodyFechasReservadas.innerHTML = "";

    // Recorremos las reservas
    for(const reserva of reservas) {

        // Crear el tr
        const tr = document.createElement("tr");

        // Creamos las columnas
        const td1 = document.createElement("td");
        td1.innerText = reserva.fecha;

        const td2 = document.createElement("td");
        td2.innerText = reserva.nombre;

        const td3 = document.createElement("td");
        td3.innerText = reserva.apellido;

        // Agregar al tr
        tr.append(td1);
        tr.append(td2);
        tr.append(td3);

        // Agregar tr al tbody
        tbodyFechasReservadas.append(tr);
    }
}

function crearInputFecha () {

    // Creo input fecha
    const fechaHoy = new Date();
    inputFecha = document.createElement("input");
    inputFecha.type = "date";

    inputFecha.min = `${fechaHoy.getFullYear()}-${fechaHoy.getMonth() + 1}-${fechaHoy.getDate()}`;

    // Agregamos input a formulario
    formularioDeReserva.append(inputFecha);
}

function fechaSeaMayorAHoy (fecha) {

    const dateHoy = new Date();
    const dateReserva = new Date(fecha);

    // Validar si la fecha elegida es menor a hoy
    if(dateReserva < dateHoy) {
        return false;
    }

    return true;
}

function obtenerReservas () {

    const reservasLS = localStorage.getItem("reservas");

    if(reservasLS !== null) {
        return JSON.parse(reservasLS);
    }

    return [];
}

function fechaDisponible (fecha) {
    return !reservas.some( (elemento) => {
        return elemento.fecha === fecha;
    });
}

/** VARIABLES GLOBALES */

const formularioDeReserva = document.getElementById("reserva");
let inputFecha;
crearInputFecha();
const inputNombre = document.getElementById("nombre");
const inputApellido = document.getElementById("apellido");

let reservas = obtenerReservas();

const tbodyFechasReservadas = document.getElementById("tbodyFechasReservadas");

const selectOrdenar = document.getElementById("selectOrdenar");

const botonLimpiarLocalStorage = document.getElementById("limpiarLocalStorage");

/** CÓDIGO */

renderizarTabla();

/** EVENTOS */

formularioDeReserva.addEventListener("submit", (event) => {

    // Detenemos el evento
    event.preventDefault();

    // Obtenemos los datos del input
    const fecha = inputFecha.value;
    const nombre = inputNombre.value;
    const apellido = inputApellido.value;

    // Chequeamos que la fecha no esté reservada
    if(fechaDisponible(fecha)) {

        // Chequeamos que la fecha elegida sea mayor al día de hoy
        if(fechaSeaMayorAHoy(fecha)) {

            // Cargamos la reserva al array
            reservas.push({
                fecha: fecha,
                nombre: nombre,
                apellido: apellido,
            });

            // Cargar array al localStorage
            localStorage.setItem("reservas", JSON.stringify(reservas));

            alert("FECHA RESERVADA CON ÉXITO");

            // Limpiar inputs
            inputFecha.value = "";
            inputNombre.value = "";
            inputApellido.value = "";

            // Renderizar tabla
            renderizarTabla();

        } else {

            alert("ESTA FECHA ES MENOR AL DÍA DE HOY");

        }


    } else {

        alert("ESTA FECHA YA ESTÁ RESERVADA");
    }


});

selectOrdenar.addEventListener("change", () => {

    const value = selectOrdenar.value;

    switch(value) {

        case 'asc':

            reservas.sort( (a, b) => {

                const dateA = new Date(a.fecha);
                const dateB = new Date(b.fecha);

                if(dateA > dateB) {
                    return 1;
                } else if(dateA < dateB) {
                    return -1;
                }

                return 0;
            });

            break;

        case 'desc':

            // Ordeno el array de reservas
            reservas.sort( (a, b) => {

                const dateA = new Date(a.fecha);
                const dateB = new Date(b.fecha);

                if(dateA > dateB) {
                    return -1;
                } else if(dateA < dateB) {
                    return 1;
                }

                return 0;
            });

            break;

        case 'original':

            reservas = obtenerReservas();

            break;
    }

    // Renderizo la tabla
    renderizarTabla();

});

botonLimpiarLocalStorage.addEventListener("click", () => {

    // Limpiamos lo que tiene la key reservas con un array vacío
    localStorage.setItem("reservas", JSON.stringify([]));

    // Obtenemos las reservas del LS
    reservas = obtenerReservas();

    // Renderizamos la tabla
    renderizarTabla();

});
