import React, { useCallback, useState } from 'react';
import { Box, Button, Typography, IconButton, CircularProgress, Alert } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import type { CsvFile, CsvUploadFieldProps } from './types'; 

const CsvUploadField: React.FC<CsvUploadFieldProps> = ({
  label = "Subir archivo CSV",
  multiple = false,
  required = false,
  disabled = false,
  maxSize = 5, // 5MB por defecto
  onFilesChange,
  onError,
  value = [],
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCsvFile = (file: File): string | null => {
    // Verificar extensión
    const validExtensions = ['.csv'];
    const fileExtension = file.name.toLowerCase().substr(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      return `El archivo "${file.name}" no es un archivo CSV válido. Solo se permiten archivos .csv`;
    }

    // Verificar tipo MIME
    const validMimeTypes = ['text/csv', 'application/csv', 'text/plain'];
    if (file.type && !validMimeTypes.includes(file.type)) {
      return `El tipo de archivo "${file.type}" no es válido para CSV`;
    }

    // Verificar tamaño
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
      return `El archivo "${file.name}" es demasiado grande (${sizeInMB} MB). El tamaño máximo permitido es ${maxSize}MB.`;
    }

    return null;
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error(`Error al leer el archivo ${file.name}`));
      reader.readAsText(file, 'UTF-8');
    });
  };

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setIsProcessing(true);
      setError(null);

      try {
        const csvFiles: CsvFile[] = multiple ? [...value] : [];
        
        for (const file of Array.from(files)) {
          // Validar archivo
          const validationError = validateCsvFile(file);
          if (validationError) {
            setError(validationError);
            if (onError) onError(validationError);
            continue;
          }

          // Leer contenido del archivo
          const content = await readFileAsText(file);
          
          // Validar que no esté vacío
          if (!content.trim()) {
            const emptyError = `El archivo "${file.name}" está vacío`;
            setError(emptyError);
            if (onError) onError(emptyError);
            continue;
          }

          // Validar estructura básica de CSV (al menos una coma o punto y coma)
          const lines = content.split('\n').filter(line => line.trim());
          if (lines.length === 0 || !lines[0].includes(',') && !lines[0].includes(';')) {
            const formatError = `El archivo "${file.name}" no parece tener un formato CSV válido`;
            setError(formatError);
            if (onError) onError(formatError);
            continue;
          }

          const csvFile: CsvFile = {
            file,
            content,
            name: file.name,
            size: file.size,
          };

          if (multiple) {
            // Verificar si ya existe un archivo con el mismo nombre
            const existingIndex = csvFiles.findIndex(f => f.name === file.name);
            if (existingIndex >= 0) {
              csvFiles[existingIndex] = csvFile; // Reemplazar
            } else {
              csvFiles.push(csvFile);
            }
          } else {
            csvFiles[0] = csvFile;
          }
        }

        onFilesChange(csvFiles);
        
        // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
        event.target.value = '';
        
      } catch (error) {
        console.error('Error procesando archivos CSV:', error);
        const errorMessage = 'Error al procesar los archivos CSV. Por favor, intente nuevamente.';
        setError(errorMessage);
        if (onError) onError(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    },
    [multiple, maxSize, value, onFilesChange, onError]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const newFiles = [...value];
      newFiles.splice(index, 1);
      onFilesChange(newFiles);
      setError(null);
    },
    [value, onFilesChange]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRowCount = (content: string): number => {
    return content.split('\n').filter(line => line.trim()).length;
  };

  const totalSize = value.reduce((total, file) => total + file.size, 0);

  return (
    <Box>
      <Typography variant="body1" component="label" sx={{ mb: 1, display: 'block' }}>
        {label}
        {required && <span style={{ color: 'red' }}> *</span>}
      </Typography>
      
      <Button
        variant="outlined"
        component="label"
        startIcon={isProcessing ? <CircularProgress size={20} /> : <CloudUploadIcon />}
        sx={{ mb: 2 }}
        disabled={disabled || isProcessing}
      >
        {isProcessing 
          ? 'Procesando...' 
          : multiple 
            ? 'Seleccionar archivos CSV' 
            : 'Seleccionar archivo CSV'
        }
        <input
          type="file"
          hidden
          multiple={multiple}
          accept=".csv,text/csv,application/csv"
          onChange={handleFileChange}
        />
      </Button>

      {isProcessing && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            Procesando archivos CSV...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {value.length > 0 && (
        <Box sx={{ mt: 2 }} >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2">
              {multiple ? 'Archivos CSV cargados:' : 'Archivo CSV cargado:'}
            </Typography>
            <Typography variant="caption" color="text.secondary" >
              Tamaño total: {formatFileSize(totalSize)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {value.map((csvFile, index) => (
              <Box
                key={`${csvFile.name}-${index}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  backgroundColor: '#f9f9f9',
                }}
              >
                <DescriptionIcon sx={{ mr: 2, color: '#4caf50' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {csvFile.name}
                  </Typography>
                  <Typography variant="caption" color="success">
                    {formatFileSize(csvFile.size)} • {getRowCount(csvFile.content)} filas
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveFile(index)}
                  sx={{ ml: 1 }}
                  color="error"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Solo se permiten archivos CSV (máximo {maxSize}MB por archivo)
      </Typography>
    </Box>
  );
};

export default CsvUploadField;
