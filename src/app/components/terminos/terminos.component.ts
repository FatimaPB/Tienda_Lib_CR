import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // <-- Asegúrate de importar FormsModule
import { CommonModule } from '@angular/common';
import { NewlineToHtmlPipe } from '../pipes/newline-to-html.pipe';

@Component({
  selector: 'app-terminos',
  standalone: true,
  imports: [FormsModule,CommonModule, NewlineToHtmlPipe],
  templateUrl: './terminos.component.html',
  styleUrl: './terminos.component.css'
})
export class TerminosComponent {
  documentos: any[] = [];
  documento: any = {
    titulo: '',
    contenido: '',
    fechaVigencia: '',
    version:'',
    eliminado:''
  };
  isEditing: boolean = false;
  editingId: string | null = null;
  documentoVigente: any = null;
  mostrarHistorial: boolean = false; // Nueva propiedad para controlar el historial
  mostrarFormulario: boolean = false;
  mensajeExito: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerDocumentos();
    this.obtenerDocumentoVigente();
  }
  verContenidoCompleto(contenido: string): void {
    alert(`Contenido completo:\n\n${contenido}`);
  }
  obtenerDocumentos() {
    this.http.get('https://back-tienda-livid.vercel.app/api/terminos/historial').subscribe((data: any) => {
      this.documentos = data;
    });
  }

  obtenerDocumentoVigente() {
    this.http.get('https://back-tienda-livid.vercel.app/api/terminos/vigente').subscribe({
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

    this.http.post('https://back-tienda-livid.vercel.app/api/terminos', this.documento).subscribe({
      next: () => {
        this.obtenerDocumentos();
        this.limpiarFormulario();
        this.obtenerDocumentoVigente();

        this.mensajeExito = 'Documento creado exitosamente.';

        setTimeout(() => {
          this.mensajeExito = '';
          this.mostrarFormulario = false; 
        }, 2000);
    
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
    this.mostrarFormulario = true;
  }

  actualizarDocumento() {
    if (this.editingId) {
      this.http.post(`https://back-tienda-livid.vercel.app/api/terminos/${this.editingId}/version`, this.documento).subscribe(() => {
        this.obtenerDocumentos();
        this.limpiarFormulario();
        this.obtenerDocumentoVigente();

        this.mensajeExito = 'Documento actualizado exitosamente.';

        setTimeout(() => {
          this.mensajeExito = '';
          this.mostrarFormulario = false; 
        }, 2000);
      });
    }
  }

  eliminarDocumento(id: string) {
    this.http.delete(`https://back-tienda-livid.vercel.app/api/terminos/${id}`).subscribe(() => {
      this.obtenerDocumentos();
      this.obtenerDocumentoVigente();


    });
  }
  onCancelar() {
    if (this.mostrarFormulario) {
      this.limpiarFormulario(); // Limpia los datos del formulario
    }
    this.mostrarFormulario = !this.mostrarFormulario; // Cambia el estado de visibilidad
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

