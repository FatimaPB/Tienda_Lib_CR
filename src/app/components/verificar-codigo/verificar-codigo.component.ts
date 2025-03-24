import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verificar-codigo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verificar-codigo.component.html',
  styleUrls: ['./verificar-codigo.component.css']
})
export class VerificarCodigoComponent {
  codigo: string = '';
  mensaje: string = '';
  exito: boolean = false;
  mostrandoSpinner: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  verificarCodigo() {
    const correo = localStorage.getItem('correoRegistro');
    const inputs = document.querySelectorAll('.code-input .form-control') as NodeListOf<HTMLInputElement>;
    this.codigo = Array.from(inputs).map(input => input.value).join('');
  
    const payload = { correo, codigoVerificacion: this.codigo };
  
    this.mostrandoSpinner = true; // ✅ Mostrar el spinner antes de hacer la petición
  
    this.http.post('https://tienda-lib-cr.vercel.app/api/usuarios/verico', payload).subscribe(
      (response: any) => {
        setTimeout(() => { // ✅ Mostrar el mensaje después de 3 segundos
          this.mostrandoSpinner = false; // ✅ Ocultar el spinner
          this.mensaje = 'Verificación exitosa, tu correo ha sido verificado.';
          this.exito = true;
  
          // Limpiar el LocalStorage
          localStorage.removeItem('correoRegistro');
  
          // Redirigir después de la verificación
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        }, 3000);
      },
      (error) => {
        setTimeout(() => { // ✅ Mostrar el mensaje después de 3 segundos
          this.mostrandoSpinner = false; // ✅ Ocultar el spinner
          this.mensaje = 'Código de verificación incorrecto o expirado.';
          this.exito = false;
          setTimeout(() => {
            this.mensaje = '';
          }, 3000);
        }, 3000);
      }
    );
  }
  
  

  moveFocus(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    const inputs = document.querySelectorAll('.form-control');
  
    // Solo permitir números
    if (/^\d$/.test(input.value)) {
      // Mover al siguiente campo si el valor es un número y no estamos en el último input
      if (index < inputs.length - 1) {
        (inputs[index + 1] as HTMLElement).focus();
      }
    } else {
      // Si el valor no es un número, borrarlo
      input.value = '';
    }
  }
  
  
}
