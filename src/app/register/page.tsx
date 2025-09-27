'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import IdTypeSelect from '@/components/select/IdTypeSelect';
import ConfirmPassword from '@/components/password/PasswordConfirmInput';
import { registerSchema, RegisterFormValues } from '@/lib/validations/registerSchema';

const RegisterPage = () => {
  const router = useRouter();
  const [showTerms, setShowTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    // Aquí puedes manejar la lógica de envío del formulario, como una llamada a la API
    console.log('Datos del formulario:', data);
    // Simula una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('¡Registro exitoso!');
  };

  const handleShowTerms = () => {
    // Lógica para abrir el PDF en una ventana modal
    // Puedes usar una biblioteca de modales o un simple estado
    setShowTerms(true);
  };

  const watchAcceptTerms = watch('acceptTerms');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Registro de Usuario</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Tipo de Identificación (Componente reutilizable) */}
          <IdTypeSelect register={register} error={errors.idType?.message} />

          {/* Número de identificación */}
          <div>
            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">Número de identificación</label>
            <input type="text" id="idNumber" {...register('idNumber')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            {errors.idNumber && <p className="mt-1 text-xs text-red-500">{errors.idNumber.message}</p>}
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" id="username" {...register('username')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
          </div>

          {/* Nombre completo */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nombre completo</label>
            <input type="text" id="fullName" {...register('fullName')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
            <input type="date" id="birthDate" {...register('birthDate')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            {errors.birthDate && <p className="mt-1 text-xs text-red-500">{errors.birthDate.message}</p>}
          </div>

          {/* Correo electrónico */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input type="email" id="email" {...register('email')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono (opcional)</label>
            <input type="tel" id="phone" {...register('phone')} placeholder="+506 ####-####" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input type="password" id="password" {...register('password')} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {/* Confirmación de Contraseña (Componente reutilizable) */}
          <ConfirmPassword register={register} error={errors.confirmPassword?.message} />

          {/* Términos y condiciones */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="acceptTerms"
              {...register('acceptTerms')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="acceptTerms" className="text-sm font-medium text-gray-700">
              Acepto los <button type="button" onClick={handleShowTerms} className="text-blue-600 hover:underline">términos y condiciones</button>
            </label>
          </div>
          {errors.acceptTerms && <p className="mt-1 text-xs text-red-500">{errors.acceptTerms.message}</p>}

          {/* Botón de registro */}
          <button
            type="submit"
            disabled={!watchAcceptTerms || isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-colors duration-200 ${
              watchAcceptTerms
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        {/* Modal para términos y condiciones */}
        {showTerms && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl h-full max-h-[80vh]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Términos y Condiciones</h2>
                <button onClick={() => setShowTerms(false)} className="text-gray-500 hover:text-gray-700">
                  &times;
                </button>
              </div>
              <div className="w-full h-full">
                {/* Aquí iría el iframe para el PDF. Puedes reemplazar la URL con la tuya. */}
                <iframe src="/path/to/your/terms.pdf" className="w-full h-[90%] border-0" title="Términos y condiciones"></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;