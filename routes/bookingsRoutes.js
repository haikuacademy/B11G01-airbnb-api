import { Router } from 'express'
const router = Router()

// create route reviews

router.get('/bookings', (req, res) => {
  const bookings = [
    { house_id: 1, name: 'House A', price: 100 },
    { house_id: 2, name: 'House B', price: 150 }
  ]
  res.json('bookings')
  console.log({ house_id: 1, name: 'House B', price: 100 })
})
export default router
