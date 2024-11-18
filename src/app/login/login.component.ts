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
  mensaje = '';
  exito: boolean = false;

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
              this.mensaje = 'Inicio de sesión exitoso!';
              this.exito= true;
              setTimeout(() => {
                this.router.navigate(['/incidencias']);
              }, 3000);
            } else {
              this.mensaje = 'Inicio de sesión exitoso!';
              this.exito= true;
              setTimeout(() => {
                this.router.navigate(['']);
              }, 3000);
            }
            
            
            
          }
        },
        error: (err) => {
          if (err.status === 401) {
            this.mensaje = 'Credenciales inválidas.';
            this.exito = false;
            setTimeout(() => {
              this.mensaje = '';
            }, 3000);
          } else if (err.status === 403) {
            this.mensaje = 'Fallaste los 5 intentos permitidos. Cuenta bloqueada. Intenta más tarde.';
            this.exito = false;
            setTimeout(() => {
              this.mensaje = '';
            }, 3000);
          } 
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
