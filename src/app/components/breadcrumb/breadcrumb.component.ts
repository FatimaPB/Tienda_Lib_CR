import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, Event } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit {
  items: MenuItem[] = [];
  visitedRoutes: MenuItem[] = []; // Almacena las rutas visitadas

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/') {
          this.visitedRoutes = []; // Vaciar rutas visitadas si se regresa a inicio
          this.updateBreadcrumbs(event.url);
        } else {
          this.updateBreadcrumbs(event.url);
        }
      });
  }

  private updateBreadcrumbs(currentUrl: string) {
    const currentBreadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);

    // Si la ruta ya está en la lista, eliminar las que estén después de ella
    const existingIndex = this.visitedRoutes.findIndex(v => v.routerLink === currentUrl);
    if (existingIndex !== -1) {
      this.visitedRoutes = this.visitedRoutes.slice(0, existingIndex + 1);
    } else {
      // Agregar solo las rutas que no estén ya en el historial
      currentBreadcrumbs.forEach(item => {
        if (!this.visitedRoutes.some(v => v.routerLink === item.routerLink)) {
          this.visitedRoutes.push(item);
        }
      });
    }

    this.items = [...this.visitedRoutes]; // Mostrar las rutas acumuladas
  }


private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: MenuItem[] = []): MenuItem[] {
  if (route.routeConfig?.data?.['breadcrumb']) {
    let path = route.routeConfig.path || '';

    Object.keys(route.snapshot.params).forEach(paramKey => {
      let paramValue = route.snapshot.params[paramKey];

      // Aquí asumimos que varianteId siempre existe porque es obligatorio
      path = path.replace(`:${paramKey}`, paramValue);
    });

    path = path.replace(/\/+/g, '/');

    const newUrl = url ? `${url}/${path}` : `/${path}`;

    let label = route.routeConfig.data['breadcrumb'];

    if (route.snapshot.paramMap.has(label)) {
      if (label === 'id') {
        const id = route.snapshot.paramMap.get('id');
        const varianteId = route.snapshot.paramMap.get('varianteId');
        label = varianteId && varianteId !== 'null' ? `detalle ${id} / ${varianteId}` : `detalle ${id}`;
      } else {
        label = route.snapshot.paramMap.get(label) || label;
      }
    }

    breadcrumbs.push({ label, routerLink: newUrl });
    url = newUrl;
  }

  for (const child of route.children) {
    this.createBreadcrumbs(child, url, breadcrumbs);
  }

  return breadcrumbs;
}


}