import { useState } from 'react';
import { CsvUploadField } from '../components/csv-upload';
import type { CsvFile } from '../components/csv-upload/types';
import './Home.css';

export const Home = () => {
  const [csvFiles, setCsvFiles] = useState<CsvFile[]>([]);

  const handleCsvFilesChange = (files: CsvFile[]) => {
    setCsvFiles(files);
    console.log('Archivos CSV cargados:', files);
    
    // Aquí puedes procesar los archivos CSV
    files.forEach(file => {
      console.log(`Archivo: ${file.name}`);
      console.log(`Tamaño: ${file.size} bytes`);
      console.log(`Primeras líneas:`, file.content.split('\n').slice(0, 5));
    });
  };

  const handleError = (error: string) => {
    console.error('Error:', error);
    alert(error);
  };

  return (
    <div className="home">
      <div style={{ marginTop: '2rem', maxWidth: '600px', margin: '2rem auto' }}>
        <h2>Subir archivos CSV</h2>
        <CsvUploadField
          label="Selecciona archivos CSV para procesar"
          multiple={true}
          required={false}
          maxSize={10} // 10MB máximo
          onFilesChange={handleCsvFilesChange}
          onError={handleError}
          value={csvFiles}
        />
        
        {csvFiles.length > 0 && (
          <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h3>Archivos cargados:</h3>
            <ul>
              {csvFiles.map((file, index) => (
                <li key={index}>
                  <strong>{file.name}</strong> - {Math.round(file.size / 1024)} KB
                  <br />
                  <small>Filas: {file.content.split('\n').filter(line => line.trim()).length}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
