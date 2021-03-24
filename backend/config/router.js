import express from 'express'
import { getAllFestivals, getOneFestival, deleteFestival, updateFestival, addFestival, addCommentToFestival, deleteCommentFromFestival } from '../controllers/festivals.js'
import { registerUser, loginUser } from '../controllers/auth.js'
import { getUserProfile } from '../controllers/users.js'
import { secureRoute } from '../config/secureRoute.js'

const router = express.Router()

router.route('/festivals')
  .get(getAllFestivals)
  .post(secureRoute, addFestival)

router.route('/festivals/:id')
  .get(getOneFestival)
  .put(secureRoute, updateFestival)
  .delete(secureRoute, deleteFestival)

  router.route('/festivals/:id/comments')
  .post(secureRoute, addCommentToFestival)

router.route('/festivals/:id/comments/:commentId')
  .delete(secureRoute, deleteCommentFromFestival)

router.route('/register')
  .post(registerUser)

router.route('/login')
  .post(loginUser)

router.route('/profile')
  .get(secureRoute, getUserProfile)

export default router
