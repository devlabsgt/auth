// RUTA: ./components/account/Form.tsx

'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import Avatar from './Avatar'
import { toast } from 'react-toastify'

export default function Form({ user }: { user: User | null }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [fullname, setFullname] = useState<string | null>(null)
    const [username, setUsername] = useState<string | null>(null)
    const [website, setWebsite] = useState<string | null>(null)
    const [avatar_url, setAvatarUrl] = useState<string | null>(null) // filePath

    const getProfile = useCallback(async () => {
        try {
            setLoading(true)
            const { data, error, status } = await supabase
                .from('profiles')
                .select(`full_name, username, website, avatar_url`)
                .eq('id', user?.id)
                .single()

            if (error && status !== 406) {
                throw error
            }

            if (data) {
                setFullname(data.full_name)
                setUsername(data.username)
                setWebsite(data.website)
                setAvatarUrl(data.avatar_url)
            }
        } catch (error) {
            toast.error('Error al cargar los datos de usuario')
        } finally {
            setLoading(false)
        }
    }, [user, supabase])

    useEffect(() => {
        getProfile()
    }, [user, getProfile])

    async function updateProfile({
        username,
        website,
        avatar_url,
        fullname,
    }: {
        username: string | null
        fullname: string | null
        website: string | null
        avatar_url: string | null
    }) {
        try {
            setLoading(true)
            const { error } = await supabase.from('profiles').upsert({
                id: user?.id as string,
                full_name: fullname,
                username,
                website,
                avatar_url,
                updated_at: new Date().toISOString(),
            })
            if (error) throw error
            toast.success('¡Perfil actualizado!')
        } catch (error) {
            toast.error('Error al actualizar los datos')
        } finally {
            setLoading(false)
        }
    }

    const handleAvatarUpload = (filePath: string) => {
        setAvatarUrl(filePath);
        updateProfile({ fullname, username, website, avatar_url: filePath });
    }

    const inputStyle = "w-full rounded-md border border-gray-300 bg-white p-2 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-sm"
    const labelStyle = "mb-1 block text-xs font-medium text-gray-600 uppercase tracking-wide"
    const linkButtonStyle = "flex-1 text-center bg-transparent px-4 py-2 text-sm font-semibold text-blue-600 hover:underline hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
    const secondaryLinkButtonStyle = "flex-1 text-center bg-transparent px-4 py-2 text-sm font-semibold text-gray-600 hover:underline hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"


    return (
        <div className="flex min-h-screen justify-center bg-white py-10 sm:py-16 px-4">
            <div className="w-full max-w-md overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                
                <div className="relative w-full aspect-square"> 
                    <Avatar
                        uid={user?.id ?? null}
                        url={avatar_url}
                        width={100} 
                        height={100} 
                        onUpload={handleAvatarUpload}
                        user={user}
                    />
                </div>
                
                <div className="space-y-4 p-6 sm:p-8">
                    <div>
                        <label htmlFor="email" className={labelStyle}>Email</label>
                        <input id="email" type="text" value={user?.email ?? ''} disabled className={inputStyle} />
                    </div>
                    <div>
                        <label htmlFor="fullName" className={labelStyle}>Nombre Completo</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullname || ''}
                            onChange={(e) => setFullname(e.target.value)}
                            className={inputStyle}
                        />
                    </div>
                    <div>
                        <label htmlFor="username" className={labelStyle}>Nombre de Usuario</label>
                        <input
                            id="username"
                            type="text"
                            value={username || ''}
                            onChange={(e) => setUsername(e.target.value)}
                            className={inputStyle}
                        />
                    </div>
                    <div>
                        <label htmlFor="website" className={labelStyle}>Sitio Web</label>
                        <input
                            id="website"
                            type="url"
                            placeholder="https://tupagina.com"
                            value={website || ''}
                            onChange={(e) => setWebsite(e.target.value)}
                            className={inputStyle}
                        />
                    </div>
                </div>

                <div className="flex w-full justify-between items-center space-x-0 p-4 border-t border-gray-100 bg-white">
                    <button
                        className={linkButtonStyle}
                        onClick={() => updateProfile({ fullname, username, website, avatar_url })}
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Actualizar'}
                    </button>

                    <form action="/x/auth/signout" method="post" className="flex-1">
                        <button className={secondaryLinkButtonStyle + " w-full"} type="submit">
                            Salir
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}