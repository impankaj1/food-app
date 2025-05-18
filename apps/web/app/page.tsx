'use client';

import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

export default function Home() {
  return (
    <div className='text-3xl font-bold gap-2 underline'>
      <Button onClick={() => redirect('/auth/login')}>Login</Button>
      Hello world!
      <Button onClick={() => redirect('/auth/signup')}>SignUp</Button>
    </div>
  );
}
