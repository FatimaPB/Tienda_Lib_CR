import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recuperarcontra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperarcontra.component.html',
  styleUrl: './recuperarcontra.component.css'
})
export class RecuperarcontraComponent {
  correo: string = '';
  mensaje: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  recuperarContrasena() {
    this.http.post('https://back-tienda-three.vercel.app/api/recuperar-contrasena', { correo: this.correo })
      .subscribe(response => {
        this.mensaje = 'Se ha enviado un código de verificación a tu correo';
        this.router.navigate(['/verificar']);
      }, error => {
        this.mensaje = error.error.message;
      });
  }
}