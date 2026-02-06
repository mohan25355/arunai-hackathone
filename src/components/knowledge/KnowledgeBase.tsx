import { useState, useEffect } from 'react';
import {
  Upload,
  Search,
  FileText,
  Database,
  Trash2,
  Eye,
  MoreVertical,
  FolderOpen,
  File,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'indexed' | 'processing' | 'error';
  chunks: number;
  uploadedAt: Date;
  lastUsed: Date;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Corporate Policy Handbook 2024.pdf',
    type: 'PDF',
    size: '2.4 MB',
    status: 'indexed',
    chunks: 156,
    uploadedAt: new Date('2024-01-15'),
    lastUsed: new Date(),
  },
  {
    id: '2',
    name: 'Product Documentation v3.2.docx',
    type: 'DOCX',
    size: '1.8 MB',
    status: 'indexed',
    chunks: 89,
    uploadedAt: new Date('2024-01-20'),
    lastUsed: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '3',
    name: 'Compliance Guidelines.pdf',
    type: 'PDF',
    size: '3.1 MB',
    status: 'processing',
    chunks: 0,
    uploadedAt: new Date(),
    lastUsed: new Date(),
  },
  {
    id: '4',
    name: 'Training Materials Q1.pdf',
    type: 'PDF',
    size: '5.6 MB',
    status: 'indexed',
    chunks: 234,
    uploadedAt: new Date('2024-01-10'),
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '5',
    name: 'API Reference Guide.md',
    type: 'MD',
    size: '456 KB',
    status: 'indexed',
    chunks: 45,
    uploadedAt: new Date('2024-02-01'),
    lastUsed: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '6',
    name: 'Corrupted_file.pdf',
    type: 'PDF',
    size: '1.2 MB',
    status: 'error',
    chunks: 0,
    uploadedAt: new Date('2024-01-25'),
    lastUsed: new Date('2024-01-25'),
  },
];

const statusConfig = {
  indexed: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Indexed' },
  processing: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Processing' },
  error: { icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Error' },
};

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const fetchDocuments = async () => {
    try {
      const res = await fetch('http://localhost:8000/documents');
      if (res.ok) {
        setDocuments(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const addDocument = async () => {
    if (!newContent) return;
    try {
      await fetch('http://localhost:8000/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle || "Untitled Note", content: newContent })
      });
      setIsAdding(false);
      setNewContent('');
      setNewTitle('');
      fetchDocuments();
    } catch (err) {
      console.error("Failed to add document", err);
    }
  };

  const totalChunks = documents.length;
  const indexedDocs = documents.length;

  return (
    <div className="h-full flex flex-col p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">Manage trusted sources for RAG-powered responses</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} variant="glow">
          {isAdding ? "Cancel" : "Add Fact / Text"}
        </Button>
      </div>

      {isAdding && (
        <div className="glass-card p-4 mb-6 animate-slide-up">
          <h3 className="font-medium mb-4">Add New Knowledge</h3>
          <div className="flex flex-col gap-3">
            <input
              placeholder="Title / Source Name"
              className="p-2 rounded bg-black/20 border border-white/10"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <textarea
              placeholder="Paste fact, policy text, or knowledge content here..."
              className="p-2 rounded bg-black/20 border border-white/10 min-h-[100px]"
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="default" onClick={addDocument}>Index Content</Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FolderOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Documents</p>
              <p className="text-xl font-bold">{documents.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Indexed</p>
              <p className="text-xl font-bold text-success">{indexedDocs}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <Database className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Vector Chunks</p>
              <p className="text-xl font-bold">{totalChunks.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <File className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Size</p>
              <p className="text-xl font-bold">N/A</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="flex-1 glass-card overflow-hidden">
        <div className="grid grid-cols-[1fr_200px_100px] gap-4 p-4 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span>Document Content</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <div className="overflow-y-auto scrollbar-thin h-[calc(100%-49px)]">
          {documents.map((doc: any) => (
            <div
              key={doc.id}
              className="grid grid-cols-[1fr_200px_100px] gap-4 p-4 border-b border-border items-center hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {doc.content}
                  </p>
                </div>
              </div>

              <Badge variant="success" className="w-fit">Indexed</Badge>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No documents indexed. Add some facts to ground your AI.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
