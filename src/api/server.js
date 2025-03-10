const express = require("express");
const net = require("net");
const blocking = require("./routes/blocking");
const listing = require("./routes/listing");

async function findAvailablePort(startPort) {
  let port = startPort;

  while (port < 65536) {
    // Maximum port number
    try {
      await new Promise((resolve, reject) => {
        const tester = net
          .createServer()
          .once("error", (err) => {
            if (err.code === "EADDRINUSE") {
              port++;
              resolve(false);
            } else {
              reject(err);
            }
          })
          .once("listening", () => {
            tester.once("close", () => resolve(true)).close();
          })
          .listen(port);
      });
      return port;
    } catch (err) {
      console.error(`Error testing port ${port}:`, err);
      port++;
    }
  }
  throw new Error("No available ports found");
}

async function initializeAPI(client) {
  const app = express();
  const preferredPort = process.env.PORT || 3000;

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS middleware
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    next();
  });

  // Inject WhatsApp client into request object
  app.use((req, res, next) => {
    req.waClient = client;
    next();
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: "Something went wrong!",
    });
  });

  // Routes
  app.use("/api", blocking);
  app.use("/api", listing);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "healthy" });
  });

  try {
    const port = await findAvailablePort(preferredPort);
    app.listen(port, () => {
      console.log(`API server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to initialize API server:", error);
    throw error;
  }

  return app;
}

module.exports = { initializeAPI };
