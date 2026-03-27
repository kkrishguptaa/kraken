import type { CardSize } from "@/components/editorial";

/**
 * Fixed pattern card size assignment for masonry grid
 * Pattern: tall, standard, standard, wide, (repeat)
 * Creates a consistent magazine aesthetic without wide-short cards
 */
const CARD_SIZE_PATTERN: CardSize[] = [
  "tall",      // 1x width, 2x height
  "standard",  // 1x width, 1x height
  "standard",  // 1x width, 1x height
  "wide",      // 2x width, 1x height
];

/**
 * Assign card sizes using a fixed repeating pattern
 * Creates consistent, predictable layout for magazine aesthetic
 *
 * @param count - Number of articles to assign sizes for
 */
export function assignCardSizes(count: number): CardSize[] {
  const sizes: CardSize[] = [];

  for (let i = 0; i < count; i++) {
    sizes.push(CARD_SIZE_PATTERN[i % CARD_SIZE_PATTERN.length]);
  }

  return sizes;
}

/**
 * Get CSS Grid classes for a card size
 * Maps CardSize to Tailwind grid spanning classes
 */
export function getCardGridClasses(size: CardSize): string {
  switch (size) {
    case "wide":
      return "md:col-span-2 row-span-2"; // 2x width, 1x height
    case "tall":
      return "col-span-1 row-span-4"; // 1x width, 2x height
    default:
      return "col-span-1 row-span-2"; // 1x width, 1x height (standard)
  }
}
