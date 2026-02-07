import { App } from "./app";
import { Database } from "./config/db";

const db = Database.getInstance();
const app = new App();

app.setupRoutes();
app.setupErrorHandling();
app.setupStaticFiles();
app.start();
