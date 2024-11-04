import path from "path";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const BLOG_FOLDER_PATH= path.join(__dirname, "../blogs");
