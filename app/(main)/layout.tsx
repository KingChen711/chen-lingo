import MobileHeader from '@/components/shared/mobile-header'
import SideBar from '@/components/shared/side-bar'

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex flex-col'>
      <MobileHeader />
      <div className='flex relative'>
        <SideBar className='hidden lg:flex lg:fixed lg:top-0 lg:left-0' />
        <main className='lg:pl-[256px] h-screen w-full max-lg:pt-[50px]'>
          <div className='max-w-[1056px] mx-auto h-full'>{children}</div>
        </main>
      </div>
    </div>
  )
}
