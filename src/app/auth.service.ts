import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tipoUsuarioSubject = new BehaviorSubject<string | null>(null);
  tipoUsuario$ = this.tipoUsuarioSubject.asObservable();

  login(type: string) {
    this.tipoUsuarioSubject.next(type); // Emitir el tipo de usuario
  }

  gettipoUsuario(): string | null {
    return this.tipoUsuarioSubject.getValue();
  }

  logout() {
    this.tipoUsuarioSubject.next(null); // Limpiar el tipo de usuario al cerrar sesión
    localStorage.removeItem('token'); // Limpiar el token

  }
}
