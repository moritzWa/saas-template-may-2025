import { useRouter } from 'next/router';
import { AppLayout } from '@/components/AppLayout';
import { DocumentEditor } from '@/components/DocumentEditor';

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
