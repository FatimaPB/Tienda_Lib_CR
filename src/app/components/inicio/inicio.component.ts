import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { CarouselModule } from 'primeng/carousel';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RecomendacionService } from '../../services/recomendacion.service';
import { ProductoService } from '../../services/producto.service';



import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSidenav } from '@angular/material/sidenav';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CategoriaService } from '../../services/categoria.service';

import { PreguntaFrecuenteService } from '../../services/preguntas.service';
import { PreguntaFrecuente } from '../../models/pregunta.model';
import { AccordionModule } from 'primeng/accordion';


interface Banner {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  creado_en: string;
}

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
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, CarouselModule, RouterLink,CardModule,ButtonModule,DialogModule, 
    FormsModule, TooltipModule,MatSlideToggleModule, MatIconModule, MatButtonModule,MatToolbarModule,
     MatMenuModule,MatSidenavModule, MatCardModule,MatGridListModule,MatFormFieldModule,MatInputModule,AccordionModule
     ,MatProgressBarModule,MatTooltipModule
    ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements AfterViewInit {
   categorias: any[] = [];
   usuarioLogueado: boolean = false;

  banners: Banner[] = [];
  apiUrl: string = 'https://api-libreria.vercel.app/api/banners';
  productosUrl = 'https://api-libreria.vercel.app/api/productos';
  currentIndex: number = 0;
  productos: Producto[] = [];
  variantesComoTarjetas: any[] = [];
  preguntas: PreguntaFrecuente[] = [];


  dialogoVisible: boolean = false;
  articuloSeleccionado: any = null;
  constructor(private http: HttpClient,
     private cdr: ChangeDetectorRef,
      private carritoService: CarritoService,
      private preguntaService: PreguntaFrecuenteService,
    private categoriaService: CategoriaService,
   private recomendacionService: RecomendacionService,
  private productoService: ProductoService) { }


  // Referencia a la instancia del sidenav
  @ViewChildren('sidenav') sidenav!: MatSidenav;

  // Método para abrir/cerrar el sidenav
  toggleSidebar() {
    this.sidenav.toggle();
  }

  onLogout() {
    // Lógica para cerrar sesión
  }
  ngOnInit(): void {
    
    this.loadBanners();
    this.loadProductos();
    this.cargarCategorias();
    this.cargarPreguntas();
    this.verificarUsuario()
    this.cargarRecomendacionesDesdeHistorial([]); 


     
  }

cargarCategorias() {
    this.categoriaService.cargarCategorias().subscribe({
      next: (res: any) => {
        this.categorias = res;
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
      }
    });
  }
  cargarPreguntas() {
    this.preguntaService.cargarPreguntas().subscribe(data => {
      this.preguntas = data.filter(p => p.activo); // Solo preguntas activas
    });
  }
loadProductos(): void {
    this.http.get<Producto[]>(`${this.productosUrl}/categoria/nombre/Biblias`).subscribe({
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
              varianteId: ''
            });
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  loadBanners(): void {
    this.http.get<Banner[]>(this.apiUrl).subscribe((data: Banner[]) => {
      this.banners = data;
    }, error => {
      console.error('Error al cargar los banners', error);
    });
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.banners.length;
    this.cdr.detectChanges();
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.banners.length) % this.banners.length;
    this.cdr.detectChanges();
  }


  isVideo(url: string): boolean {
  return url?.match(/\.(mp4|webm|ogg)$/i) !== null;
}

  

  @ViewChildren('serviceItem') serviceItems!: QueryList<ElementRef>;
  //@ViewChildren('categoria') categorias!: QueryList<ElementRef>;
@ViewChildren('producto') productosElementos!: QueryList<ElementRef>;



ngAfterViewInit() {
  const options = {
    root: null, // Observar el viewport
    threshold: 0.1 // El 10% del elemento debe ser visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, options);

  // Observa los elementos de servicio
  this.serviceItems.toArray().forEach(item => {
    observer.observe(item.nativeElement);
  });

  // Observa los elementos de categoría
//  this.categorias.toArray().forEach(item => {
  //  observer.observe(item.nativeElement);
  //});

  // Observa los elementos de producto
  this.productosElementos.toArray().forEach(item => {
    observer.observe(item.nativeElement);
  });
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


usuarioId: number | null = null;
recomendacionesDetalles: any[] = [];

verificarUsuario(): void {
  this.http.get<any>('https://api-libreria.vercel.app/api/check-auth', { withCredentials: true }).subscribe({
    next: res => {
      if (res.authenticated) {
        this.usuarioId = res.usuario.id;
        console.log('Usuario autenticado para recomendaciones:', this.usuarioId);
        this.obtenerHistorial();
      }
    },
    error: err => {
      console.error('Error al verificar autenticación:', err);
    }
  });
}

obtenerHistorial(): void {
  this.http.get<any>(`https://api-libreria.vercel.app/api/ventas/productos-comprados/${this.usuarioId}`, { withCredentials: true }).subscribe({
    next: res => {
      console.log('Historial de ventas:', res);
      
      const nombresComprados: string[] = res.productosComprados || [];

      this.cargarRecomendacionesDesdeHistorial(nombresComprados);
      console.log('Nombres comprados para recomendar:', nombresComprados);
    },
    error: err => {
      console.error('Error al obtener historial:', err);
    }
  });
}

cargarRecomendacionesDesdeHistorial(nombresProductos: string[]) {
  if (nombresProductos.length === 0) {
    this.recomendacionesDetalles = [];
    return;
  }

  this.recomendacionService.obtenerRecomendaciones(nombresProductos).subscribe({
    next: nombresRecomendados => {
      console.log('Nombres recomendados (desde historial):', nombresRecomendados);

      if (nombresRecomendados.length === 0) {
        this.recomendacionesDetalles = [];
        return;
      }

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

}