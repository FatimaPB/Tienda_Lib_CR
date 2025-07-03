import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { MessageService, ConfirmationService } from 'primeng/api';

import { PreguntaFrecuente } from '../../models/pregunta.model';
import { PreguntaFrecuenteService } from '../../services/preguntas.service';


@Component({
  selector: 'app-preguntas',
  standalone: true,
  providers: [MessageService, ConfirmationService],
  imports: [  CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    RippleModule,
    DialogModule,
    ConfirmDialogModule],
  templateUrl: './preguntas.component.html',
  styleUrl: './preguntas.component.css'
})
export class PreguntasComponent {
  preguntas: PreguntaFrecuente[] = [];
  pregunta: PreguntaFrecuente = { pregunta: '', respuesta: '' };
  visible: boolean = false;
  position: string = 'top';

  constructor(
    private preguntaService: PreguntaFrecuenteService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.cargarPreguntas();
  }

  cargarPreguntas() {
    this.preguntaService.cargarPreguntas().subscribe((data) => {
      this.preguntas = data;
    });
  }

guardarPregunta() {
  if (!this.pregunta.pregunta.trim() || !this.pregunta.respuesta.trim()) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Campos incompletos',
      detail: 'Por favor, completa todos los campos antes de guardar.'
    });
    return;
  }

  if (this.pregunta.id) {
    this.preguntaService.actualizarPregunta(this.pregunta.id, this.pregunta).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Pregunta actualizada correctamente' });
      this.resetFormulario();
      this.cargarPreguntas();
      this.visible = false;
    });
  } else {
    this.preguntaService.crearPregunta(this.pregunta).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Agregada', detail: 'Pregunta agregada correctamente' });
      this.resetFormulario();
      this.cargarPreguntas();
      this.visible = false;
    });
  }
}


  editar(p: PreguntaFrecuente) {
    this.pregunta = { ...p };
  }

  cancelarEdicion(): void {
    this.visible = false;
    this.resetFormulario();
  }

  confirmarEliminacion(id?: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar esta pregunta?',
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

    this.preguntaService.eliminarPregunta(id).subscribe(() => {
      this.messageService.add({ severity: 'error', summary: 'Eliminada', detail: 'Pregunta eliminada correctamente' });
      this.cargarPreguntas();
    });
  }

  showDialog(position: string) {
    this.position = position;
    this.visible = true;
  }

  resetFormulario() {
    this.pregunta = { pregunta: '', respuesta: '' };
  }
}