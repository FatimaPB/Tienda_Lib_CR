import { Component, inject, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderuComponent } from './headeru/headeru.component';
import { HeaderaComponent } from './headera/headera.component';
import { HeaderNormalComponent } from './header-normal/header-normal.component';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export interface Empresa {
  redesSociales?: {
    facebook?: string;
    instagram?: string;
  };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule, HeaderuComponent, HeaderaComponent, HeaderNormalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent {
  title = 'cristo';
  token: string | null = null;
  tipoUsuario: string | null = null;
  darkMode = false;

  constructor(private router: Router, private authService: AuthService, private renderer: Renderer2, private http: HttpClient) {
    // Suscribirse al tipo de usuario
    this.authService.tipoUsuario$.subscribe((tipo) => {
      this.tipoUsuario = tipo;
      console.log('Tipo de usuario actualizado:', this.tipoUsuario);
      console.log("Token:", this.token);
    });
  }

  ngOnInit() {
    // Recuperar el estado del modo oscuro del almacenamiento local
    const darkModeSetting = localStorage.getItem('darkMode');
    if (darkModeSetting === 'true') {
      this.darkMode = true;
      this.renderer.addClass(document.body, 'dark-theme'); // Aplicar modo oscuro
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Usuario autenticado');
      this.tipoUsuario = localStorage.getItem('tipoUsuario'); 
      console.log('Tipo de usuario al iniciar:', this.tipoUsuario);
    } 
    this.getEmpresasData(); 
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;

    if (this.darkMode) {
      this.renderer.addClass(document.body, 'dark-theme'); // Agregar clase para modo oscuro
      localStorage.setItem('darkMode', 'true'); // Guardar el estado en localStorage
    } else {
      this.renderer.removeClass(document.body, 'dark-theme'); // Remover clase para modo claro
      localStorage.setItem('darkMode', 'false'); // Guardar el estado en localStorage
    }
  }

  empresaData: Empresa | null = null; // Inicializa como null

  getEmpresasData(): void {
    this.http.get<Empresa>('https://back-tienda-three.vercel.app/api/datos').subscribe({
      next: (response) => {
        this.empresaData = response; // Guarda el objeto directamente
      },
      error: (err) => {
        console.error('Error al obtener los perfiles de empresa', err);
        // Manejar el error
      }
    });
  }
}
