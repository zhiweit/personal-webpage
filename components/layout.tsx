import Navbar from './Navbar'

export default function Layout({ children } : { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className='bg-slate-100' >{children}</main>
    </>
  )
}