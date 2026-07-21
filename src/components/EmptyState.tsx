interface EmptyStateProps {
  message: string;
  className?: string;
}

export function EmptyState({ message, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`rounded-xl border border-dashed border-border bg-bg-secondary/30 px-6 py-12 text-center ${className}`}
    >
      <p className="text-sm text-gray-muted">{message}</p>
    </div>
  );
}
