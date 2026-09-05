import React from 'react';

export default function SubRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full mx-auto mt-5">{children}</div>;
}