import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PreguntaFrecuente } from '../models/pregunta.model';

@Injectable({
  providedIn: 'root',
})
export class PreguntaFrecuenteService {
  private apiUrl = 'https://api-libreria.vercel.app/api/preguntas';

  constructor(private http: HttpClient) {}

  cargarPreguntas(): Observable<PreguntaFrecuente[]> {
    return this.http.get<PreguntaFrecuente[]>(this.apiUrl);
  }

  crearPregunta(pregunta: PreguntaFrecuente): Observable<PreguntaFrecuente> {
    return this.http.post<PreguntaFrecuente>(this.apiUrl, pregunta);
  }

  actualizarPregunta(id: number, pregunta: PreguntaFrecuente): Observable<PreguntaFrecuente> {
    return this.http.put<PreguntaFrecuente>(`${this.apiUrl}/${id}`, pregunta);
  }

  eliminarPregunta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
