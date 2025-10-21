import { login } from './actions'

export default function LoginPage() {
  return (
    // Contenedor principal: Centra el contenido en el medio de la pantalla
    <div className="flex h-screen items-center justify-center bg-gray-900">
      
      {/* Tarjeta del Formulario (Form Widget) */}
      <form className="flex w-full max-w-sm flex-col space-y-6 rounded-xl border border-gray-700 bg-gray-800 p-8 shadow-2xl">
        
        <h1 className="text-2xl font-bold text-white">Iniciar Sesión</h1>

        {/* Campo de Email */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-400">
            Email:
          </label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-500 focus:border-green-500 focus:ring-green-500"
          />
        </div>

        {/* Campo de Contraseña */}
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-400">
            Contraseña:
          </label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-500 focus:border-green-500 focus:ring-green-500"
          />
        </div>

        {/* Botón de Enviar */}
        <button 
          formAction={login}
          className="w-full rounded-lg bg-green-600 p-3 font-semibold text-white transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Entrar
        </button>
        
        <p className="text-center text-sm text-gray-500">
          ¿Aún no tienes cuenta? <a href="/signup" className="text-green-500 hover:underline">Regístrate</a>
        </p>
      </form>
    </div>
  )
}