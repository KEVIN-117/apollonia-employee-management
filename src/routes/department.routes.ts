import { Router } from "express";
import { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment } from "../controllers/department.controller";

const router: Router = Router();

router.post("/", createDepartment);
router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;