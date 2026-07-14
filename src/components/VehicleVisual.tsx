import React, { useState } from 'react';
import { Car } from 'lucide-react';

interface VehicleVisualProps {
  type: string;
  className?: string;
}

export const VehicleVisual: React.FC<VehicleVisualProps> = ({ type, className = "h-12 w-12" }) => {
  const [error, setError] = useState(false);

  const isUrl = !error && (
    type.startsWith('http://') || 
    type.startsWith('https://') || 
    type.startsWith('/') || 
    type.startsWith('data:')
  );

  if (isUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src={type} 
        alt="Vehicle" 
        className={`${className} object-cover w-full h-full rounded-md`}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Car 
      className={`${className} text-neutral-700 dark:text-zinc-300 transition-colors`} 
      strokeWidth={1.5} 
    />
  );
};
