'use client';

import dynamic from 'next/dynamic';

const DwvViewer = dynamic(() => import('@/components/DwvViewer'), {
  ssr: false,
});

export default function Home() {
  return <DwvViewer />;
}
