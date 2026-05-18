type FormActionsProps = {
  children: React.ReactNode;
};

export default function FormActions({ children }: FormActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
      {children}
    </div>
  );
}
