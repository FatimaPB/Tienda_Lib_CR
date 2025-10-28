import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Insignia } from '../../models/insignia.model';
import { InsigniaService } from '../../services/insignias.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-insignias',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FileUploadModule, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './insignias.component.html',
  styleUrl: './insignias.component.css'
})
export class InsigniasComponent implements OnInit {
  insignias: Insignia[] = [];
  visible: boolean = false;
  editando: boolean = false;
  seleccionada: Insignia | null = null;
  formData: any = {
    nombre: '',
    descripcion: '',
    tipo: '',
    regla: ''
  };
  archivo: File | null = null;

  constructor(private insigniaService: InsigniaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.cargarInsignias();
  }

  cargarInsignias(): void {
    this.insigniaService.obtenerTodas().subscribe(data => {
      this.insignias = data;
    });
  }

  position: string = 'top';
  showDialog(position: string) {
    this.position = position;
    this.visible = true;
  }

  editar(ins: Insignia) {
    this.editando = true;
    this.visible = true;
    this.seleccionada = ins;
    this.formData = { ...ins };
    this.archivo = null;
  }

  onFileSelect(event: any) {
    this.archivo = event.files[0];
  }

  guardar() {
    const fd = new FormData();
    fd.append('nombre', this.formData.nombre);
    fd.append('descripcion', this.formData.descripcion);
    fd.append('tipo', this.formData.tipo);
    fd.append('regla', this.formData.regla);
    if (this.archivo) {
      fd.append('icono', this.archivo);
    }

    if (this.editando && this.seleccionada) {
      this.insigniaService.actualizar(this.seleccionada.id, fd).subscribe(() => {
        this.cargarInsignias();
        this.visible = false;
      });
    } else {
      this.insigniaService.crear(fd).subscribe(() => {
        this.cargarInsignias();
        this.visible = false;
      });
    }
  }

  confirmarEliminacion(id: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar esta categoría?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.eliminar(id);
      }
    });
  }

  eliminar(id: number) {
    if (!id) return;

    this.insigniaService.eliminar(id).subscribe(() => {
      this.messageService.add({ severity: 'error', summary: 'Eliminado', detail: 'Insignia eliminada' });
      this.cargarInsignias();
    });
  }

    cancelarEdicion(): void {
    this.visible = false; // Ocultar el diálogo
    this.editando = false;
    this.seleccionada = null;
    this.formData = {
      nombre: '',
      descripcion: '',
      tipo: '',
      regla: ''
    };
    this.archivo = null;
  }
}
