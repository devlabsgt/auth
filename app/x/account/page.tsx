// RUTA: ./app/x/account/page.tsx

import Form from '@/components/account/Form'
import { createClient } from '@/utils/supabase/server'

export default async function AccountPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    return <Form user={user} />
}