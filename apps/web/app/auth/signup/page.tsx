'use client';

import { FC, memo } from 'react';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { BASE_URL } from '@/helpers/helper';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const SignUpPage: FC = () => {
  const formSchema = z.object({
    first_name: z.string().nonempty(),
    last_name: z.string().optional(),
    email: z.string().email('Please enter a valid email id').nonempty(),
    phone_no: z.string().optional(),
    password: z.string().nonempty(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_no: '',
      password: '',
    },
  });

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await axios
      .post(`${BASE_URL}/auth/signup`, values)
      .then((res) => res);
    console.log('res ', res);
    if (res.status === 200) {
      console.log('redirecting');
      form.reset();

      redirect(`${BASE_URL}/dashboard`);
    }
  };

  return (
    <div className='flex h-[100vh] flex-col items-center justify-center '>
      <h1 className='font-bold text-2xl'>Create your new account</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onFormSubmit)}
          className='w-1/2 lg:w-1/3  p-10 m-2 outline outline-gray-100 shadow-2xl rounded-2xl bg-gradient-to-br from-secondary/40 via-secondary/90 to-secondary/40  text-white space-y-8'
        >
          <div className='grid gap-8 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='first_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground'>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your first name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='last_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground'>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your last name here' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-foreground'>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your email here' {...field} />
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
                  <Input
                    type='password'
                    placeholder='Enter your password here'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='phone_no'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-foreground'>Phone No.</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your phone no. here' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='w-full mt-2' type='submit'>
            Submit
          </Button>
        </form>
      </Form>
      <div>
        <p>
          Already have an account?{' '}
          <span className=''>
            <Link className='text-primary underline' href={'/auth/login'}>
              Login
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default memo(SignUpPage);
