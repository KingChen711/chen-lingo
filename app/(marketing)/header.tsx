import { ClerkLoaded, ClerkLoading, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import { Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'

function Header() {
  return (
    <header className='h-20 w-full border-b-2 border-slate-200 px-4'>
      <div className='lg:max-w-screen-lg mx-auto flex items-center justify-between h-full'>
        <div className='pt-8 pl-4 pb-7 flex items-center gap-x-3'>
          <div className='flex items-center gap-1'>
            <Image alt='logo' src='/site-logo.png' height={40} width={40} />

            <p className='text-[24px] font-extrabold tracking-wide leading-[31.2px] max-sm:hidden'>
              Chen<span className='text-green-500 font-extrabold tracking-wide'>Lingo</span>
            </p>
          </div>
        </div>

        <ClerkLoading>
          <Loader className='h-5 w-5 text-muted-foreground animate-spin' />
        </ClerkLoading>

        <ClerkLoaded>
          <SignedIn>
            <UserButton afterSignOutUrl='/' />
          </SignedIn>

          <SignedOut>
            <SignInButton mode='modal' afterSignInUrl='/learn' afterSignUpUrl='/learn'>
              <Button size='lg' variant='ghost'>
                Login
              </Button>
            </SignInButton>
          </SignedOut>
        </ClerkLoaded>
      </div>
    </header>
  )
}

export default Header
