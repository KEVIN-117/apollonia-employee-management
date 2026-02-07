import express from "express";
import { envConfig } from "./config/env.config";
import departmentRoutes from "./routes/department.routes";
import employeeRoutes from "./routes/employee.routes";
import { NextFunction, Request, Response } from "express";


export class App {
    private app: express.Application;
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    public start() {
        this.app.listen(envConfig.PORT, () => {
            console.log(`Server is running on port ${envConfig.PORT}`);
        });
    }

    public setupStaticFiles() {
        this.app.use(express.static("public"));
    }

    public setupRoutes() {
        this.app.use(`/api/${envConfig.API_VERSION}/departments`, departmentRoutes);
        this.app.use(`/api/${envConfig.API_VERSION}/employees`, employeeRoutes);
    }

    public setupErrorHandling() {
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error(err.stack);
            res.status(500).json({ error: "Internal server error" });
        });
    }
}