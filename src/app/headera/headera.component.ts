import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service'; // Ajusta la ruta según tu estructura de carpetas
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-headera',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './headera.component.html',
  styleUrl: './headera.component.css'
})
export class HeaderaComponent {
  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  onLogout() {

     // Realiza la solicitud de logout al servidor para eliminar la cookie de sesión
    this.http.post('https://back-tienda-livid.vercel.app/api/logout', {}, { withCredentials: true }).subscribe(
      () => {
    this.authService.logout(); // Llama al método de logout del servicio
    this.router.navigate(['']); // Redirige a la página de inicio de sesión
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
