import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pago-pendiente',
  standalone: true,
  imports: [CardModule,ButtonModule,RouterLink],
  templateUrl: './pago-pendiente.component.html',
  styleUrl: './pago-pendiente.component.css'
})
export class PagoPendienteComponent {

}
