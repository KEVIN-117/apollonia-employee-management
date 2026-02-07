import { EmployeeService } from "../services/employee.service";
import type { IEmployee } from "../models/Employee";
import { Request, Response, NextFunction } from "express";

const employeeService = new EmployeeService();

const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, department } = req.body as IEmployee;
        if (!firstName || !lastName || !department) {
            res.status(400).json({ error: "Employee name and department are required" });
            return;
        }
        const employee = await employeeService.createEmployee({ firstName, lastName, department });
        res.json(employee);
    } catch (error) {
        next(error);
    }
}

const getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employees = await employeeService.getAllEmployees();
        res.json(employees);
    } catch (error) {
        next(error);
    }
}

const getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        if (!id) {
            res.status(400).json({ error: "Employee ID is required" });
            return;
        }
        const employee = await employeeService.getEmployeeById(id);
        res.json(employee);
    } catch (error) {
        next(error);
    }
}

const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        if (!id) {
            res.status(400).json({ error: "Employee ID is required" });
            return;
        }
        const { firstName, lastName, department } = req.body as IEmployee;
        if (!firstName || !lastName || !department) {
            res.status(400).json({ error: "Employee name and department are required" });
            return;
        }
        const employee = await employeeService.updateEmployee(id, { firstName, lastName, department });
        res.json(employee);
    } catch (error) {
        next(error);
    }
}

const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        if (!id) {
            res.status(400).json({ error: "Employee ID is required" });
            return;
        }
        const employee = await employeeService.deleteEmployee(id);
        res.json(employee);
    } catch (error) {
        next(error);
    }
}

export { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee };
