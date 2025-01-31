import { Component, OnInit } from '@angular/core'; // Agrega OnInit para la inicialización
import { RouterLink} from '@angular/router';
import { HttpClient,  HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getEmpresasData(); 
  }

  getEmpresasData(): void {
    this.http.get<Empresa>('https://back-tienda-livid.vercel.app/api/datos').pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Error al obtener los perfiles de empresa', err);
        
        // Redirigir según el código de estado HTTP
        if (err.status === 400) {
          this.router.navigate(['/error400']); // Solicitud incorrecta (Bad Request)
        } else if (err.status === 404) {
          this.router.navigate(['/error404']); // Página no encontrada (Not Found)
        } else if (err.status === 500) {
         this.router.navigate(['/error500']); // Error del servidor (Internal Server Error)
        } else {
         this.router.navigate(['/error500']); // Otros errores, los tratamos como error 500
        }
        
        return throwError(() => new Error('Error en la solicitud'));
      })
    ).subscribe({
      next: (response) => {
        this.empresaData = response; // Guarda el objeto directamente
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
