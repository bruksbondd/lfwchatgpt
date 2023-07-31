import { Header } from '@/components/Header'
import { Message } from '@/components/Message'
import { Prompt } from '@/components/Prompt'
import stacks from '@/data/stacks.json'
import {
  Params,
  Stack,
  StackKey,
  StackPageProps,
} from '@/interfaces/stack.interface'
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next'
import Image from 'next/image'
import { ParsedUrlQuery } from 'querystring'
import { useEffect, useRef, useState } from 'react'
export default function Stack({
  stack,
  stackKey,
}: StackPageProps): JSX.Element {
  const [messages, setMessages] = useState<Array<TMessages>>([])
  const chatRef = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo(0, chatRef.current.scrollHeight)
    }
  }, [messages])

  const onSubmit = (prompt: string) => {
    if (prompt.trim().length === 0) {
      return
    }
    setMessages((messages) => {
      return [
        ...messages,
        {
          id: new Date().toISOString(),
          author: 'human',
          avatar:
            'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png',
          text: prompt,
        },
      ]
    })
  }

  return (
    <div className='h-full flex flex-col'>
      <Header logo={stack.logo} info={stack.info} />

      <hr className='my-4' />
      <div ref={chatRef} className='chat flex flex-col h-full overflow-scroll'>
        {messages.map((message, index) => (
          <Message
            key={message.id}
            idx={index}
            avatar={message.avatar}
            text={message.text}
          />
        ))}
      </div>

      <div className='flex p-4'>
        <Prompt onSubmit={onSubmit} />
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = (Object.keys(stacks) as Array<keyof typeof stacks>).map(
    (key) => ({
      params: { stack: key },
    })
  )

  return {
    paths,
    fallback: false,
  }
}

// export async function getStaticPaths() {
//   const paths = (Object.keys(stacks) as Array<keyof typeof stacks>).map(
//     (key) => ({
//       params: { stack: key },
//     })
//   )

//   return {
//     paths,
//     fallback: true,
//   }
// }

export const getStaticProps: GetStaticProps<StackPageProps> = async (
  context: GetStaticPropsContext<ParsedUrlQuery>
) => {
  const { stack } = context.params as Params

  return {
    props: {
      stack: stacks[stack as StackKey],
      stackKey: stack,
    },
  }
}

type TMessages = {
  id: string
  author: string
  avatar: string
  text: string
}
