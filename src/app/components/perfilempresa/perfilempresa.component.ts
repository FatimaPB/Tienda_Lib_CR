import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Empresa {
  nombre: string;
  slogan?: string;
  logo_url?: string; // Asegúrate de que este campo sea correcto en el modelo
  facebook?: string;
  instagram?: string;
  direccion?: string;
  correo_electronico: string;
  telefono?: string;
}

@Component({
  selector: 'app-perfilempresa',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './perfilempresa.component.html',
  styleUrls: ['./perfilempresa.component.css']
})
export class PerfilempresaComponent implements OnInit {
  empresaForm: FormGroup;
  logoFile: File | null = null;
  empresaData!: Empresa | null; // Cambia a un objeto que puede ser nulo
  mostrarFormulario: boolean = false;
  mensajeExito: boolean = false;
  mensajeError: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.empresaForm = this.fb.group({
      nombre: ['',[ Validators.required,Validators.minLength(3)]],
      slogan: ['', [Validators.required,Validators.maxLength(200)]],
      logo: [''], // Este campo puede ser utilizado para el nombre del archivo o URL
      facebook: ['', [ Validators.required,Validators.pattern(/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.me)\/.*/)]],
      instagram: ['', [ Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?instagram\.com\/.*/)]],
      direccion: ['',  Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      telefono: ['',  [Validators.required, Validators.pattern(/^\d{10}$/)]],
      })

  }

  ngOnInit(): void {
    this.getEmpresasData(); // Obtener los datos de la empresa al inicializar el componente
  }

  preventLetters(event: KeyboardEvent): void {
    const input = String.fromCharCode(event.charCode);
    if (!/[0-9]/.test(input)) {
      event.preventDefault();
    }
  }

  getEmpresasData(): void {
    this.http.get<Empresa>('http://localhost:3000/api/datos').subscribe({
      next: (response) => {
        this.empresaData = response; // Guarda el objeto directamente
      },
      error: (err) => {
        console.error('Error al obtener los perfiles de empresa', err);
        // Manejar el error
      }
    });
  }

  onLogoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.logoFile = file;
    }
  }

  cargarDatosEmpresa(empresa: Empresa): void {
    this.empresaForm.patchValue({
      nombre: empresa.nombre,
      slogan: empresa.slogan,
      facebook: empresa.facebook,
      instagram: empresa.instagram,
      direccion: empresa.direccion,
      correoElectronico: empresa.correo_electronico,
      telefono: empresa.telefono
      })

    this.mostrarFormulario = true;
  }

  onSubmit(): void {
    const formData = new FormData();

    // Agregar los datos del formulario
    formData.append('nombre', this.empresaForm.value.nombre);
    formData.append('slogan', this.empresaForm.value.slogan);

    if (this.logoFile) {
      formData.append('logo', this.logoFile); // Solo añadir si hay un archivo
    }
    formData.append('facebook', this.empresaForm.value.facebook);
    // Enviar la solicitud PUT al servidor
    this.http.put('https://back-tienda-livid.vercel.app/api/perfil', formData).subscribe({
      next: (response) => {
        console.log('Perfil de empresa actualizado exitosamente', response);
        this.getEmpresasData(); // Actualiza los datos después de modificar

          // Mostrar el mensaje de éxito
    this.mensajeExito = true;

     // Ocultar el mensaje después de 2 segundos
     setTimeout(() => {
      this.mensajeExito = false;
      this.mostrarFormulario = false; 
      this.empresaForm.reset();
    }, 2000);

      

      },
      error: (err) => {
        console.error('Error al actualizar el perfil de la empresa', err);
        // Manejar el error

        this.mensajeError = true;

        setTimeout(() => {
          this.mensajeError = false;
        }, 2000);
        
      }
    });
  }
  cancelarEdicion(): void {
    this.mostrarFormulario = false;
  }
  
}
