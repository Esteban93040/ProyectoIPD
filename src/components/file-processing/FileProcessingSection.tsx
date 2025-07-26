import { useState } from 'react';
import { Box, TextField, Typography, Divider } from '@mui/material';
import type { CsvFile } from '../csv-upload/types';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface FileProcessingSectionProps {
  csvFiles: CsvFile[];
  isLoading: boolean;
  onProcess: (dateRange?: DateRange) => void;
  buttonText: string;
  loadingText?: string;
  buttonClassName?: string;
  title?: string;
  showDateFilter?: boolean;
}

const FileProcessingSection: React.FC<FileProcessingSectionProps> = ({
  csvFiles,
  isLoading,
  onProcess,
  buttonText,
  loadingText = 'Procesando...',
  buttonClassName = 'process-btn',
  title = 'Archivos listos para análisis:',
  showDateFilter = false
}) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  if (csvFiles.length === 0) {
    return null;
  }

  const handleProcess = () => {
    const dateRange: DateRange | undefined = showDateFilter && (startDate || endDate) ? {
      startDate,
      endDate
    } : undefined;
    
    onProcess(dateRange);
  };

  const isDateRangeValid = () => {
    if (!showDateFilter) return true;
    if (!startDate && !endDate) return true;
    if (startDate && endDate) {
      return new Date(startDate) <= new Date(endDate);
    }
    return true;
  };

  return (
    <div className="files-info">
      <h3 className="files-title">{title}</h3>
      <ul className="files-list">
        {csvFiles.map((file, index) => (
          <li key={index} className="file-item">
            <strong className="file-name">{file.name}</strong> - {Math.round(file.size / 1024)} KB
            <br />
            <small className="file-details">
              Filas: {file.content.split('\n').filter(line => line.trim()).length}
            </small>
          </li>
        ))}
      </ul>

      {showDateFilter && (
        <>
          <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#ffffff' }}>
              Filtrar por rango de fechas :
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Fecha inicio"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                  style: { color: '#ffffff' }
                }}
                InputProps={{
                  style: { color: '#ffffff' }
                }}
                sx={{
                  flex: 1,
                  minWidth: '150px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ffffff',
                    },
                  },
                }}
                size="small"
              />
              <TextField
                label="Fecha fin"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                  style: { color: '#ffffff' }
                }}
                InputProps={{
                  style: { color: '#ffffff' }
                }}
                sx={{
                  flex: 1,
                  minWidth: '150px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ffffff',
                    },
                  },
                }}
                size="small"
              />
            </Box>
            {!isDateRangeValid() && (
              <Typography 
                variant="caption" 
                sx={{ color: '#ff6b6b', mt: 1, display: 'block' }}
              >
                La fecha de inicio debe ser anterior o igual a la fecha de fin
              </Typography>
            )}
            {(startDate || endDate) && (
              <Typography 
                variant="caption" 
                sx={{ color: '#ffffff', mt: 1, display: 'block', opacity: 0.8 }}
              >
                {startDate && endDate 
                  ? `Filtrando desde ${startDate} hasta ${endDate}`
                  : startDate 
                    ? `Filtrando desde ${startDate}`
                    : `Filtrando hasta ${endDate}`
                }
              </Typography>
            )}
          </Box>
        </>
      )}
      
      <button 
        className={buttonClassName}
        onClick={handleProcess}
        disabled={isLoading || !isDateRangeValid()}
      >
        {isLoading ? loadingText : buttonText}
      </button>
    </div>
  );
};

export default FileProcessingSection;
