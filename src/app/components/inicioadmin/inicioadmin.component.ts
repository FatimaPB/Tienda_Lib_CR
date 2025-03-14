import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';



export interface Categoria {
  id?: number;
  nombre_categoria: string;
}
export interface Producto {
  nombre: string;
  descripcion: string;
  sku: string;
  costo: number;
  porcentaje_ganancia: number;
  precio_calculado: number;
  calificacion_promedio: number;
  total_resenas: number;
  cantidad_stock: number;
  categoria_id: number;
}


@Component({
  selector: 'app-inicioadmin',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule,RouterLink],
  templateUrl: './inicioadmin.component.html',
  styleUrl: './inicioadmin.component.css'
})
export class InicioadminComponent implements OnInit{



  categorias: Categoria[] = [];
  categoria: Categoria = { id: undefined, nombre_categoria: '' }; // Ahora tiene `id`

  apiUrl = 'https://back-tienda-one.vercel.app/api/categorias'; // URL del backend

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.loadCategorias();
  }

  // Obtener todas las categorías
  cargarCategorias() {
    this.http.get<Categoria[]>(this.apiUrl).subscribe((data) => {
      this.categorias = data;
    });
  }

  // Agregar o editar categoría
  guardarCategoria() {
    if (this.categoria.id) { // Ahora accedemos correctamente a `id`
      // Editar categoría existente
      this.http.put(`${this.apiUrl}/${this.categoria.id}`, this.categoria).subscribe(() => {
        this.cargarCategorias();
        this.categoria = { id: undefined, nombre_categoria: '' }; // Resetear formulario
      });
    } else {
      // Agregar nueva categoría
      this.http.post(this.apiUrl, this.categoria).subscribe(() => {
        this.cargarCategorias();
        this.categoria = { id: undefined, nombre_categoria: '' };
      });
    }
  }

  // Cargar datos para editar
  editar(categoria: Categoria) {
    this.categoria = { ...categoria }; // Copiar valores correctamente
  }

  // Eliminar categoría
  eliminar(id?: number) {
    if (id === undefined) return; // Evitar errores si `id` es undefined
  
    if (confirm('¿Seguro que deseas eliminar esta categoría?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.cargarCategorias();
      });
    }
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token'); // O donde tengas almacenado el token
  }
  
  // Producto con sus campos; el campo precio_calculado se calculará automáticamente.
  producto: Producto = {
    nombre: '',
    descripcion: '',
    sku: '',
    costo: 0,
    porcentaje_ganancia: 0,
    precio_calculado: 0,
    calificacion_promedio: 0,
    total_resenas: 0,
    cantidad_stock: 0,
    categoria_id: 0,
  };


  // Archivos de imagen seleccionados
  selectedFiles: File[] = [];

  // URL del endpoint para crear el producto (backend)
  apiUrlProducto: string = 'https://back-tienda-one.vercel.app/api/productos';
  // URL del endpoint para cargar las categorías
  apiUrlCategorias: string = 'https://back-tienda-one.vercel.app/api/categorias';

  // Simulación: ID del usuario actualmente autenticado (debe obtenerse desde el contexto real)
  currentUserId: number = 1;


  // Cargar las categorías existentes desde el backend
  loadCategorias(): void {
    this.http.get<Categoria[]>(this.apiUrlCategorias).subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

  // Manejar la selección de archivos
  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  // Calcular el precio calculado según el costo y el porcentaje de ganancia
  calcularPrecio(): number {
    return this.producto.costo + (this.producto.costo * (this.producto.porcentaje_ganancia / 100));
  }

  // Función para enviar el producto (con imágenes) al backend
  guardarProducto(): void {
    // Calcular el precio y asignarlo
    this.producto.precio_calculado = this.calcularPrecio();
    // Asignar el ID del usuario actual (el usuario que crea el producto)


    // Crear un objeto FormData para enviar la información y los archivos
    const formData = new FormData();
    // Agregar los campos del producto
    formData.append('nombre', this.producto.nombre);
    formData.append('descripcion', this.producto.descripcion);
    formData.append('sku', this.producto.sku);
    formData.append('costo', this.producto.costo.toString());
    formData.append('porcentaje_ganancia', this.producto.porcentaje_ganancia.toString());
    formData.append('precio_calculado', this.producto.precio_calculado.toString());
    formData.append('calificacion_promedio', this.producto.calificacion_promedio.toString());
    formData.append('total_resenas', this.producto.total_resenas.toString());
    formData.append('cantidad_stock', this.producto.cantidad_stock.toString());
    formData.append('categoria_id', this.producto.categoria_id.toString());

    // Agregar cada imagen seleccionada
    this.selectedFiles.forEach(file => {
      formData.append('images', file, file.name);
    });

      // Obtener el token
  const token = this.getAuthToken();
  if (!token) {
    console.error('No se encontró el token de autenticación');
    return;
  }

  // Enviar la petición POST al endpoint con el token en los encabezados
  this.http.post(this.apiUrlProducto, formData, {
    headers: {
      Authorization: `Bearer ${token}` // Incluye el token en los encabezados
    }
  }).subscribe({
    next: (response) => {
      console.log('Producto creado:', response);
      this.resetForm();
    },
    error: (err) => {
      console.error('Error creando producto:', err);
    }
  });
  }

  // Reiniciar el formulario
  resetForm(): void {
    this.producto = {
      nombre: '',
      descripcion: '',
      sku: '',
      costo: 0,
      porcentaje_ganancia: 0,
      precio_calculado: 0,
      calificacion_promedio: 0,
      total_resenas: 0,
      cantidad_stock: 0,
      categoria_id: 0,
    };
    this.selectedFiles = [];
  }
}