import { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'
import { withNextSession } from '@/lib/session'
import { dbConnect } from '@/lib/lowDb'
import bots from './bots.json'

type Keys = keyof typeof bots

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const USER_NAME = 'Human'
const AI_NAME = 'Walt'

const MEMORY_SIZE = 6

export default withNextSession(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const stack = req.query.stack as Keys
      const body = req.body
      const prompt = body.prompt || ''
      const { user } = req.session

      if (!configuration.apiKey) {
        return res
          .status(500)
          .json({ result: { message: 'SessionOpenAi api Key is missing!' } })
      }
      if (!user) {
        return res
          .status(500)
          .json({ result: { message: 'Session is missing!' } })
      }

      try {
        const db = await dbConnect()
        await db.read()

        db.data = db.data || { messageHistory: {} }
        db.data.messageHistory[user.uid] =
          db.data.messageHistory[user.uid] || []
        db.data.messageHistory[user.uid].push(`${USER_NAME}: ${prompt}\n`)
        const aiPrompt = bots[stack].prompt

        const openai = new OpenAIApi(configuration)
        //const formatedPrompt = AI_PROMPT + '\n' + prompt + '\n' + 'Walt:'

        const completion: any = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt:
            aiPrompt + db.data.messageHistory[user.uid].join('') + 'Walt:',
          temperature: 0.7,
          max_tokens: 1024,
        })

        const aiResponse = completion.data.choices[0].text.trim()
        db.data.messageHistory[user.uid].push(`${AI_NAME}: ${aiResponse}\n`)

        if (db.data.messageHistory[user.uid].length > MEMORY_SIZE) {
          db.data.messageHistory[user.uid].splice(0, 2)
        }

        return res.status(200).json({ result: aiResponse })
      } catch (e) {
        return res
          .status(500)
          .json({ error: { message: (e as Error).message } })
      }
      // const aiResponse = 'React JS is a library for creating UIs..'
      // await new Promise((res) => setTimeout(res, 500))
    } else if (req.method === 'PUT') {
      const { uid } = req.query

      if (!uid) {
        return res
          .status(500)
          .json({ error: { message: 'Invalid uid provided!' } })
      }

      req.session.user = {
        uid,
      }

      await req.session.save()

      return res.status(200).json(uid)
    } else if (req.method === 'DELETE') {
      const { user } = req.session

      if (user) {
        const db = await dbConnect()
        db.data.messageHistory[user.uid] = []

        return res.status(200).json({ message: 'History cleared!' })
      }

      return res.status(200).json({ message: 'Nothing to clear!' })
    } else {
      return res.status(500).json({ error: { messages: 'Invalid Api Router' } })
    }
  }
)
