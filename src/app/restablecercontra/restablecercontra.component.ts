import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restablecercontra',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './restablecercontra.component.html',
  styleUrl: './restablecercontra.component.css'
})
export class RestablecercontraComponent {
  nuevaContrasena: string = '';
  confirmacionContrasena: string = '';
  mensaje: string = '';
  isPasswordVisible = false; // Para la contraseña

  constructor(private http: HttpClient, private router: Router) {}

  restablecerContrasena() {
    const correo = history.state.correo;
    this.http.post('https://back-tienda-three.vercel.app/api/restablecer-contrasena', { correo, nuevaContrasena: this.nuevaContrasena })
      .subscribe(response => {
        this.mensaje = 'Contraseña restablecida exitosamente';
        this.router.navigate(['/login']);
      }, error => {
        this.mensaje = error.error.message;
      });
  }

      // Métodos para mostrar/ocultar contraseñas
      togglePasswordVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
      }
}