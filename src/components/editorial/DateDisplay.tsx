interface DateDisplayProps {
  date: Date | string;
  className?: string;
}

/**
 * Formats date as DD/MM/YY to match the editorial newspaper aesthetic
 */
export function DateDisplay({ date, className = "" }: DateDisplayProps) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = String(dateObj.getFullYear()).slice(-2);

  return (
    <time dateTime={dateObj.toISOString()} className={`${className}`}>
      {day}/{month}/{year}
    </time>
  );
}
