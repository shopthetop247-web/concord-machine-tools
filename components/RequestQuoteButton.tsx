// components/RequestQuoteButton.tsx
import React from 'react';

interface RequestQuoteButtonProps {
  stockNumber: string;
}

export default function RequestQuoteButton({ stockNumber }: RequestQuoteButtonProps) {
  return (
    <a
      href={`mailto:sales@concordmt.com?subject=Request for Stock# ${stockNumber}`}
      className="
        inline-block 
        bg-brandBlue 
        text-white 
        font-semibold 
        px-6 py-3 
        mt-4 
        rounded 
        shadow-md 
        hover:bg-blue-400 
        hover:shadow-lg 
        transform 
        hover:scale-105 
        transition 
        duration-300 
        ease-in-out
      "
    >
      Request Quote
    </a>
  );
}
