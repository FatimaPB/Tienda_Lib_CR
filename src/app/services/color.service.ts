// categoria.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Color } from '../models/color.model'; // Importamos el modelo

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private apiUrl = 'https://back-tienda-one.vercel.app//api/colores';

  constructor(private http: HttpClient) {}

  // Obtener todas las categorías
  cargarColores(): Observable<Color[]> {
    return this.http.get<Color[]>(this.apiUrl);
  }

  // Crear una nueva categoría
  crearColor(color: Color): Observable<Color> {
    return this.http.post<Color>(this.apiUrl, color);
  }

  // Actualizar una categoría
  actualizarColor(id: number, color: Color): Observable<Color> {
    return this.http.put<Color>(`${this.apiUrl}/${id}`, color);
  }

  // Eliminar una categoría
  eliminarColor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
