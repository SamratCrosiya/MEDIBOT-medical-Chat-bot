-- Create medical knowledge base table
CREATE TABLE public.medical_knowledge (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- symptoms, conditions, drugs, treatments
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medical documents table for user uploads
CREATE TABLE public.medical_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medical_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_documents ENABLE ROW LEVEL SECURITY;

-- RLS for medical_knowledge (public read, no write from client)
CREATE POLICY "Anyone can read medical knowledge"
  ON public.medical_knowledge FOR SELECT
  USING (true);

-- RLS for medical_documents (user owns their documents)
CREATE POLICY "Users can view own documents"
  ON public.medical_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON public.medical_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON public.medical_documents FOR DELETE
  USING (auth.uid() = user_id);

-- Create GIN indexes for keyword search
CREATE INDEX idx_medical_knowledge_keywords ON public.medical_knowledge USING GIN(keywords);
CREATE INDEX idx_medical_documents_keywords ON public.medical_documents USING GIN(keywords);
CREATE INDEX idx_medical_knowledge_category ON public.medical_knowledge(category);

-- Create full-text search function
CREATE OR REPLACE FUNCTION public.search_medical_knowledge(search_query TEXT)
RETURNS TABLE (
  id UUID,
  category TEXT,
  title TEXT,
  content TEXT,
  relevance FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mk.id,
    mk.category,
    mk.title,
    mk.content,
    ts_rank(to_tsvector('english', mk.title || ' ' || mk.content), plainto_tsquery('english', search_query)) AS relevance
  FROM medical_knowledge mk
  WHERE 
    to_tsvector('english', mk.title || ' ' || mk.content) @@ plainto_tsquery('english', search_query)
    OR search_query = ANY(mk.keywords)
  ORDER BY relevance DESC
  LIMIT 5;
END;
$$;

-- Create function to search user documents
CREATE OR REPLACE FUNCTION public.search_user_documents(search_query TEXT, user_uuid UUID)
RETURNS TABLE (
  id UUID,
  filename TEXT,
  content TEXT,
  relevance FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    md.id,
    md.filename,
    md.content,
    ts_rank(to_tsvector('english', md.filename || ' ' || md.content), plainto_tsquery('english', search_query)) AS relevance
  FROM medical_documents md
  WHERE 
    md.user_id = user_uuid
    AND (
      to_tsvector('english', md.filename || ' ' || md.content) @@ plainto_tsquery('english', search_query)
      OR search_query = ANY(md.keywords)
    )
  ORDER BY relevance DESC
  LIMIT 3;
END;
$$;