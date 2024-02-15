import { Router } from 'express'
const router = Router()

//authRoutes for /signup
router.get('/signup', (req, res) => {
  let signUpMessage = 'This is from Signup'
  res.send(signUpMessage)
})

//authRoutes for /login
router.get('/login', (req, res) => {
  let logInMessage = 'This is from login'
  res.send(logInMessage)
})

//authRoutes for /logout
router.get('/logout', (req, res) => {
  let logOutMessage = 'This is from logout'
  res.send(logOutMessage)
})

// Export the router
export default router
