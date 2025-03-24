import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // <-- Asegúrate de importar FormsModule
import { CommonModule } from '@angular/common';
import { NewlineToHtmlPipe } from '../../components/pipes/newline-to-html.pipe'; 

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';


import { DocumentoService } from '../../services/documento.service';
import { Documento } from '../../models/documento.model';


@Component({
  selector: 'app-politicas',
  standalone: true,
  imports: [FormsModule,CommonModule, NewlineToHtmlPipe, TableModule, ButtonModule, InputTextModule, ToastModule, ConfirmDialogModule,
     RippleModule, DialogModule],
     providers: [MessageService, ConfirmationService],
  templateUrl: './politicas.component.html',
  styleUrl: './politicas.component.css'
})
export class PoliticasComponent {
 // Definimos la ruta de la API y el tipo del documento por separado:
 ruta = 'politicas';       // Esto se usa para construir la URL (ej.: /api/politicas/historial)
 docType = 'politica';      // Este es el valor que se enviará en el payload

 documentos: Documento[] = [];
 documentoVigente: Documento | null = null;
 documento: Documento = {
   id: null,
   titulo: '',
   contenido: '',
   fecha_vigencia: '',
   vigente: false,
   version: '',
   eliminado: false,
   tipo: this.docType
 };

 isEditing = false;
 editingId: number | null = null;
 mostrarHistorial = false;
 mostrarFormulario = false;
 mensajeExito = '';

 constructor(private documentoService: DocumentoService, private messageService: MessageService, private confirmationService: ConfirmationService) {}

 ngOnInit() {
   this.obtenerDocumentos();
   this.obtenerDocumentoVigente();
 }

 obtenerDocumentos() {
   this.documentoService.obtenerDocumentos(this.ruta).subscribe(data => {
     this.documentos = data;
   });
 }

 obtenerDocumentoVigente() {
   this.documentoService.obtenerDocumentoVigente(this.ruta).subscribe({
     next: data => {
       this.documentoVigente = data;
     },
     error: err => console.error('Error al obtener documento vigente:', err)
   });
 }

 toggleHistorial() {
   this.mostrarHistorial = !this.mostrarHistorial;
 }

 crearDocumento() {
   if (!this.documento.fecha_vigencia || new Date(this.documento.fecha_vigencia) < new Date()) {
     this.messageService.add({severity:'warn', summary:'', detail:'La fecha de vigencia debe ser válida y en el futuro.'});
     return;
   }
   // Aseguramos que el tipo del documento es correcto
   this.documento.tipo = this.docType;

   this.documentoService.crearDocumento(this.ruta, this.documento).subscribe({
     next: () => {
       this.messageService.add({severity:'success', summary:'Éxito', detail:'Documento creado exitosamente.'});
       this.onCancelar()
       this.refrescarVista();
     },
     error: err => {
       console.error('Error al crear documento:', err);
       this.messageService.add({severity:'error', summary:'Error', detail:'Hubo un error al crear el documento.'});
     }
   });
 }

 editarDocumento(documento: Documento) {
   this.documento = { ...documento };
   this.isEditing = true;
   this.editingId = documento.id !== undefined ? documento.id : null;
   this.mostrarFormulario = true;
 }

 actualizarDocumento() {
   if (this.editingId !== null) {
     this.documento.tipo = this.docType;
     this.documentoService.actualizarDocumento(this.ruta, this.editingId, this.documento).subscribe(() => {
      this.messageService.add({severity:'success', summary:'Éxito', detail:'Documento actualizado exitosamente.'});
      this.onCancelar()
      this.refrescarVista();
     });
   }
 }

 eliminarDocumento(id: number) {
   if (id !== null) {
     this.confirmationService.confirm({
       message: '¿Estás seguro de que deseas eliminar este documento?',
       header: 'Confirmación de eliminación',
       icon: 'pi pi-exclamation-triangle',
       accept: () => {
         this.documentoService.eliminarDocumento(this.ruta, id).subscribe({
           next: () => {
             this.messageService.add({severity:'success', summary:'Éxito', detail:'Documento eliminado.'});
             this.refrescarVista();
           },
           error: err => {
             console.error('Error al eliminar documento:', err);
             this.messageService.add({severity:'error', summary:'Error', detail:'Hubo un error al eliminar el documento.'});
           }
         });
       }
     });
   }
 }

 onCancelar() {
   this.mostrarFormulario = false;
   this.isEditing = false;
   this.documento = {
     id: null,
     titulo: '',
     contenido: '',
     fecha_vigencia: '',
     vigente: false,
     version: '',
     eliminado: false,
     tipo: this.docType
   };
 }

 refrescarVista() {
   this.obtenerDocumentos();
   this.obtenerDocumentoVigente();
 }
}