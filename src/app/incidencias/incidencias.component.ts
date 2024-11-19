import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Usuario {
  _id: number;
  nombre: string;
  correo: string;
  failedAttempts: number;
  isBlocked: boolean;
  blockedUntil: Date | null;
}
interface Actividad {
  _id: string;
  usuarioId: string;
  tipo: string;
  ip: string;
  detalles: string;
  fecha: Date;
}

@Component({
  selector: 'app-incidencias',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './incidencias.component.html',
  styleUrls: ['./incidencias.component.css']
})
export class IncidenciasComponent implements OnInit {
  actividades: Actividad[] = [];
  usuarios: Usuario[] = [];
  usuariosBloqueados: Usuario[] = [];
  usuariosBloqueadosmes: Usuario[] = [];
  usuariosBloqueadossemana: Usuario[] = [];
  nVeces: number = 3; // Cambia según tu requerimiento

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarUsuarios(); // Cargar usuarios al inicializar el componente
    this.obtenerActividades();
    this.obtenerUsuariosBloqueados(); // Cargar usuarios bloqueados
    this.obtenerUsuariosBloqueadosmes();
    this.obtenerUsuariosBloqueadossemana();
  }

  obtenerActividades(): void {
    this.http.get<Actividad[]>('https://back-tienda-livid.vercel.app/api/actividad')

      .subscribe((data) => {
        this.actividades = data;
      }, (error) => {
        console.error('Error al cargar las actividades:', error);
      });
  }
  

// Método para cargar usuarios desde la API
cargarUsuarios(): void {
  this.http.get<Usuario[]>('https://back-tienda-livid.vercel.app/api/usuarios') // Cambia la URL según tu API
    .subscribe((data) => {
      // Filtra los usuarios para obtener solo aquellos que no están bloqueados
      this.usuarios = data.filter(usuario => !usuario.isBlocked);
    }, (error) => {
      console.error('Error al cargar usuarios:', error);
    });
}


  // Método para bloquear un usuario si cumple con las condiciones
  bloquearUsuario(usuario: Usuario): void {
    if (usuario.failedAttempts >= this.nVeces && !usuario.isBlocked) {
      usuario.isBlocked = true;
      usuario.blockedUntil = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // Bloqueo de 24 horas
      this.usuariosBloqueados.push(usuario); // Agregar a usuarios bloqueados
      console.log(`Usuario ${usuario.nombre} bloqueado por haber excedido ${this.nVeces} intentos.`);
    }
  }

  // Método para obtener los usuarios bloqueados desde el servidor
  obtenerUsuariosBloqueados(): void {
    this.http.get<Usuario[]>('https://back-tienda-livid.vercel.app/api/usuarios-bloqueados?periodo=dia') // Cambia la URL según tu API
      .subscribe((data) => {
        this.usuariosBloqueados = data;
      }, (error) => {
        console.error('Error al cargar usuarios bloqueados:', error);
      });
  }

    // Método para obtener los usuarios bloqueados desde el servidor
    obtenerUsuariosBloqueadosmes(): void {
      this.http.get<Usuario[]>('https://back-tienda-livid.vercel.app/api/usuarios-bloqueados?periodo=mes') // Cambia la URL según tu API
        .subscribe((data) => {
          this.usuariosBloqueados = data;
        }, (error) => {
          console.error('Error al cargar usuarios bloqueados:', error);
        });
    }

        // Método para obtener los usuarios bloqueados desde el servidor
        obtenerUsuariosBloqueadossemana(): void {
          this.http.get<Usuario[]>('https://back-tienda-livid.vercel.app/api/usuarios-bloqueados?periodo=semana') // Cambia la URL según tu API
            .subscribe((data) => {
              this.usuariosBloqueados = data;
            }, (error) => {
              console.error('Error al cargar usuarios bloqueados:', error);
            });
        }

// Método para bloquear un usuario desde la lista de usuarios
bloquearUsuarioDesdeLista(usuario: Usuario): void {
  // Usa _id en lugar de id
  const userId = usuario._id; // Accede a la propiedad _id

  // Verifica que el ID del usuario no sea undefined
  if (!userId) {
      console.error('El ID del usuario es indefinido.');
      return; // Detiene la ejecución si no hay un ID válido
  }

  // Llama a la API para bloquear al usuario
  this.http.put(`https://back-tienda-livid.vercel.app/api/usuarios/bloquear/${userId}`, {})
    .subscribe((response) => {
      console.log(response);
      usuario.isBlocked = true; // Actualiza el estado localmente
      usuario.blockedUntil = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // Bloqueo de 24 horas
      this.usuariosBloqueados.push(usuario); // Agregar a usuarios bloqueados
    }, (error) => {
      console.error('Error al bloquear el usuario:', error);
    });
}

intentosLimite: number = 5; // Valor por defecto
mensajeError: string | null = null;
mensajeExito: string | null = null;

async guardarConfiguracionBloqueo() {
  if (this.intentosLimite < 1) {
      this.mensajeError = 'El número de intentos debe ser al menos 1.';
      this.mensajeExito = null;
      return;
  }

  try {
      const response = await fetch('https://back-tienda-livid.vercel.app/api/limite-intentos', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ maxFailedAttempts: this.intentosLimite }),
      });

      if (!response.ok) {
          throw new Error('Error al guardar la configuración.');
      }

      const data = await response.json();
      console.log('Configuración guardada con éxito:', data);
      this.mensajeExito = 'Configuración guardada con éxito.';
      this.mensajeError = null;
  } catch (error) {
      console.error('Error al guardar la configuración:', error);
      this.mensajeError = 'Error al guardar la configuración.';
      this.mensajeExito = null;
  }
}


}
