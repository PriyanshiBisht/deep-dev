const express = require('express');

const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
dotenv.config();
const mongoose = require('mongoose');
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
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
const REVIEW_SYSTEM_PROMPT = `You are a code reviewer for a web development learning platform.
You will be given a challenge description and a student's HTML, CSS, and JS code.
Identify bugs, give improvement suggestions specific to the challenge requirements,
and generate a score.
Respond ONLY with valid JSON in exactly this format, no extra text:
{
  "score": <number 0-10>,
  "bugs": ["bug description 1", "bug description 2"],
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;

app.post('/api/review', async (req, res) => {
  try {
    const { challengeTitle, challengeDescription, html, css, js } = req.body;

    if (!challengeDescription) {
      return res.status(400).json({ message: "Challenge description missing" });
    }

    const codeBlock = `HTML:\n${html}\n\nCSS:\n${css}\n\nJS:\n${js}`;

    const response = await groq.chat.completions.create({
      model:"openai/gpt-oss-120b",
      messages: [
        { role: "system", content: REVIEW_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Challenge: ${challengeTitle}\nDescription: ${challengeDescription}\n\nStudent's code:\n${codeBlock}`,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const review = JSON.parse(response.choices[0].message.content);
    res.status(200).json({ review });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});