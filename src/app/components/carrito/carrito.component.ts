import { Component, OnInit, ViewChild } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';

import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';

import { ViewportScroller } from '@angular/common';


import { RecomendacionService } from '../../services/recomendacion.service';

interface Producto {
  id: number;
  nombre: string;
  precio_venta: number;
  cantidad: number;
  imagenes_variante: string[];
  imagenes_producto: string[];
}


@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, CarouselModule, FormsModule, RouterLink, TableModule, ButtonModule, CardModule, DropdownModule, RadioButtonModule, InputNumberModule, ToastModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
  providers: [MessageService, ConfirmationService],
})
export class CarritoComponent implements OnInit {

  // Aquí guardaremos los detalles completos de las recomendaciones
  recomendacionesDetalles: any[] = [];


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


  recomendaciones: string[] = [];



  // URL de la API de compra
  apiUrl: string = 'https://api-libreria.vercel.app/api/comprar';

  constructor(private http: HttpClient,
    private carritoService: CarritoService,
    private messageService: MessageService,
    private router: Router,
    private recomendacionService: RecomendacionService,
   private scroller: ViewportScroller) { }

  // Se llama una vez al iniciar
  cargarCodigosPostales(): void {
    this.http.get<any[]>('assets/csvjson.json').subscribe(data => {
      this.codigosPostalesData = data;
    });
  }


  // Método que primero obtiene nombres recomendados y luego detalles completos
  cargarRecomendaciones() {
    const nombresProductos = this.carrito.map(item => item.nombre);
    if (nombresProductos.length === 0) {
      this.recomendacionesDetalles = [];
      return;
    }

    // 1. Obtener nombres recomendados desde Flask
    this.recomendacionService.obtenerRecomendaciones(nombresProductos).subscribe({
      next: nombresRecomendados => {
        console.log('Nombres recomendados:', nombresRecomendados);

        if (nombresRecomendados.length === 0) {
          this.recomendacionesDetalles = [];
          return;
        }

        // 2. Obtener detalles completos desde backend Express
        this.http.post<any[]>('https://api-libreria.vercel.app/api/productos/recomendados-detalle', { nombres: nombresRecomendados })
          .subscribe({
            next: detalles => {
              this.recomendacionesDetalles = detalles;
              console.log('Detalles recomendados:', this.recomendacionesDetalles);
            },
            error: err => {
              console.error('Error obteniendo detalles recomendados', err);
              this.recomendacionesDetalles = [];
            }
          });
      },
      error: err => {
        console.error('Error obteniendo nombres recomendados', err);
        this.recomendacionesDetalles = [];
      }
    });
  }






  ngOnInit(): void {
    this.cargarCarrito();
    this.cargarMetodosPago();
    this.cargarCodigosPostales();
    this.cargarRecomendaciones();
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
      this.cargarRecomendaciones();
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

  eliminarDelCarrito(producto_id: number, variante_id: number | null = null): void {
    this.carritoService.eliminarProducto(producto_id, variante_id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Producto eliminado del carrito' });
        this.cargarCarrito(); // Recarga la lista después de eliminar
      },
      error: (err) => {
        console.error('Error al eliminar producto', err);
        this.messageService.add({ severity: 'error', summary: 'Error al eliminar producto' });
      }
    });
  }


  // Cargar métodos de pago desde el backend
  cargarMetodosPago(): void {
    this.http.get<any[]>('https://api-libreria.vercel.app/api/metodos-pago').subscribe(metodos => {
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
    this.http.post<any>(this.apiUrl, compraData, { withCredentials: true }).subscribe(
      response => {
        if (this.metodoPago == 4 && response.init_point) {
          alert('Redirigiendo a Mercado Pago...');
          // Redirigir al checkout de Mercado Pago
          window.location.href = response.init_point;

        } else if (response.redirect) {
          // Método de pago: Efectivo u otro que requiere redirección
          alert('Compra realizada. Redirigiendo...');
          this.router.navigate([response.redirect]);

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
  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '992px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  
  irACategorias() {
    this.router.navigate(['/']).then(() => {
      // Esperamos un poco para asegurar que se cargue el home antes de hacer scroll
      setTimeout(() => {
        this.scroller.scrollToAnchor('categorias');
      }, 500);
    });
  }

}