'use client';
import React from 'react';
import WithAuth from '@/components/auth/WithAuth';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WithAuth>
      {children}
    </WithAuth>
  );
}