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

@Component({
  selector: 'app-incidencias',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './incidencias.component.html',
  styleUrls: ['./incidencias.component.css']
})
export class IncidenciasComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosBloqueados: Usuario[] = [];
  usuariosBloqueadosmes: Usuario[] = [];
  usuariosBloqueadossemana: Usuario[] = [];
  nVeces: number = 3; // Cambia según tu requerimiento

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarUsuarios(); // Cargar usuarios al inicializar el componente
    this.obtenerUsuariosBloqueados(); // Cargar usuarios bloqueados
    this.obtenerUsuariosBloqueadosmes();
    this.obtenerUsuariosBloqueadossemana();
  }

// Método para cargar usuarios desde la API
cargarUsuarios(): void {
  this.http.get<Usuario[]>('https://back-tienda-three.vercel.app/api/usuarios') // Cambia la URL según tu API
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
    this.http.get<Usuario[]>('https://back-tienda-three.vercel.app/api/usuarios-bloqueados?periodo=dia') // Cambia la URL según tu API
      .subscribe((data) => {
        this.usuariosBloqueados = data;
      }, (error) => {
        console.error('Error al cargar usuarios bloqueados:', error);
      });
  }

    // Método para obtener los usuarios bloqueados desde el servidor
    obtenerUsuariosBloqueadosmes(): void {
      this.http.get<Usuario[]>('https://back-tienda-three.vercel.app/api/usuarios-bloqueados?periodo=mes') // Cambia la URL según tu API
        .subscribe((data) => {
          this.usuariosBloqueados = data;
        }, (error) => {
          console.error('Error al cargar usuarios bloqueados:', error);
        });
    }

        // Método para obtener los usuarios bloqueados desde el servidor
        obtenerUsuariosBloqueadossemana(): void {
          this.http.get<Usuario[]>('https://back-tienda-three.vercel.app/api/usuarios-bloqueados?periodo=semana') // Cambia la URL según tu API
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
  this.http.put(`https://back-tienda-three.vercel.app/api/usuarios/bloquear/${userId}`, {})
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

guardarConfiguracionBloqueo() {
    if (this.intentosLimite < 1) {
        this.mensajeError = 'El número de intentos debe ser al menos 1.';
        this.mensajeExito = null;
        return;
    }

    this.http.post('https://back-tienda-three.vercel.app/api/configurar-intentos', { intentosLimite: this.intentosLimite })
      .subscribe(
        () => {
            this.mensajeExito = 'Configuración guardada con éxito.';
            this.mensajeError = null;
        },
        (error) => {
            this.mensajeError = 'Error al guardar la configuración.';
            this.mensajeExito = null;
        }
    );
}

}
