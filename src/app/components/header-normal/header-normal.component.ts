import { Component, OnInit, ChangeDetectorRef, HostListener, ElementRef } from '@angular/core'; // Agrega OnInit para la inicialización
import { RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Categoria } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria.service';
import { EmpresaService } from '../../services/empresa.service';
import { Empresa } from '../../models/empresa.model';
import { BadgeModule } from 'primeng/badge';


@Component({
  selector: 'app-header-normal',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, MatBadgeModule,BadgeModule],
  templateUrl: './header-normal.component.html',
  styleUrls: ['./header-normal.component.css'],
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
export class HeaderNormalComponent implements OnInit { // Implementa OnInit
  productos: any[] = [];
  empresaData: Empresa | null = null; // Inicializa como null
  apiUrl = 'https://api-libreria.vercel.app/api/categorias';
  categorias: Categoria[] = [];
  cantidadCarrito = 0;
  mostrarNombre: boolean = true;
  intervalId: any;

  constructor(private http: HttpClient,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private elRef: ElementRef,
    private categoriaService: CategoriaService,
    private empresaService: EmpresaService) { }

  cargarCategorias(): void {
    this.categoriaService.cargarCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías', err)
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

  getEmpresasData(): void {
    this.empresaService.obtenerDatosEmpresa().subscribe({
      next: (response) => {
        this.empresaData = response;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al obtener los perfiles de empresa', err);
        switch (err.status) {
          case 400: this.router.navigate(['/error400']); break;
          case 404: this.router.navigate(['/error404']); break;
          case 500:
          default: this.router.navigate(['/error500']); break;
        }
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

  closerSearch() {
    this.isSearchOpen = false;
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
