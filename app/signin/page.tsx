"use client"
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SignInPage(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const router = useRouter()
  const search = useSearchParams()

  const handle = async (e:any)=>{
    e.preventDefault()
    setError('')
    const res = await signIn('credentials',{email,password,redirect:false})
    if(res?.error) return setError('認証失敗')
    router.push(search.get('callbackUrl') || '/')
  }

  return (
    <div style={{padding:40}}>
      <h2>ecback2 管理ログイン</h2>
      <form onSubmit={handle}>
        <div><label>Email <input value={email} onChange={e=>setEmail(e.target.value)} /></label></div>
        <div><label>Password <input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label></div>
        <button type="submit">ログイン</button>
      </form>
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  )
}
