
export interface Banner {
    id?: number;
    titulo: string;
    descripcion: string;
    imagen_principal: File | null;
    imagen_secundaria?: File | null;
    imagen_terciaria?: File | null;
  }
  