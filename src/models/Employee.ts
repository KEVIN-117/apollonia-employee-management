import { Schema, model } from "mongoose";

export interface IEmployee {
    firstName: string;
    lastName: string;
    department: Schema.Types.ObjectId;
}

export interface IEmployeeInputDTO {
    firstName: string;
    lastName: string;
    department: Schema.Types.ObjectId;
}

export interface IEmployeeUpdateDTO {
    firstName?: string;
    lastName?: string;
    department?: Schema.Types.ObjectId;
}

const employeeSchema = new Schema<IEmployee>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: "Department"
    }
});

export const Employee = model<IEmployee>("Employee", employeeSchema);