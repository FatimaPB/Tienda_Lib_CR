import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, RecaptchaModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  resolvedCaptcha: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isPasswordVisible = false; // Para la contraseña

  private apiUrl = 'https://back-tienda-livid.vercel.app/api';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  onLogin(loginForm: NgForm) {
    const { email, password } = loginForm.value;

    if (!this.resolvedCaptcha) {
      this.errorMessage = 'Por favor, completa el reCAPTCHA.';
      return;
    }

    this.http.post<any>(`${this.apiUrl}/login`, { correo: email, contrasena: password, recaptcha: this.resolvedCaptcha }, { withCredentials: true })
      .subscribe({
        next: (response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            console.log('token generado es:', response.token)
            localStorage.setItem('tipoUsuario', response.tipoUsuario);
            localStorage.setItem('correoRegistro', response.correo);
            this.authService.login(response.tipoUsuario);

            if (response.tipoUsuario === 'admin') {
              this.successMessage = 'Inicio de sesión exitoso!';
              this.errorMessage = null;
                this.router.navigate(['/incidencias']);
                this.successMessage = null; 
            } else {
                this.router.navigate(['']);
            }
            
            
            
          }
        },
        error: (err) => {
          if (err.status === 400) {
            this.errorMessage = 'Error de verificación de reCAPTCHA. Intenta de nuevo.';
          } else if (err.status === 401) {
            this.errorMessage = 'Credenciales inválidas.';
          } else if (err.status === 403) {
            alert('Fallaste los 5 intentos permitidos. Cuenta bloqueada. Intenta más tarde.');
          } else {
            this.errorMessage = 'Error al iniciar sesión: ' + (err.error?.message || 'Servidor no disponible');
          }
          this.successMessage = null;
        }
      });
  }

  onCaptchaResolved(captchaResponse: string) {
    this.resolvedCaptcha = captchaResponse;
  }
    // Métodos para mostrar/ocultar contraseñas
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    }
}
