import { useState } from 'react';
import { CsvUploadField } from '../components/csv-upload';
import type { CsvFile } from '../components/csv-upload/types';
import './PageStyles.css';

export const FiveMinPage = () => {
  const [csvFiles, setCsvFiles] = useState<CsvFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCsvFilesChange = (files: CsvFile[]) => {
    setCsvFiles(files);
    console.log('Archivos CSV cargados para 5 Min:', files);
  };

  const handleError = (error: string) => {
    console.error('Error:', error);
    alert(error);
  };

  const processFiveMinAnalysis = async () => {
    if (csvFiles.length === 0) {
      alert('Por favor, selecciona al menos un archivo CSV');
      return;
    }

    setIsLoading(true);
    try {
      // Aquí harás la petición a tu API específica para 5 Min
      const response = await fetch('/api/five-min-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: csvFiles.map(file => ({
            name: file.name,
            content: file.content
          }))
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Resultado del análisis 5 Min:', result);
        alert('Análisis 5 Min completado exitosamente');
      } else {
        throw new Error('Error en el análisis 5 Min');
      }
    } catch (error) {
      console.error('Error procesando análisis 5 Min:', error);
      alert('Error al procesar el análisis 5 Min');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{ color: '#ffffff' }}>Análisis 5 Min</h1>
        <p style={{ color: '#ffffff' }}>Sube archivos CSV para realizar análisis en intervalos de 5 minutos</p>
      </div>
      
      <div className="upload-section">
        <CsvUploadField
          label="Selecciona archivos CSV para análisis 5 Min"
          multiple={true}
          required={false}
          maxSize={10}
          onFilesChange={handleCsvFilesChange}
          onError={handleError}
          value={csvFiles}
        />
        
        {csvFiles.length > 0 && (
          <div className="files-info">
            <h3>Archivos listos para análisis:</h3>
            <ul>
              {csvFiles.map((file, index) => (
                <li key={index}>
                  <strong>{file.name}</strong> - {Math.round(file.size / 1024)} KB
                  <br />
                  <small>Filas: {file.content.split('\n').filter(line => line.trim()).length}</small>
                </li>
              ))}
            </ul>
            
            <button 
              className="process-btn five-min"
              onClick={processFiveMinAnalysis}
              disabled={isLoading}
            >
              {isLoading ? 'Procesando...' : 'Iniciar Análisis 5 Min'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FiveMinPage;
