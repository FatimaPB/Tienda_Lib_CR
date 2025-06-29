import { Component, OnInit,ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-inicioadmin',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule,RouterLink, CardModule],
  templateUrl: './inicioadmin.component.html',
  styleUrl: './inicioadmin.component.css'
})
export class InicioadminComponent{
  cards = [
    { title: 'Productos', icon: 'pi pi-box', link: '/admproduts' },
    { title: 'Categorías', icon: 'pi pi-tags', link: '/categorias' },
    { title: 'Banners', icon: 'pi pi-image', link: '/banners' },
    { title: 'Ventas', icon: 'pi pi-chart-line', link: '/ventas' },
    { title: 'Incidencias', icon: 'pi pi-exclamation-circle', link: '/incidencias' },
    { title: 'Políticas', icon: 'pi pi-file', link: '/politicas' },
    { title: 'Términos', icon: 'pi pi-book', link: '/terminos' },
    { title: 'Deslinde Legal', icon: 'pi pi-shield', link: '/deslinde' },
    { title: 'Perfil Empresa', icon: 'pi pi-building', link: '/pempresa' },
    { title: 'Usuarios', icon: 'pi pi-users', link: '/usuarios' },
    { title: 'Configuración', icon: 'pi pi-cog', link: '/configuracion' },
  ];
}