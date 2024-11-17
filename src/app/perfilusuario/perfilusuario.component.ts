import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfilusuario',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './perfilusuario.component.html',
  styleUrl: './perfilusuario.component.css'
})
export class PerfilusuarioComponent  implements OnInit {
  private apiUrl = `https://back-tienda-livid.vercel.app/api`;
  perfil: any = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showForm: boolean = false; // Controla la visibilidad del formulario
  showPasswordForm: boolean = false; // Controla la visibilidad del formulario de cambio de contraseña
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  }; // Datos para el cambio de contraseña

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getPerfil();
  }

  getPerfil() {
    const token = localStorage.getItem('token');
    console.log('Token obtenido del localStorage:', token);
    
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.get<any>(`${this.apiUrl}/perfil`, { headers })
      .subscribe({
        next: (response) => {
          console.log('Perfil recibido:', response);
          this.perfil = response;
        },
        error: (err) => {
          if (err.status === 401) {
            this.errorMessage = 'Token inválido o expirado. Inicia sesión de nuevo.';
            this.router.navigate(['/login']);
          } else {
            this.errorMessage = 'Error al obtener los datos del perfil';
          }
          console.error('Error de autenticación:', err);
        }
      });
  }
  actualizarPerfil() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Enviar los datos modificados al servidor
    this.http.put<any>(`${this.apiUrl}/edit`, this.perfil, { headers })
      .subscribe({
        next: (response) => {
          this.successMessage = 'Perfil actualizado con éxito';
          this.errorMessage = null;
          this.showForm = false; // Ocultar el formulario después de actualizar
          this.perfil = response; // Actualizar el perfil con los datos nuevos

          // Hacer que el mensaje de éxito desaparezca después de 3 segundos
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar el perfil';
          this.successMessage = null;
        }
      });
  }

  cambiarContrasena() {
    if (this.passwordData.newPassword !== this.passwordData.confirmNewPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const data = {
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword
    };

    this.http.put<any>(`${this.apiUrl}/cambiar-contrasena`, data, { headers })
      .subscribe({
        next: () => {
          this.successMessage = 'Contraseña actualizada con éxito';
          this.errorMessage = null;
          this.showPasswordForm = false;

          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar la contraseña';
          this.successMessage = null;
        }
      });
  }

  cancelarEdicion() {
    this.showForm = false;
  }

  cancelarCambioContrasena() {
    this.showPasswordForm = false;
  }
}