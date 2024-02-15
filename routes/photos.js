import { Router } from 'express'
const router = Router()

// create route reviews

router.get('/photos', (req, res) => {
  const photos = [
    { house_id: 1, photo: 'http://1' },
    { house_id: 2, photo: 'http://2' }
  ]
  res.send('List of photos')
})
export default router
