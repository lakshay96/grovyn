export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-accent" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}

export function CanvasLoader({ label = 'Loading 3D scene…' }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-surface/60 backdrop-blur-sm">
      <Spinner label={label} />
    </div>
  );
}
