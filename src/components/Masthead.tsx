import HorizontalRule from "./HorizontalRule";

interface MastheadProps {
  publicationName: string;
  editionNumber?: number;
  date?: string;
  title?: string;
  className?: string;
}

export default function Masthead({
  publicationName,
  editionNumber,
  date,
  title,
  className = "",
}: MastheadProps) {
  return (
    <header className={`text-center py-12 ${className}`}>
      <h1 className="text-6xl md:text-8xl italic font-serif tracking-tight mb-4 uppercase">
        {publicationName}
      </h1>

      {(editionNumber || date) && (
        <div className="flex justify-center gap-8 text-xs uppercase tracking-[0.2em] font-sans text-muted-ink mb-6">
          {editionNumber && <span>Edition #{editionNumber}</span>}
          {date && <span>{date}</span>}
        </div>
      )}

      <HorizontalRule />

      {title && (
        <h2 className="text-3xl md:text-5xl font-serif mt-8 mb-4 max-w-4xl mx-auto leading-tight">
          {title}
        </h2>
      )}
    </header>
  );
}
