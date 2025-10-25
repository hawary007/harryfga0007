
import React, { useCallback, useState } from 'react';
import { UploadedFile } from '../types';
import { FileIcon } from './icons/FileIcon';
import { UploadIcon } from './icons/UploadIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface FileUploadProps {
  id: string;
  accept: string[];
  file: UploadedFile | null;
  onFileChange: (id: string, file: UploadedFile | null) => void;
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove "data:*/*;base64," prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });

export const FileUpload: React.FC<FileUploadProps> = ({ id, accept, file, onFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(async (selectedFile: File | null) => {
    if (selectedFile) {
      if (!accept.some(type => selectedFile.name.toLowerCase().endsWith(type.toLowerCase()))) {
        alert(`Invalid file type. Please upload one of: ${accept.join(', ')}`);
        return;
      }
      const base64Content = await toBase64(selectedFile);
      onFileChange(id, {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        content: base64Content,
      });
    }
  }, [id, accept, onFileChange]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const onRemoveFile = () => {
    onFileChange(id, null);
  };
  
  if (file) {
    return (
      <div className="flex items-center justify-between bg-brand-gray-700 border border-brand-gray-600 rounded-md p-2 text-sm">
        <div className="flex items-center gap-2 overflow-hidden">
          <FileIcon className="w-5 h-5 flex-shrink-0 text-brand-gray-400" />
          <span className="truncate text-brand-gray-200">{file.name}</span>
        </div>
        <button onClick={onRemoveFile} className="text-brand-gray-500 hover:text-white transition-colors">
          <XCircleIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-md p-6 text-center transition-colors ${isDragging ? 'border-brand-blue bg-blue-900/20' : 'border-brand-gray-600 hover:border-brand-gray-500'}`}
    >
      <input
        type="file"
        id={`file-input-${id}`}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={onFileSelect}
        accept={accept.join(',')}
      />
      <div className="flex flex-col items-center justify-center text-brand-gray-400">
        <UploadIcon className="w-8 h-8 mb-2"/>
        <p className="font-semibold text-brand-gray-300">
          <span className="text-brand-blue">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs mt-1">Accepts: {accept.join(', ')}</p>
      </div>
    </div>
  );
};
