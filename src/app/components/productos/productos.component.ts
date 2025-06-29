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



// Agrega variantes a Producto
export interface Variante {
  id: number;
  nombre_color: string;
  nombre_tamano: string;
  precio_venta: number;
  cantidad_stock: number;
  imagenes: string[];
}


export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_venta: number;
  cantidad_stock: number;
  categoria_id: number;
  nombre_color: string;
  tamano_id: number;
  nombre_tamano: string;
  color_id: number;
  imagenes: string[];
  total_resenas:number;
  calificacion_promedio: number;
  stars?: string[];
  variantes?: Variante[];
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
  variantesComoTarjetas: any[] = [];


  apiUrlProductos = 'https://back-tienda-one.vercel.app/api/productos'; // Ajusta esta URL según tu backend
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

          // Aplanar variantes en tarjetas individuales
      this.variantesComoTarjetas = [];


        // Calcula las estrellas para cada producto basado en la calificación promedio
        this.productos.forEach(producto => {
          producto.stars = this.calculateStars(producto.calificacion_promedio);

          if (producto.variantes && producto.variantes.length > 0) {
            producto.variantes.forEach(vari => {
              this.variantesComoTarjetas.push({
                id: producto.id,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                color: vari.nombre_color,
                tamano: vari.nombre_tamano,
                precio_venta: vari.precio_venta,
                cantidad_stock: vari.cantidad_stock,
                imagenes: vari.imagenes,
                calificacion_promedio: producto.calificacion_promedio,
                total_resenas: producto.total_resenas,
                stars: producto.stars,
                varianteId: vari.id
              });
            });
          } else {
            // Productos sin variantes
            this.variantesComoTarjetas.push({
              id: producto.id,
              nombre: producto.nombre,
              descripcion: producto.descripcion,
              color: producto.nombre_color,
              tamano: producto.nombre_tamano,
              precio_venta: producto.precio_venta,
              cantidad_stock: producto.cantidad_stock,
              imagenes: producto.imagenes,
              calificacion_promedio: producto.calificacion_promedio,
              total_resenas: producto.total_resenas,
              stars: producto.stars,
              varianteId: ''
            });
          }
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
agregarAlCarrito(producto_id: number, variante_id: number | null): void {
  this.carritoService.agregarAlCarrito(producto_id, variante_id, 1).subscribe({
    next: () => alert('Producto agregado al carrito'),
    error: (err) => {
      if (err.status === 401) alert('Debes iniciar sesión para agregar productos al carrito.');
      else console.error(err);
    }
  });
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