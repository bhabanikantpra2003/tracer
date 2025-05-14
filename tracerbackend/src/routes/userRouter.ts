import express from 'express';
import {
  login,
  signup,
  forgetpassword,
  resetpassword,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updatepassword,
  userdetail,
} from '../controller/authController';
const router = express.Router();
router.post('/signup', signup);
router.post('/signin', login);
router.post('/forgotpassword', forgetpassword);
router.patch('/resetpassword/:token', resetpassword);
router.get('/me', userdetail);
//router.route("/").get().post();
//router.route("/:id").get().patch().delete();
export default router;
