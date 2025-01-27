import { Component , OnInit  } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Array<{ label: string, url: string }> = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        // Si estamos en la página de inicio, reiniciar las migas de pan
        if (this.router.url === '/') {
          this.breadcrumbs = [{ label: 'Inicio', url: '/' }];
        } else {
          // Obtener las rutas acumuladas
          let route = this.activatedRoute.root;
          this.breadcrumbs = this.getBreadcrumbs(route);
        }
      });
  }

  // Método para acumular las migas de pan
  private getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Array<{ label: string, url: string }> = []): Array<{ label: string, url: string }> {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL) {
        url += `/${routeURL}`;
        breadcrumbs.push({ label: routeURL, url: url });
      }

      // Recursivamente agregar las rutas de los hijos
      this.getBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}