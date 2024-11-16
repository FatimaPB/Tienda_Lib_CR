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

  ngOnInit(): void {
    // Recuperar el correo desde localStorage
    const correoGuardado = localStorage.getItem('correo');
    if (correoGuardado) {
      this.correo = correoGuardado; // Asignar el correo recuperado.
    } else {
      this.mensaje = 'No se encontró un correo guardado.';
    }
  }

  verificarCodigo() {
    this.http.post('https://back-tienda-three.vercel.app/api/verificar-codigo', { correo: this.correo, codigo: this.codigo })
      .subscribe(response => {
        this.mensaje = 'Código verificado con éxito. Ahora puedes restablecer tu contraseña.';
        this.router.navigate(['/restablecer'], { state: { correo: this.correo } });
      }, error => {
        this.mensaje = error.error.message;
      });
  }
}