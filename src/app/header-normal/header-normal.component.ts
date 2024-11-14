import { Component, OnInit } from '@angular/core'; // Agrega OnInit para la inicialización
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Empresa {
  slogan?: string;
  nombre?: string;
  logo?: string; // Asegúrate de que este campo sea correcto en el modelo
}

@Component({
  selector: 'app-header-normal',
  standalone: true,
  imports:[FormsModule , CommonModule, RouterLink],
  templateUrl: './header-normal.component.html',
  styleUrls: ['./header-normal.component.css'] // Corrige aquí de styleUrl a styleUrls
})
export class HeaderNormalComponent implements OnInit { // Implementa OnInit

  empresaData: Empresa | null = null; // Inicializa como null

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getEmpresasData(); 
  }

  getEmpresasData(): void {
    this.http.get<Empresa>('https://back-tienda-three.vercel.app/api/perfil').subscribe({
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

}
