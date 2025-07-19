import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';

import { NoticiaEvento } from '../../models/noticia-evento.model';
import { NoticiaEventoService } from '../../services/noticia-evento.service';


@Component({
  selector: 'app-gestionnoticias',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FileUploadModule, ToastModule,
    DialogModule, ConfirmDialogModule, TableModule, DropdownModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './gestionnoticias.component.html',
  styleUrl: './gestionnoticias.component.css'
})
export class GestionnoticiasComponent implements OnInit {
  noticias: NoticiaEvento[] = [];
  noticiaForm!: FormGroup;
  selectedNoticia: NoticiaEvento | null = null;
  selectedFile: File | null = null;
  isEditing = false;
  visible = false;

  @ViewChild('fileUploader') fileUploader: any;
  uploadedFiles: any[] = [];

  tipos = [
    { label: 'Noticia', value: 'noticia' },
    { label: 'Evento', value: 'evento' }
  ];

  constructor(
    private fb: FormBuilder,
    private noticiaService: NoticiaEventoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadNoticias();
    this.initForm();
  }

  initForm(): void {
    this.noticiaForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
      tipo: ['noticia', Validators.required],
      fecha_evento: ['']
    });
  }

  loadNoticias(): void {
    this.noticiaService.getNoticias().subscribe(data => {
      this.noticias = data;
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las noticias' });
    });
  }

  onFileChange(event: any): void {
    const file = event.files?.[0];
    if (file) this.selectedFile = file;
  }

submitNoticia(): void {
  if (this.noticiaForm.invalid) {
    this.noticiaForm.markAllAsTouched();
    this.messageService.add({ severity: 'warn', summary: 'Faltan campos', detail: 'Por favor completa todos los campos obligatorios.' });
    return;
  }

  if (!this.selectedFile && !this.isEditing) {
    this.messageService.add({ severity: 'warn', summary: 'Imagen requerida', detail: 'Debes seleccionar una imagen.' });
    return;
  }

  const formData = new FormData();
  const formValue = this.noticiaForm.value;

  formData.append('titulo', formValue.titulo);
  formData.append('descripcion', formValue.descripcion);
  formData.append('tipo', formValue.tipo);
  formData.append('fecha_evento', formValue.fecha_evento || '');

  if (this.selectedFile) {
    formData.append('imagen', this.selectedFile, this.selectedFile.name);
  }

  if (this.isEditing && this.selectedNoticia) {
    this.noticiaService.updateNoticia(this.selectedNoticia.id, formData).subscribe(() => {
      this.loadNoticias();
      this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Registro actualizado' });
      this.resetForm();
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el registro' });
    });
  } else {
    this.noticiaService.createNoticia(formData).subscribe(() => {
      this.loadNoticias();
      this.messageService.add({ severity: 'success', summary: 'Agregado', detail: 'Registro agregado' });
      this.resetForm();
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo agregar el registro' });
    });
  }
}

  editNoticia(noticia: NoticiaEvento): void {
    this.isEditing = true;
    this.selectedNoticia = noticia;
    this.noticiaForm.patchValue({
      titulo: noticia.titulo,
      descripcion: noticia.descripcion,
      tipo: noticia.tipo,
      fecha_evento: noticia.fecha_evento ? noticia.fecha_evento.substring(0, 16) : ''
    });
    this.visible = true;
  }

  confirmDelete(noticia: NoticiaEvento): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este registro?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.noticiaService.deleteNoticia(noticia.id).subscribe(() => {
          this.loadNoticias();
          this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Registro eliminado' });
        }, () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' });
        });
      }
    });
  }

  resetForm(): void {
    this.noticiaForm.reset();
    this.selectedFile = null;
    this.selectedNoticia = null;
    this.isEditing = false;
    this.visible = false;
    this.uploadedFiles = [];

    if (this.fileUploader) {
      this.fileUploader.clear();
    }
  }
}