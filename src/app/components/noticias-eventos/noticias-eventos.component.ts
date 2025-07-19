import { Component, OnInit } from '@angular/core';
import { NoticiaEvento } from '../../models/noticia-evento.model';
import { NoticiaEventoService } from '../../services/noticia-evento.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-noticias-eventos',
  standalone: true,
  imports: [CommonModule,FormsModule,DropdownModule,ToastModule,TableModule,InputTextModule,MatProgressSpinner],
  templateUrl: './noticias-eventos.component.html',
  styleUrl: './noticias-eventos.component.css'
})
export class NoticiasEventosComponent  implements OnInit {
  noticiasOriginal: NoticiaEvento[] = [];
  noticiasFiltradas: NoticiaEvento[] = [];
  loading: boolean = true;
fechaMinima: string = '';


filtros: {
  tipo: {
    [key: string]: boolean;
  };
} = {
  tipo: {
    noticia: false,
    evento: false
  }
};

  constructor(private noticiaService: NoticiaEventoService) {}

  ngOnInit(): void {
    this.cargarNoticias();
  }

  cargarNoticias(): void {
    this.loading = true;
    this.noticiaService.getNoticias().subscribe({
      next: (data) => {
        this.noticiasOriginal = data;
        this.aplicarFiltros(); // Aplica filtros iniciales
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

 aplicarFiltros(): void {
  const tiposSeleccionados = Object.keys(this.filtros.tipo).filter(t => this.filtros.tipo[t]);

  if (tiposSeleccionados.length === 0) {
    // Si no hay ningún tipo seleccionado, mostrar TODO
    this.noticiasFiltradas = [...this.noticiasOriginal];
  } else {
    // Filtrar por tipos seleccionados
    this.noticiasFiltradas = this.noticiasOriginal.filter(n => tiposSeleccionados.includes(n.tipo));
  }
}

resetearFiltros(): void {
  this.filtros.tipo = {
    noticia: false,
    evento: false
  };
  this.aplicarFiltros();
}
}