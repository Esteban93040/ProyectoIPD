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
      <h1 className='home-title'>Welcome to the Home Page</h1>
      <p className='home-description'>This is the home page of our application.</p>
      <p className='home-instructions'>Please upload your CSV files to get started.</p>
    </div>
  );
};

export default Home;
