import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CarritoService } from '../../services/carrito.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { DataViewModule } from 'primeng/dataview';


export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_calculado: number;
  cantidad_stock: number;
  categoria_id: number;
  imagenes: string[];  // Lista de imágenes asociadas al producto
  inventoryStatus: 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';
  total_resenas:number;
  calificacion_promedio: number;
  stars?: string[];
}


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, ButtonModule, TagModule, RatingModule, DataViewModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit  {
  stars: string[] = [];
  layout: 'list' | 'grid' = 'list'; 

  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null; // Producto seleccionado

  apiUrlProductos = 'https://tienda-lib-cr.vercel.app/api/productos'; // Ajusta esta URL según tu backend
  categoriaNombre: string = ''; // Variable para almacenar el nombre de la categoría
  constructor(private http: HttpClient, private carritoService: CarritoService,private route: ActivatedRoute) {}

  ngOnInit(): void {
 // Captura el parámetro 'nombre' de la URL

 this.route.params.subscribe(params => {
  this.categoriaNombre = params['nombreCategoria'];
  this.cargarProductosPorCategoria(this.categoriaNombre);
});
  }

  cargarProductosPorCategoria(nombreCategoria: string): void {
    this.http.get<Producto[]>(`${this.apiUrlProductos}/categoria/nombre/${nombreCategoria}`).subscribe({
      next: (data) => {
        this.productos = data;

        // Calcula las estrellas para cada producto basado en la calificación promedio
        this.productos.forEach(producto => {
          producto.stars = this.calculateStars(producto.calificacion_promedio);
        });
        // Verifica si hay un query parameter "selected"
        const selectedId = this.route.snapshot.queryParamMap.get('selected');
        if (selectedId) {
          const id = parseInt(selectedId, 10);
          const found = data.find(p => p.id === id);
          if (found) {
            this.productoSeleccionado = found;
          } else {
            this.productoSeleccionado = null;
          }
        } else {
          // Si no se llegó desde búsqueda, no se destaca ningún producto.
          this.productoSeleccionado = null;
        }
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  // Getter para obtener los productos restantes (excluyendo el seleccionado, si lo hay)
  get productosRestantes(): Producto[] {
    if (!this.productoSeleccionado) {
      return this.productos;
    }
    return this.productos.filter(p => p.id !== this.productoSeleccionado!.id);
  }
    // Cambiar la imagen principal al hacer clic
    cambiarImagen(producto: Producto): void {
      if (producto.imagenes.length > 1) {
        const imagenActual = producto.imagenes[0];  // Obtener la imagen actual
        producto.imagenes = [producto.imagenes[1], ...producto.imagenes.filter(img => img !== imagenActual)];
      }
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



  // Función para ver el detalle del producto
  verDetalle(producto: Producto): void {
    console.log('Ver detalle del producto:');
    // Aquí agregaríamos lógica para redirigir a una página de detalle o mostrar más información sobre el producto
  }

  getSeverity(product: Producto): 'success' | 'warning' | 'danger' | 'secondary' | 'info' | 'contrast' | undefined {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return undefined;
    }
  }
// Función para calcular las estrellas
calculateStars(rating: number): string[] {
  if (rating === 0) {
    return []; // No mostrar estrellas si la calificación es 0
  }
  
  const fullStars = Math.floor(rating); // Estrellas llenas
  const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Estrella media si el resto es >= 0.5
  const emptyStars = 5 - fullStars - halfStars; // Estrellas vacías

  return [
    ...Array(fullStars).fill('pi-star'), // Estrellas llenas
    ...Array(halfStars).fill('pi-star-half'), // Estrella media
    ...Array(emptyStars).fill('pi-star-o') // Estrellas vacías
  ];
}

  

}