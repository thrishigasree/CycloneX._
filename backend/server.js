import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// MONGODB
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is not defined in .env");
  process.exit(1);
}

const client = new MongoClient(uri);

let users;


async function connectDB() {
  try {
    await client.connect();

    console.log("MongoDB connected successfully");

    const db = client.db("Cyclone");

    users = db.collection("users");

  
    await users.createIndex(
      { email: 1 },
      { unique: true }
    );

    console.log("Database: Cyclone");
    console.log("Collection: users");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}


// SIGNUP
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    
    const existingUser = await users.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

  
    const newUser = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await users.insertOne(newUser);

    console.log("New user created:", result.insertedId);

    res.status(201).json({
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

   
    const user = await users.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.log("User logged in:", user.email);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

//Routes
app.get("/", (req, res) => {
  res.json({
    message: "CycloneX backend is running",
  });
});


const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
