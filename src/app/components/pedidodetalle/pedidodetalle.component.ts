import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-pedidodetalle',
  standalone: true,
  imports: [CommonModule, TimelineModule],
  templateUrl: './pedidodetalle.component.html',
  styleUrl: './pedidodetalle.component.css'
})
export class PedidodetalleComponent implements OnInit {
  pedido: any;
  historial: any[] = [];
  events: any[] = [];
  isMobile = window.innerWidth < 768;
  estadoActualIndex = -1;
  

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });

    this.route.queryParams.subscribe(params => {
      const id = params['id'];

      this.http.get(`https://back-tienda-one.vercel.app/api/pedidos/${id}`, { withCredentials: true }).subscribe(data => {
        this.pedido = data;

        this.http.get<any>(`https://back-tienda-one.vercel.app/api/envio/seguimiento/${id}`, { withCredentials: true }).subscribe(res => {
          const eventosManual = [
            {
              status: 'Pedido realizado',
              date: new Date(this.pedido.fecha).toLocaleString(),
              rawDate: new Date(this.pedido.fecha),
              description: 'El cliente realizó el pedido.',
              cambio_por: this.pedido.usuario || 'Cliente'
            },
            {
              status: 'Pedido pagado',
              date: new Date(this.pedido.fecha).toLocaleString(),
              rawDate: new Date(this.pedido.fecha),
              description: 'Pago confirmado',
              cambio_por: 'Sistema'
            }
          ];

this.events = [...eventosManual, ...res.historial.map((item: any) => ({
  status: item.estado_nuevo,
  date: new Date(item.fecha).toLocaleString(),
  rawDate: new Date(item.fecha),
  description: item.descripcion,
  cambio_por: item.cambio_por
}))].sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

// Detectar el evento más reciente como estado actual
this.estadoActualIndex = this.events.length - 1;

const isEntregado = this.events[this.estadoActualIndex].status?.toLowerCase() === 'entregado';

// Asignar color e ícono por estado
this.events = this.events.map((event, i) => {
  const entregado = event.status?.toLowerCase() === 'entregado';
  return {
    ...event,
    color: entregado ? '#4CAF50' : (i === this.estadoActualIndex ? '#2196F3' : '#BDBDBD'),
    icon: entregado ? 'pi pi-check' : (i === this.estadoActualIndex ? 'pi pi-clock' : 'pi pi-circle'),
    marcadorExtra: false
  };
});

// Si NO está entregado, agregar una bolita de espera extra
if (!isEntregado) {
  this.events.push({
    status: 'Esperando actualización',
    date: '',
    description: '',
    cambio_por: '',
    color: '#90CAF9',
    icon: 'pi pi-clock',
    marcadorExtra: true
  });
}


this.events = this.events.map((event, i) => {
  if (event.marcadorExtra) return event; // no cambiar marcador extra

  const isEntregado = event.status?.toLowerCase() === 'entregado';
  return {
    ...event,
    color: isEntregado ? '#4CAF50' : (i === this.estadoActualIndex ? '#28a745' : '#BDBDBD'),
    icon: isEntregado ? 'pi pi-check' : (i === this.estadoActualIndex ? '' : 'pi pi-circle')
  };
});

        
        });
      });
    });
  }
}
