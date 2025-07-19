import { Component, OnInit,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

export interface Empresa {
  mision?: string;
  vision?: string;
  valores?: string;

}

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [MatProgressSpinner,CommonModule],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Agrega esto
})
export class NosotrosComponent implements OnInit {
  empresaData: Empresa | null = null;
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getEmpresasData();
  }

  getEmpresasData(): void {
    this.http.get<Empresa>('https://api-libreria.vercel.app/api/nosotros').subscribe({
      next: (response) => {
        this.empresaData = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener los datos de la empresa', err);
        this.loading = false;
      }
    });
  }
}