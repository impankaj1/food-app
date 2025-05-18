'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye } from 'lucide-react';
import { z } from 'zod';
import { useState } from 'react';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email id').nonempty(),
  password: z.string().min(6).nonempty(),
});

const LoginPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, values)
      .then((res) => res);
    if (res.status === 200) {
      console.log('redirecting');
      form.reset();
      redirect(`/dashboard`);
    }
  }

  const handlePasswordTypeChange = () => setShowPassword(!showPassword);

  return (
    <div className='w-full flex flex-col items-center justify-center h-[100vh]'>
      <h1 style={{}} className='font-bold text-2xl'>Welcome back!</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='w-1/2 lg:w-1/4 p-10 m-2 outline outline-gray-100 shadow-2xl rounded-2xl bg-gradient-to-br from-secondary/40 via-secondary/90 to-secondary/40  text-white space-y-8'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-foreground'>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-foreground'>Password</FormLabel>
                <FormControl>
                  <div className='relative flex items-center '>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      className='text-foreground relative'
                      placeholder='Password'
                      {...field}
                    />
                    <div
                      role='button'
                      onClick={handlePasswordTypeChange}
                      className='absolute right-0 p-2 z-30 cursor-pointer'
                    >
                      <Eye className='text-foreground' />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='w-full' type='submit'>
            Submit
          </Button>
        </form>
      </Form>
      <div>
        <p>
          Don&apos;t have an account?{' '}
          <span className='m-1'>
            <Link className='text-primary underline' href={'/auth/signup'}>
              Signup
            </Link>
          </span>
          now.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
