import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxImageZoomModule } from 'ngx-image-zoom';


export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_calculado: number;
  cantidad_stock: number;
  categoria_id: number;
  nombre_color: string;
  tamano_id: number;
  nombre_tamano: string;
  color_id: number;
  imagenes: string[];
}

// Interfaz para definir variantes (colores y tamaños)
interface Variante {
  color_id: number;
  nombre_color: string;
  tamano_id: number;
  nombre_tamano: string;
}


@Component({
  selector: 'app-detalleproducto',
  standalone: true,
  imports: [CurrencyPipe, CommonModule,MatCardModule,MatButtonModule,MatIconModule,MatProgressSpinnerModule, NgxImageZoomModule],
  templateUrl: './detalleproducto.component.html',
  styleUrl: './detalleproducto.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Añade esto aquí
})
export class DetalleproductoComponent implements OnInit{

  
  zoomEnabled: boolean = false;
  producto: Producto | null = null;
  apiUrlProductos = 'https://back-tienda-one.vercel.app//api/productos'; // URL del backend

  coloresDisponibles: Variante[] = [];
  tamanosDisponibles: Variante[] = [];
  apiUrl = 'https://back-tienda-one.vercel.app//api'; // URL del backend

  constructor(private route: ActivatedRoute, private http: HttpClient,private carritoService: CarritoService) {}

  ngOnInit(): void {
    const productoId = this.route.snapshot.paramMap.get('id');
    if (productoId) {
      this.cargarDetalleProducto(+productoId);
    }
  }

  cargarDetalleProducto(id: number): void {
    this.http.get<Producto>(`${this.apiUrlProductos}/${id}`).subscribe({
      next: (data) => {
        this.producto = data;
        this.cargarVariantes(data.nombre);
      },
      error: (err) => {
        console.error('Error al cargar el producto:', err);
      }
    });
  }
  colorSeleccionado: number | null = null;

  cargarVariantes(nombre: string): void {
    this.http.get<Variante[]>(`${this.apiUrl}/variantes?nombre=${nombre}`).subscribe({
      next: (data) => {
        if (data.length > 0) {
          // Obtener los colores únicos disponibles
          this.coloresDisponibles = [...new Map(data.map(v => [v.color_id, v])).values()];
          this.tamanosDisponibles = []; // No mostrar tamaños hasta seleccionar un color
        }
      },
      error: (err) => console.error('Error al obtener variantes:', err),
    });
  }
  

    seleccionarColor(colorId: number): void {
      this.colorSeleccionado = colorId;
    
      // Realizar la consulta para obtener el producto con el color seleccionado
      this.http.get<Producto[]>(`${this.apiUrlProductos}?nombre=${this.producto?.nombre}&color_id=${colorId}`).subscribe({
        next: (productos) => {
          if (productos.length > 0) {
            // Mostrar el producto con el color seleccionado (en este caso, tomamos el primer producto)
            this.producto = productos[0];
            
            // Cargar variantes (tamaños) disponibles para ese color seleccionado
            this.tamanosDisponibles = productos.map(p => ({
              color_id: p.color_id,          // Mantener el color_id
              nombre_color: p.nombre_color,  // Mantener el nombre del color
              tamano_id: p.tamano_id,
              nombre_tamano: p.nombre_tamano
            }));
          } else {
            console.log('No se encontró producto con ese color');
          }
        },
        error: (err) => {
          console.error('Error al obtener producto con el color seleccionado:', err);
        }
      });
    }
    
    
    
    
    
    
  

      // Cambiar la imagen principal al hacer clic en una imagen secundaria
      cambiarImagenProducto(producto: Producto, index: number): void {
        const imagenSeleccionada = producto.imagenes[index];
        producto.imagenes = [imagenSeleccionada, ...producto.imagenes.filter(img => img !== imagenSeleccionada)];
      }


      // Agregar producto al carrito usando el servicio
      agregarAlCarrito(producto: Producto): void {
        this.carritoService.agregarAlCarrito(producto.id, 1).subscribe({
          next: (respuesta) => {
            console.log('Respuesta del backend:', respuesta);
            alert('Producto agregado al carrito');
          },
          error: (err) => {
            if (err.status === 401) {
              alert('Debes iniciar sesión para agregar productos al carrito.');
            } else {
              console.error('Error al agregar producto:', err);
            }
          }
        });
      }


      zoom(event: MouseEvent): void {
        this.zoomEnabled = true;
        const lens = document.querySelector('.zoom-lens') as HTMLElement;
        const image = document.querySelector('.product-detail-image') as HTMLImageElement;
        const imagesContainer = document.querySelector('.product-detail-images') as HTMLElement;
      
        if (lens && image) {
          imagesContainer.classList.add('zoom-active');
          
          // Posición del cursor dentro de la imagen
          const x = event.offsetX;
          const y = event.offsetY;
      
          // Ajustar la posición y tamaño del zoom
          lens.style.backgroundSize = `${image.width * 3}px ${image.height * 3}px`;
          lens.style.backgroundPosition = `-${x * 3}px -${y * 3}px`;
        }
      }
      
      resetZoom(): void {
        this.zoomEnabled = false;
        const imagesContainer = document.querySelector('.product-detail-images') as HTMLElement;
        if (imagesContainer) {
          imagesContainer.classList.remove('zoom-active');
        }
      }
      
      

 
}
