import { useState } from 'react';
import { CsvUploadField } from '../components/csv-upload';
import { FileProcessingSection, type DateRange } from '../components/file-processing';
import type { CsvFile } from '../components/csv-upload/types';
import './PageStyles.css';

export const SentimentalPage = () => {
  const [csvFiles, setCsvFiles] = useState<CsvFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCsvFilesChange = (files: CsvFile[]) => {
    setCsvFiles(files);
    console.log('Archivos CSV cargados para Análisis Sentimental:', files);
  };

  const handleError = (error: string) => {
    console.error('Error:', error);
    alert(error);
  };

  const processSentimentalAnalysis = async (dateRange?: DateRange) => {
    if (csvFiles.length === 0) {
      alert('Por favor, selecciona al menos un archivo CSV');
      return;
    }

    setIsLoading(true);
    try {
      // Aquí harás la petición a tu API específica para análisis sentimental
      const response = await fetch('/api/sentimental-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: csvFiles.map(file => ({
            name: file.name,
            content: file.content
          })),
          dateRange: dateRange
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Resultado del análisis sentimental:', result);
        if (dateRange && (dateRange.startDate || dateRange.endDate)) {
          console.log('Filtros de fecha aplicados:', dateRange);
        }
        alert('Análisis sentimental completado exitosamente');
      } else {
        throw new Error('Error en el análisis sentimental');
      }
    } catch (error) {
      console.error('Error procesando análisis sentimental:', error);
      alert('Error al procesar el análisis sentimental');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 style={{ color: '#ffffff' }}>Análisis Sentimental</h1>
        <p style={{ color: '#ffffff' }}>Sube archivos CSV para realizar análisis de sentimientos</p>
      </div>
      
      <div className="upload-section">
        <CsvUploadField
          label="Selecciona archivos CSV para análisis sentimental"
          multiple={true}
          required={false}
          maxSize={10}
          onFilesChange={handleCsvFilesChange}
          onError={handleError}
          value={csvFiles}
        />
        
        <FileProcessingSection
          csvFiles={csvFiles}
          isLoading={isLoading}
          onProcess={processSentimentalAnalysis}
          buttonText="Iniciar Análisis Sentimental"
          buttonClassName="process-btn sentimental"
          title="Archivos listos para análisis:"
          showDateFilter={true}
        />
      </div>
    </div>
  );
};

export default SentimentalPage;
