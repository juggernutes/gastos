class Gasto {
    constructor(id, cantidad, categoria, desc) {
        this.id = id;
        this.cantidad = cantidad;
        this.categoria = categoria;
        this.desc = desc;
    }
}

class ControlGastos {
    constructor() {
        this.gastos = JSON.parse(localStorage.getItem('gastos')) || [];
    }

    agregarGasto(cantidad, categoria, desc) {
        let nuevoId = 1;
        if (this.gastos.length > 0) {
            const ids = this.gastos.map(g => g.id);
            nuevoId = Math.max(...ids) + 1;
        }
        const nGasto = new Gasto(nuevoId, cantidad, categoria, desc);
        this.gastos.push(nGasto);
        localStorage.setItem('gastos', JSON.stringify(this.gastos));

        return nGasto;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        localStorage.setItem('gastos', JSON.stringify(this.gastos));
    }

    calcularTotal() {
        let total = 0;
        this.gastos.forEach(g => total += g.cantidad);
        return total;
    }
}

const control = new ControlGastos();
const formulario = document.getElementById('formulario');
const lista = document.getElementById('lista-gastos');
const total = document.getElementById('total');

document.addEventListener('DOMContentLoaded', () => {
    control.gastos.forEach(gasto => agregarGastoLista(gasto));
    calcularTotal();
});

formulario.addEventListener('submit', e => {
    e.preventDefault();
    const cantidad = parseFloat(document.getElementById('cantidad').value);
    const categoria = document.getElementById('categoria').value;
    const desc = document.getElementById('desc').value;
    const gasto = control.agregarGasto(cantidad, categoria, desc);
    agregarGastoLista(gasto);
    formulario.reset();
});

function agregarGastoLista(gasto) {
    const li = document.createElement('li');

    li.className = 'card-text list-group-item d-flex justify-content-between align-items-center';
    li.dataset.id = gasto.id;
    li.innerHTML = `${gasto.categoria} ,${gasto.cantidad}, ${gasto.desc}`;
    const btnBorrar = document.createElement('button');
    btnBorrar.textContent = 'Borrar';

    btnBorrar.classList.add('btn', 'btn-danger', 'btn-sm');
    btnBorrar.onclick = function () {
        control.eliminarGasto(gasto.id);
        lista.removeChild(li);
        calcularTotal();
    }
    li.appendChild(btnBorrar);
    lista.appendChild(li);

    calcularTotal();
}

function calcularTotal() {
    total.innerHTML = "Total: $" + control.calcularTotal();
}