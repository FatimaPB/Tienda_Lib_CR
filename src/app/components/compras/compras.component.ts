import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';


@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [FormsModule, TableModule, CommonModule, ButtonModule, InputTextModule, ToastModule, ConfirmDialogModule, DialogModule, DropdownModule],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class ComprasComponent implements OnInit {

  compras: any[] = [];  // Aquí almacenamos las compras
  compra: any = {};  // Objeto de compra para agregar o editar
  detalle: any = { varianteId: null, productoId: null, cantidad: 0, precioCompra: 0 , margenGanancia: 0 };  // Detalle de compra
  proveedores: any[] = [];  // Proveedores cargados desde el backend
  variantes: any[] = [];  // Variantes cargadas desde el backend
  productos: any[] = [];
  visible: boolean = false;  // Para mostrar u ocultar el diálogo



  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.cargarCompras();
    this.cargarProveedores();
    this.cargarVariantes();
    this.cargarproductos();
  }
  

  cargarCompras() {
    this.http.get<any[]>('https://api-libreria.vercel.app/api/compras')
      .subscribe(
        (data) => {
          this.compras = data;
        },
        (error) => {
          console.error('Error al cargar compras:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las compras' });
        }
      );
  }

  cargarProveedores() {
    this.http.get<any[]>('https://api-libreria.vercel.app/api/proveedor')
      .subscribe(
        (data) => {
          this.proveedores = data;
        },
        (error) => {
          console.error('Error al cargar proveedores:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los proveedores' });
        }
      );
  }

  cargarVariantes() {
    this.http.get<any[]>('https://api-libreria.vercel.app/api/variantes')
      .subscribe(
        (data) => {
          this.variantes = data;
        },
        (error) => {
          console.error('Error al cargar variantes:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las variantes' });
        }
      );
  }
  cargarproductos() {
    this.http.get<any[]>('https://api-libreria.vercel.app/api/productos-simples')
      .subscribe(
        (data) => {
          this.productos = data;
        },
        (error) => {
          console.error('Error al cargar productos:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las productos' });
        }
      );
  }

  showDialog(position: string) {
    this.visible = true;
  }

guardarCompra() {
  const { proveedorId } = this.compra;
  const { varianteId, productoId, cantidad, precioCompra, margenGanancia } = this.detalle;

  // Validaciones
  if (!proveedorId || (!varianteId && !productoId)) {
    this.messageService.add({ 
      severity: 'warn', 
      summary: 'Campos incompletos', 
      detail: 'Debes seleccionar un producto o una variante.' 
    });
    return;
  }

    if (varianteId && productoId) {
    this.messageService.add({ 
      severity: 'warn', 
      summary: 'Selección inválida', 
      detail: 'No puedes seleccionar producto y variante al mismo tiempo.' 
    });
    return;
  }

    if (!cantidad || !precioCompra) {
    this.messageService.add({ 
      severity: 'warn', 
      summary: 'Campos incompletos', 
      detail: 'Cantidad y precio de compra son obligatorios.' 
    });
    return;
  }
    
    if (!margenGanancia) {
    this.messageService.add({ 
      severity: 'warn', 
      summary: 'Campo obligatorio', 
      detail: 'Margen de ganancia es obligatorio.' 
    });
    return;
  }

  const detallesCompra = [{
  varianteId: this.detalle.varianteId || null,
  productoId: this.detalle.productoId || null,
  cantidad: this.detalle.cantidad,
  precioCompra: this.detalle.precioCompra,
  margenGanancia: (this.detalle.margenGanancia || 0) / 100  // convierte 80 → 0.8

  }];

  const compraPayload = {
    proveedorId,
    detallesCompra
  };

  this.http.post('https://api-libreria.vercel.app/api/compras', compraPayload).subscribe(
    (response) => {
      this.messageService.add({ severity: 'success', summary: 'Compra agregada', detail: 'La compra ha sido registrada correctamente.' });
      this.cargarCompras();
      this.compra = {};
      this.detalle = { varianteId: null, productoId: null, cantidad: 0, precioCompra: 0 , margenGanancia: 0 };
      this.visible = false;
    },
    (error) => {
      console.error('Error al registrar compra:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al agregar la compra.' });
    }
  );
}

  

  editar(compra: any) {
    this.compra = { ...compra };  // Copiar los datos de la compra a editar
    this.showDialog('top');
  }

  confirmarEliminacion(compraId: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar esta compra?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.delete(`https://api-libreria.vercel.app/api/compras/${compraId}`).subscribe(
          () => {
            this.messageService.add({ severity: 'success', summary: 'Compra eliminada', detail: 'La compra ha sido eliminada.' });
            this.cargarCompras();  // Recargar compras después de la eliminación
          },
          (error) => {
            console.error('Error al eliminar la compra:', error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Hubo un error al eliminar la compra.' });
          }
        );
      }
    });
  }

  cancelarEdicion() {
    this.visible = false;
this.detalle.varianteId  = null
this.detalle.productoId = null
 this.detalle.cantidad = 0,
   this.detalle.precioCompra = 0
this.detalle.margenGanancia = 0
  }
}