import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/utils/trpc';
import { useDebouncedCallback } from 'use-debounce';

function DocumentEditor({ documentId }: { documentId: string }) {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : '';

  const { data: document, isLoading } = trpc.documents.get.useQuery(
    { token, id: documentId },
    { enabled: !!token }
  );

  const updateDocument = trpc.documents.update.useMutation();
  const deleteDocument = trpc.documents.delete.useMutation({
    onSuccess: () => {
      router.push('/');
    },
  });

  const [title, setTitle] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);

  const displayTitle = title ?? document?.title ?? '';
  const displayContent = content ?? document?.content ?? '';

  const debouncedSave = useDebouncedCallback(
    (updates: { title?: string; content?: string }) => {
      if (token) {
        updateDocument.mutate({ token, id: documentId, ...updates });
      }
    },
    500
  );

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    debouncedSave({ title: newTitle });
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    debouncedSave({ content: newContent });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument.mutate({ token, id: documentId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div>Loading...</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div>Document not found</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{displayTitle || 'Untitled'} - PROJECT_NAME</title>
      </Head>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="size-4 mr-2" />
            Delete
          </Button>
        </div>

        <div className="space-y-4">
          <Input
            value={displayTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Document title"
            className="text-2xl font-bold border-none shadow-none px-0 focus-visible:ring-0"
          />
          <Textarea
            value={displayContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Start writing..."
            className="min-h-[60vh] resize-none border-none shadow-none px-0 focus-visible:ring-0"
          />
        </div>

        {updateDocument.isPending && (
          <div className="fixed bottom-4 right-4 text-sm text-muted-foreground">Saving...</div>
        )}
      </div>
    </>
  );
}

export default function DocumentPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== 'string') {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div>Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <DocumentEditor key={id} documentId={id} />
    </AppLayout>
  );
}
