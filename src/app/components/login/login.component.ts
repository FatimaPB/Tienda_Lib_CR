import { Component,ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { RecaptchaModule,  RecaptchaComponent   } from 'ng-recaptcha';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, RecaptchaModule ],
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

    @ViewChild(RecaptchaComponent ) recaptcha: RecaptchaComponent  | undefined; // Acceder al componente de reCAPTCHA

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}
  // Función personalizada para decodificar el JWT
  customDecode(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  

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
           // No necesitas guardar el token en localStorage
        // localStorage.setItem('token', response.token);
        // localStorage.setItem('rol', response.rol);
        // localStorage.setItem('correoRegistro', response.correo);
   

        // Usar la respuesta para decodificar el JWT
        //const decodedToken: any = this.customDecode(response.token);
        //const userId = decodedToken.id;
        // localStorage.setItem('usuarioId', userId);

       // console.log('ID del usuario:', userId); // Solo para verificar
            this.authService.login(response.rol);
            if (response.rol === 'admin' ||response.rol === 'empleado') {
              loginForm.resetForm();
              this.mensaje = 'Inicio de sesión exitoso!';
              this.exito= true;
              setTimeout(() => { 
                localStorage.removeItem('_grecaptcha');
                window.location.reload();
              }, 2000);
                this.router.navigate(['/inicioadmin']);
              this.mensaje = '';
              this.resolvedCaptcha = null;
            } else {
              this.mensaje = 'Inicio de sesión exitoso!';
              this.exito= true;
              setTimeout(() => {
                localStorage.removeItem('_grecaptcha');
                this.router.navigate(['']);
              }, 3000);
              this.mensaje = '';
              this.resolvedCaptcha = null;
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
            this.mensaje = 'Fallaste los intentos permitidos. Cuenta bloqueada. Intenta más tarde.';
            this.exito = false;
            loginForm.resetForm();
            setTimeout(() => {
              this.mensaje = '';
            }, 3000);
          } else {
            this.mensaje = 'Error al iniciar sesión: ' + (err.error?.message);
            this.exito = false;
            setTimeout(() => {
              this.mensaje = '';
            }, 3000);
          }
          this.resolvedCaptcha = null;

          // Reiniciar el reCAPTCHA
          if (this.recaptcha) {
            this.recaptcha.reset(); // Esto reinicia el estado del CAPTCHA
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
