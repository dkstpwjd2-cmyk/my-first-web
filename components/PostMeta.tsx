type PostMetaProps = {
  category: string;
  date: string;
};

export default function PostMeta({ category, date }: PostMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span className="rounded-md bg-accent px-2 py-0.5 font-medium text-accent-foreground">
        {category}
      </span>
      <span>{date || "기록"}</span>
    </div>
  );
}
