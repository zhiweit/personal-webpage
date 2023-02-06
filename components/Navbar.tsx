import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import { useEffect, useState } from 'react'
import { UserJwtPayload } from '@/lib/auth'
import { Avatar, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import Box from '@mui/material/Box'
import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'

export default function SimpleBottomNavigation() {
  const [value, setValue] = useState(0)
  const [role, setRole] = useState<undefined | 'USER' | 'ADMIN'>()

  const navbarItems: { label: string, href: string }[] = [
    { label: 'About', href: role === 'ADMIN' ? '/admin/about' : '#about' },
    { label: 'Projects', href: role === 'ADMIN' ? '/admin/projects' : '#projects' },
    { label: 'Experiences', href: role === 'ADMIN' ? '/admin/experiences' : '#experiences' },
    { label: 'Certifications', href: role === 'ADMIN' ? '/admin/certifications' : '#certifications' },
    { label: 'Contact', href: role === 'ADMIN' ? '/admin/contact' : '#contact' },
    // { label: 'Register', href: role === 'USER' || role === undefined ? '/register' },
    // { label: 'Login', href: '/login' },
  ]

  useEffect(() => { // get USER cookie and set role once component mounted
    // console.log('running useEffect')
    const fetchUserRole = async () => {
      try {
        const res = await fetch('/api/cookies')
        
        if (res.status === 200) {
          const { data: token }: { data: UserJwtPayload } = await res.json()
          if (token.role === 'ADMIN' || token.role === 'USER') {
            setRole(token.role)
          }
        
        }
      } catch (error: unknown) {
        console.error('error in Navbar fetchUserRole', error)
      }
    }
    fetchUserRole()

    // set navbar value based on current route
    const i = document.baseURI.lastIndexOf("/")
    const lastRoute = document.baseURI.substring(i + 1)
    let routeIndex: number | undefined = undefined
    const route = navbarItems.find((item, index) => {
      if (item.label.toLowerCase() === lastRoute.toLowerCase()) routeIndex = index
    })
    if (routeIndex !== undefined) {
      setValue(routeIndex + 1)
    }
    // console.log('lastRoute', lastRoute, 'routeIndex', routeIndex)
  }, [value])

  // Drawer to open on small media breakpoint
  const [open, setOpen] = useState(false)
  const list = () => (
    <Box
      className='w-fit h-[100%] bg-white'
      role="presentation"
      onClick={(event) => setOpen(false)}
      onKeyDown={(event) => setOpen(false)}
    >
      <List>
        <ListItem key='-1' className='font-medium m-2'> Thean Zhi Wei </ListItem>
        {navbarItems.map((navItem, index) => (
          <ListItem key={index}>
            <ListItemButton>
              <a href={navItem.href}>
                <ListItemText primary={navItem.label} />
              </a>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )


  return (
    <>
      <BottomNavigation
        className='w-auto bg-white h-16 hidden md:flex'
        showLabels={true}

        value={value}
        onChange={(event, newValue) => {
          setValue(newValue)
        }}
      >

        <BottomNavigationAction className='mr-auto'
          href='/'
          label="Thean Zhi Wei"
        />
        {navbarItems.map((navItem, index) => (
          <BottomNavigationAction label={navItem.label} href={navItem.href} key={index} />
        ))}

        {/* Show register if the visitor does not have jwt token */}
        {role === undefined ?
          <BottomNavigationAction label='Register' href={'/register'} /> :
          null
        }

        {role === undefined ? // if do not have jwtpayload, navbar should be login, if have jwt payload, navbar should be logout
          <BottomNavigationAction label='Login' href='/login' /> :
          <BottomNavigationAction label='Logout' onClick={async () => {
            setRole(undefined)
            // await fetch('/api/cookies', { method: 'DELETE' })  TO-DO: fix logout, remove cookie

          }} />}

      </BottomNavigation>

      <div className='flex p-2 md:hidden'>
        <Link href="/" className='font-medium'>Thean Zhi Wei</Link>
        <IconButton className='ml-auto'
          onClick={(e) => setOpen(true)}
        >
          <MenuIcon fontSize='large' />
        </IconButton>
      </div>

      <Drawer
        anchor='left'
        open={open}
        onClose={() => setOpen(false)}
      >
        {list()}
      </Drawer>
    </>
  )
}