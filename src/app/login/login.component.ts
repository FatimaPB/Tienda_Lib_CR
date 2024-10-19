import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service'; // Asegúrate de importar el servicio
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

 successMessage: string | null = null;
  errorMessage: string | null = null;

  private apiUrl = 'https://back-tienda-three.vercel.app/api'; // Cambia esta URL si es necesario

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  onLogin(loginForm: NgForm) {
    const { email, password } = loginForm.value;
  
    this.http.post<any>(`${this.apiUrl}/login`, { correo: email, contrasena: password })
      .subscribe({
        next: (response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('tipoUsuario', response.tipoUsuario); // Almacenar el tipo de usuario
            this.authService.login(response.tipoUsuario); // Establecer el tipo de usuario
            console.log("Tipo de usuario después de iniciar sesión:", response.tipoUsuario); // Verificar el tipo de usuario
            console.log("Token:", response.token); // Verificar el tipo de usuario

            console.log("Tipo de usuario:", response.tipoUsuario); // Esto debería mostrar 'admin' o 'cliente'
  
            if (response.tipoUsuario === 'admin') {
              this.router.navigate(['/inicioadmin']); // Redirigir al admin
              this.successMessage = 'Inicio de sesión exitoso!';
              this.errorMessage = null;
            } else {
              this.router.navigate(['']); // Redirigir al cliente
            }
          }
        },
        error: (err) => {
          if (err.status === 403) {
            alert('Fallaste los 5 intentos permitidos cuenta bloqueada. Intenta más tarde.'); // Mensaje para cuenta bloqueada
          } else {
            this.errorMessage = 'Error al iniciar sesión: ' + (err.error?.message || 'Servidor no disponible');
          }
          this.successMessage = null;
        }
      });
  }
}
