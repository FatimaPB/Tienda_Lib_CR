import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, CarouselModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements AfterViewInit {

  currentIndex: number = 0;

  slides = [
    {
      src: "../../assets/img/prueba.png",
      subtitle: "Nueva colleccion",
      title: "Luce los nuevos rosarios de madera",
      link: "/deta"
    },
    {
      src: "../../assets/img/pueba2.png",
      subtitle: "Tendencias",
      title: "Arte",
      link: "/deta"
    }
  ];
  constructor(private cdr: ChangeDetectorRef) {}

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.cdr.detectChanges(); // Forzar detección de cambios
    this.resetAnimation(); // Reiniciar animación
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.cdr.detectChanges(); // Forzar detección de cambios
    this.resetAnimation(); // Reiniciar animación
  }

  resetAnimation() {
    const element = document.querySelector('.hero-slider-content') as HTMLElement;
    if (element) {
      // Elimina la clase 'animate'
      element.classList.remove('hero-slider-content'); 
      
      // Forzar el reflujo para que el DOM se actualice antes de volver a añadir la animación
      void element.offsetWidth; 
  
      // Agregar la clase 'animate' después de un pequeño retraso
      setTimeout(() => {
        element.classList.add('hero-slider-content');
      }, 0); // Ejecutarlo inmediatamente después de que el DOM se actualice
    }
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