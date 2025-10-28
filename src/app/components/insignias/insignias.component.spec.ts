import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { InsigniasComponent } from './insignias.component';
import { InsigniaService } from '../../services/insignias.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Insignia } from '../../models/insignia.model';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // <-- importante

//Mock del servicio InsigniaService
class MockInsigniaService {
  obtenerTodas = jasmine.createSpy('obtenerTodas').and.returnValue(of([
    { id: 1, nombre: 'Fe', descripcion: 'Confianza', tipo: 'Virtud', regla: 'Asistir a misa', icono_url: 'icono.png', activa: 1 }
  ]));

  crear = jasmine.createSpy('crear').and.returnValue(of({}));
  actualizar = jasmine.createSpy('actualizar').and.returnValue(of({}));
  eliminar = jasmine.createSpy('eliminar').and.returnValue(of({}));
}

describe('InsigniasComponent', () => {
  let component: InsigniasComponent;
  let fixture: ComponentFixture<InsigniasComponent>;
  let mockService: MockInsigniaService;

  beforeEach(async () => {
    mockService = new MockInsigniaService();

    await TestBed.configureTestingModule({
      imports: [
        InsigniasComponent,
        HttpClientTestingModule // <-- esto permite inyectar HttpClient
      ],
      providers: [
        { provide: InsigniaService, useValue: mockService },
        MessageService,
        ConfirmationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InsigniasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load insignias on init', () => {
    expect(mockService.obtenerTodas).toHaveBeenCalled();
    expect(component.insignias.length).toBe(1);
  });

  it('should fill form when editing an insignia', () => {
    const ins: Insignia = {
      id: 1,
      nombre: 'Fe',
      descripcion: 'Confianza',
      tipo: 'Virtud',
      regla: 'Asistir',
      icono_url: '',
      activa: 1
    };
    component.editar(ins);
    expect(component.editando).toBeTrue();
    expect(component.formData.nombre).toBe('Fe');
    expect(component.visible).toBeTrue();
  });

  it('should call crear when saving a new insignia', () => {
    component.editando = false;
    component.formData = { nombre: 'Nueva', descripcion: 'Desc', tipo: 'Tipo', regla: 'Regla' };
    component.guardar();
    expect(mockService.crear).toHaveBeenCalled();
  });

  it('should call actualizar when editing an insignia', () => {
    component.editando = true;
    component.seleccionada = {
      id: 1,
      nombre: 'Fe',
      descripcion: '',
      tipo: '',
      regla: '',
      icono_url: '',
      activa: 1
    };
    component.formData = { nombre: 'Editada', descripcion: 'Desc', tipo: 'Tipo', regla: 'Regla' };
    component.guardar();
    expect(mockService.actualizar).toHaveBeenCalledWith(1, jasmine.any(FormData));
  });

  it('should delete insignia', () => {
    component.eliminar(1);
    expect(mockService.eliminar).toHaveBeenCalledWith(1);
  });

  it('should reset form on cancel', () => {
    component.formData = { nombre: 'A', descripcion: 'B', tipo: 'C', regla: 'D' };
    component.cancelarEdicion();
    expect(component.formData.nombre).toBe('');
    expect(component.editando).toBeFalse();
    expect(component.visible).toBeFalse();
  });
});
