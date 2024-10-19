import { Component } from '@angular/core';
import { AuthService } from '../auth.service'; // Ajusta la ruta según tu estructura de carpetas
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-headeru',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './headeru.component.html',
  styleUrl: './headeru.component.css'
})
export class HeaderuComponent {

  constructor(private authService: AuthService, private router: Router) {}
  onLogout() {
    this.authService.logout(); // Llama al método de logout del servicio
    this.router.navigate(['']); // Redirige a la página de inicio de sesión
  }

}
