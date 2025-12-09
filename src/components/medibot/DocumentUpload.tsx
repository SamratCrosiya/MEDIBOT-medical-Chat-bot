import { useState } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UploadedDocument {
  id: string;
  filename: string;
  created_at: string;
}

interface DocumentUploadProps {
  documents: UploadedDocument[];
  onDocumentsChange: () => void;
}

// Extract keywords from text content
function extractKeywords(text: string): string[] {
  const medicalKeywords = [
    'pain', 'ache', 'fever', 'cough', 'headache', 'nausea', 'vomiting',
    'diarrhea', 'fatigue', 'dizzy', 'swelling', 'rash', 'bleeding',
    'infection', 'diabetes', 'blood pressure', 'cholesterol', 'asthma',
    'allergy', 'medication', 'drug', 'dose', 'treatment', 'symptom',
    'diagnosis', 'test', 'lab', 'result', 'mg', 'ml', 'tablet', 'capsule',
    'glucose', 'hemoglobin', 'creatinine', 'sodium', 'potassium', 'calcium'
  ];

  const lowerText = text.toLowerCase();
  const foundKeywords: string[] = [];

  for (const keyword of medicalKeywords) {
    if (lowerText.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  }

  return [...new Set(foundKeywords)];
}

export function DocumentUpload({ documents, onDocumentsChange }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to upload documents.',
        variant: 'destructive',
      });
      return;
    }

    // Only accept text-based files
    const allowedTypes = ['text/plain', 'text/csv', 'application/json'];
    const allowedExtensions = ['.txt', '.csv', '.json', '.md'];
    
    const hasValidExtension = allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );

    if (!allowedTypes.includes(file.type) && !hasValidExtension) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload text files (.txt, .csv, .json, .md)',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 1024 * 1024) { // 1MB limit
      toast({
        title: 'File too large',
        description: 'Please upload files smaller than 1MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const content = await file.text();
      const keywords = extractKeywords(content);

      const { error } = await supabase
        .from('medical_documents')
        .insert({
          user_id: user.id,
          filename: file.name,
          content: content.substring(0, 50000), // Limit content size
          keywords: keywords,
          file_type: file.type || 'text/plain',
        });

      if (error) throw error;

      toast({
        title: 'Document uploaded',
        description: `${file.name} has been added to your knowledge base.`,
      });

      onDocumentsChange();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to process the document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const deleteDocument = async (id: string, filename: string) => {
    try {
      const { error } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Document deleted',
        description: `${filename} has been removed.`,
      });

      onDocumentsChange();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: 'Failed to delete the document. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".txt,.csv,.json,.md"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center justify-center text-center">
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          )}
          <p className="text-sm font-medium text-foreground">
            {isUploading ? 'Processing...' : 'Drop medical documents here'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports .txt, .csv, .json, .md (max 1MB)
          </p>
        </div>
      </div>

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Your Documents</h4>
          {documents.map((doc) => (
            <Card key={doc.id} className="flex items-center justify-between p-3 bg-secondary/30">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm text-foreground truncate max-w-[180px]">
                  {doc.filename}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => deleteDocument(doc.id, doc.filename)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}