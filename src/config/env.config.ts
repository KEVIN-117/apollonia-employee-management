import { config } from "dotenv";
import z from "zod";
config();

interface EnvConfig {
    PORT: number;
    MONGO_URI: string;
    API_VERSION: string;
}

const envSchema = z.object({
    PORT: z.string().transform((val) => Number(val)),
    MONGO_URI: z.string(),
    API_VERSION: z.string(),
});


const { data, success, error } = envSchema.safeParse(process.env);

if (!success) {
    throw new Error(error.message);
}

export const envConfig: EnvConfig = data;