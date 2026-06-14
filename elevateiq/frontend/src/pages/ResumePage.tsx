import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, CheckCircle2, Trash2, Loader2, CloudUpload, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useResumes, useUploadResume } from '@/hooks/useApi';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

export default function ResumePage() {
  const { data, isLoading } = useResumes();
  const uploadMutation = useUploadResume();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState<string | null>(null);

  const resumes = data?.resumes ?? [];
  const active = resumes.find(r => r.isActive);

  const onDrop = useCallback(async (files: File[]) => {
    if (files[0]) await uploadMutation.mutateAsync(files[0]);
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1, maxSize: 10 * 1024 * 1024,
  });

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try { await api.delete(`/resumes/${id}`); queryClient.invalidateQueries({ queryKey: ['resumes'] }); }
    finally { setDeleting(null); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Resume</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload your resume (PDF or DOCX) to get AI analysis</p>
      </div>

      {/* Upload Zone */}
      <Card className="neon-border-cyan">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-white">
            <CloudUpload className="w-4 h-4 text-neon-cyan" /> Upload Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div {...getRootProps()} className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
            isDragActive ? 'border-cyan-400 bg-cyan-500/10 neon-glow-cyan' : 'border-purple-500/30 hover:border-cyan-500/50 hover:bg-cyan-500/5'
          }`}>
            <input {...getInputProps()} />
            <AnimatePresence mode="wait">
              {uploadMutation.isPending ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-neon-purple animate-spin" />
                  <p className="text-white font-medium">Parsing your resume with AI...</p>
                  <p className="text-sm text-muted-foreground">Extracting skills, experience, projects...</p>
                </motion.div>
              ) : uploadMutation.isSuccess ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3">
                  <CheckCircle2 className="w-10 h-10 text-neon-green" />
                  <p className="text-white font-medium">Resume uploaded successfully!</p>
                  <p className="text-sm text-neon-green">AI parsing complete ✓</p>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/30">
                    <Upload className="w-7 h-7 text-neon-purple" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{isDragActive ? 'Drop it here!' : 'Drag & drop your resume'}</p>
                    <p className="text-sm text-muted-foreground mt-1">PDF or DOCX · Max 10MB</p>
                  </div>
                  <Button variant="neon" size="sm" type="button">Browse Files</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {uploadMutation.isError && (
            <p className="text-red-400 text-sm mt-3 text-center">Upload failed. Please try again.</p>
          )}
        </CardContent>
      </Card>

      {/* Active Resume Skills */}
      {active?.parsedData?.skills && (active.parsedData.skills as string[]).length > 0 && (
        <Card className="neon-border-green">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-white">
              <FileCheck className="w-4 h-4 text-neon-green" /> Detected Skills ({(active.parsedData.skills as string[]).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(active.parsedData.skills as string[]).map((skill) => (
                <span key={skill} className="text-xs bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1 rounded-full font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resume List */}
      {!isLoading && resumes.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Your Resumes</h2>
          <div className="space-y-3">
            {resumes.map((resume) => (
              <motion.div key={resume.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className={resume.isActive ? 'neon-border-purple' : 'border-border opacity-60'}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${resume.isActive ? 'bg-purple-500/20 border border-purple-500/40' : 'bg-secondary'}`}>
                        <FileText className={`w-5 h-5 ${resume.isActive ? 'text-neon-purple' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-gray-200">{resume.fileName}</p>
                        <p className="text-xs text-muted-foreground">Uploaded {formatDate(resume.uploadedAt)}</p>
                      </div>
                      {resume.isActive && (
                        <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-1 rounded-full">Active</span>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(resume.id)} disabled={deleting === resume.id}
                        className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10 shrink-0">
                        {deleting === resume.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
