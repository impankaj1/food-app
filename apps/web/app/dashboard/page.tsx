import {
  Card,
  CardDescription,
  CardTitle,
  HoverEffect,
} from '@/components/ui/card-hover-effect';
import React from 'react';

function DashboardPage() {
  const items = [
    { title: 'string', description: 'string', link: 'asffdsss' },
    { title: 'string', description: 'string', link: 'hgfgfg' },
  ];
  return (
    <div>
      <HoverEffect items={items} className='h-48'></HoverEffect>
    </div>
  );
}

export default DashboardPage;
