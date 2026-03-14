"use client";

import { useState } from "react";

interface KeyTermCardProps {
  term: string;
  definition: string;
}

export default function KeyTermCard({ term, definition }: KeyTermCardProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="bg-brand-50 rounded-xl p-4 border border-brand-100 relative cursor-pointer transition-colors hover:border-brand-300"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow((s) => !s)}
    >
      <h4 className="font-medium text-brand-800 text-sm mb-1 flex items-center gap-1.5">
        {term}
        <span className="text-brand-400 text-xs">&#9432;</span>
      </h4>
      <p className="text-xs text-brand-600 leading-relaxed line-clamp-2">
        {definition}
      </p>

      {show && (
        <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-brand-200 shadow-lg rounded-xl p-4 text-xs text-brand-700 leading-relaxed animate-in fade-in duration-150">
          <div className="font-semibold text-brand-800 text-sm mb-1">{term}</div>
          {definition}
        </div>
      )}
    </div>
  );
}
