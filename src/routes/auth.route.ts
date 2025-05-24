import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";

const router = Router();

// export default (router: Router) => {
router.post("/auth/register", registerUser);
//   router.post("/login", loginUser);
// };
export default router;
