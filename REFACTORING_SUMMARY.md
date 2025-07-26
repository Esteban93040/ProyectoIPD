# 🔧 Refactorización: Componente FileProcessingSection

## 🎯 **Problema Original**
Código duplicado en `SentimentalPage` y `FiveMinPage` para mostrar archivos cargados y botón de procesamiento.

## ✅ **Solución Implementada**

### 📦 **Nuevo Componente: FileProcessingSection**

**Ubicación:** `src/components/file-processing/FileProcessingSection.tsx`

**Props:**
```typescript
interface FileProcessingSectionProps {
  csvFiles: CsvFile[];
  isLoading: boolean;
  onProcess: () => void;
  buttonText: string;
  loadingText?: string;
  buttonClassName?: string;
  title?: string;
}
```

**Características:**
- ✅ **Reutilizable** para ambas páginas
- ✅ **Configurabe** mediante props
- ✅ **Estilo consistente** con colores blancos
- ✅ **Loading states** integrados
- ✅ **Tipos específicos** para cada botón (sentimental/five-min)

## 🔄 **Cambios en las Páginas**

### **Antes (Código duplicado):**
```tsx
{csvFiles.length > 0 && (
  <div className="files-info">
    <h3 style={{ color: '#ffffff'}}>Archivos listos para análisis:</h3>
    <ul>
      {csvFiles.map((file, index) => (
        <li key={index}>
          <strong style={{ color: '#ffffff' }}>{file.name}</strong> - {Math.round(file.size / 1024)} KB
          <br />
          <small style={{ color: '#ffffff' }}>Filas: {file.content.split('\n').filter(line => line.trim()).length}</small>
        </li>
      ))}
    </ul>
    
    <button 
      className="process-btn sentimental"
      onClick={processSentimentalAnalysis}
      disabled={isLoading}
    >
      {isLoading ? 'Procesando...' : 'Iniciar Análisis Sentimental'}
    </button>
  </div>
)}
```

### **Después (Componente simplificado):**
```tsx
<FileProcessingSection
  csvFiles={csvFiles}
  isLoading={isLoading}
  onProcess={processSentimentalAnalysis}
  buttonText="Iniciar Análisis Sentimental"
  buttonClassName="process-btn sentimental"
  title="Archivos listos para análisis:"
/>
```

## 📁 **Estructura de Archivos Creados**

```
src/components/file-processing/
├── FileProcessingSection.tsx    # Componente principal
├── FileProcessingSection.css    # Estilos específicos
└── index.ts                    # Exports simplificados
```

## 🎨 **Beneficios**

### 🚀 **Código Limpio**
- **-15 líneas** en cada página
- **DRY principle** aplicado
- **Separación de responsabilidades**

### 🔧 **Mantenibilidad**
- **Un solo lugar** para cambios de UI
- **Consistencia** garantizada
- **Fácil testing** del componente

### 🎯 **Flexibilidad**
- **Configurable** para diferentes tipos de análisis
- **Reutilizable** en futuras páginas
- **Extensible** para nuevas funcionalidades

## 🧪 **Uso en las Páginas**

### **SentimentalPage:**
```tsx
<FileProcessingSection
  csvFiles={csvFiles}
  isLoading={isLoading}
  onProcess={processSentimentalAnalysis}
  buttonText="Iniciar Análisis Sentimental"
  buttonClassName="process-btn sentimental"
/>
```

### **FiveMinPage:**
```tsx
<FileProcessingSection
  csvFiles={csvFiles}
  isLoading={isLoading}
  onProcess={processFiveMinAnalysis}
  buttonText="Iniciar Análisis 5 Min"
  buttonClassName="process-btn five-min"
/>
```

## 🎉 **Resultado**

✅ **Código más limpio y mantenible**  
✅ **Componentes simplificados**  
✅ **Reutilización efectiva**  
✅ **Misma funcionalidad**  
✅ **Estilos consistentes**  

¡La refactorización está completa y las páginas están mucho más limpias! 🚀
