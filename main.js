function Prestamo(monto, tasaAnual, tiempoEnMeses) {
  this.monto = monto;
  this.tasaAnual = tasaAnual;
  this.tiempoEnMeses = tiempoEnMeses;
  this.calcularInteresSimple = function () {
    return (this.monto * this.tasaAnual * (this.tiempoEnMeses / 12)) / 100;
  };
  this.calcularMontoTotal = function () {
    return this.monto + this.calcularInteresSimple();
  };
  this.calcularCuotaMensual = function () {
    return this.calcularMontoTotal() / this.tiempoEnMeses;
  };
}


let prestamos = [];


function cargarPrestamos() {
  if (prestamos.length == 0) {
    fetch('prestamos.json')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Error al cargar los préstamos.');
      })
      .then(data => {
        data.forEach(prestamo => {
          prestamos.push(new Prestamo(prestamo.monto, prestamo.tasaAnual, prestamo.tiempoEnMeses));
        });
        mostrarTodosLosPrestamos();
      })
      .catch(error => {
        Swal.fire({
          icon: "error",
          title: "Ufa...",
          text: "¡Algo salió mal!",
        });
      });
  }
}


function mostrarTodosLosPrestamos() {
  const listaPrestamos = document.getElementById("listaPrestamos");
  listaPrestamos.innerHTML = prestamos.length === 0 ? "<li>No se han realizado operaciones.</li>" : generarListaPrestamos();
}


function generarListaPrestamos() {
  return prestamos.map((prestamo, index) => `
    <li><strong>Operación #${index + 1}</strong><br>
    Monto principal: $${prestamo.monto.toFixed(2)}<br>
    Tasa de interés anual: ${prestamo.tasaAnual}%<br>
    Tiempo en meses: ${prestamo.tiempoEnMeses}<br>
    Cuota Mensual: $${prestamo.calcularCuotaMensual().toFixed(2)}</li><br>`).join('');
}


function agregarPrestamoALaLista(prestamo) {
  prestamos.push(prestamo);
  guardarEnLocalStorage();
  mostrarTodosLosPrestamos();
}


function limpiarInputs() {
  document.getElementById("monto").value = "";
  document.getElementById("tiempo").value = "";
  document.getElementById("tasa").value = "";
}


function guardarEnLocalStorage() {
  
  const datosParaGuardar = prestamos.map(prestamo => ({
    monto: prestamo.monto,
    tasaAnual: prestamo.tasaAnual,
    tiempoEnMeses: prestamo.tiempoEnMeses,
    cuotaMensual: prestamo.calcularCuotaMensual()
  }));

  localStorage.setItem('prestamos', JSON.stringify(datosParaGuardar));
}



function cargarDesdeLocalStorage() {
  const storedPrestamos = localStorage.getItem('prestamos');
  if (storedPrestamos) {
    const parsedPrestamos = JSON.parse(storedPrestamos);
    parsedPrestamos.forEach(prestamo => {
      prestamos.push(new Prestamo(prestamo.monto, prestamo.tasaAnual, prestamo.tiempoEnMeses));
    });
  }
}

function limpiarData() {
  prestamos = [];
}


window.onload = function () {
  limpiarData();
  cargarDesdeLocalStorage();
  cargarPrestamos();
  mostrarTodosLosPrestamos();

  const calcularButton = document.getElementById("calcularBtn");
  calcularButton.addEventListener("click", function() {
    const monto = parseFloat(document.getElementById("monto").value);
    const tiempoEnMeses = parseFloat(document.getElementById("tiempo").value);
    const tasaAnual = parseFloat(document.getElementById("tasa").value);

    if (isNaN(monto) || monto <= 0 || isNaN(tasaAnual) || tasaAnual < 0 || isNaN(tiempoEnMeses) || tiempoEnMeses < 1) {
      document.getElementById("resultados").innerHTML = "Por favor, ingrese valores válidos para el monto, la tasa y el tiempo.";
      return;
    }

    const nuevoPrestamo = new Prestamo(monto, tasaAnual, tiempoEnMeses);

    agregarPrestamoALaLista(nuevoPrestamo);

    limpiarInputs();

    Swal.fire({
      icon: 'success',
      title: '¡Préstamo calculado!',
      text: 'El préstamo ha sido calculado y agregado a la lista.',
      showConfirmButton: false,
      timer: 2000
    });
  });
};

