import { TestBed } from '@angular/core/testing';
import { CanActivate, Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Crear un espía para el Router
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: spy } // Inyectar el espía en lugar del Router real
      ],
    });

    authGuard = TestBed.inject(AuthGuard); // Inyectar el guardia
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>; // Inyectar el espía del Router
  });

  it('should allow activation if token exists in cookies', () => {
    const result = authGuard.canActivate(); // Llamar al método canActivate
    expect(result).toBeTrue(); // Esperar que se permita la activación
  });

  it('should redirect to login if token does not exist in cookies', () => {
    const result = authGuard.canActivate(); // Llamar al método canActivate
    expect(result).toBeFalse(); // Esperar que no se permita la activación
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']); // Verificar que redirige al login
  });
});