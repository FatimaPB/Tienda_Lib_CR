import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { ComentarioService } from '../../services/comentario.service';
import { Comentario } from '../../models/comentario.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { RouterLink } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';



// interfaz Variante ya está definida
interface Variante {
  id: number;
  color_id: number;
  nombre_color: string;
  codigo_color: string;
  tamano_id: number;
  nombre_tamano: string;
  cantidad_stock: number;
  precio_compra: number;
  precio_venta: number;
  precio_anterior: number;
  imagenes: string[];
}

// Agrega variantes a Producto
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
  variantes: Variante[]; // <<=== Aquí
}



@Component({
  selector: 'app-detalleproducto',
  standalone: true,
  imports: [CurrencyPipe, CommonModule, MatCardModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, NgxImageZoomModule, RouterLink, FormsModule, ReactiveFormsModule, BreadcrumbModule],
  templateUrl: './detalleproducto.component.html',
  styleUrl: './detalleproducto.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Añade esto aquí
})
export class DetalleproductoComponent implements OnInit {
  items: MenuItem[] = [];
  productoId: number = 0;
  varianteId: number = 0;
  comentarios: Comentario[] = [];
  comentarioForm!: FormGroup;
  usuarioLogueado = false;
  puedeComentar = false;
  usuarioId: number | null = null;


  zoomEnabled: boolean = false;
  producto: Producto | null = null;
  variante: Variante | null = null; // Agrega esta propiedad


  imagenPrincipal: string = '';


  // Variables para la selección de variantes
  selectedColor: string = '';
  selectedSize: string = '';
  selectedVariant: Variante | null = null;

  // Listas de opciones disponibles
  coloresDisponibles: { nombre_color: string; codigo_color: string }[] = [];
  availableSizesForColor: string[] = [];
  productosRelacionados: Producto[] = [];


  // Valores de la variante seleccionada
  imagenSeleccionada: string = '';
  precioSeleccionado: number = 0;
  cantidadStockSeleccionado: number = 0;

  apiUrlProductos = 'https://api-libreria.vercel.app/api/productos'; // URL del backend

  constructor(private route: ActivatedRoute, private http: HttpClient, private carritoService: CarritoService,
    private comentarioService: ComentarioService,
    private fb: FormBuilder) { }

  ngOnInit(): void {

    this.comentarioForm = this.fb.group({
      comentario: ['', [Validators.required, Validators.maxLength(500)]],
      calificacion: [0, [Validators.required, Validators.min(1)]]
    });

    this.verificarUsuario();

    this.route.paramMap.subscribe(params => {
      const productoId = params.get('id');
      const varianteId = params.get('varianteId');

      if (productoId) {
        this.cargarDetalleProducto(+productoId, varianteId ? +varianteId : null);
      }
    });
  }

  cargarComentarios() {
    if (!this.producto) {
      console.warn('No se puede cargar comentarios: producto no definido');
      return;
    }

    this.comentarioService.obtenerComentarios(this.producto.id, this.variante ? this.variante.id : null).subscribe({
      next: (data) => {
        this.comentarios = data;
      },
      error: (err) => {
        console.error('Error al cargar comentarios:', err);
      }
    });
  }

  seleccionarImagen(imagen: string) {
    this.imagenPrincipal = imagen;
  }



  verificarPermisoParaComentar() {
    if (!this.producto || !this.usuarioLogueado) {
      this.puedeComentar = false;
      return;
    }

    this.comentarioService.puedeComentar(this.producto.id, this.variante?.id || null)
      .subscribe(permisos => {
        this.puedeComentar = permisos.permitido;
      }, err => {
        console.error('Error al verificar permiso para comentar:', err);
        this.puedeComentar = false;
      });
  }


  // Modifica verificarUsuario para actualizar usuarioLogueado y llamar a verificarPermisoParaComentar cuando ya tengas producto cargado
  verificarUsuario(): void {
    this.http.get<any>('https://api-libreria.vercel.app/api/check-auth', { withCredentials: true }).subscribe(
      res => {
        if (res.authenticated) {
          this.usuarioId = res.usuario.id;
          this.usuarioLogueado = true;

          // Si ya tienes producto cargado, verifica permiso para comentar
          if (this.producto) {
            this.verificarPermisoParaComentar();
          }
        } else {
          this.usuarioLogueado = false;
          this.usuarioId = null;
          this.puedeComentar = false;
        }
      },
      err => {
        console.error('Error al verificar autenticación:', err);
        this.usuarioLogueado = false;
        this.usuarioId = null;
        this.puedeComentar = false;
      }
    );
  }


  enviarComentario() {
    if (this.comentarioForm.invalid || this.usuarioId === null || !this.producto) return;

    const nuevoComentario: Comentario = {
      usuario_id: this.usuarioId,
      producto_id: this.producto.id,
      variante_id: this.variante?.id || null,
      comentario: this.comentarioForm.value.comentario,
      calificacion: this.comentarioForm.value.calificacion
    };

    this.comentarioService.crear(nuevoComentario).subscribe(() => {
      this.cargarComentarios();
      this.comentarioForm.reset({ calificacion: 5 });
    });
  }

  cargarProductosRelacionados(productoId: number): void {
    this.http.get<Producto[]>(`https://api-libreria.vercel.app/api/relacionados/${productoId}`).subscribe({
      next: (relacionados) => {
        this.productosRelacionados = relacionados;
      },
      error: (err) => {
        console.error('Error al cargar productos relacionados:', err);
      }
    });
  }



  onSelectColor(color: string): void {
    this.selectedColor = color;

    if (this.producto) {
      // Actualizar tamaños disponibles según el color seleccionado
      this.availableSizesForColor = [...new Set(
        this.producto.variantes
          .filter(v => v.nombre_color === color)
          .map(v => v.nombre_tamano)
      )];

      // Buscar la primera variante con ese color
      const defaultVariant = this.producto.variantes.find(v => v.nombre_color === color);

      if (defaultVariant) {
        // Asignar automáticamente la variante completa
        this.selectedVariant = defaultVariant;
        this.selectedSize = defaultVariant.nombre_tamano;
        this.variante = defaultVariant;

        // ✅ ACTUALIZAR imagen principal
        this.imagenPrincipal = defaultVariant.imagenes[0] || '';

        // ✅ Actualizar datos mostrados de la variante
        this.imagenSeleccionada = defaultVariant.imagenes[0] || '';
        this.precioSeleccionado = defaultVariant.precio_venta;
        this.cantidadStockSeleccionado = defaultVariant.cantidad_stock;
      } else {
        // Si no hay variante con ese color
        this.selectedVariant = null;
        this.selectedSize = '';
        this.variante = null;
        this.imagenPrincipal = '';
        this.imagenSeleccionada = '';
        this.precioSeleccionado = 0;
        this.cantidadStockSeleccionado = 0;
      }
    }
  }


  onSelectSize(size: string): void {
    this.selectedSize = size;
    this.seleccionarVariante();
  }



  seleccionarVariante(): void {
    if (this.producto && this.selectedColor && this.selectedSize) {
      const varianteEncontrada = this.producto.variantes.find(
        v => v.nombre_color === this.selectedColor && v.nombre_tamano === this.selectedSize
      );

      if (varianteEncontrada) {
        this.selectedVariant = varianteEncontrada;
        this.variante = varianteEncontrada;

        // ✅ Actualizar datos al seleccionar tamaño también
        this.imagenSeleccionada = varianteEncontrada.imagenes[0] || '';
        this.precioSeleccionado = varianteEncontrada.precio_venta;
        this.cantidadStockSeleccionado = varianteEncontrada.cantidad_stock;
      }
    }
  }




  cargarDetalleProducto(id: number, varianteId: number | null): void {
    this.http.get<Producto>(`${this.apiUrlProductos}/${id}`, { withCredentials: true }).subscribe({
      next: (data) => {
        this.producto = data;

        // Si se especificó una variante, buscarla entre las variantes del producto
        if (varianteId) {
          this.variante = this.producto.variantes.find(v => v.id === varianteId) || null;
          // Si hay variante seleccionada, precargar color y tamaño
          if (this.variante) {
            this.selectedColor = this.variante.nombre_color;
            this.selectedSize = this.variante.nombre_tamano;
            this.onSelectColor(this.selectedColor); // Esto ya actualiza tamaños y selectedVariant
            this.onSelectSize(this.selectedSize);

          }

        } else {
          this.variante = null; // Si no hay variante, mostrar el producto completo
        }
        this.imagenPrincipal = this.variante?.imagenes[0] ?? this.producto.imagenes[0] ?? '';
        // Ahora que tienes el producto, carga comentarios
        this.cargarComentarios();

        // Si usuario está logueado, verifica permiso para comentar
        if (this.usuarioLogueado) {
          this.verificarPermisoParaComentar();
        }

        // Cargar los colores disponibles (si se necesita para otros propósitos)
        // Después
        const mapa = new Map<string, string>();
        data.variantes.forEach(v => {
          if (!mapa.has(v.nombre_color)) {
            mapa.set(v.nombre_color, v.codigo_color || '#ccc');
          }
        });
        this.coloresDisponibles = Array.from(mapa, ([nombre_color, codigo_color]) => ({ nombre_color, codigo_color }));
        this.cargarProductosRelacionados(this.producto.id);
      },
      error: (err) => {
        console.error('Error al cargar el producto:', err);
      }
    });
  }


  // Agregar producto al carrito usando el servicio
  agregarAlCarrito(producto_id: number, variante_id: number | null = null): void {
    this.carritoService.agregarAlCarrito(producto_id, variante_id, 1).subscribe({
      next: () => {
        alert('Producto agregado al carrito');
      },
      error: (err) => {
        if (err.status === 401) {
          alert('Debes iniciar sesión para agregar productos al carrito.');
        } else {
          console.error('Error al agregar al carrito:', err);
        }
      }
    });
  }



  zoom(event: MouseEvent): void {
    this.zoomEnabled = true;
    const lens = document.querySelector('.zoom-lens') as HTMLElement;
    const image = document.querySelector('.product-detail-image') as HTMLImageElement;
    const zoomContainer = document.querySelector('.zoom-container') as HTMLElement;
    const rect = zoomContainer.getBoundingClientRect();

    if (lens && image) {
      // Calcular posición del cursor relativo al contenedor de la imagen
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Tamaño del lente
      const lensWidth = lens.offsetWidth;
      const lensHeight = lens.offsetHeight;

      // Posicionar el lente exactamente donde está el cursor
      lens.style.left = `${x - (lensWidth / 2)}px`;
      lens.style.top = `${y - (lensHeight / 2)}px`;

      // Factor de ampliación
      const zoomFactor = 2.5;

      // Calcular la posición de fondo para dar efecto de zoom
      const bgX = x * zoomFactor;
      const bgY = y * zoomFactor;

      // Establecer la imagen de fondo ampliada
      lens.style.backgroundImage = `url(${image.src})`;
      lens.style.backgroundSize = `${image.width * zoomFactor}px ${image.height * zoomFactor}px`;
      lens.style.backgroundPosition = `-${bgX - (lensWidth / 2)}px -${bgY - (lensHeight / 2)}px`;

      // Activar el zoom
      zoomContainer.classList.add('zoom-active');
    }
  }

  resetZoom(): void {
    this.zoomEnabled = false;
    const zoomContainer = document.querySelector('.zoom-container') as HTMLElement;
    if (zoomContainer) {
      zoomContainer.classList.remove('zoom-active');
    }
  }

  comprar(): void {
    if (!this.producto) return;

    const varianteId = this.variante?.id ?? null;
    this.agregarAlCarrito(this.producto.id, varianteId);
  }

}
