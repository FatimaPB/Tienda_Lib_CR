import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InsigniaService } from './insignias.service';
import { Insignia } from '../models/insignia.model';

describe('InsigniaService', () => {
  let service: InsigniaService;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://api-libreria.vercel.app/api/insignias';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InsigniaService]
    });

    service = TestBed.inject(InsigniaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden peticiones pendientes
  });

  it('debería obtener todas las insignias (GET)', () => {
    const mockData: Insignia[] = [
      { id: 1, nombre: 'Fe', descripcion: 'Confianza', tipo: 'Virtud', regla: 'Asistir', icono_url: '', activa: 1 },
      { id: 2, nombre: 'Esperanza', descripcion: 'Motivación', tipo: 'Valor', regla: 'Orar', icono_url: '', activa: 1 }
    ];

    service.obtenerTodas().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener una insignia por ID (GET)', () => {
    const mockInsignia: Insignia = {
      id: 1,
      nombre: 'Fe',
      descripcion: 'Confianza',
      tipo: 'Virtud',
      regla: 'Asistir',
      icono_url: '',
      activa: 1
    };

    service.obtenerPorId(1).subscribe(data => {
      expect(data).toEqual(mockInsignia);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockInsignia);
  });

  it('debería crear una insignia (POST)', () => {
    const formData = new FormData();
    formData.append('nombre', 'Caridad');

    const mockResponse = { message: 'Insignia creada' };

    service.crear(formData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('debería actualizar una insignia (PUT)', () => {
    const formData = new FormData();
    formData.append('nombre', 'Actualizada');

    const mockResponse = { message: 'Insignia actualizada' };

    service.actualizar(1, formData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('debería eliminar una insignia (DELETE)', () => {
    const mockResponse = { message: 'Insignia eliminada' };

    service.eliminar(1).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
