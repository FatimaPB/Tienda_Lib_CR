// categoria.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model'; // Importamos el modelo

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private apiUrl = 'https://api-libreria.vercel.app/api/categorias';

  constructor(private http: HttpClient) { }

  // Obtener todas las categorías
  cargarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  // Crear una nueva categoría
  crearCategoriaConImagen(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }


  // Actualizar una categoría
  actualizarCategoriaConImagen(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  // Eliminar una categoría
  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
