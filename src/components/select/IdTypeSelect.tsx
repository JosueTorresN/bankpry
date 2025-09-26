import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { RegisterFormValues } from '@/lib/validations/registerSchema'; // Importa el tipo del esquema

interface IdTypeSelectProps {
  register: UseFormRegister<RegisterFormValues>; // Tipamos el prop register
  error?: string;
}

const IdTypeSelect: React.FC<IdTypeSelectProps> = ({ register, error }) => {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor="idType" className="text-sm font-medium text-gray-700 mb-1">
        Tipo de identificación
      </label>
      <select
        id="idType"
        {...register('idType')} // Enlazamos el campo con React Hook Form
        className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        <option value="" disabled>Seleccione una opción</option>
        <option value="Nacional">Nacional</option>
        <option value="DIMEX">DIMEX</option>
        <option value="Pasaporte">Pasaporte</option>
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default IdTypeSelect;