import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { FileUpload } from 'primeng/fileupload';

export interface Banner {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  creado_en: string;
}

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FileUploadModule, ToastModule, DialogModule, ConfirmDialogModule, TableModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  banners: Banner[] = [];
  bannerForm!: FormGroup;
  selectedBanner: Banner | null = null;
  selectedFile: File | null = null;
  isEditing: boolean = false;
  apiUrl: string = 'https://api-libreria.vercel.app/api/banners';
  visible = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadBanners();
    this.initForm();
  }

  loadBanners(): void {
    this.http.get<Banner[]>(this.apiUrl).subscribe((data: Banner[]) => {
      this.banners = data;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los banners' });
    });
  }

  initForm(): void {
    this.bannerForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: [''],
    });
  }

  submitBanner(): void {
    const formData = new FormData();
    formData.append('titulo', this.bannerForm.get('titulo')?.value);
    formData.append('descripcion', this.bannerForm.get('descripcion')?.value);

    if (this.selectedFile) {
      formData.append('archivo', this.selectedFile, this.selectedFile.name);
    } else {
      this.messageService.add({ severity: 'warn', summary: '', detail: 'Debes seleccionar una imagen.' });
      return;
    }

    if (this.isEditing && this.selectedBanner) {
      this.http.put(`${this.apiUrl}/${this.selectedBanner.id}`, formData).subscribe(response => {
        this.loadBanners();
        this.resetForm();
        this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Banner actualizado correctamente' });
        this.visible = false;
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el banner' });
        this.visible = false;
        
      });
    } else {
      this.http.post(this.apiUrl, formData).subscribe(response => {
        this.loadBanners();
        this.resetForm();
        this.messageService.add({ severity: 'success', summary: 'Agregado', detail: 'Banner agregado correctamente' });
        this.visible = false;

      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el banner' });
      });
    }
  }

  editBanner(banner: Banner): void {
    this.isEditing = true;
    this.selectedBanner = banner;
    this.bannerForm.patchValue({
      titulo: banner.titulo,
      descripcion: banner.descripcion,
      
    });
  }

  confirmDelete(banner: Banner): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este banner?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.http.delete(`${this.apiUrl}/${banner.id}`).subscribe(() => {
          this.loadBanners();
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Banner eliminado con éxito' });
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el banner' });
        });
      }
    });
  }
  @ViewChild('fileUploader') fileUploader: any;
  resetForm(): void {
    this.bannerForm.reset();
    this.isEditing = false;
    this.selectedBanner = null;
    this.visible = false;
    this.selectedFile = null;
    this.uploadedFiles = []; 
  
    if (this.fileUploader) {
      this.fileUploader.clear(); // Limpia la selección de archivos en p-fileUpload
    }
  }


  uploadedFiles: any[] = [];

  onFileChange(event: any): void {
  const file = event.files && event.files[0];
  if (file) {
    this.selectedFile = file;
  }
}

// Agregar función para manejar la subida de archivos (incluyendo videos si es necesario)
onUpload(event: any): void {
  for (let file of event.files) {
    this.uploadedFiles.push(file);
  }
}


}
