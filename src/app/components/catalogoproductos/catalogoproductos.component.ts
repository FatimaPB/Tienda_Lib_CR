import { Component, OnInit  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { CarouselModule } from 'primeng/carousel';


export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_calculado: number;
  imagenes: string[];
}



@Component({
  selector: 'app-catalogoproductos',
  standalone: true,
  imports: [CommonModule,ToastModule,ConfirmDialogModule, TableModule, CarouselModule],
  templateUrl: './catalogoproductos.component.html',
  styleUrl: './catalogoproductos.component.css',
  providers: [MessageService, ConfirmationService]
})
export class CatalogoproductosComponent implements OnInit {

  productos: Producto[] = [];

  constructor(private http: HttpClient,  private messageService: MessageService,    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.loadProductos();
  }

  loadProductos() {
    this.http.get<any>('https://tienda-lib-cr.vercel.app/api/catalogo')
      .subscribe(
        data => this.productos = data.productos,
        error => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los productos' })
      );
  }

  confirmarEliminarProducto(productoId: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este producto del catalogo?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.eliminarProductoDelCatalogo(productoId);
      }
    });
  }

  eliminarProductoDelCatalogo(productoId: number) {
    this.http.delete(`https://tienda-lib-cr.vercel.app/api/catalogo/${productoId}`)
      .subscribe(
        () => {
          this.productos = this.productos.filter(producto => producto.id !== productoId);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado del catalogo exitosamente' });
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el producto' });
        }
      );
  }
}