import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  imports: [CardModule,ButtonModule, RouterLink],
  templateUrl: './pago-exitoso.component.html',
  styleUrl: './pago-exitoso.component.css'
})
export class PagoExitosoComponent {

}
