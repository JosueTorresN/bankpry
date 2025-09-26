import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { RegisterFormValues } from '@/lib/validations/registerSchema';

interface ConfirmPasswordProps {
  register: UseFormRegister<RegisterFormValues>;
  error?: string;
}

const ConfirmPassword: React.FC<ConfirmPasswordProps> = ({ register, error }) => {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-1">
        Confirmación de contraseña
      </label>
      <input
        type="password"
        id="confirmPassword"
        {...register('confirmPassword')}
        className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default ConfirmPassword;