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

  constructor(private http: HttpClient, private router: Router) {}

  restablecerContrasena() {
    const correo = history.state.correo;
    this.http.post('http://localhost:3000/api/restablecer-contrasena', { correo, nuevaContrasena: this.nuevaContrasena })
      .subscribe(response => {
        this.mensaje = 'Contraseña restablecida exitosamente';
        this.router.navigate(['/login']);
      }, error => {
        this.mensaje = error.error.message;
      });
  }
}