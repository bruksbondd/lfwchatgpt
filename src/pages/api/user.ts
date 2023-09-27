import { withNextSession } from '@/lib/session'
import { NextApiRequest, NextApiResponse } from 'next'

export default withNextSession(userRoute)

function userRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user) {
    return res.status(200).json(req.session.user)
  } else {
    return res.status(200).json(null)
  }
}
