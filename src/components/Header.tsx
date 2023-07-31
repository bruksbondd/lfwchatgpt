import { Stack } from '@/interfaces/stack.interface'
import Image from 'next/image'
import React from 'react'

export const Header = ({ logo, info }: Stack): JSX.Element => {
  return (
    <div className='header flex bg-slate-200 p-4 rounded-xl'>
      <div className='flex mr-4 justify-center items-center'>
        <Image src={logo} alt='' width={200} height={200} />
      </div>
      <div className='flex font-bold text-sm'>{info}</div>
    </div>
  )
}
