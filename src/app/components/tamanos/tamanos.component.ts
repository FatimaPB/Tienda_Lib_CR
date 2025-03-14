import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { Tamano } from '../../models/tamano.model'; // Importar el modelo
import { TamanoService } from '../../services/tamano.service'; // Importar el servicio
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-tamanos',
  standalone: true,
  imports: [ FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    RippleModule,
    DialogModule,
    ConfirmDialogModule],
    providers: [MessageService, ConfirmationService],
  templateUrl: './tamanos.component.html',
  styleUrl: './tamanos.component.css'
})
export class TamanosComponent implements OnInit{
tamanos: Tamano[] = [];
  tamano: Tamano = {nombre_tamano: '' };
  mostrarFormulario: boolean = false;

  constructor(
    private tamanoService: TamanoService,  // Inyectamos el servicio
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.cargarTamanos();
  }

  // Obtener colores desde la API
  cargarTamanos() {
    this.tamanoService.cargarTamanos().subscribe((data) => {
      this.tamanos = data;
    });
  }

  // Guardar (crear o actualizar)
  guardarTamano() {
    if (this.tamano.id) {
      this.tamanoService
        .actualizarTamano(this.tamano.id, this.tamano)
        .subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'tamaño actualizado correctamente' });
          this.resetFormulario();
          this.cargarTamanos();
          this.visible = false;
        });
    } else {
      this.tamanoService.crearTamano(this.tamano).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Agregado', detail: 'color agregado correctamente' });
        this.resetFormulario();
        this.cargarTamanos();
        this.visible = false;
      });
    }
  }

  // Cargar datos para edición
  editar(tamano: Tamano) {
    this.tamano = { ...tamano };
    this.mostrarFormulario = true; // Mostrar formulario para edición
  }

  confirmarEliminacion(id: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar este tamaño?',
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

      this.tamanoService.eliminarTamano(id).subscribe(() => {
        this.messageService.add({ severity: 'error', summary: 'Eliminado', detail: 'color eliminada' });
        this.cargarTamanos();
      });
    
  }

  // Mostrar mensaje
  mostrarMensaje(severidad: string, mensaje: string) {
    this.messageService.add({ severity: severidad, summary: mensaje });
  }

  // Reset formulario
  resetFormulario() {
    this.tamano = { nombre_tamano: '' };
    this.mostrarFormulario = false; // Ocultar formulario después de agregar o editar
  }

  cancelarEdicion(): void {
    this.visible = false; // Ocultar el diálogo
    this.tamano = { id: undefined, nombre_tamano: '' }; // Limpiar los datos de la categoría
  }

  mostrarFormularioAgregar() {
    this.tamano = { id: undefined, nombre_tamano: '' };
    this.mostrarFormulario = true; // Mostrar formulario para agregar nueva categoría
  }

  visible: boolean = false;
  position: string = 'top';

  showDialog(position: string) {
    this.position = position;
    this.visible = true;
  }
  

}
 


