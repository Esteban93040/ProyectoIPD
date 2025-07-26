export interface CsvFile {
  file: File;
  content: string;
  name: string;
  size: number;
}

export interface CsvUploadFieldProps {
  label?: string;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean;
  maxSize?: number; // en MB
  onFilesChange: (files: CsvFile[]) => void;
  onError?: (error: string) => void;
  value?: CsvFile[];
}

export interface CsvValidationResult {
  isValid: boolean;
  error?: string;
  rowCount?: number;
  columnCount?: number;
  headers?: string[];
}
