import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { TableModule } from 'primeng/table';




@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatCardModule,MatPaginatorModule, 
    MatSortModule,TableModule],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent implements OnInit  {
  ventas: any[] = [];
  apiUrl: string = 'https://back-tienda-one.vercel.app//api/ventas/historial-todos';
  usuarioRol: string | null = null;

  ventasFiltradas: any[] = [];


  fechaInicio: string = '';
  fechaFin: string = '';
  estado: string = '';
  metodoPago: string = '';
  busquedaProducto: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.verificarUsuario();
  }

  verificarUsuario(): void {
    this.http.get<any>('https://back-tienda-one.vercel.app//api/check-auth',{withCredentials:true}).subscribe(
      res => {
        if (res.authenticated && (res.usuario.rol === 'admin' || res.usuario.rol === 'vendedor')) {
          this.usuarioRol = res.usuario.rol;
          this.obtenerHistorial();
        } else {
          console.warn('No tienes permiso para ver el historial de ventas');
        }
      },
      err => {
        console.error('Error al verificar autenticación:', err);
      }
    );
  }

  obtenerHistorial(): void {
    this.http.get<any>(this.apiUrl,{withCredentials:true}).subscribe(
      res => {
        this.ventas = res.ventas;
      },
      err => {
        console.error("Error al obtener el historial de ventas", err);
      }
    );
  }



  filtrar() {
    this.ventasFiltradas = this.ventas.filter((venta) => {
      const cumpleFecha =
        (!this.fechaInicio || new Date(venta.fecha) >= new Date(this.fechaInicio)) &&
        (!this.fechaFin || new Date(venta.fecha) <= new Date(this.fechaFin));

      const cumpleEstado = !this.estado || venta.estado === this.estado;
      const cumpleMetodoPago = !this.metodoPago || venta.metodo_pago === this.metodoPago;

      const cumpleBusquedaProducto =
      !this.busquedaProducto ||
      venta.productos.some((p: { nombre: string; cantidad: number }) =>
        p.nombre.toLowerCase().includes(this.busquedaProducto.toLowerCase())
      );
    

      return cumpleFecha && cumpleEstado && cumpleMetodoPago && cumpleBusquedaProducto;
    });
  }
}