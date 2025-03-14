import { Component, OnInit, ChangeDetectorRef  } from '@angular/core'; // Agrega OnInit para la inicialización
import { RouterLink} from '@angular/router';
import { HttpClient,  HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../auth.service'; // Ajusta la ruta según tu estructura de carpetas

export interface Empresa {
  slogan?: string;
  nombre?: string;
  logo?: string;
}
export interface Categoria {
  id?: number;
  nombre_categoria: string;
}
@Component({
  selector: 'app-headeru',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './headeru.component.html',
  styleUrl: './headeru.component.css'
})
export class HeaderuComponent {
  productos: any[] = [];
  empresaData: Empresa | null = null; // Inicializa como null
  categorias: Categoria[] = [];
  apiUrl = 'https://back-tienda-one.vercel.app//api/categorias';
  constructor(private authService: AuthService, private router: Router, private http: HttpClient, private cdRef: ChangeDetectorRef) {}
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
    this.http.get<Empresa>('https://back-tienda-one.vercel.app//api/datos').pipe(
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


  onLogout() {

  
    this.http.post('https://back-tienda-one.vercel.app//api/logout', {}, { withCredentials: true }).subscribe(
    () => {
    this.authService.logout(); 
    this.router.navigate(['']); 
  },
  (error) => {
    console.error('Error al cerrar sesión:', error);
  }
);
  }

  buscarProductos(termino: string): void {
    if (!termino.trim()) {
  
      return;
    }
  
    this.http.get<any[]>(`https://back-tienda-one.vercel.app//api/productos/buscar?q=${encodeURIComponent(termino)}`, { withCredentials: true })
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
