import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth.service'; // Ajusta la ruta según tu estructura de carpetas
import { Router } from '@angular/router';

@Component({
  selector: 'app-headera',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './headera.component.html',
  styleUrl: './headera.component.css'
})
export class HeaderaComponent {
  constructor(private authService: AuthService, private router: Router) {}

  onLogout() {
    this.authService.logout(); // Llama al método de logout del servicio
    this.router.navigate(['']); // Redirige a la página de inicio de sesión
  }
  menuActive = false; // Variable para controlar el estado del menú

  toggleMenu() {
    this.menuActive = !this.menuActive; // Alterna el estado del menú
  }

  closeMenu() {
    this.menuActive = false; // Cierra el menú cuando se selecciona una opción
  }
}
