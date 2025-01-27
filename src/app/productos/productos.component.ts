import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit  {
// Lista de imágenes
images = [
  "../../assets/img/rosario.jpg",
  "../../assets/img/Libreria_Logo.jpg",
"../../assets/img/cadena.jpg"
  // Agrega aquí las otras imágenes que desees mostrar
];

currentIndex = 0;
  imageUrl: string = this.images[this.currentIndex];
  imageClass = 'slide-in-active';  // Clase para la animación

  ngOnInit() {
    // Función para cambiar la imagen cada 3 segundos
    setInterval(() => {
      this.imageClass = 'slide-in-left';  // Inicia la animación de deslizamiento
      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % this.images.length; // Cicla a través de las imágenes
        this.imageUrl = this.images[this.currentIndex]; // Cambia la fuente de la imagen
        this.imageClass = 'slide-in-right'; // Anima la nueva imagen deslizándose desde la derecha
      }, 1000); // Espera 1 segundo para completar la animación
    }, 3000); // Cambia cada 3000ms (3 segundos)
  }
}