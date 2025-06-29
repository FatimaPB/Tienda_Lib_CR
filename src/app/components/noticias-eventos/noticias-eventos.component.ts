import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectChange } from '@angular/material/select';


import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';


interface Producto {
  id: number;
  titulo: string;
  precio: number;
  calificacion: number;
  imagen: string;
  enOferta: boolean;
}

interface Categoria {
  nombre: string;
  tieneSubmenu: boolean;
}



@Component({
  selector: 'app-noticias-eventos',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatListModule, MatIconModule, MatDividerModule, MatSliderModule,MatButtonModule,
    MatCardModule, MatChipsModule, MatSelectModule, MatFormFieldModule, MatTooltipModule
  ],
  templateUrl: './noticias-eventos.component.html',
  styleUrl: './noticias-eventos.component.css'
})
export class NoticiasEventosComponent implements OnInit {
 // Opciones de vista
 vistaGrid = true;
  
 // Opciones de ordenamiento
 opcionesOrdenamiento = [
   'Ordenar por novedad',
   'Ordenar por precio: menor a mayor',
   'Ordenar por precio: mayor a menor',
   'Ordenar por popularidad'
 ];
 ordenamientoSeleccionado = this.opcionesOrdenamiento[0];
 
 // Categorías
 categorias: Categoria[] = [
   { nombre: 'Hombres', tieneSubmenu: true },
   { nombre: 'Fútbol americano', tieneSubmenu: false },
   { nombre: 'de los hombres', tieneSubmenu: false },
   { nombre: 'Audio portátil', tieneSubmenu: false },
   { nombre: 'Relojes inteligentes', tieneSubmenu: false },
   { nombre: 'Tenis', tieneSubmenu: false },
   { nombre: 'Sin categorizar', tieneSubmenu: false },
   { nombre: 'Juegos de video', tieneSubmenu: false },
   { nombre: 'De las mujeres', tieneSubmenu: false }
 ];
 
 // Productos
 productos: Producto[] = [
   {
     id: 1,
     titulo: 'EPICURO POR LA LETRA',
     precio: 68,
     calificacion: 4,
     imagen: '../../../assets/img/rosario.jpg',
     enOferta: false
   },
   {
     id: 2,
     titulo: 'LA CAJA ESTÁ VACÍA.',
     precio: 95,
     calificacion: 4,
     imagen: '../../../assets/img/rosario.jpg',
     enOferta: true
   },
   {
     id: 3,
     titulo: 'PONLE EL CONDIMENTO.',
     precio: 115,
     calificacion: 4,
     imagen: '../../../assets/img/rosario.jpg',
     enOferta: true
   },
   {
    id: 4,
    titulo: 'EPICURO POR LA LETRA',
    precio: 68,
    calificacion: 4,
    imagen: '../../../assets/img/rosario.jpg',
    enOferta: false
  },
  {
    id: 5,
    titulo: 'LA CAJA ESTÁ VACÍA.',
    precio: 95,
    calificacion: 4,
    imagen: '../../../assets/img/rosario.jpg',
    enOferta: true
  },
  {
    id: 6,
    titulo: 'PONLE EL CONDIMENTO.',
    precio: 115,
    calificacion: 4,
    imagen: '../../../assets/img/rosario.jpg',
    enOferta: true
  }
 ];
 
 constructor() { }
 
 ngOnInit(): void { }
 
 // Cambiar vista entre grid y lista
 cambiarVista(esGrid: boolean): void {
   this.vistaGrid = esGrid;
 }
 
 // Cambiar ordenamiento
 cambiarOrdenamiento(event: MatSelectChange): void {
   this.ordenamientoSeleccionado = event.value;
   this.ordenarProductos();
 }
 
 // Ordenar productos según el criterio seleccionado
 ordenarProductos(): void {
   switch (this.ordenamientoSeleccionado) {
     case 'Ordenar por precio: menor a mayor':
       this.productos.sort((a, b) => a.precio - b.precio);
       break;
     case 'Ordenar por precio: mayor a menor':
       this.productos.sort((a, b) => b.precio - a.precio);
       break;
     case 'Ordenar por popularidad':
       // Aquí iría la lógica para ordenar por popularidad
       break;
     default:
       // Por novedad (podría ser por ID si es secuencial)
       this.productos.sort((a, b) => a.id - b.id);
   }
 }
 
 // Añadir al carrito
 anadirAlCarrito(productoId: number): void {
   console.log(`Producto ${productoId} añadido al carrito`);
   // Aquí iría la lógica para añadir al carrito
 }
 
 // Ver detalles
 verDetalles(productoId: number): void {
   console.log(`Ver detalles del producto ${productoId}`);
   // Aquí iría la lógica para ver detalles
 }
 
 // Añadir a favoritos
 anadirAFavoritos(productoId: number): void {
   console.log(`Producto ${productoId} añadido a favoritos`);
   // Aquí iría la lógica para añadir a favoritos
 }
}