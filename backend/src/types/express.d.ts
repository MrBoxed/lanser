// types/express/index.d.ts

import { JwtPayload } from "./auth.types";
// import "express";

// declare module "express" {
//   export interface Request {
//     file?: Express.Multer.File;
//     thumbnail?: Express.Multer.File;
//   }
// }
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
