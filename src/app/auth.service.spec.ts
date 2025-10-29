import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería retornar null inicialmente', () => {
    expect(service.gettipoUsuario()).toBeNull();
  });

  it('debería asignar tipoUsuario al hacer login', () => {
    service.login('admin');
    expect(service.gettipoUsuario()).toBe('admin');
  });

  it('debería limpiar tipoUsuario al hacer logout', () => {
    service.login('user');
    expect(service.gettipoUsuario()).toBe('user');

    service.logout();
    expect(service.gettipoUsuario()).toBeNull();
  });

  it('el observable rol$ debería emitir nuevos valores al hacer login y logout', () => {
    const emittedValues: (string | null)[] = [];
    service.rol$.subscribe(value => emittedValues.push(value));

    service.login('admin'); // primer valor emitido
    service.logout();       // segundo valor emitido

    expect(emittedValues).toEqual([null, 'admin', null]);
  });

});
