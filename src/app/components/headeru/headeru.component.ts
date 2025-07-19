import { Component, OnInit, ChangeDetectorRef,HostListener, ElementRef  } from '@angular/core'; // Agrega OnInit para la inicialización
import { RouterLink} from '@angular/router';
import { HttpClient,  HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatBadgeModule } from '@angular/material/badge';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { AuthService } from '../../auth.service'; // Ajusta la ruta según tu estructura de carpetas
import { CarritoService } from '../../services/carrito.service';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa.model';
import { BadgeModule } from 'primeng/badge';

export interface Categoria {
  id?: number;
  nombre_categoria: string;
}
@Component({
  selector: 'app-headeru',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule,MatBadgeModule,BadgeModule],
  templateUrl: './headeru.component.html',
  styleUrl: './headeru.component.css',
    animations: [
      trigger('listAnimation', [
        transition('* => *', [ // cada vez que cambia placeholderIndex
          query(':enter', [], { optional: true }), // no hacemos nada con entradas nuevas
          query('.animated-placeholder.visible', [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger(500, [
              animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
          ], { optional: true })
        ])
      ])
    ]
})
export class HeaderuComponent {
  productos: any[] = [];
  empresaData: Empresa | null = null; // Inicializa como null
  categorias: Categoria[] = [];
  cantidadCarrito = 0;
  mostrarNombre: boolean = true;
  apiUrl = 'https://api-libreria.vercel.app/api/categorias';


  constructor(private authService: AuthService,
    private carritoservice: CarritoService,
     private router: Router, 
     private http: HttpClient, 
     private cdRef: ChangeDetectorRef,
    private empresaService: EmpresaService,
        private elRef: ElementRef
    ) {}
   // Obtener todas las categorías
        cargarCategorias() {
          this.http.get<Categoria[]>(this.apiUrl, {withCredentials:true}).subscribe((data) => {
            this.categorias = data;
          });
        }

          // Este método se dispara en cada clic global
          @HostListener('document:click', ['$event'])
          onClickOutside(event: MouseEvent) {
            // Si el clic no fue dentro del área del buscador...
            if (!this.elRef.nativeElement.contains(event.target)) {
              this.closerSearch(); // Cierra la búsqueda y resultados
            }
          }

  ngOnInit(): void {
    this.getEmpresasData(); 
    this.cargarCategorias();

        setInterval(() => {
      this.mostrarNombre = !this.mostrarNombre;
    }, 4000);

        setInterval(() => {
      this.placeholderIndex = (this.placeholderIndex + 1) % this.placeholders.length;
    }, 3000);
  }

  ngAfterViewInit() {
    this.carritoservice.getCarrito().subscribe((carrito) => {
      this.cantidadCarrito = carrito.length; // Actualiza la cantidad del carrito
      this.cdRef.detectChanges(); // Fuerza la actualización de la vista
    });
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
  event.preventDefault(); // para que no haga scroll ni siga enlace
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

  
    this.http.post('https://api-libreria.vercel.app/api/logout', {}, { withCredentials: true }).subscribe(
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
      closerSearch() {
    this.isSearchOpen = false;
    this.productos = [];     // Limpia los resultados
  }



      placeholders: string[] = [
    'Biblia latinoamericana',
    'Libros de espiritualidad',
    'Estampas religiosas',
    'Biblias para niños',
    'Rosarios de madera',
    'Libros de catequesis',
    'Estampas de santos',
    'Biblias en tapa dura',
  ];

  placeholderActual: string = this.placeholders[0];
  placeholderIndex: number = 0;
  placeholderVisible = true;
}
