import cors from "cors";
import express from "express";
import morgan from "morgan";
import connect from "../server/database/conn.js";
import router from "./router/route.js";

const app = express();

const PORT = 8080;

/** Middleware */
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by"); //less hacker know about our stack

app.get("/", (req, res) => {
  res.status(201).json("Home get route");
});

/** router endpoints */
app.use("/api", router);

connect()
  .then(() => {
    try {
      app.listen(PORT, () => {
        console.log(`Server is listening on port http://localhost:${PORT}`);
      });
    } catch (error) {
      console.log("Cannot connect to the server");
    }
  })
  .catch((error) => {
    console.log("Invalide DB Connection " + error);
  });
