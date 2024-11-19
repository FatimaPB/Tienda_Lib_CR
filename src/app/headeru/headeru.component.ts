import { Component } from '@angular/core';
import { AuthService } from '../auth.service'; // Ajusta la ruta según tu estructura de carpetas
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface Empresa {
  slogan?: string;
  nombre?: string;
  logo?: string;
}

@Component({
  selector: 'app-headeru',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './headeru.component.html',
  styleUrl: './headeru.component.css'
})
export class HeaderuComponent {

  empresaData: Empresa | null = null; 

  ngOnInit(): void {
    this.getEmpresasData(); 
  }

  getEmpresasData(): void {
    this.http.get<Empresa>('https://back-tienda-livid.vercel.app/api/datos').subscribe({
      next: (response) => {
        this.empresaData = response; // Guarda el objeto directamente
      },
      error: (err) => {
        console.error('Error al obtener los perfiles de empresa', err);
        // Manejar el error
      }
    });
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }


  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}
  onLogout() {

  
    this.http.post('https://back-tienda-livid.vercel.app/api/logout', {}, { withCredentials: true }).subscribe(
    () => {
    this.authService.logout(); 
    this.router.navigate(['']); 
  },
  (error) => {
    console.error('Error al cerrar sesión:', error);
  }
);
  }

}
