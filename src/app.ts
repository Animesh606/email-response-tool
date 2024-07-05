import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import authRouter from "./routers";
import "./config/passportConfig";
import "./Utils/taskScheduler";

dotenv.config();

const app = express();

app.use(session({ secret: "ItisHiSecret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/connect", authRouter);

export default app;