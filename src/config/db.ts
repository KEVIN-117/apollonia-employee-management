import { envConfig } from "./env.config";
import mongoose from "mongoose";

export class Database {
    private static instance: Database;
    private constructor() {
        this.connect();
    }
    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    private async connect() {
        try {
            await mongoose.connect(envConfig.MONGO_URI);
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Error connecting to MongoDB", error);
        }
    }
}