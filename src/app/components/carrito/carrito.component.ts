import { Component, OnInit, ViewChild } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';



@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, CardModule, DropdownModule, RadioButtonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit  {


  carrito: any[] = [];
  totalParcial: number = 0;
  total: number = 0;
  tarifaPlana: number = 255.00;
  metodoPago: number = 0;
  direccionEnvio: string = '';
  metodosPago: any[] = [];

codigoPostal: string = '';
colonias: string[] = [];
coloniaSeleccionada: string = '';
municipio: string = '';
estado: string = '';
calle: string = '';
numero: string = '';
referencia: string = '';
codigosPostalesData: any[] = [];
mostrarFormulario = false;


  
  // URL de la API de compra
  apiUrl: string = 'https://back-tienda-one.vercel.app/api/comprar';

  constructor(private http: HttpClient, private carritoService: CarritoService) {}

// Se llama una vez al iniciar
cargarCodigosPostales(): void {
  this.http.get<any[]>('assets/csvjson.json').subscribe(data => {
    this.codigosPostalesData = data;
  });
}


  ngOnInit(): void {
    this.cargarCarrito();
    this.cargarMetodosPago();
    this.cargarCodigosPostales();
  }

  // Cargar productos del carrito desde el backend
  cargarCarrito(): void {
    this.carritoService.getCarrito().subscribe((productos) => {
      this.carrito = productos.map(item => ({
        ...item,
        precio_venta: Number(item.precio_venta),
        imagenes_variante: item.imagenes_variante ? item.imagenes_variante.split(',') : [],
        imagenes_producto: item.imagenes_producto ? item.imagenes_producto.split(',') : []
      }));
      this.actualizarTotales();
    });
  }
  getTotal(): number {
    return this.total;
  }
  // Actualiza los totales (incluyendo la tarifa de envío solo si hay productos)
  actualizarTotales(): void {
    this.totalParcial = this.carrito.reduce((total, item) => total + (item.precio_venta * item.cantidad), 0);
    this.total = this.carrito.length > 0 ? this.totalParcial + this.tarifaPlana : 0;
  }

  // Cargar métodos de pago desde el backend
  cargarMetodosPago(): void {
    this.http.get<any[]>('https://back-tienda-one.vercel.app/api/metodos-pago').subscribe(metodos => {
      this.metodosPago = metodos;
      if (metodos && metodos.length > 0) {
        this.metodoPago = metodos[0].id;
      }
    });
  }

  // Función para realizar la compra
  comprar(): void {
    if (!this.metodoPago) {
      alert('Seleccione un método de pago');
      return;
    }

    // Asignar la dirección antes
  this.direccionEnvio = `${this.calle} ${this.numero}, ${this.coloniaSeleccionada}, ${this.municipio}, ${this.estado}, CP ${this.codigoPostal}, Referencia ${this.referencia} `;

    if (!this.direccionEnvio) {
      alert('Ingrese su dirección de envío');
      return;
    }
    const compraData = {
      productos: this.carrito,
      total: this.getTotal(),
      metodoPago: this.metodoPago,
      direccionEnvio: this.direccionEnvio

    };
    this.http.post<any>(this.apiUrl, compraData, {withCredentials:true}).subscribe(
      response => {
           if (this.metodoPago == 4 && response.init_point) {
             alert('Redirigiendo a Mercado Pago...');
        // Redirigir al checkout de Mercado Pago
        window.location.href = response.init_point;
      } else {
        alert('Compra realizada con éxito. ID de venta: ');
        // Una vez realizada la compra, se limpia el carrito
        this.carritoService.limpiarCarrito().subscribe(() => {
          this.carrito = [];
          this.actualizarTotales();
        });
      }
      },
      error => {
        console.error('Error al realizar la compra', error);
        alert('Error al realizar la compra');
      }
    );
  }

// Buscar colonias según código postal ingresado
buscarColoniasPorCP(): void {
  if (this.codigoPostal.length === 5) {
    const coincidencias = this.codigosPostalesData.filter(item => item.d_codigo == +this.codigoPostal);
    const coloniasUnicas = [...new Set(coincidencias.map(item => item.d_asenta))];
    this.colonias = coloniasUnicas;
    if (coincidencias.length > 0) {
      this.municipio = coincidencias[0].D_mnpio;
      this.estado = coincidencias[0].d_estado;
    } else {
      this.municipio = '';
      this.estado = '';
    }
  }
}

direccionValida(): boolean {
  return this.calle.trim() !== '' && this.numero.trim() !== '' &&
         this.codigoPostal.length === 5 && this.coloniaSeleccionada !== '' &&
         this.municipio !== '' && this.estado !== '';
}

cancelarFormulario() {
  this.codigoPostal = '';
  this.coloniaSeleccionada = '';
  this.calle = '';
  this.numero = '';
  this.referencia = '';
  this.colonias = [];
  this.municipio = '';
  this.estado = '';
  this.mostrarFormulario = false;
}


}