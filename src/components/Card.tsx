import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`relative rounded-3xl border border-border bg-surface-glass backdrop-blur-xl shadow-xl ${className}`}
    >
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-crimson/30 rounded-tl-3xl" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-crimson/30 rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-crimson/30 rounded-bl-3xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-crimson/30 rounded-br-3xl" />
      {children}
    </div>
  );
}
