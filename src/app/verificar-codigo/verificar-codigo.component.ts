import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-verificar-codigo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './verificar-codigo.component.html',
  styleUrls: ['./verificar-codigo.component.css']
})
export class VerificarCodigoComponent {
  codigo: string = '';
  mensaje: string = '';
  exito: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  verificarCodigo() {
    // Recuperar el correo del LocalStorage
    const correo = localStorage.getItem('correoRegistro');
    
    // Aquí enviamos el código y el correo al backend
    const payload = { correo, codigoVerificacion: this.codigo };

    this.http.post('https://back-tienda-three.vercel.app/api/usuarios/verico', payload).subscribe(
      (response: any) => {
        this.mensaje = 'Verificación exitosa, tu correo ha sido verificado.',response;
        this.exito = true;

         // Limpiar el LocalStorage
      localStorage.removeItem('correoRegistro');

        // Redirigir después de la verificación
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      (error) => {
        this.mensaje = 'Código de verificación incorrecto o expirado.';
        this.exito = false;
      }
    );
  }
}
