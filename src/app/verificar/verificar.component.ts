import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verificar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './verificar.component.html',
  styleUrl: './verificar.component.css'
})
export class VerificarComponent {

  correo: string = '';
  codigo: string = '';
  mensaje: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  verificarCodigo() {
    this.http.post('http://localhost:3000/api/verificar-codigo', { correo: this.correo, codigo: this.codigo })
      .subscribe(response => {
        this.mensaje = 'Código verificado con éxito. Ahora puedes restablecer tu contraseña.';
        this.router.navigate(['/restablecer'], { state: { correo: this.correo } });
      }, error => {
        this.mensaje = error.error.message;
      });
  }
}