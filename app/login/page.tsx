'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { login } from './actions'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit"
      aria-disabled={pending}
      className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? 'Cargando...' : 'Entrar'}
    </button>
  )
}

const initialState = {
  message: '',
  emailValue: '',
  passwordValue: '',
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction] = useActionState(login, initialState)
  
  const [email, setEmail] = useState(state.emailValue || '')
  const [password, setPassword] = useState(state.passwordValue || '')

  useEffect(() => {
    if (state?.message) {
      if (state.message === 'CredentialsError') {
         toast.error("Credenciales de inicio de sesión inválidas.", {
           position: "top-center",
           autoClose: false,
           closeOnClick: false,
           pauseOnHover: true,
           draggable: true,
           theme: "light",
         });
      } else if (state.message !== 'Success') {
         toast.error(state.message, {
           position: "top-center",
           autoClose: false,
           closeOnClick: false,
           pauseOnHover: true,
           draggable: true,
           theme: "light",
         });
      }
    }
    if (state.emailValue) setEmail(state.emailValue);
    if (state.passwordValue) setPassword(state.passwordValue);
    
  }, [state])

  return (
    <div className="flex h-screen items-center justify-center">
      
      <form action={formAction} className="flex w-full max-w-sm flex-col space-y-6 rounded-xl border border-gray-300 bg-white p-8">
        
        <h1 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h1>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-600">
            Email:
          </label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-800 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-600">
            Contraseña:
          </label>
          <div className="relative">
            <input 
              id="password" 
              name="password" 
              type={showPassword ? 'text' : 'password'} 
              required 
              className="w-full rounded-lg border border-gray-300 bg-white p-3 pr-10 text-gray-800 placeholder-gray-400 focus:border-blue-600 focus:ring-blue-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.988 5.844A2.025 2.025 0 0 0 3 7.051v11.517c0 1.203.987 2.188 2.2 2.188h13.6c.306 0 .584-.06.845-.166M7.126 7.126L7.126 7.126c-.035.051-.064.102-.095.152C7.03 7.332 7 7.433 7 7.535v11.026a2.2 2.2 0 0 0 2.2 2.188h11.026a2.2 2.2 0 0 0 2.188-2.2v-3.765M16.5 10.5h-3.9M12 21.05V22.5M12 2.5V3.95M20.5 12h-1.45" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.5C8.962 6.5 6.452 8.01 5 10.5c1.452 2.49 3.962 4 7 4s5.548-1.51 7-4c-1.452-2.49-3.962-4-7-4zm0 6a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <SubmitButton />
        
      </form>
    </div>
  )
}