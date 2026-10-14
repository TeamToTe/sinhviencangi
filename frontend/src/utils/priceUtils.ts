import type { PlaceCategory } from '../types/place';

/**
 * Returns a suitable pricing unit for a place based on its category and custom unit.
 * Ensures non-housing places (food, drinks, entertainment, services, etc.) never show '/tháng'.
 */
export function getCategoryUnit(category?: string, currentUnit?: string): string {
  if (currentUnit && currentUnit.trim()) {
    // Strip trailing parenthesis e.g. "phần (35k - 50k)" -> "phần"
    const cleaned = currentUnit.replace(/\s*\(.*?\)/g, '').trim();
    // 'tháng' is only valid for boarding houses / accommodations
    if (category !== 'boarding_house' && cleaned.toLowerCase() === 'tháng') {
      // ignore invalid 'tháng'
    } else if (cleaned) {
      return cleaned;
    }
  }

  switch (category as PlaceCategory) {
    case 'boarding_house':
      return 'tháng';
    case 'food_drink':
      return 'món';
    case 'entertainment':
      return 'giờ';
    case 'services':
      return 'lần';
    case 'grocery':
      return 'món';
    case 'pharmacy':
      return 'món';
    case 'campus':
      return 'lượt';
    default:
      return category === 'boarding_house' ? 'tháng' : 'món';
  }
}

/**
 * Formats price text with proper Vietnamese units based on category.
 * e.g.:
 * - Boarding house: "2.8tr/tháng"
 * - Food & Drink: "35k/món" or "35k/phần"
 * - Entertainment: "10k/giờ"
 */
export function formatPriceText(
  priceInfo?: { amount: number; unit?: string } | null,
  category?: string
): string {
  if (!priceInfo || typeof priceInfo.amount !== 'number' || priceInfo.amount <= 0) {
    return '';
  }

  const unit = getCategoryUnit(category, priceInfo.unit);
  const amount = priceInfo.amount;

  if (amount >= 1000000) {
    const val = (amount / 1000000).toFixed(1).replace('.0', '');
    return `${val}tr/${unit}`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toLocaleString('vi-VN')}k/${unit}`;
  }
  return `${amount.toLocaleString('vi-VN')}đ/${unit}`;
}
