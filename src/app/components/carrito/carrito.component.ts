import { Component, OnInit, ViewChild } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit  {


  carrito: any[] = [];
  totalParcial: number = 0;
  total: number = 0;
  tarifaPlana: number = 255.00;
  metodoPago: string = '';
  direccionEnvio: string = '';
  metodosPago: any[] = [];
  
  // URL de la API de compra
  apiUrl: string = 'https://back-tienda-one.vercel.app/api/comprar';

  constructor(private http: HttpClient, private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.cargarCarrito();
    this.cargarMetodosPago();
  }

  // Cargar productos del carrito desde el backend
  cargarCarrito(): void {
    this.carritoService.getCarrito().subscribe((productos) => {
      this.carrito = productos;
      this.actualizarTotales();
    });
  }
  getTotal(): number {
    return this.total;
  }
  // Actualiza los totales (incluyendo la tarifa de envío solo si hay productos)
  actualizarTotales(): void {
    this.totalParcial = this.carrito.reduce((total, item) => total + (item.precio_calculado * item.cantidad), 0);
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
        alert('Compra realizada con éxito. ID de venta: ' + response.venta_id);
        // Una vez realizada la compra, se limpia el carrito
        this.carritoService.limpiarCarrito().subscribe(() => {
          this.carrito = [];
          this.actualizarTotales();
        });
      },
      error => {
        console.error('Error al realizar la compra', error);
        alert('Error al realizar la compra');
      }
    );
  }
}