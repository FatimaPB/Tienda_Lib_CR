import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InsigniasComponent } from './insignias.component';
import { InsigniaService } from '../../services/insignias.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Insignia } from '../../models/insignia.model';

// Helper para crear insignias de prueba
const crearInsignia = (id: number, nombre: string): Insignia => ({
  id,
  nombre,
  descripcion: '',
  tipo: '',
  regla: '',
  icono_url: '',
  activa: 1
});

describe('Integración: InsigniasComponent + InsigniaService', () => {
  let fixture: ComponentFixture<InsigniasComponent>;
  let component: InsigniasComponent;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://api-libreria.vercel.app/api/insignias';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsigniasComponent, HttpClientTestingModule],
      providers: [InsigniaService, MessageService, ConfirmationService]
    }).compileComponents();

    fixture = TestBed.createComponent(InsigniasComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  // Helper para disparar ngOnInit y resolver GET inicial
  const inicializarComponente = (insignias: Insignia[]) => {
    fixture.detectChanges(); // ngOnInit()
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(insignias);
  };

  it('debería cargar las insignias desde el servicio', () => {
    const mockInsignias = [crearInsignia(1, 'Fe')];
    inicializarComponente(mockInsignias);

    expect(component.insignias.length).toBe(1);
    expect(component.insignias[0].nombre).toBe('Fe');
  });

  it('debería crear una insignia mediante el servicio', () => {
    const mockInsignias = [crearInsignia(1, 'Fe')];
    inicializarComponente(mockInsignias);

    component.formData = { nombre: 'Caridad', descripcion: '', tipo: '', regla: '' };
    component.guardar();

    const reqPost = httpMock.expectOne(apiUrl);
    expect(reqPost.request.method).toBe('POST');
    reqPost.flush({ message: 'Insignia creada' });

    const reqReload = httpMock.expectOne(apiUrl);
    reqReload.flush([...mockInsignias, crearInsignia(2, 'Caridad')]);

    expect(component.insignias.length).toBe(2);
    expect(component.insignias[1].nombre).toBe('Caridad');
    expect(component.editando).toBeFalse();
  });

  it('debería actualizar una insignia existente', () => {
    const mockInsignias = [crearInsignia(1, 'Fe')];
    inicializarComponente(mockInsignias);

    component.editando = true;
    component.seleccionada = mockInsignias[0];
    component.formData = { nombre: 'Fe Editada', descripcion: '', tipo: '', regla: '' };
    component.guardar();

    const reqPut = httpMock.expectOne(`${apiUrl}/1`);
    expect(reqPut.request.method).toBe('PUT');
    reqPut.flush({ message: 'Insignia actualizada' });

    const reqReload = httpMock.expectOne(apiUrl);
    reqReload.flush([crearInsignia(1, 'Fe Editada')]);

    expect(component.insignias[0].nombre).toBe('Fe Editada');
  });

  it('debería eliminar una insignia', () => {
    const mockInsignias = [crearInsignia(1, 'Fe'), crearInsignia(2, 'Caridad')];
    inicializarComponente(mockInsignias);

    component.eliminar(2);

    const reqDelete = httpMock.expectOne(`${apiUrl}/2`);
    expect(reqDelete.request.method).toBe('DELETE');
    reqDelete.flush({ message: 'Insignia eliminada' });

    const reqReload = httpMock.expectOne(apiUrl);
    reqReload.flush([crearInsignia(1, 'Fe')]);

    expect(component.insignias.length).toBe(1);
    expect(component.insignias[0].nombre).toBe('Fe');
  });
});
