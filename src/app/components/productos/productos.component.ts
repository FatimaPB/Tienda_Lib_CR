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
import { MenuItem } from 'primeng/api'; // Importa MenuItem
import { FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ComentarioService } from '../../services/comentario.service';

import { ViewportScroller } from '@angular/common';



// Agrega variantes a Producto
export interface Variante {
  id: number;
  nombre_color: string;
  nombre_tamano: string;
  precio_venta: number;
  precio_anterior: number;
  cantidad_stock: number;
  imagenes: string[];
}


export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_venta: number;
  precio_anterior: number;
  cantidad_stock: number;
  categoria_id: number;
  nombre_color: string;
  tamano_id: number;
  nombre_tamano: string;
  color_id: number;
  imagenes: string[];
  total_resenas: number;
  calificacion_promedio: number;
  stars?: string[];
  variantes?: Variante[];
}


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, ButtonModule,
    TagModule, RatingModule, DataViewModule, BreadcrumbModule, FormsModule, MatProgressSpinner],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  items: MenuItem[] = [];
  stars: string[] = [];
  layout: 'list' | 'grid' = 'list';


  loading: boolean = true;

  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null; // Producto seleccionado
  variantesComoTarjetas: any[] = [];

  comentariosPorProducto: { [key: string]: number } = {};

  promedioCalificacionesPorProducto: { [key: string]: number } = {};



  apiUrlProductos = 'https://api-libreria.vercel.app/api/productos'; // Ajusta esta URL según tu backend
  categoriaNombre: string = ''; // Variable para almacenar el nombre de la categoría
  constructor(private router: Router,private http: HttpClient, private carritoService: CarritoService, private route: ActivatedRoute, private comentarioService: ComentarioService, private scroller: ViewportScroller) { }

  ngOnInit(): void {
    // Captura el parámetro 'nombre' de la URL

    this.route.params.subscribe(params => {
      this.categoriaNombre = params['nombreCategoria'];
      this.cargarProductosPorCategoria(this.categoriaNombre);
    });
  }

  irACategorias() {
    this.router.navigate(['/']).then(() => {
      // Esperamos un poco para asegurar que se cargue el home antes de hacer scroll
      setTimeout(() => {
        this.scroller.scrollToAnchor('categorias');
      }, 500);
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
                precio_anterior: vari.precio_anterior,
                cantidad_stock: vari.cantidad_stock,
                imagenes: vari.imagenes,
                calificacion_promedio: producto.calificacion_promedio,
                total_resenas: producto.total_resenas,
                stars: producto.stars,
                varianteId: vari.id
              });

              // Obtener comentarios y promedio para producto con variante
              this.comentarioService
                .obtenerComentarios(producto.id, vari.id)
                .subscribe((comentarios) => {
                  const clave = `${producto.id}_${vari.id}`;
                  this.comentariosPorProducto[clave] = comentarios.length;

                  const promedio =
                    comentarios.length > 0
                      ? comentarios.reduce((sum, c) => sum + c.calificacion, 0) / comentarios.length
                      : 0;
                  this.promedioCalificacionesPorProducto[clave] = promedio;
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
              precio_anterior: producto.precio_anterior,
              cantidad_stock: producto.cantidad_stock,
              imagenes: producto.imagenes,
              calificacion_promedio: producto.calificacion_promedio,
              total_resenas: producto.total_resenas,
              stars: producto.stars,
              varianteId: ''
            });
            // Obtener comentarios y promedio para producto sin variante
            this.comentarioService.obtenerComentarios(producto.id, null).subscribe((comentarios) => {
              const clave = `${producto.id}_null`;
              this.comentariosPorProducto[clave] = comentarios.length;

              const promedio =
                comentarios.length > 0
                  ? comentarios.reduce((sum, c) => sum + c.calificacion, 0) / comentarios.length
                  : 0;
              this.promedioCalificacionesPorProducto[clave] = promedio;
            });
          }
        });

        this.coloresDisponibles = Array.from(new Set(this.variantesComoTarjetas.map(p => p.color).filter(Boolean)));
        this.tamanosDisponibles = Array.from(new Set(this.variantesComoTarjetas.map(p => p.tamano).filter(Boolean)));

        this.filtros.colores = {};
        this.filtros.tamanos = {};

        this.coloresDisponibles.forEach(color => this.filtros.colores[color] = false);
        this.tamanosDisponibles.forEach(tam => this.filtros.tamanos[tam] = false);

        this.variantesComoTarjetasOriginales = [...this.variantesComoTarjetas]; // Backup




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
        this.loading = false;
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

  precioMaximo: number = 1000; // No 370 ni 10000
  coloresDisponibles: string[] = [];
  tamanosDisponibles: string[] = [];

  filtros = {
    colores: {} as { [key: string]: boolean },
    tamanos: {} as { [key: string]: boolean }
  };

  variantesComoTarjetasOriginales: any[] = [];

  aplicarFiltros(): void {
    this.variantesComoTarjetas = this.variantesComoTarjetasOriginales.filter(producto => {
      const cumplePrecio = producto.precio_venta <= this.precioMaximo;

      const coloresActivos = Object.keys(this.filtros.colores).filter(c => this.filtros.colores[c]);
      const tamanosActivos = Object.keys(this.filtros.tamanos).filter(t => this.filtros.tamanos[t]);

      const cumpleColor = coloresActivos.length === 0 || coloresActivos.includes(producto.color);
      const cumpleTamano = tamanosActivos.length === 0 || tamanosActivos.includes(producto.tamano);

      return cumplePrecio && cumpleColor && cumpleTamano;
    });
  }

  resetearFiltros(): void {
    this.precioMaximo = 100;
    Object.keys(this.filtros.colores).forEach(c => this.filtros.colores[c] = false);
    Object.keys(this.filtros.tamanos).forEach(t => this.filtros.tamanos[t] = false);
    this.variantesComoTarjetas = [...this.variantesComoTarjetasOriginales];
  }

}