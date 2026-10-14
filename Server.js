import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/universityDB";

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true }, 
    },
    { timestamps: true }
);
const User = mongoose.model("User", userSchema);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name?.trim() || !email?.trim() || !password) {
            return res.status(400).json({ message: "Name, email and password are important." });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Enter Your Valid Email" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Enter minimum 6 charcater" });
        }

        const exists = await User.findOne({ email: email.toLowerCase().trim() });
        if (exists) {
            return res.status(409).json({ message: "Already Exist Email" });
        }

        const hashed = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashed });

        res.status(201).json({ message: "Registration successful" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Already Exist Account" });
        }
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const invalid = { message: "Invalid email or password" };

        if (!email || !password) return res.status(401).json(invalid);

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return res.status(401).json(invalid);

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json(invalid);

        res.json({
            message: "Login successful",
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    });
