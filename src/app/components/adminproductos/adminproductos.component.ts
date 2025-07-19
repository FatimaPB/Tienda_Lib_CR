import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA , ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CarouselModule } from 'primeng/carousel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';



import { Producto } from '../../models/producto.model';
import { Categoria } from '../../models/categoria.model';
import { Color } from '../../models/color.model';
import { Tamano } from '../../models/tamano.model';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { ColorService } from '../../services/color.service';
import { TamanoService } from '../../services/tamano.service';


interface Variante {
  color_id: number | null;
  tamano_id: number | null;
  cantidad_stock: number;
  precio_compra: number;
  precio_venta: number;
}


@Component({
  selector: 'app-adminproductos',
  standalone: true,
  imports: [FormsModule,
     TableModule,InputTextModule,InputTextareaModule,
     DropdownModule, PaginatorModule,FileUploadModule,DialogModule,ConfirmDialogModule,ToastModule,CarouselModule, CheckboxModule, TagModule],
  providers: [MessageService, ConfirmationService,InputTextareaModule, RadioButtonModule],
  templateUrl: './adminproductos.component.html',
  styleUrl: './adminproductos.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminproductosComponent implements OnInit {

  @ViewChild('tablaProductos') tablaProductos: any;

  filtroGlobal: string = '';
 
  
  limpiarFiltros() {
    this.filtroGlobal = '';
    this.tablaProductos.reset();
  }
  
  mostrarFormulario: boolean = false;
  productos: Producto[] = [];
// En la clase del componente
producto: any = {
  nombre: '',
  descripcion: '',
  sku: '',
  categoria_id: null,
  color_id: null,
  tamano_id: null,
  tieneVariantes: false,
  variantes: []
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
  this.producto = { ...producto };
  this.mostrarFormulario = true;

  // Cargar variantes del producto si tiene
  if (producto.tieneVariantes) {
    this.productoService.getVariantesPorProducto(producto.id).subscribe({
      next: (data) => {
        this.producto.variantes = data.map(v => ({ ...v, selectedFiles: [] }));
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar variantes' });
      }
    });
  }
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

  onVariantFileChange(event: any, varianteIndex: number): void {
    // Si aún no existe el array para los archivos de esta variante, lo inicializamos.
    if (!this.producto.variantes[varianteIndex].selectedFiles) {
      this.producto.variantes[varianteIndex].selectedFiles = [];
    }
    
    // Agrega los archivos seleccionados al array de la variante.
    if (event.files && event.files.length > 0) {
      this.producto.variantes[varianteIndex].selectedFiles = [
        ...this.producto.variantes[varianteIndex].selectedFiles,
        ...event.files
      ];
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

  // Agregar este método
  validarVariantes(): boolean {
    return this.producto.variantes.every((v: Variante) => 
      v.color_id !== null && 
      v.tamano_id !== null 
    );
  }

  guardarProducto(): void {
    if (!this.validarFormulario()) return;
  
    const formData = new FormData();
  
    // Datos base
    formData.append('nombre', this.producto.nombre);
    formData.append('descripcion', this.producto.descripcion);
    formData.append('sku', this.producto.sku);
    formData.append('categoria_id', this.producto.categoria_id.toString());
    
    if (this.producto.color_id !== null) {
      formData.append('color_id', this.producto.color_id.toString());
    }
    
    if (this.producto.tamano_id !== null) {
      formData.append('tamano_id', this.producto.tamano_id.toString());
    }

    formData.append('tiene_variantes', this.producto.tieneVariantes ? '1' : '0');
  
    // Valores por defecto
    formData.append('calificacion_promedio', '0');
    formData.append('total_resenas', '0');
  
    if (this.producto.tieneVariantes) {
      formData.append('variantes', JSON.stringify(this.producto.variantes.map((v: any) => {
        const { selectedFiles, ...datosVariante } = v;
         if (v.id) datosVariante.id = v.id
        return datosVariante;
      })));
    }
  
    // No se agregan precio_compra, precio_venta ni cantidad_stock
  
    // Imágenes
    this.selectedFiles.forEach(file => {
      formData.append('images', file, file.name);
    });

   this.producto.variantes.forEach((variante: any, index: number) => {
  if (variante.selectedFiles && variante.selectedFiles.length > 0) {
    variante.selectedFiles.forEach((file: File) => {
      formData.append(`imagenes_variantes_${index}`, file, file.name); // ✅
    });
  }
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
        this.activeIndex = 0;
        this.progreso = 0;
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
  



  
  // Nueva función de validación general
validarFormulario(): boolean {
  // Validar campos básicos
  if (!this.producto.nombre || !this.producto.descripcion || !this.producto.sku) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Complete los campos básicos del producto'
    });
    return false;
  }

  // Validar categoría
  if (!this.producto.categoria_id) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Seleccione una categoría'
    });
    return false;
  }

  return true;
}


 resetForm(): void {
  this.producto = {
    id: null, // ✅ añade esto
    nombre: '',
    descripcion: '',
    sku: '',
    categoria_id: null,
    color_id: null,
    tamano_id: null,
    tieneVariantes: false,
    variantes: []
  };
    if (this.fileUploader) {
      this.fileUploader.clear();
    }
    this.selectedFiles = [];
  }
  

  siguientePaso() {
    if (this.activeIndex < 2) {
      this.activeIndex++;
      this.progreso = (this.activeIndex / 2) * 100;
    }
  }
  
  anteriorPaso() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      this.progreso = (this.activeIndex / 2) * 100;
    }
  }
  

  agregarVariante(): void {
    // Agrega una variante vacía
    this.producto.variantes.push({
      color_id: 0,
      tamano_id: 0,
    });
  }
  
  eliminarVariante(index: number): void {
    this.producto.variantes.splice(index, 1);
  }

  cambiarEstadoVariantes(valor: boolean) {
    if (!valor) {
      this.producto.variantes = []; // Limpiar variantes si no tiene
    } else {
      this.producto.cantidad_stock = 0;
      this.producto.precio_compra = null;
      this.producto.precio_venta = null;
    }
  }
  
  checked: boolean = false;











nuevoPrecio: number = 0;
productoSeleccionado: any = null;
mostrarDialogoDescuento: boolean = false;
esVariante: boolean = false;

abrirDialogoDescuento(producto: any, variante: any = null): void {
  this.productoSeleccionado = variante || producto;
  this.nuevoPrecio = this.productoSeleccionado.precio_venta;
  this.esVariante = !!variante;
  this.mostrarDialogoDescuento = true;
}

aplicarDescuento(): void {
  if (isNaN(this.nuevoPrecio) || this.nuevoPrecio <= 0) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El precio debe ser mayor a cero' });
    return;
  }

  const id = this.productoSeleccionado.id;

  const obs = this.esVariante
    ? this.productoService.updatePrecioVariante(id, this.nuevoPrecio)
    : this.productoService.updatePrecioProducto(id, this.nuevoPrecio);

  obs.subscribe({
    next: () => {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Precio actualizado correctamente' });
      this.mostrarDialogoDescuento = false;
      this.loadProductos(); // Recarga los productos actualizados
    },
    error: () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el precio' });
    }
  });
}


  
}