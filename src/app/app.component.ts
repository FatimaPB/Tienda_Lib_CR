import { Component, inject, Renderer2 } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderuComponent } from './components/headeru/headeru.component';
import { HeaderaComponent } from './components/headera/headera.component';
import { HeaderNormalComponent } from './components/header-normal/header-normal.component';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NewlineToHtmlPipe } from './components/pipes/newline-to-html.pipe';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { BannerComponent } from './components/banner/banner.component';
import { FormsModule } from '@angular/forms';


import { ButtonModule } from 'primeng/button';



export interface Empresa {
  redesSociales?: {
    facebook?: string;
    instagram?: string;
  };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ButtonModule, HttpClientModule, CommonModule, 
    HeaderuComponent, HeaderaComponent, HeaderNormalComponent,BreadcrumbComponent, FormsModule,RouterModule ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent {
  title = 'cristo';
  token: string | null = null;
  rol: string | null = null;
  darkMode = false;
  isChatOpen = false;
  messages: { user: string, text: string }[] = [];
  userMessage = '';
  apiUrl = 'https://back-tienda-one.vercel.app//api/chat'; // Ruta del backend
  getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }
  

  constructor(private router: Router, private authService: AuthService, private renderer: Renderer2, private http: HttpClient) {
    // Suscribirse al tipo de usuario
    this.authService.rol$.subscribe((tipo) => {
      this.rol = tipo;
    });
  }

  ngOnInit() {
    // Recuperar el estado del modo oscuro del almacenamiento local
    const darkModeSetting = localStorage.getItem('darkMode');
    if (darkModeSetting === 'true') {
      this.darkMode = true;
      this.renderer.addClass(document.body, 'dark-theme'); // Aplicar modo oscuro
    }
    
    // Llamada para verificar el estado de la autenticación
    this.http.get<any>('https://back-tienda-one.vercel.app//api/check-auth', { withCredentials: true })
    .subscribe({
      next: (response) => {
        if (response.authenticated) {
          console.log('Usuario autenticado');
          this.rol = response.rol;  // Suponiendo que el backend envía el rol
          console.log('Usuario en sesión:', this.rol);
        } else {
          console.log('No autenticado');
        }
      },
      error: () => {
        console.log('Error al verificar la autenticación');
      }
    });
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
    this.http.get<Empresa>('https://back-tienda-one.vercel.app//api/datos').subscribe({
      next: (response) => {
        this.empresaData = response; // Guarda el objeto directamente
      },
      error: (err) => {
        console.error('Error al obtener los perfiles de empresa', err);
        // Manejar el error
      }
    });
  }


  // Método para alternar el estado del chat
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    if (!this.isChatOpen) {
      this.messages = []; // Borrar mensajes al cerrar el chat
    }
  }
  
  sendMessage(): void {
    if (!this.userMessage.trim()) return;

    // Agrega el mensaje del usuario al chat
    this.messages.push({ user: 'Usuario', text: this.userMessage });

    // Envía la pregunta al backend
    this.http.post<{ respuesta: string }>(this.apiUrl, { pregunta: this.userMessage }).subscribe(response => {
      this.messages.push({ user: 'Librería', text: response.respuesta });
    });

    // Limpia el input
    this.userMessage = '';
  }
}
