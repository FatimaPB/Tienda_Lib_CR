// categoria.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tamano } from '../models/tamano.model'; // Importamos el modelo

@Injectable({
  providedIn: 'root',
})
export class TamanoService {
  private apiUrl = 'https://tienda-lib-cr.vercel.app/api/tamanos';

  constructor(private http: HttpClient) {}

  // Obtener todas las categorías
  cargarTamanos(): Observable<Tamano[]> {
    return this.http.get<Tamano[]>(this.apiUrl);
  }

  // Crear una nueva categoría
  crearTamano(tamano: Tamano): Observable<Tamano> {
    return this.http.post<Tamano>(this.apiUrl, tamano);
  }

  // Actualizar una categoría
  actualizarTamano(id: number, tamano: Tamano): Observable<Tamano> {
    return this.http.put<Tamano>(`${this.apiUrl}/${id}`, tamano);
  }

  // Eliminar una categoría
  eliminarTamano(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
