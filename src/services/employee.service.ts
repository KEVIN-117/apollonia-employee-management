import { Employee, IEmployee, IEmployeeInputDTO, IEmployeeUpdateDTO } from "../models/Employee";

export class EmployeeService {
    async createEmployee(employee: IEmployeeInputDTO) {
        const newEmployee = new Employee(employee);
        await newEmployee.save();
        return newEmployee;
    }

    async getAllEmployees() {
        return await Employee.find();
    }

    async getEmployeeById(id: string) {
        return await Employee.findById(id);
    }

    async updateEmployee(id: string, employee: IEmployeeUpdateDTO) {
        const updatedEmployee = await Employee.findByIdAndUpdate(id, employee, { new: true });
        return updatedEmployee;
    }

    async deleteEmployee(id: string) {
        const deletedEmployee = await Employee.findByIdAndDelete(id);
        return deletedEmployee;
    }
}