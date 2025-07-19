// src/app/services/empresa.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Empresa } from '../models/empresa.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private apiUrl = 'https://api-libreria.vercel.app/api/datos';

  constructor(private http: HttpClient) {}

  obtenerDatosEmpresa(): Observable<Empresa> {
    return this.http.get<Empresa>(this.apiUrl);
  }
}
