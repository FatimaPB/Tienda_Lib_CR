




import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService,ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';


export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  rol: string;
  verificado: boolean;
  bloqueado: boolean;
  creado_en: string;
}

@Component({
  selector: 'app-gestionusuarios',
  standalone: true,
  imports: [CommonModule, TableModule, ToastModule, RippleModule, ConfirmDialogModule],
  templateUrl: './gestionusuarios.component.html',
  styleUrl: './gestionusuarios.component.css',
providers: [MessageService, ConfirmationService] // 👈 Asegúrate de que esté esto
})
export class GestionusuariosComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.http.get<Usuario[]>('https://api-libreria.vercel.app/api/usuarios')
      .subscribe({
        next: (data) => {
          this.usuarios = data;
        },
        error: (err) => {
          console.error('Error al obtener usuarios:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios' });
        }
      });
  }
}
