import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private rolSubject = new BehaviorSubject<string | null>(null);
  rol$ = this.rolSubject.asObservable();

  login(type: string) {
    this.rolSubject.next(type); // Emitir el tipo de usuario
  }

  gettipoUsuario(): string | null {
    return this.rolSubject.getValue();
  }

  logout() {
    this.rolSubject.next(null); // Limpiar el tipo de usuario al cerrar sesión
  }
}