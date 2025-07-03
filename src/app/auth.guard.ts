// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private http: HttpClient) {}
  private apiUrl = 'https://api-libreria.vercel.app/api';
 /* canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true; // Permite el acceso
    }
    this.router.navigate(['/login']); // Redirige al login si no hay token
    return false; // Bloquea el acceso
  }
    */
  canActivate(): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/check-auth`, { withCredentials: true })
      .pipe(
        map(response => {
          if (response.authenticated) {
            return true;
          } else {
            this.router.navigate(['/login']);
            return false;
          }
        }),
        catchError(() => {
          this.router.navigate(['/login']);
          return of(false);
        })
      );
  }
}
