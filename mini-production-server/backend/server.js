const express = require("express");
const { Pool } = require("pg");
const redis = require("redis");
const nodemailer = require("nodemailer");

const app = express();

const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err.message);
});

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'ryuta130603@gmail.com',
      pass: 'M4ncR4f1Z00h4ir'
    }
  });
  await transporter.sendMail({to, subject, text});
}

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

app.get("/", (req, res) => {
  res.json({
    message: "Hello from backend service behind NGINX",
    service: "mini-production-server-backend",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "backend",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as current_time");
    res.json({
      status: "ok",
      database: "connected",
      current_time: result.rows[0].current_time,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "failed",
      message: error.message,
    });
  }
});

app.get("/api/redis-test", async (req, res) => {
  try {
    await connectRedis();
    await redisClient.set("ops_lab_test", "redis is working");
    const value = await redisClient.get("ops_lab_test");

    res.json({
      status: "ok",
      redis: "connected",
      value,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      redis: "failed",
      message: error.message,
    });
  }
});

app.post("/api/send-email", async (req, res) => {
  try {
    const {to, subject, text} = req.body;
    await sendEmail(to, subject, text);
    res.status(200).json({
      message: "email sent"
    })
  }catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    })
  }
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend service running on port ${PORT}`);
});
