// app.ts or server.ts (Main entry point of your application)
import express from "express";
import bodyParser from "body-parser";
import webhookRoutes from "./routes/webhookRoutes.ts";

const app = express();
// Parse JSON bodies
app.use(bodyParser.json());

// Use your webhook routes
app.use("/webhooks", webhookRoutes);

// Start the server
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
