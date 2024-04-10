import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SignInPage = () => {
  return (
    <main className='flex h-screen w-full items-center justify-center'>
        <SignIn 
        appearance={{
            layout:{
                logoImageUrl: '/icons/logo.png',
                socialButtonsVariant: 'iconButton'
            },
            variables:{
                colorText: '#fff',
                colorPrimary: '#0E78F9',
                colorBackground: '#1c1f2e',
                colorInputBackground: '#252a41',
                colorInputText: '#fff'
            }
        }}
        />
    </main>
  )
}

export default SignInPage