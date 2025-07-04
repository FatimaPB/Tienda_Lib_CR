import { Component, OnInit, ChangeDetectorRef  } from '@angular/core'; // Agrega OnInit para la inicialización
import { RouterLink} from '@angular/router';
import { HttpClient,  HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';





export interface Categoria {
  id?: number;
  nombre_categoria: string;
}

export interface Empresa {
  slogan?: string;
  nombre?: string;
  logo_url?: string; // Asegúrate de que este campo sea correcto en el modelo
}

@Component({
  selector: 'app-header-normal',
  standalone: true,
  imports:[FormsModule , CommonModule, RouterLink, MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,MatSidenavModule,MatCardModule, MatBadgeModule,
    MatExpansionModule,
    MatDialogModule,],
  templateUrl: './header-normal.component.html',
  styleUrls: ['./header-normal.component.css'] // Corrige aquí de styleUrl a styleUrls
})
export class HeaderNormalComponent implements OnInit { // Implementa OnInit
  productos: any[] = [];
  empresaData: Empresa | null = null; // Inicializa como null
  apiUrl = 'https://api-libreria.vercel.app/api/categorias';
  categorias: Categoria[] = [];
   cantidadCarrito = 0;

  constructor(private http: HttpClient, private router: Router, private cdRef: ChangeDetectorRef) {}

    // Obtener todas las categorías
      cargarCategorias() {
        this.http.get<Categoria[]>(this.apiUrl, {withCredentials:true}).subscribe((data) => {
          this.categorias = data;
        });
      }

  ngOnInit(): void {
    this.getEmpresasData(); 
    this.cargarCategorias();

    setInterval(() => {
      this.isVisibleNombre = !this.isVisibleNombre;
      this.cdRef.detectChanges();  // Fuerza la actualización de la vista
    }, 3000); // Cambiar cada 3 segundos
  }

  getEmpresasData(): void {
    this.http.get<Empresa>('https://api-libreria.vercel.app/api/datos').pipe(
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
  isMegaMenuOpen = false;

  toggleMegaMenu(event: Event) {
    event.stopPropagation(); // Evita que el evento cierre el menú al hacer clic
    this.isMegaMenuOpen = !this.isMegaMenuOpen;
  }
  
  isSearchOpen: boolean = false;

  openSearch() {
    this.isSearchOpen = true;
  }
  
  closeSearch() {
    this.isSearchOpen = false;
    this.searchQuery = '';  // Limpia el input
    this.productos = [];     // Limpia los resultados
  }

searchQuery: string = '';

toggleSearch() {
  this.isSearchOpen = !this.isSearchOpen;
}

isVisibleNombre: boolean = true;
loadProductos(): void {
  this.http.get<any[]>('https://api-libreria.vercel.app/api/productos', { withCredentials: true })
    .subscribe(
      (data) => {
        this.productos = data;
        this.cdRef.detectChanges(); // Fuerza la actualización de la vista
      },
      (err) => console.error('Error al cargar productos:', err)
    );
}


buscarProductos(termino: string): void {
  if (!termino.trim()) {

    return;
  }

  this.http.get<any[]>(`https://api-libreria.vercel.app/api/productos/buscar?q=${encodeURIComponent(termino)}`, { withCredentials: true })
    .subscribe(
      (data) => this.productos = data,
      (err) => console.error('Error al buscar productos:', err)
    );
}

  // Método para limpiar la búsqueda
  clearSearch() {
    this.searchQuery = '';  // Limpia el input
    this.productos = [];     // Limpia los resultados
  }


}
