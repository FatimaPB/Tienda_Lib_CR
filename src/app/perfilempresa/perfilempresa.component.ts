import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Empresa {
  nombre: string;
  slogan?: string;
  logo?: string; // Asegúrate de que este campo sea correcto en el modelo
  redesSociales?: {
    facebook?: string;
    instagram?: string;
  };
  contacto?: {
    direccion?: string;
    correoElectronico: string;
    telefono?: string;
  };
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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.empresaForm = this.fb.group({
      nombre: ['', Validators.required],
      slogan: ['', [Validators.maxLength(100)]],
      logo: [''], // Este campo puede ser utilizado para el nombre del archivo o URL
      redesSociales: this.fb.group({
        facebook: ['', [Validators.pattern(/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.me)\/.*/)]],
        instagram: ['', [Validators.pattern(/^(https?:\/\/)?(www\.)?instagram\.com\/.*/)]]
      }),
      contacto: this.fb.group({
        direccion: [''],
        correoElectronico: ['', [Validators.required, Validators.email]],
        telefono: ['']
      })
    });
  }

  ngOnInit(): void {
    this.getEmpresasData(); // Obtener los datos de la empresa al inicializar el componente
  }

  getEmpresasData(): void {
    this.http.get<Empresa>('https://back-tienda-three.vercel.app/api/perfil').subscribe({
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
      redesSociales: {
        facebook: empresa.redesSociales?.facebook,
        instagram: empresa.redesSociales?.instagram
      },
      contacto: {
        direccion: empresa.contacto?.direccion,
        correoElectronico: empresa.contacto?.correoElectronico,
        telefono: empresa.contacto?.telefono
      }
    });
  }

  onSubmit(): void {
    const formData = new FormData();

    // Agregar los datos del formulario
    formData.append('nombre', this.empresaForm.value.nombre);
    formData.append('slogan', this.empresaForm.value.slogan);
    if (this.logoFile) {
      formData.append('logo', this.logoFile); // Solo añadir si hay un archivo
    }

    // Agregar redes sociales
    const redesSociales = this.empresaForm.value.redesSociales;
    formData.append('redesSociales', JSON.stringify(redesSociales)); // Convertir a JSON

    // Agregar contacto
    const contacto = this.empresaForm.value.contacto;
    formData.append('contacto', JSON.stringify(contacto)); // Convertir a JSON

    // Enviar la solicitud PUT al servidor
    this.http.put('https://back-tienda-three.vercel.app/api/perfil', formData).subscribe({
      next: (response) => {
        console.log('Perfil de empresa actualizado exitosamente', response);
        this.getEmpresasData(); // Actualiza los datos después de modificar
        this.empresaForm.reset();
      },
      error: (err) => {
        console.error('Error al actualizar el perfil de la empresa', err);
        // Manejar el error
      }
    });
  }
}
