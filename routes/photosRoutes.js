// import router
import { Router } from 'express'
const router = Router()

// create photos routes
router.get('/photos', (req, res) => {
  const photos = [
    { id: 1, photo: 'https://random.imagecdn.app/500/150' },
    { id: 2, photo: 'https://random.imagecdn.app/500/150' }
  ]
  res.json(photos)
})

//create /photos/1
router.get('/photos/1', (req, res) => {
  const photos1 = { id: 1, photo: 'https://random.imagecdn.app/500/150' }

  res.json(photos1)
})

// Export the router
export default router
