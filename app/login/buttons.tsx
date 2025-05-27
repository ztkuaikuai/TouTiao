'use client'

import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'
import { login, signup } from './actions'
import { Loader2 } from 'lucide-react'

export function LoginButton() {
  const { pending } = useFormStatus()
  return (
    <Button formAction={login} className="w-full" type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      登录
    </Button>
  )
}

export function SignupButton() {
  const { pending } = useFormStatus()
  return (
    <Button formAction={signup} variant="outline" className="w-full" type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      注册
    </Button>
  )
}
