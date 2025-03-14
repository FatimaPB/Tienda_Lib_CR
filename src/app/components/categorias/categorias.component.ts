import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { Categoria } from '../../models/categoria.model'; // Importar el modelo
import { CategoriaService } from '../../services/categoria.service'; // Importar el servicio
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';



@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    RippleModule,
    DialogModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  categoria: Categoria = {nombre_categoria: '' };
  mostrarFormulario: boolean = false;

  constructor(
    private categoriaService: CategoriaService,  // Inyectamos el servicio
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  // Obtener categorías desde la API
  cargarCategorias() {
    this.categoriaService.cargarCategorias().subscribe((data) => {
      this.categorias = data;
    });
  }

  // Guardar (crear o actualizar)
  guardarCategoria() {
    if (this.categoria.id) {
      this.categoriaService
        .actualizarCategoria(this.categoria.id, this.categoria)
        .subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Categoría actualizada correctamente' });
          this.resetFormulario();
          this.cargarCategorias();
          this.visible = false;
        });
    } else {
      this.categoriaService.crearCategoria(this.categoria).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Agregado', detail: 'Categoría agregada correctamente' });
        this.resetFormulario();
        this.cargarCategorias();
        this.visible = false;
      });
    }
  }

  // Cargar datos para edición
  editar(categoria: Categoria) {
    this.categoria = { ...categoria };
    this.mostrarFormulario = true; // Mostrar formulario para edición
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

  // Eliminar categoría
  eliminar(id?: number) {
    if (!id) return;

      this.categoriaService.eliminarCategoria(id).subscribe(() => {
        this.messageService.add({ severity: 'error', summary: 'Eliminado', detail: 'Categoría eliminada' });
        this.cargarCategorias();
      });
    
  }

  // Mostrar mensaje
  mostrarMensaje(severidad: string, mensaje: string) {
    this.messageService.add({ severity: severidad, summary: mensaje });
  }

  // Reset formulario
  resetFormulario() {
    this.categoria = { nombre_categoria: '' };
    this.mostrarFormulario = false; // Ocultar formulario después de agregar o editar
  }

  cancelarEdicion(): void {
    this.visible = false; // Ocultar el diálogo
    this.categoria = { id: undefined, nombre_categoria: '' }; // Limpiar los datos de la categoría
  }

  mostrarFormularioAgregar() {
    this.categoria = { id: undefined, nombre_categoria: '' };
    this.mostrarFormulario = true; // Mostrar formulario para agregar nueva categoría
  }

  visible: boolean = false;
  position: string = 'top';

  showDialog(position: string) {
    this.position = position;
    this.visible = true;
  }
  

}