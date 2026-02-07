import { Department, IDepartmentInputDTO, IDepartmentUpdateDTO } from "../models/Department";

export class DepartmentService {
    async createDepartment(department: IDepartmentInputDTO) {
        const newDepartment = new Department(department);
        await newDepartment.save();
        return newDepartment;
    }

    async getAllDepartments() {
        return await Department.find();
    }

    async getDepartmentById(id: string) {
        return await Department.findById(id);
    }

    async updateDepartment(id: string, department: IDepartmentUpdateDTO) {
        const updatedDepartment = await Department.findByIdAndUpdate(id, department, { new: true });
        return updatedDepartment;
    }

    async deleteDepartment(id: string) {
        const department = await Department.findByIdAndDelete(id);
        return department;
    }
}