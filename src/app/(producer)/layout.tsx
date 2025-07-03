'use client';
import React from 'react';
import WithProducerAuth from '@/components/auth/withProducerAuth';

export default function ProducerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WithProducerAuth>
      {children}
    </WithProducerAuth>
  );
}