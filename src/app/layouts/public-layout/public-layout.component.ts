import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderaComponent } from '../../components/headera/headera.component';
import { HeaderuComponent } from '../../components/headeru/headeru.component';
import { HeaderNormalComponent } from '../../components/header-normal/header-normal.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { RouterOutlet } from '@angular/router';
import { NgModel } from '@angular/forms';
import { OnInit, inject, Renderer2 } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { Router, NavigationEnd  } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


import { MessagingService } from '../../messaging.service';


export interface Empresa {
  redesSociales?: {
    facebook?: string;
    instagram?: string;
  };
}

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [HeaderaComponent,HeaderNormalComponent,HttpClientModule,FormsModule,
    HeaderuComponent,BreadcrumbComponent,RouterOutlet,CommonModule],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css'
})
export class PublicLayoutComponent implements OnInit {
 token: string | null = null;
  rol: string | null = null;
  darkMode = false;
  isChatOpen = false;
  messages: { user: string, text: string }[] = [];
  userMessage = '';
  apiUrl = 'https://api-libreria.vercel.app/api/chat'; // Ruta del backend
  getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }
  

  constructor(private router: Router, private authService: AuthService, private renderer: Renderer2,
     private http: HttpClient,private messagingService: MessagingService,  private snackBar: MatSnackBar) {

    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
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

  // Primero: verificar la autenticación y obtener usuario
  this.http.get<any>('https://api-libreria.vercel.app/api/check-auth', { withCredentials: true })
    .subscribe({
      next: (response) => {
        if (response.authenticated) {
          console.log('Usuario autenticado');
          this.rol = response.rol;
          const usuarioId = response.usuario.id;  // Guarda el id usuario
          console.log('Usuario en sesión:', this.rol, 'ID:', usuarioId);

          // Luego: pedir permiso para notificaciones y enviar token junto con usuarioId
          this.messagingService.requestPermission()
            .then(token => {
              this.token = token;
              console.log('Token recibido:', token);

              // Aquí haces el POST para guardar el token asociado al usuario
              this.http.post('https://api-libreria.vercel.app/api/guardar-token', {
                usuario_id: usuarioId,
                token_fcm: token
              }).subscribe({
                next: () => console.log('Token FCM guardado en backend'),
                error: err => console.error('Error guardando token en backend', err)
              });

            })
            .catch(err => {
              console.error('No se pudo obtener permiso para notificaciones:', err);
            });

        } else {
          console.log('No autenticado');
        }
      },
      error: () => {
        console.log('Error al verificar la autenticación');
      }
    });

  this.getEmpresasData();

 this.messagingService.receiveMessage(payload => {
      const title = payload.notification?.title ?? 'Notificación';
      const body = payload.notification?.body ?? '';

      this.snackBar.open(`${title}: ${body}`, 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
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
    this.http.get<Empresa>('https://api-libreria.vercel.app/api/datos').subscribe({
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
