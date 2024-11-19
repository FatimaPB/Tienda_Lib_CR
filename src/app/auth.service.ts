import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tipoUsuarioSubject = new BehaviorSubject<string | null>(null);
  tipoUsuario$ = this.tipoUsuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(type: string) {
    this.tipoUsuarioSubject.next(type); // Emitir el tipo de usuario
  }

  gettipoUsuario(): string | null {
    return this.tipoUsuarioSubject.getValue();
  }

  logout() {

     // Llama al servidor para eliminar la cookie
     this.http.post('https://back-tienda-livid.vercel.app/api/logout', {}, { withCredentials: true }).subscribe(
      () => {
        console.log('Sesión cerrada en el servidor');
        this.tipoUsuarioSubject.next(null); // Limpiar el tipo de usuario
        localStorage.removeItem('token'); // Limpiar el token
      },
      (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    );
  }
}
