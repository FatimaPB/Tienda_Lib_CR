import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';



import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSidenav } from '@angular/material/sidenav';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipListbox } from '@angular/material/chips';




interface Banner {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  creado_en: string;
}


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, CarouselModule, RouterLink,CardModule,ButtonModule,DialogModule, 
    FormsModule, TooltipModule,MatSlideToggleModule, MatIconModule, MatButtonModule,MatToolbarModule,
     MatMenuModule,MatSidenavModule, MatCardModule,MatGridListModule,MatFormFieldModule,MatInputModule
     ,MatProgressBarModule,MatTooltipModule
    ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements AfterViewInit {
  banners: Banner[] = [];
  apiUrl: string = 'http://localhost:3000/api/banners';
  currentIndex: number = 0;

  dialogoVisible: boolean = false;
  articuloSeleccionado: any = null;
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }


  // Referencia a la instancia del sidenav
  @ViewChildren('sidenav') sidenav!: MatSidenav;

  // Método para abrir/cerrar el sidenav
  toggleSidebar() {
    this.sidenav.toggle();
  }

  onLogout() {
    // Lógica para cerrar sesión
  }
  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(): void {
    this.http.get<Banner[]>(this.apiUrl).subscribe((data: Banner[]) => {
      this.banners = data;
    }, error => {
      console.error('Error al cargar los banners', error);
    });
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.banners.length;
    this.cdr.detectChanges();
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.banners.length) % this.banners.length;
    this.cdr.detectChanges();
  }


  
  

  @ViewChildren('serviceItem') serviceItems!: QueryList<ElementRef>;
  @ViewChildren('categoria') categorias!: QueryList<ElementRef>;
@ViewChildren('producto') productosElementos!: QueryList<ElementRef>;



ngAfterViewInit() {
  const options = {
    root: null, // Observar el viewport
    threshold: 0.1 // El 10% del elemento debe ser visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, options);

  // Observa los elementos de servicio
  this.serviceItems.toArray().forEach(item => {
    observer.observe(item.nativeElement);
  });

  // Observa los elementos de categoría
  this.categorias.toArray().forEach(item => {
    observer.observe(item.nativeElement);
  });

  // Observa los elementos de producto
  this.productosElementos.toArray().forEach(item => {
    observer.observe(item.nativeElement);
  });
}

  productos = [
    {
      nombre: 'Biblia de Estudio',
      imagen: '../../assets/img/cadena.jpg',
      precio: 500,
      descuento: 50
    },
    {
      nombre: 'Cirio Pascual',
      imagen: '../../assets/img/rosario.jpg',
      precio: 200
    },
    {
      nombre: 'Estampa de San Judas',
      imagen: '../../assets/img/catedral1.png',
      precio: 50,
      descuento: 10
    },
    {
      nombre: 'Cuadro Religioso',
      imagen: '../../assets/img/Libreria_Logo.jpg',
      precio: 350
    },
    {
      nombre: 'Biblia de Estudio',
      imagen: '../../assets/img/cadena.jpg',
      precio: 500,
      descuento: 50
    },
    {
      nombre: 'Cirio Pascual',
      imagen: '../../assets/img/rosario.jpg',
      precio: 200
    },
    {
      nombre: 'Estampa de San Judas',
      imagen: '../../assets/img/catedral1.png',
      precio: 50,
      descuento: 10
    },
    {
      nombre: 'Cuadro Religioso',
      imagen: '../../assets/img/Libreria_Logo.jpg',
      precio: 350
    }
  ];
}