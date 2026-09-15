import { useState, useCallback } from 'react';
import { UploadCloud, X, File, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatBytes } from '../utils/helpers';
import { useDocuments } from '../hooks/useDocuments';

export default function UploadModal({ isOpen, onClose }) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, processing, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);

  const { documents, upload, process } = useDocuments();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    // Filter out non-PDFs and check size
    const validFiles = newFiles.filter(file => {
      if (file.type !== 'application/pdf') {
        setErrorMsg('Only PDF files are allowed.');
        return false;
      }
      if (file.size > 20 * 1024 * 1024) { // 20MB
        setErrorMsg('File size must be less than 20MB.');
        return false;
      }
      return true;
    });

    if (validFiles.length > 1 || files.length + validFiles.length > 1) {
      setErrorMsg('Only one PDF can be active at a time.');
      return;
    }

    if (validFiles.length > 0) {
      setFiles(validFiles.slice(0, 1));
      setErrorMsg('');
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploadStatus('uploading');
    setErrorMsg('');
    setProgress(0);

    try {
      // 1. Upload file. The backend replaces this browser's previous PDF.
      const uploadRes = await upload({
        files,
        onProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      // 2. Process documents
      setUploadStatus('processing');
      const documentIds = uploadRes.documents.map(doc => doc.id);
      await process(documentIds);

      setUploadStatus('success');
      setTimeout(() => {
        onClose();
        setFiles([]);
        setUploadStatus('idle');
      }, 2000);

    } catch (err) {
      console.error(err);
      setUploadStatus('error');
      setErrorMsg(err.response?.data?.detail || err.message || 'An error occurred during upload/processing.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#051329]/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#071733] w-full max-w-lg rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] border border-[#1E3E75] overflow-hidden flex flex-col text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#13284C]">
            <h3 className="font-bold text-lg text-white">Upload Documents</h3>
            <button 
              onClick={onClose}
              disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
              className="p-1.5 rounded-lg text-[#8EA2C6] hover:bg-[#0E244B] hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Dropzone */}
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all
                ${dragActive ? 'border-[#1557D6] bg-[#1557D6]/15' : 'border-[#1E3E75] hover:border-[#1557D6] hover:bg-[#0E244B]'}
                ${(uploadStatus === 'uploading' || uploadStatus === 'processing') ? 'opacity-50 pointer-events-none' : ''}
              `}
            >
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
              />
              <UploadCloud className="w-10 h-10 text-[#1557D6] mx-auto mb-3" />
              <p className="text-sm font-semibold text-white mb-1">
                Click or drag one PDF file to upload
              </p>
              <p className="text-xs text-[#8EA2C6]">
                Maximum file size: 20MB. New uploads replace your current PDF.
              </p>
            </div>

            {documents.length > 0 && (
              <p className="mt-3 text-xs text-[#8EA2C6]">
                Current PDF will be replaced after upload.
              </p>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#0E244B] border border-[#1E3E75] text-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <File className="w-4 h-4 text-[#38BDF8] shrink-0" />
                      <span className="truncate text-white font-medium">{file.name}</span>
                      <span className="text-[#8EA2C6] text-xs shrink-0">{formatBytes(file.size)}</span>
                    </div>
                    <button 
                      onClick={() => removeFile(idx)}
                      disabled={uploadStatus !== 'idle' && uploadStatus !== 'error'}
                      className="text-[#8EA2C6] hover:text-rose-400 shrink-0 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Progress Bar */}
            {uploadStatus === 'uploading' && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-[#8EA2C6]">
                  <span>Uploading files...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-[#0E244B] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#1557D6] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {uploadStatus === 'processing' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#38BDF8]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing chunks and generating embeddings...
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Successfully uploaded and processed!
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#13284C] flex justify-end gap-3 bg-[#051329]/50">
            <button
              onClick={onClose}
              disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
              className="px-4 py-2 text-sm font-semibold text-[#8EA2C6] hover:text-white hover:bg-[#0E244B] rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={files.length === 0 || uploadStatus !== 'idle'}
              className="px-5 py-2 text-sm font-semibold bg-[#1557D6] hover:bg-[#0F46B3] text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_4px_14px_rgba(21,87,214,0.35)] cursor-pointer"
            >
              {(uploadStatus === 'uploading' || uploadStatus === 'processing') && <Loader2 className="w-4 h-4 animate-spin" />}
              {uploadStatus === 'idle' || uploadStatus === 'error' ? 'Upload & Process' : 'Please wait...'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
