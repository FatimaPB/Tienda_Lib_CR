import { Component, OnInit,ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';


interface Card {
  title: string;
  icon: string;
  link: string;
  count?: number;  // opcional
}

@Component({
  selector: 'app-inicioadmin',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, ChartModule,CardModule,MatIconModule],
  templateUrl: './inicioadmin.component.html',
  styleUrl: './inicioadmin.component.css'
})


export class InicioadminComponent implements OnInit{
   ventas: any[] = [];
     recentSales: any[] = [];
   chartData: any;

cards: Card[] = [
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

  chatMessages = [
    { from: 'admin', text: 'Hola, ¿en qué podemos ayudarte hoy?' },
    { from: 'user', text: '¿Cómo actualizo los productos?' }
  ];

  chatInput = '';

  constructor(private router: Router, private http: HttpClient) {}

    ngOnInit(): void {
   this.obtenerCategorias();
  //this.obtenerUsuarios();
  this.obtenerProductos();
  this.obtenerBanners();
  this.obtenerVentas();
  //this.obtenerIncidencias();
  }


  navigate(link: string) {
    this.router.navigate([link]);
  }

  sendMessage() {
    if (this.chatInput.trim()) {
      this.chatMessages.push({ from: 'user', text: this.chatInput.trim() });
      this.chatInput = '';
      setTimeout(() => {
        this.chatMessages.push({ from: 'admin', text: 'Gracias por tu mensaje, lo revisamos.' });
      }, 1000);
    }
  }

  metrics = [
  { label: 'Usuarios', icon: 'pi pi-users', value: 0 },
  { label: 'Productos', icon: 'pi pi-box', value: 0 },
  { label: 'Ventas', icon: 'pi pi-dollar', value: 0 },
  { label: 'Pedidos', icon: 'pi pi-shopping-cart', value: 0 }
];

 generarDatosDeGrafico() {
  const ventasPorDia: { [key: string]: number } = {
    'Lun': 0,
    'Mar': 0,
    'Mié': 0,
    'Jue': 0,
    'Vie': 0,
    'Sáb': 0,
    'Dom': 0
  };

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  for (const venta of this.ventas) {
    const fecha = new Date(venta.fecha || venta.created_at);
    const dia = diasSemana[fecha.getDay()];
    if (dia in ventasPorDia) {
      ventasPorDia[dia]++;
    }
  }

  // Reordena para empezar en lunes
  const labelsOrdenadas = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const datosOrdenados = labelsOrdenadas.map(dia => ventasPorDia[dia]);

  this.chartData = {
    labels: labelsOrdenadas,
    datasets: [
      {
        label: 'Ventas por día',
        data: datosOrdenados,
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        borderWidth: 1
      }
    ]
  };
}

chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#333'
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#555' },
      grid: { color: '#eee' }
    },
    y: {
      beginAtZero: true,
      ticks: { color: '#555' },
      grid: { color: '#eee' }
    }
  }
};


obtenerCategorias() {
  this.http.get<any[]>('https://api-libreria.vercel.app/api/categorias')
    .subscribe({
      next: (categorias) => {
        this.setCardCount('Categorías', categorias.length);
      },
      error: (err) => console.error('Error al obtener categorías:', err)
    });
}

obtenerUsuarios() {
  this.http.get<any[]>('https://api-libreria.vercel.app/api/usuarios')
    .subscribe({
      next: (usuarios) => {
        this.setCardCount('Usuarios', usuarios.length);
      },
      error: (err) => console.error('Error al obtener usuarios:', err)
    });
}

obtenerProductos() {
  this.http.get<any[]>('https://api-libreria.vercel.app/api/productos',{withCredentials: true})
    .subscribe({
      next: (productos) => {
        this.setCardCount('Productos', productos.length);
      },
      error: (err) => console.error('Error al obtener productos:', err)
    });
}

obtenerBanners() {
  this.http.get<any[]>('https://api-libreria.vercel.app/api/banners')
    .subscribe({
      next: (banners) => {
        this.setCardCount('Banners', banners.length);
      },
      error: (err) => console.error('Error al obtener banners:', err)
    });
}
verDetalle(venta: any) {
  this.router.navigate(['/ventas', venta.id]);
}




obtenerVentas(): void {
  this.http.get<any>('https://api-libreria.vercel.app/api/ventas/historial-todos', { withCredentials: true }).subscribe(
    res => {
      this.ventas = res.ventas || [];
      this.setCardCount('Ventas', this.ventas.length);
      this.generarDatosDeGrafico();

 this.recentSales = this.ventas.slice(-5).reverse().map(venta => ({
  ...venta,
  total: Number(venta.total)
}));

    },
    err => {
      console.error("Error al obtener el historial de ventas", err);
    }
  );
}




obtenerIncidencias() {
  this.http.get<any[]>('https://api-libreria.vercel.app/api/incidencias')
    .subscribe({
      next: (incidencias) => {
        this.setCardCount('Incidencias', incidencias.length);
      },
      error: (err) => console.error('Error al obtener incidencias:', err)
    });
}

setCardCount(title: string, count: number) {
  const card = this.cards.find(c => c.title === title);
  if (card) card.count = count;
}

// Métodos auxiliares para el template
  getCardCount(title: string): number {
    const card = this.cards.find(c => c.title === title);
    return card?.count || 0;
  }

 calculateTotalRevenue(): string {
  const total = this.ventas.reduce((sum, venta) => sum + Number(venta.total || 0), 0);
  return total.toLocaleString('es-ES', { minimumFractionDigits: 2 });
}


  getNewUsersCount(): number {
    // Lógica para calcular usuarios nuevos
    return Math.floor(Math.random() * 50) + 10;
  }

  getRandomGradient(): string {
    const gradients = [
      'linear-gradient(45deg, #8B4513, #D2691E)',
      'linear-gradient(45deg, #2C3E50, #34495E)',
      'linear-gradient(45deg, #3498DB, #2980B9)',
      'linear-gradient(45deg, #1ABC9C, #16A085)',
      'linear-gradient(45deg, #95A5A6, #7F8C8D)'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  }

  getRandomColor(): string {
    const colors = ['#FF6B35', '#4ECDC4', '#E056FD', '#4CAF50', '#9C27B0', '#FF9800'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getProgressWidth(count?: number): string {
  const max = Math.max(...this.cards.map(c => c.count || 0));
  const porcentaje = max > 0 ? (count ?? 0) / max * 100 : 0;
  return `${Math.max(20, porcentaje)}%`;
}

  getNotificationIconClass(from: string): string {
    return from === 'admin' ? 'admin' : 'user';
  }

  getNotificationIcon(from: string): string {
    return from === 'admin' ? 'pi pi-user-edit' : 'pi pi-user';
  }
}