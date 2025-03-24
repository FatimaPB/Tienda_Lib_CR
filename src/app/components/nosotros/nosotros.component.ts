import { Component, OnInit,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { PanelModule } from 'primeng/panel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';









export interface Empresa {
  mision?: string;
  vision?: string;
  valores?: string;

}

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CardModule, ButtonModule, DialogModule, FormsModule, TooltipModule, CommonModule, CarouselModule, PanelModule,
    ScrollTopModule, InputTextModule, DividerModule, TagModule],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Agrega esto
})
export class NosotrosComponent implements OnInit {
  empresaData: Empresa | null = null; // Inicializa como null
 mensajeExito: boolean = false;
 mensajeError: boolean = false;

 dialogoVisible: boolean = false;
 articuloSeleccionado: any = null;
   constructor(private http: HttpClient) {}

ngOnInit(): void {
    this.getEmpresasData(); // Obtener los datos de la empresa al inicializar el componente
  }

  getEmpresasData(): void {
    this.http.get<Empresa>('https://back-tienda-one.vercel.app/api/nosotros').subscribe({
      next: (response) => {
        this.empresaData = response; // Guarda el objeto directamente
      },
      error: (err) => {
        console.error('Error al obtener los perfiles de empresa', err);
        // Manejar el error
      }
    });
  }








   // Definir los productos para el carrusel
   products = [
    { name: 'Cruz de Madera', image: '../../assets/img/biblias.png', price: 25, inventoryStatus: 'IN STOCK' },
    { name: 'Biblia Ilustrada', image: '../../assets/img/cadena.jpg', price: 15, inventoryStatus: 'OUT OF STOCK' },
    { name: 'Rosario de Perlas', image: '../../assets/img/libro.jpg', price: 10, inventoryStatus: 'IN STOCK' },
    { name: 'otro', image: '../../assets/img/rosario.jpg', price: 10, inventoryStatus: 'IN STOCK' }
  ];

  // Opciones de responsive para el carrusel
  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '992px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  // Función para determinar la severidad de la etiqueta
  getSeverity(status: string) {
    if (status === 'IN STOCK') {
      return 'success';
    } else {
      return 'danger';
    }
  }
}
