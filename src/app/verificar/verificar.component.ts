import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verificar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './verificar.component.html',
  styleUrl: './verificar.component.css'
})
export class VerificarComponent {

  correo: string = '';
  codigo: string = '';
  mensaje: string = '';
  exito: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Recuperar el correo desde localStorage
    const correo = localStorage.getItem('correoguardado');
    if (correo) {
      this.correo = correo; // Asignar el correo recuperado.
    } else {
      this.mensaje = 'No se encontró un correo guardado.';
    }
  }

  verificarCodigo() {
    this.http.post('https://back-tienda-three.vercel.app/api/verificar-codigo', { correo: this.correo, codigo: this.codigo })
      .subscribe(response => {
        this.mensaje = 'Código verificado con éxito. Ahora puedes restablecer tu contraseña.';
        this.exito = true;
        setTimeout(() => {
          this.router.navigate(['/restablecer'], { state: { correo: this.correo } });
        }, 3000);
      }, error => {
        this.mensaje = 'Error al verificar código';
        this.exito = false;
        setTimeout(() => {
          this.mensaje = '';
        }, 3000);
      });
  }
}