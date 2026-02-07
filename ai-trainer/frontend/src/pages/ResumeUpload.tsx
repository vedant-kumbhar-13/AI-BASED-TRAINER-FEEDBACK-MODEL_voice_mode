import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navigation } from '../components/dashboard/Navigation';
import { Upload, FileText, X, CheckCircle, Loader2 } from 'lucide-react';
import InterviewAPI from '../services/interviewAPI';

export const ResumeUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const interviewType = location.state?.interviewType || 'Technical';
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a PDF file');
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress([]);
    setError('');

    // Simulate progress steps
    const progressSteps = [
      'Uploading resume...',
      'Extracting text content...',
      'Identifying skills...',
      'Analyzing experience...',
      'Generating personalized questions...'
    ];

    for (let i = 0; i < progressSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setUploadProgress(prev => [...prev, progressSteps[i]]);
    }

    try {
      const result = await InterviewAPI.uploadResume(file);
      
      if (result.success && result.resume) {
        navigate('/ai-interview-summary', {
          state: {
            resume: result.resume,
            interviewType
          }
        });
      } else {
        setError(result.error || 'Failed to upload resume');
        setIsUploading(false);
      }
    } catch (err) {
      setError('Failed to upload resume. Please try again.');
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    navigate('/ai-interview-summary', {
      state: { interviewType, skipResume: true }
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-16">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Upload Your Resume</h1>
            <p className="text-gray-500">
              Upload your resume for personalized interview questions based on your experience
            </p>
          </div>

          {/* Upload Zone */}
          {!isUploading ? (
            <>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  isDragging
                    ? 'border-primary bg-primary-light'
                    : file
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 bg-white hover:border-primary hover:bg-gray-50'
                }`}
              >
                {!file ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-light flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Drag & drop your resume here
                    </h3>
                    <p className="text-gray-500 mb-6">or click to browse files</p>
                    
                    <label className="inline-block">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <span className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg cursor-pointer transition-all">
                        Browse Files
                      </span>
                    </label>
                    
                    <p className="text-sm text-gray-400 mt-4">Supported format: PDF (max 10MB)</p>
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      onClick={removeFile}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-red-500 text-center mt-4">{error}</p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
                <button
                  onClick={handleUpload}
                  disabled={!file}
                  className={`px-8 py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                    file
                      ? 'bg-primary hover:bg-primary-dark text-white shadow-button'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  Upload and Analyze
                </button>
                
                <button
                  onClick={handleSkip}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-600 font-bold rounded-xl hover:border-gray-400 transition-all"
                >
                  Skip & Continue Without Resume
                </button>
              </div>
            </>
          ) : (
            /* Processing State */
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-light flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Resume...</h3>
              <p className="text-gray-500 mb-8">Please wait while we process your resume</p>
              
              <div className="max-w-md mx-auto space-y-3">
                {uploadProgress.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 text-left">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back Link */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/ai-interview')}
              className="text-primary hover:underline font-medium"
            >
              ← Back to Interview Options
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeUpload;
