export const formatCurrency = (value: number | null | undefined, currency = 'RUB') => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  return new Intl.NumberFormat('ru-RU').format(value);
};

export const formatDateTime = (value: string | Date | null | undefined) => {
  if (!value) {
    return '—';
  }
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

