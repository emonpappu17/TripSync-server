import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.get('/', (req, res) => {
    res.send('Hello World!')
})


router.post("/create-user", authController.createUser)


export const authRoutes = router;