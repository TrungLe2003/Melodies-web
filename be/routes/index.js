import { Router } from "express";
import V1Router from "./v1/index.js";

const RootRouter = Router();

RootRouter.use("/v1", V1Router);

export default RootRouter;
