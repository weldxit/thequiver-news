import { Link } from '@mui/material'
import React from 'react'

export default function Redirect() {
  return (
    <div style={{width:'100%',height:'100vh',display:'flex',flexDirection:'column', gap:'1rem',justifyContent:'center',alignItems:'center', backgroundColor:'white'}}>
        <Link href='https://quiver-admin.vercel.app'>quiver-admin.vercel.app</Link>
        <p>click here to redirect upload page</p>
    </div>
  )
}
