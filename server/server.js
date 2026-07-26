const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
dotenv.config();
const mongoose = require('mongoose');
const app = express();
const jwt = require('jsonwebtoken');
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('DeepDev API is running...');
});
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

   await newUser.save();

const token = jwt.sign(
  { userId: newUser._id },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

res.status(201).json({
  message: "User registered successfully",
  token,
  user: {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    createdAt: newUser.createdAt,
  },
});
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
app.put('/api/auth/update', async (req, res) => {
  try {
    const { userId, username, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) {
      user.username = username;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
app.post('/api/challenges/solve', async (req, res) => {
  try {
    const { userId, challengeId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.solvedChallenges.includes(challengeId)) {
      user.solvedChallenges.push(challengeId);
      await user.save();
    }

    res.status(200).json({ message: "Challenge marked as solved", solvedChallenges: user.solvedChallenges });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get('/api/challenges/solved/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ solvedChallenges: user.solvedChallenges });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});