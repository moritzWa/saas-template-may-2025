import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Plus } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';

type Document = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export default function HomePage() {
  const router = useRouter();
  const token = getToken();

  const { data: documents, isLoading: documentsLoading } = trpc.documents.list.useQuery(
    { token: token || '' },
    { enabled: !!token }
  );

  const createDocument = trpc.documents.create.useMutation({
    onSuccess: (doc) => {
      router.push(`/documents/${doc.id}`);
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && !getToken()) {
      router.replace('/landing');
    }
  }, [router]);

  const handleCreateDocument = () => {
    createDocument.mutate({ token: token || '' });
  };

  if (typeof window === 'undefined' || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - PROJECT_NAME</title>
      </Head>
      <AppLayout>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Documents</h1>
            <Button onClick={handleCreateDocument} disabled={createDocument.isPending}>
              <Plus className="size-4 mr-2" />
              New Document
            </Button>
          </div>

          {documentsLoading ? (
            <div className="text-muted-foreground">Loading documents...</div>
          ) : documents && documents.length > 0 ? (
            <div className="grid gap-4">
              {documents.map((doc: Document) => (
                <Link
                  key={doc.id}
                  href={`/documents/${doc.id}`}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <FileText className="size-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Updated {formatDistanceToNow(new Date(doc.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No documents yet</h3>
              <p className="text-muted-foreground mb-4">Create your first document to get started</p>
              <Button onClick={handleCreateDocument} disabled={createDocument.isPending}>
                <Plus className="size-4 mr-2" />
                Create Document
              </Button>
            </div>
          )}
        </div>
      </AppLayout>
    </>
  );
}
