import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Oracion } from '../models/oracion.model'; // Asegúrate de que la ruta al modelo sea correcta

@Injectable({
  providedIn: 'root',
})
export class OracionService {
  private apiUrl = 'https://api-libreria.vercel.app/api/oracion'; // Asegúrate que este sea el endpoint correcto

  constructor(private http: HttpClient) {}

  cargarOraciones(): Observable<Oracion[]> {
    return this.http.get<Oracion[]>(this.apiUrl);
  }

  crearOracion(oracion: Oracion): Observable<Oracion> {
    return this.http.post<Oracion>(this.apiUrl, oracion);
  }

  actualizarOracion(id: number, oracion: Oracion): Observable<Oracion> {
    return this.http.put<Oracion>(`${this.apiUrl}/${id}`, oracion);
  }

  eliminarOracion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
