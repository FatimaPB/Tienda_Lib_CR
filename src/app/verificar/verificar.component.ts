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

  verificarCodigo() {
    const correo = localStorage.getItem('correoguardado');
    const inputs = document.querySelectorAll('.code-input .form-control') as NodeListOf<HTMLInputElement>;
    this.codigo = Array.from(inputs).map(input => input.value).join('');

    const payload = { correo, codigo: this.codigo };

    this.http.post('https://back-tienda-three.vercel.app/api/verificar-codigo',payload)
      .subscribe(response => {
        this.mensaje = 'Código verificado con éxito. Ahora puedes restablecer tu contraseña.';
        localStorage.setItem('correores', this.correo);
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