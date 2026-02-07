import { Schema, model } from "mongoose";

export interface IDepartment {
    name: string;
    employees: Schema.Types.ObjectId[];
}

export interface IDepartmentInputDTO {
    name: string;
}

export interface IDepartmentUpdateDTO {
    name?: string;
}

const departmentSchema = new Schema<IDepartment>({
    name: {
        type: String,
        required: true
    },
    employees: {
        type: [Schema.Types.ObjectId],
        ref: "Employee"
    }
});

export const Department = model<IDepartment>("Department", departmentSchema);