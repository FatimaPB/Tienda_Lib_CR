import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA , ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { StepperModule } from 'primeng/stepper';
import { GalleriaModule } from 'primeng/galleria';
import { StepsModule } from 'primeng/steps';
import { CarouselModule } from 'primeng/carousel';



import { Producto } from '../../models/producto.model';
import { Categoria } from '../../models/categoria.model';
import { Color } from '../../models/color.model';
import { Tamano } from '../../models/tamano.model';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { ColorService } from '../../services/color.service';
import { TamanoService } from '../../services/tamano.service';



@Component({
  selector: 'app-adminproductos',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule,
     TableModule, ButtonModule,CardModule,InputTextModule,InputTextareaModule,
     DropdownModule, PaginatorModule,FileUploadModule,DialogModule,ConfirmDialogModule,ToastModule, GalleriaModule,CarouselModule],
     providers: [MessageService, ConfirmationService, StepperModule,InputTextareaModule,StepsModule],
  templateUrl: './adminproductos.component.html',
  styleUrl: './adminproductos.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminproductosComponent implements OnInit {

 
  mostrarFormulario: boolean = false;
  productos: Producto[] = [];
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
    color_id: 0,
    tamano_id: 0,
  };
  colores: Color[] = [];
  categorias: Categoria[] = [];
  tamanos: Tamano[] = [];

  selectedFiles: File[] = [];
  uploadedFiles: any[] = [];

  activeIndex: number = 0;
  progreso: number = 0;

  @ViewChild('fileUploader') fileUploader: any;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private colorService: ColorService,
    private tamanoService: TamanoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loadProductos();
    this.loadCategorias();
    this.loadColores();
    this.loadTamanos();
  }

  loadProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los productos' })
      
    });
  }

  loadCategorias(): void {
    this.categoriaService.cargarCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  loadColores(): void {
    this.colorService.cargarColores().subscribe({
      next: (data) => this.colores = data,
      error: (err) => console.error('Error al cargar colores:', err)
    });
  }

  loadTamanos(): void {
    this.tamanoService.cargarTamanos().subscribe({
      next: (data) => this.tamanos = data,
      error: (err) => console.error('Error al cargar tamaños:', err)
    });
  }

  editarProducto(producto: Producto): void {
    this.producto = { ...producto }; // Copia el producto para editar
    this.mostrarFormulario = true;
  }

  confirmarEliminarProducto(id: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este producto?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.eliminarProducto(id);
      }
    });
  }

  eliminarProducto(id: number): void {
    this.productoService.deleteProducto(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Producto eliminado correctamente' });
        this.loadProductos();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el producto' });
      }
    });
  }

  agregarAlCatalogo(productoId: number): void {
    this.productoService.addToCatalog(productoId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Agregado', detail: 'Producto agregado al catálogo exitosamente!' });
        this.loadProductos();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al agregar el producto al catálogo' });
      }
    });
  }

  onFileChange(event: any): void {
    if (event.files && event.files.length > 0) {
      this.selectedFiles = [...this.selectedFiles, ...event.files];
    }
  }

  onUpload(event: any): void {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  calcularPrecio(): number {
    return this.producto.costo + (this.producto.costo * (this.producto.porcentaje_ganancia / 100));
  }

  guardarProducto(): void {
    this.producto.precio_calculado = this.calcularPrecio();
    const formData = new FormData();
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
    formData.append('color_id', this.producto.color_id.toString());
    formData.append('tamano_id', this.producto.tamano_id.toString());
    this.selectedFiles.forEach(file => {
      formData.append('images', file, file.name);
    });

    this.productoService.saveProducto(formData, this.producto.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.producto.id ? 'Actualizado' : 'Agregado',
          detail: this.producto.id ? 'Producto actualizado correctamente' : 'Producto agregado correctamente'
        });
        this.loadProductos();
        this.resetForm();
        this.mostrarFormulario = false;
        this.activeIndex--;
        this.progreso = (this.activeIndex / 2) * 100;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.producto.id ? 'Error al actualizar el Producto' : 'Error al crear el Producto'
        });
      }
    });
  }

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
      color_id: 0,
      tamano_id: 0,
    };
    if (this.fileUploader) {
      this.fileUploader.clear();
    }
    this.selectedFiles = [];
  }

  siguientePaso() {
    this.activeIndex++;
    this.progreso = (this.activeIndex / 2) * 100;
  }

  anteriorPaso() {
    this.activeIndex--;
    this.progreso = (this.activeIndex / 2) * 100;
  }
}