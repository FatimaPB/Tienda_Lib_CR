import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NoticiaEvento } from '../models/noticia-evento.model';

@Injectable({
  providedIn: 'root',
})
export class NoticiaEventoService {
  private baseUrl = 'https://api-libreria.vercel.app/api/noticias-eventos';

  constructor(private http: HttpClient) {}

  // Obtener todas las noticias y eventos
  getNoticias(): Observable<NoticiaEvento[]> {
    return this.http.get<NoticiaEvento[]>(this.baseUrl);
  }

  // Obtener una por ID
  getNoticiaById(id: number): Observable<NoticiaEvento> {
    return this.http.get<NoticiaEvento>(`${this.baseUrl}/${id}`);
  }

  // Crear una nueva noticia o evento
  createNoticia(data: FormData): Observable<NoticiaEvento> {
    return this.http.post<NoticiaEvento>(this.baseUrl, data);
  }

  // Actualizar una noticia o evento
  updateNoticia(id: number, data: FormData): Observable<NoticiaEvento> {
    return this.http.put<NoticiaEvento>(`${this.baseUrl}/${id}`, data);
  }

  // Eliminar una noticia o evento
  deleteNoticia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
