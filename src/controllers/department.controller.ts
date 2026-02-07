import { Request, Response, NextFunction } from "express";
import { IDepartmentInputDTO, IDepartmentUpdateDTO } from "../models/Department";
import { DepartmentService } from "../services/department.service";

const departmentService: DepartmentService = new DepartmentService();

const createDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body as IDepartmentInputDTO;
        if (!name) {
            res.status(400).json({ error: "Department name is required" });
            return;
        }
        const department = await departmentService.createDepartment({ name });
        res.json(department);
    } catch (error) {
        next(error);
    }
}

const getAllDepartments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const departments = await departmentService.getAllDepartments();
        res.json(departments);
    } catch (error) {
        next(error);
    }
}

const getDepartmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        if (!id) {
            res.status(400).json({ error: "Department ID is required" });
            return;
        }
        const department = await departmentService.getDepartmentById(id);
        res.json(department);
    } catch (error) {
        next(error);
    }
}

const updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        if (!id) {
            res.status(400).json({ error: "Department ID is required" });
            return;
        }
        const { name } = req.body as IDepartmentUpdateDTO;
        if (!name) {
            res.status(400).json({ error: "Department name is required" });
            return;
        }
        const department = await departmentService.updateDepartment(id, { name });
        res.json(department);
    } catch (error) {
        next(error);
    }
}

const deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        if (!id) {
            res.status(400).json({ error: "Department ID is required" });
            return;
        }
        const department = await departmentService.deleteDepartment(id);
        res.json(department);
    } catch (error) {
        next(error);
    }
}

export { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment };