import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-headera',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './headera.component.html',
  styleUrl: './headera.component.css'
})
export class HeaderaComponent {
  constructor(private http: HttpClient, private router: Router) {}

  onLogout() {
     // Realiza la solicitud de logout al servidor para eliminar la cookie de sesión
     this.http.post('https://back-tienda-livid.vercel.app/api/logout', {}, { withCredentials: true }).subscribe(
      () => {
        console.log('Sesión cerrada exitosamente');
        // Limpiar el token del almacenamiento local
        localStorage.removeItem('token');
        // Redirigir al inicio de sesión
        this.router.navigate(['']);
      },
      (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    );
  }

  isMenuOpen: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
