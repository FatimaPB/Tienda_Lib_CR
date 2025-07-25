import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { trigger, style, transition, animate } from '@angular/animations';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


import { Router } from '@angular/router';

interface Empresa {
  direccion?: string;
  telefono?: string;
  correo_electronico?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
}


@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MatCardModule,MatIconModule,MatChipsModule,MatFormFieldModule,
    MatProgressBarModule,MatTooltipModule,MatInputModule,MatProgressSpinner
  ],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
  animations: [
      trigger('fadeIn', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ])
    ]
})
export class ContactoComponent {
 loading = true;
  empresaData: Empresa | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getEmpresasData();
  }

  getEmpresasData(): void {
    this.http.get<Empresa>('https://api-libreria.vercel.app/api/datos').pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Error al obtener los datos de empresa', err);
        this.loading = false;

        if (err.status === 400) this.router.navigate(['/error400']);
        else if (err.status === 404) this.router.navigate(['/error404']);
        else this.router.navigate(['/error500']);

        return throwError(() => new Error('Error en la solicitud'));
      })
    ).subscribe({
      next: (response) => {
        this.empresaData = response;
        this.loading = false;
      }
    });
  }
}