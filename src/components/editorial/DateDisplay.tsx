interface DateDisplayProps {
  date: Date | string;
  className?: string;
}

/**
 * Formats date as DD/MM/YY to match the editorial newspaper aesthetic
 */
export function DateDisplay({ date, className = "" }: DateDisplayProps) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const year = String(dateObj.getUTCFullYear()).slice(-2);
  const dateTime = `${dateObj.getUTCFullYear()}-${month}-${day}`;

  return (
    <time dateTime={dateTime} className={`${className}`}>
      {day}/{month}/{year}
    </time>
  );
}
