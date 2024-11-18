import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // <-- Asegúrate de importar FormsModule
import { CommonModule } from '@angular/common';
import { NewlineToHtmlPipe } from '../../app/pipes/newline-to-html.pipe';


@Component({
  selector: 'app-deslinde',
  standalone: true,
  imports: [FormsModule,CommonModule, NewlineToHtmlPipe],
  templateUrl: './deslinde.component.html',
  styleUrl: './deslinde.component.css'
})
export class DeslindeComponent {

  documentos: any[] = [];
  documento: any = {
    titulo: '',
    contenido: '',
    fechaVigencia: ''
  };
  isEditing: boolean = false;
  editingId: string | null = null;
  documentoVigente: any = null;
  mostrarHistorial: boolean = false; // Nueva propiedad para controlar el historial

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerDocumentos();
    this.obtenerDocumentoVigente();
  }

  obtenerDocumentos() {
    this.http.get('https://back-tienda-livid.vercel.app/api/deslinde/historial').subscribe((data: any) => {
      this.documentos = data;
    });
  }

  obtenerDocumentoVigente() {
    this.http.get('https://back-tienda-livid.vercel.app/api/deslinde/vigente').subscribe({
      next: (data: any) => {
        this.documentoVigente = data;
      },
      error: (err) => {
        console.error('Error al obtener el documento vigente:', err);
      }
    });
  }

  toggleHistorial() {
    this.mostrarHistorial = !this.mostrarHistorial; // Alternar el estado de visibilidad
  }

  crearDocumento() {
    if (!this.documento.fechaVigencia || new Date(this.documento.fechaVigencia) < new Date()) {
      alert('La fecha de vigencia debe ser válida y en el futuro.');
      return;
    }

    this.http.post('https://back-tienda-livid.vercel.app/api/deslinde', this.documento).subscribe({
      next: () => {
        this.obtenerDocumentos();
        this.limpiarFormulario();
        this.obtenerDocumentoVigente();
      },
      error: (err) => {
        console.error('Error al crear documento:', err);
      }
    });
  }

  editarDocumento(documento: any) {
    this.documento = { ...documento };
    this.isEditing = true;
    this.editingId = documento._id || null;
  }

  actualizarDocumento() {
    if (this.editingId) {
      this.http.post(`https://back-tienda-livid.vercel.app/api/deslinde/${this.editingId}/version`, this.documento).subscribe(() => {
        this.obtenerDocumentos();
        this.limpiarFormulario();
        this.obtenerDocumentoVigente();
      });
    }
  }

  eliminarDocumento(id: string) {
    this.http.delete(`https://back-tienda-livid.vercel.app/api/deslinde/${id}`).subscribe(() => {
      this.obtenerDocumentos();
      this.obtenerDocumentoVigente();
    });
  }

  limpiarFormulario() {
    this.documento = {
      titulo: '',
      contenido: '',
      fechaVigencia: ''
    };
    this.isEditing = false;
    this.editingId = null;
  }
}
