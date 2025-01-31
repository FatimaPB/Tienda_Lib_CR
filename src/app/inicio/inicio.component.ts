import { Component, AfterViewInit, ElementRef, ViewChild,  Renderer2 } from '@angular/core';
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
export class InicioComponent {

  @ViewChild('slider') slider!: ElementRef;
  @ViewChild('scrollTitle') scrollTitle!: ElementRef;
  @ViewChild('productosDestacados') productosDestacados!: ElementRef;
  @ViewChild('ubicacionLibreria') ubicacionLibreria!: ElementRef;
  @ViewChild('comentariosClientes') comentariosClientes!: ElementRef;

  images = [
    {
      src: 'assets/img/rosario.jpg',
      alt: 'Nueva colección de Rosarios',
      title: 'Nueva colección de Rosarios',
      description: 'Conoce nuestra línea de rosarios artesanales bendecidos para todas las edades.'
    },
    {
      src: 'assets/img/cadena.jpg',
      alt: 'Misa Especial para Familias',
      title: 'Misa Especial para Familias',
      description: 'Participa en nuestra misa especial dedicada a la unión y bendición de las familias.'
    },
    {
      src: 'assets/img/Libreria_Logo.jpg',
      alt: 'Semana Santa: Eventos Litúrgicos',
      title: 'Semana Santa: Eventos Litúrgicos',
      description: 'Consulta el calendario de actividades para Semana Santa y acompáñanos en estas fechas tan importantes.'
    }
  ];

  currentIndex = 0;
  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      const offset = -this.currentIndex * 100;
      this.slider.nativeElement.style.transform = `translateX(${offset}%)`;
    }, 4000);

        // Agregar evento de scroll
        this.renderer.listen('window', 'scroll', () => {
          const scrollY = window.scrollY; // Posición del scroll en Y
          const titleElement = this.scrollTitle.nativeElement;
    
          // Asegurar que el título esté presente
          if (titleElement) {
            const newFontSize = Math.min(5, 2 + scrollY / 500); // Máximo tamaño de 5rem
            titleElement.style.fontSize = `${newFontSize}rem`;
          }
        });
  }

  

}
