import { Database, Book, FileText, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RAGContext {
  sources: string[];
  keywordsUsed: string[];
}

interface RAGIndicatorProps {
  ragContext: RAGContext | null;
}

export function RAGIndicator({ ragContext }: RAGIndicatorProps) {
  if (!ragContext || ragContext.sources.length === 0) {
    return null;
  }

  const getSourceIcon = (source: string) => {
    if (source.includes('Medical KB')) return <Book className="h-3 w-3" />;
    if (source.includes('User Doc')) return <FileText className="h-3 w-3" />;
    if (source.includes('FDA')) return <ExternalLink className="h-3 w-3" />;
    return <Database className="h-3 w-3" />;
  };

  return (
    <div className="mt-3 pt-3 border-t border-border/50">
      <div className="flex items-center gap-2 mb-2">
        <Database className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">
          RAG Sources Used
        </span>
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {ragContext.sources.map((source, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-xs py-0.5 px-2 gap-1 bg-primary/10 text-primary border-0"
          >
            {getSourceIcon(source)}
            <span className="truncate max-w-[150px]">{source}</span>
          </Badge>
        ))}
      </div>

      {ragContext.keywordsUsed.length > 0 && (
        <div className="mt-2">
          <span className="text-xs text-muted-foreground">
            Keywords: {ragContext.keywordsUsed.slice(0, 5).join(', ')}
            {ragContext.keywordsUsed.length > 5 && '...'}
          </span>
        </div>
      )}
    </div>
  );
}