export interface Documento {
    id: number | null;
    titulo: string;
    contenido: string;
    vigente: boolean;
    fecha_vigencia: string;
    version: string;
    eliminado?: boolean;
    tipo: string;
  }
  