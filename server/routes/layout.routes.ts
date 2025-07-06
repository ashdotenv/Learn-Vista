import { Router } from "express"
import { createLayout, editLayout, getLayoutByType } from "../controllers/layout.controller"

const router = Router()
router.post("/create", createLayout)
router.put("/edit", editLayout)
router.get("/type", getLayoutByType)
export default router