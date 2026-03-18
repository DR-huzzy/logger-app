import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { app } from "./app";

//dotenv.config({path: './.env'});

//CREATE SERVER

const port = process.env.PORT;

const server = app.listen( port, () => {
    console.log(`Server is running on port ${port}`);
}); 

