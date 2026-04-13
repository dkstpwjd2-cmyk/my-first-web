"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="제목으로 검색"
      className="w-full p-3 border rounded-lg"
      aria-label="게시글 검색"
    />
  );
}
