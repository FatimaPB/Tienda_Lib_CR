// src/app/services/comentario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comentario } from '../models/comentario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private baseUrl = 'https://back-tienda-one.vercel.app/api';

  constructor(private http: HttpClient) {}

obtenerComentarios(producto_id: number, variante_id: number | null): Observable<Comentario[]> {
  const params: any = { producto_id };
  if (variante_id !== null) {
    params.variante_id = variante_id;
  }

  return this.http.get<Comentario[]>(`${this.baseUrl}/comentarios`, { params });
}


puedeComentar(producto_id: number, variante_id: number | null): Observable<{ permitido: boolean }> {
  const url = `https://back-tienda-one.vercel.app/api/puede-comentar?producto_id=${producto_id}&variante_id=${variante_id ?? ''}`;
  return this.http.get<{ permitido: boolean }>(url, { withCredentials: true });
}

crear(comentario: Comentario): Observable<any> {
  const url = `https://back-tienda-one.vercel.app/api/comentario`;
  return this.http.post(url, comentario, { withCredentials: true });
}

}
