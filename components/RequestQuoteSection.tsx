'use client';

interface Props {
  onClick: () => void;
  variant?: 'compact' | 'primary';
}

export default function RequestQuoteSection({
  onClick,
  variant = 'primary',
}: Props) {
  const base =
    'font-semibold rounded transition duration-300 ease-in-out';

  const styles =
    variant === 'compact'
      ? 'bg-brandBlue text-white px-4 py-2 text-sm hover:bg-blue-400'
      : 'bg-brandBlue text-white px-6 py-3 shadow-md hover:bg-blue-400 hover:shadow-lg transform hover:scale-105';

  return (
    <button onClick={onClick} className={`${base} ${styles}`}>
      Request Quote
    </button>
  );
}

