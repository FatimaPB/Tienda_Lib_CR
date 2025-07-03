
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { MessageService, ConfirmationService } from 'primeng/api';

import { Oracion } from '../../models/oracion.model';
import { OracionService } from '../../services/oracion.service';

@Component({
  selector: 'app-oraciones',
  standalone: true,
  providers: [MessageService, ConfirmationService],
  imports: [ CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    RippleModule,
    DialogModule,
    ConfirmDialogModule],
  templateUrl: './oraciones.component.html',
  styleUrl: './oraciones.component.css'
})
export class OracionesComponent implements OnInit {

oraciones: Oracion[] = [];
  oracion: Oracion = { titulo: '', contenido: '' };
  visible: boolean = false;
  position: string = 'top';

  constructor(
    private oracionService: OracionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.cargarOraciones();
  }

  cargarOraciones() {
    this.oracionService.cargarOraciones().subscribe((data) => {
      this.oraciones = data;
    });
  }

  guardarOracion() {
    if (!this.oracion.titulo.trim() || !this.oracion.contenido.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos incompletos',
        detail: 'Por favor, completa todos los campos antes de guardar.'
      });
      return;
    }

    if (this.oracion.id) {
      this.oracionService.actualizarOracion(this.oracion.id, this.oracion).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Oración actualizada correctamente' });
        this.resetFormulario();
        this.cargarOraciones();
        this.visible = false;
      });
    } else {
      this.oracionService.crearOracion(this.oracion).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Agregada', detail: 'Oración agregada correctamente' });
        this.resetFormulario();
        this.cargarOraciones();
        this.visible = false;
      });
    }
  }

  editar(oracion: Oracion) {
    this.oracion = { ...oracion };
    this.visible = true;
  }

  cancelarEdicion(): void {
    this.visible = false;
    this.resetFormulario();
  }

  confirmarEliminacion(id?: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar esta oración?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.eliminar(id);
      }
    });
  }

  eliminar(id?: number) {
    if (!id) return;

    this.oracionService.eliminarOracion(id).subscribe(() => {
      this.messageService.add({ severity: 'error', summary: 'Eliminada', detail: 'Oración eliminada correctamente' });
      this.cargarOraciones();
    });
  }

  showDialog(position: string) {
    this.position = position;
    this.visible = true;
  }

  resetFormulario() {
    this.oracion = { titulo: '', contenido: '' };
  }
}