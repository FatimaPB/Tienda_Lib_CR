import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PerfilusuarioComponent } from './perfilusuario.component';
import { MessageService } from 'primeng/api';

describe('PerfilusuarioComponent - insignias', () => {
  let component: PerfilusuarioComponent;
  let fixture: ComponentFixture<PerfilusuarioComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PerfilusuarioComponent],
      providers: [MessageService]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilusuarioComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Simular peticiones automáticas al iniciar (check-auth y perfil)
    fixture.detectChanges();
    httpMock.expectOne('https://api-libreria.vercel.app/api/check-auth').flush({ authenticated: false });
    httpMock.expectOne('https://api-libreria.vercel.app/api/perfil').flush({});
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('no debería obtener insignias si no hay usuarioId', () => {
    component.usuarioId = null;
    component.obtenerInsignias();
    // No debería hacer ninguna llamada HTTP
    httpMock.verify();
  });

  it('debería obtener insignias y verificar insignia nueva', () => {
    component.usuarioId = 1;

    const mockInsignias = [
      { id: 1, nombre: 'Primera compra' },
      { id: 2, nombre: 'Cliente frecuente' }
    ];

    component.obtenerInsignias();

    const req = httpMock.expectOne('https://api-libreria.vercel.app/api/user-insignias');
    req.flush({ insignias: mockInsignias });

    expect(component.insignias.length).toBe(2);
  });

  it('debería mostrar animación si hay insignia nueva', fakeAsync(() => {
    const insignia = { id: 3, nombre: 'Super cliente' };
    localStorage.removeItem('ultimaInsigniaVista');

    component.mostrarAnimacionInsignia(insignia);

    expect(component.mostrarNotificacionInsignia).toBeTrue();

    tick(5000);  // simula los 5 segundos del timeout
    flush();     // limpia temporizadores pendientes

    expect(component.mostrarNotificacionInsignia).toBeFalse();
  }));


  it('no debería mostrar animación si no hay insignias nuevas', () => {
    component.insignias = [];
    spyOn(component, 'mostrarAnimacionInsignia');
    component.verificarInsigniaNueva();
    expect(component.mostrarAnimacionInsignia).not.toHaveBeenCalled();
  });

  it('debería cerrar manualmente la notificación', () => {
    component.mostrarNotificacionInsignia = true;
    component.cerrarNotificacion();

    expect(component.mostrarNotificacionInsignia).toBeFalse();
    // No debe fallar ni quedar con datos activos
  });
});
