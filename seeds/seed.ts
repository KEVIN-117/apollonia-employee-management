import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import { Department } from "../src/models/Department";
import { Employee } from "../src/models/Employee";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in .env");
    process.exit(1);
}

interface DepartmentSeed {
    name: string;
}

interface EmployeeSeed {
    firstName: string;
    lastName: string;
    department: string;
}

const seedDatabase = async () => {
    try {
        console.log("🌱 Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);

        console.log("🧹 Cleaning existing data...");
        await Department.deleteMany({});
        await Employee.deleteMany({});

        console.log("🏥 Seeding departments...");
        const departmentsPath = path.join(__dirname, "departments.json");
        const departmentsData: DepartmentSeed[] = JSON.parse(
            fs.readFileSync(departmentsPath, "utf-8")
        );

        const createdDepartments = await Department.insertMany(departmentsData);

        const departmentMap = new Map<string, mongoose.Types.ObjectId>();
        createdDepartments.forEach((dept) => {
            departmentMap.set(dept.name, dept._id);
        });

        console.log("👩‍⚕️ Seeding employees...");
        const employeesPath = path.join(__dirname, "employees.json");
        const employeesData: EmployeeSeed[] = JSON.parse(
            fs.readFileSync(employeesPath, "utf-8")
        );

        const employeesWithDeptIds = employeesData.map((emp) => {
            const departmentId = departmentMap.get(emp.department);

            if (!departmentId) {
                throw new Error(`Department not found: ${emp.department}`);
            }

            return {
                firstName: emp.firstName,
                lastName: emp.lastName,
                department: departmentId,
            };
        });

        await Employee.insertMany(employeesWithDeptIds);

        console.log("✅ Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error while seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
