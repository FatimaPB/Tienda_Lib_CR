import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthGuard,
        { provide: Router, useValue: spy },
      ],
    });

    authGuard = TestBed.inject(AuthGuard);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería permitir la activación si está autenticado', (done) => {
    authGuard.canActivate().subscribe(result => {
      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
      done();
    });

    const req = httpMock.expectOne('https://api-libreria.vercel.app/api/check-auth');
    req.flush({ authenticated: true });
  });

  it('debería redirigir al login si no está autenticado', (done) => {
    authGuard.canActivate().subscribe(result => {
      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });

    const req = httpMock.expectOne('https://api-libreria.vercel.app/api/check-auth');
    req.flush({ authenticated: false });
  });

  it('debería redirigir al login si la petición HTTP falla', (done) => {
    authGuard.canActivate().subscribe(result => {
      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });

    const req = httpMock.expectOne('https://api-libreria.vercel.app/api/check-auth');
    req.error(new ErrorEvent('Error de red'));
  });
});
