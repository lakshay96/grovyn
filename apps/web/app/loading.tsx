import { Spinner } from '@/components/ui/Spinner';

export default function Loading() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center pt-20">
      <Spinner label="Loading…" />
    </div>
  );
}
