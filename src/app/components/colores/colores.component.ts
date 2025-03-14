import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { Color } from '../../models/color.model'; // Importar el modelo
import { ColorService } from '../../services/color.service'; // Importar el servicio
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-colores',
  standalone: true,
  imports: [ CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    RippleModule,
    DialogModule,
    ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
  templateUrl: './colores.component.html',
  styleUrl: './colores.component.css'
})
export class ColoresComponent implements OnInit {

  colores: Color[] = [];
  color: Color = {nombre_color: '' };
  mostrarFormulario: boolean = false;

  constructor(
    private colorService: ColorService,  // Inyectamos el servicio
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.cargarColores();
  }

  // Obtener colores desde la API
  cargarColores() {
    this.colorService.cargarColores().subscribe((data) => {
      this.colores = data;
    });
  }

  // Guardar (crear o actualizar)
  guardarColor() {
    if (this.color.id) {
      this.colorService
        .actualizarColor(this.color.id, this.color)
        .subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'color actualizado correctamente' });
          this.resetFormulario();
          this.cargarColores();
          this.visible = false;
        });
    } else {
      this.colorService.crearColor(this.color).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Agregado', detail: 'color agregado correctamente' });
        this.resetFormulario();
        this.cargarColores();
        this.visible = false;
      });
    }
  }

  // Cargar datos para edición
  editar(color: Color) {
    this.color = { ...color };
    this.mostrarFormulario = true; // Mostrar formulario para edición
  }

  confirmarEliminacion(id: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar este color?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.eliminar(id);
      }
    });
  }

  // Eliminar color
  eliminar(id?: number) {
    if (!id) return;

      this.colorService.eliminarColor(id).subscribe(() => {
        this.messageService.add({ severity: 'error', summary: 'Eliminado', detail: 'color eliminada' });
        this.cargarColores();
      });
    
  }

  // Mostrar mensaje
  mostrarMensaje(severidad: string, mensaje: string) {
    this.messageService.add({ severity: severidad, summary: mensaje });
  }

  // Reset formulario
  resetFormulario() {
    this.color = { nombre_color: '' };
    this.mostrarFormulario = false; // Ocultar formulario después de agregar o editar
  }

  cancelarEdicion(): void {
    this.visible = false; // Ocultar el diálogo
    this.color = { id: undefined, nombre_color: '' }; // Limpiar los datos de la categoría
  }

  mostrarFormularioAgregar() {
    this.color = { id: undefined, nombre_color: '' };
    this.mostrarFormulario = true; // Mostrar formulario para agregar nueva categoría
  }

  visible: boolean = false;
  position: string = 'top';

  showDialog(position: string) {
    this.position = position;
    this.visible = true;
  }
  

}
 

