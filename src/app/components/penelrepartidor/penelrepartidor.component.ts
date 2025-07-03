import { Component , OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-penelrepartidor',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
}