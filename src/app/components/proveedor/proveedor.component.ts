import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [   CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule],
  templateUrl: './proveedor.component.html',
  styleUrl: './proveedor.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ProveedorComponent implements OnInit{
  proveedores: any[] = [];
  proveedor: any = {};
  mostrarFormulario: boolean = false;
  esEditar: boolean = false;
  filtroGlobal: string = '';

  constructor(private http: HttpClient, private confirm: ConfirmationService, private toast: MessageService) {}

  ngOnInit() {
    this.obtenerProveedores();
  }

  obtenerProveedores() {
    this.http.get<any[]>('https://api-libreria.vercel.app/api/proveedor').subscribe(data => {
      this.proveedores = data;
    });
  }

  guardarProveedor() {
    if (this.esEditar) {
      this.http.put(`https://api-libreria.vercel.app/api/editar/${this.proveedor.id}`, this.proveedor).subscribe(() => {
        this.toast.add({ severity: 'success', summary: 'Editado', detail: 'Proveedor actualizado' });
        this.obtenerProveedores();
        this.mostrarFormulario = false;
      });
    } else {
      this.http.post('https://api-libreria.vercel.app/api/proveedor', this.proveedor).subscribe(() => {
        this.toast.add({ severity: 'success', summary: 'Agregado', detail: 'Proveedor creado' });
        this.obtenerProveedores();
        this.mostrarFormulario = false;
      });
    }
  }

  nuevoProveedor() {
    this.proveedor = {};
    this.esEditar = false;
    this.mostrarFormulario = true;
  }

  editarProveedor(p: any) {
    this.proveedor = { ...p };
    this.esEditar = true;
    this.mostrarFormulario = true;
  }

  eliminarProveedor(id: number) {
    console.log('Eliminando proveedor con ID:', id); // DEBUG
    this.confirm.confirm({
      message: '¿Eliminar este proveedor?',
      accept: () => {
        this.http.delete(`https://api-libreria.vercel.app/api/eliminar/${id}`).subscribe(() => {
          this.toast.add({ severity: 'warn', summary: 'Eliminado', detail: 'Proveedor eliminado' });
          this.obtenerProveedores();
        });
      }
    });
  }
  
}
