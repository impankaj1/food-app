'use client';

import { FC, memo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';

interface SignUpProps {}

const SignUpPage: FC = (props: SignUpProps) => {
  const [formData, setFormdata] = useState({
    firstName: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormdata((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    axios.post(`${process.env.NEXT_PUBLIC_NEXT_PUBLIC_BASE_URL}`);
  };

  return (
    <div>
      <h1>SignupPage</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor='firstName'>First Name</Label>
          <Input
            name='firstName'
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};

export default memo(SignUpPage);
