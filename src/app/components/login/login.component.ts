import { Component,ViewChild, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';
import { RecaptchaModule,  RecaptchaComponent   } from 'ng-recaptcha';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MatProgressSpinner } from '@angular/material/progress-spinner';



@Component({
  selector: 'app-login',
  standalone: true,
  providers: [MessageService],
  imports: [FormsModule, RouterLink, CommonModule, RecaptchaModule,InputTextModule, PasswordModule, ButtonModule, FloatLabelModule, ToastModule,MatProgressSpinner],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   resolvedCaptcha: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isPasswordVisible = false;
  mensaje = '';
  password: string = '';
  exito: boolean = false;

  loading: boolean = true;

  // Nueva propiedad para mostrar campo de MFA
  showMFAField: boolean = false;
  mfaToken: string = ''; // Código MFA ingresado por el usuario
  mfaUsuarioId: string | null = null; // Para almacenar el usuarioId cuando se requiera MFA

  @ViewChild(RecaptchaComponent) recaptcha: RecaptchaComponent | undefined;

  private apiUrl = 'https://api-libreria.vercel.app/api';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService,private messageService: MessageService) {}

  customDecode(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  }

  ngOnInit() {
  // Aquí puedes esperar 300ms o lo que creas necesario para simular la carga real (como cookies, reCAPTCHA o autenticación).
  setTimeout(() => {
    this.loading = false;
  }, 300); // o más si estás esperando algo del servidor
}

  

  onLogin(loginForm: NgForm) {
    const { email, password } = loginForm.value;

    if (!this.resolvedCaptcha) {
      this.errorMessage = 'Por favor, completa el reCAPTCHA.';
      return;
    }

    // Si ya se está en flujo MFA, se evita volver a enviar las credenciales
    if (this.showMFAField) {
      return;
    }

    this.http.post<any>(`${this.apiUrl}/login`, { correo: email, contrasena: password, recaptcha: this.resolvedCaptcha }, { withCredentials: true })
      .subscribe({
        next: (response) => {
          // Si el backend indica que se requiere MFA, se activa el campo MFA en el mismo componente
          if (response.requiereMFA) {
            console.log("MFA requerido, usuarioId:", response.usuarioId);
            this.showMFAField = true;
            this.mfaUsuarioId = response.usuarioId;
            this.messageService.add({
            severity: 'info',
            summary: 'MFA requerido',
            detail: 'Ingresa el código MFA para completar el inicio de sesión.'
          });
            return;
          }

          // Flujo normal sin MFA
          if (response.token) {
            this.authService.login(response.rol);
            if (response.rol === 'admin' || response.rol === 'empleado') {
              loginForm.resetForm();
             this.messageService.add({
            severity: 'success',
            summary: 'Inicio de sesión exitoso',
            detail: 'Bienvenido'
          });

              this.exito = true;
              setTimeout(() => { 
                localStorage.removeItem('_grecaptcha');
              }, 2000);
              this.router.navigate(['/inicioadmin']);
              this.mensaje = '';
              this.resolvedCaptcha = null;
            } else {
            this.messageService.add({
            severity: 'success',
            summary: 'Inicio de sesión exitoso',
            detail: 'Bienvenido'
          });

              this.exito = true;
              setTimeout(() => {
                localStorage.removeItem('_grecaptcha');
                this.router.navigate(['']);
              }, 2000);
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

           this.messageService.add({
            severity: 'warn',
            summary: 'Credenciales inválidas.',
            detail: 'Revisa tu correo y contraseña.'
          });
          } else if (err.status === 403) {
            this.mensaje = 'Fallaste los intentos permitidos. Cuenta bloqueada. Intenta más tarde.';
            this.exito = false;
            loginForm.resetForm();
            setTimeout(() => {
              this.mensaje = '';
            }, 3000);
          } else {
            this.mensaje = 'Error al iniciar sesión: ' + (err.error?.message);
           
           this.messageService.add({
            severity: 'error',
            summary: 'Credenciales inválidas.',
            detail: 'Revisa tu correo y contraseña.'
          });
          
          }
          this.resolvedCaptcha = null;
          if (this.recaptcha) {
            this.recaptcha.reset();
          }
        }
      });
  }

  // Nuevo método para verificar el código MFA
  onVerifyMFA() {
    if (!this.mfaToken) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Código MFA',
        detail: 'Por favor, ingresa el código MFA.'
      });
      return;
    }
  
    this.http.post<any>(`${this.apiUrl}/verificar-mfa`, { usuarioId: this.mfaUsuarioId, tokenMFA: this.mfaToken }, { withCredentials: true })
      .subscribe({
        next: (response) => {
          if (response.token) {
            this.authService.login(response.rol);
            if (response.rol === 'admin' || response.rol === 'empleado') {
               this.messageService.add({
            severity: 'success',
            summary: 'Inicio de sesión exitoso',
            detail: 'Acceso permitido'
          });
              this.exito = true;
              setTimeout(() => { 
                localStorage.removeItem('_grecaptcha');
              }, 2000);
              this.router.navigate(['/inicioadmin']);
              this.mensaje = '';
              this.resolvedCaptcha = null;
            } else {
              this.mensaje = 'Inicio de sesión exitoso!';
              this.exito = true;
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
          console.error('Error en verificación MFA:', err);
          this.mensaje = 'Código MFA incorrecto.';
          this.exito = false;
        }
      });
  }
  
  
  
  

  onCaptchaResolved(captchaResponse: string) {
    this.resolvedCaptcha = captchaResponse;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}