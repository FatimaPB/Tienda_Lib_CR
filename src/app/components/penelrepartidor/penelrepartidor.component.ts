import { Component , OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { MatFormField } from '@angular/material/form-field';


import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  selector: 'app-penelrepartidor',
  standalone: true,
  imports: [CommonModule, FormsModule,MatIcon,MatLabel,MatFormField, CardModule, ButtonModule, DropdownModule, TagModule, InputTextModule],
  templateUrl: './penelrepartidor.component.html',
  styleUrl: './penelrepartidor.component.css'
})
export class PenelrepartidorComponent {
  pedidos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('https://api-libreria.vercel.app/api/envios/pendientes', { withCredentials: true })
      .subscribe(res => {
        this.pedidos = res.pedidos
      });
  }

  actualizarSeguimiento(pedido: any): void {
    const body = {
      venta_id: pedido.id,
      nuevoEstado: pedido.nuevoEstado,
      descripcion: pedido.descripcion
    };

    this.http.post('https://api-libreria.vercel.app/api/envio/actualizar', body, { withCredentials: true }).subscribe({
      next: () => {
        alert('Estado actualizado correctamente');
        this.ngOnInit(); // Recarga pedidos
      },
      error: () => alert('Error al actualizar el estado')
    });
  }

  estados = [
  { label: 'En reparto', value: 'en reparto' },
  { label: 'Entregado', value: 'entregado' }
];

}