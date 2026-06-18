import { cn } from "@/lib/utils";

export function Label({
  htmlFor,
  children,
  className,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-2",
        className,
      )}
    >
      {children}
    </label>
  );
}

const fieldBase =
  "w-full border border-line bg-white px-4 py-3 text-[0.95rem] text-ink outline-none transition-colors focus:border-accent placeholder:text-muted/70";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldBase, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(fieldBase, "min-h-[130px] resize-y", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(fieldBase, "appearance-none pr-10", props.className)} />;
}

export function Field({
  label,
  htmlFor,
  error,
  children,
  className,
}: {
  label?: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4", className)}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error && <p className="mt-1.5 text-[0.74rem] text-[#a4583f]">{error}</p>}
    </div>
  );
}
