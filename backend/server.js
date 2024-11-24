const express = require("express");
const mongoose = require("mongoose");
const Message = require("./models/messages");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const dotenv = require("dotenv");
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
mongoose
  .connect(
    "mongodb+srv://1234:1234@cluster0.eegpygg.mongodb.net/letschatdb?retryWrites=true"
  )
  .then(() => {
    console.log("Connected to DB");
  });

app.get("/api/health", (req, res) => {
  res.json({ message: "Server Ok", status: "200" });
});

app.post("/api/login", (req, res) => {
  try {
    const { name, password } = req.body;
    if (name && password === "amol") {
      res.json({ message: "welcome" });
    } else {
      res.status(401).json({ message: "imposter" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.get("/api/messages", async (req, res) => {
  const messages = await Message.find().sort({ timestamp: 1 });
  res.json(messages);
});

app.delete("/api/messages", async (req, res) => {
  await Message.deleteMany({});
  res.json({ message: "All messages deleted" });
});

app.get("*", (req, res) => {
  res.status(404).json("Not found");
});

io.on("connection", (socket) => {
  socket.on("join", (username) => {
    console.log(`${username} has joined`);
    socket.broadcast.emit("someone_joined", username);
  });
  socket.on("leave", (username) => {
    console.log(`${username} has left`);
    socket.broadcast.emit("someone_left", username);
  });
  socket.on("client_msg", async (msg) => {
    await Message.create({ sender: msg.sender, content: msg.content });
    socket.broadcast.emit("server_msg", msg);
  });
});

app.post("/suggest", async (req, res) => {
  const { userInput } = req.body; // Extract user input
  console.log("User Input:", req.body);

  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST", // Specify HTTP method
      headers: {
        "Content-Type": "application/json", // Set content type
        Authorization: `Bearer ${OPENAI_API_KEY}`, // Add your API key
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // or gpt-4
        prompt: `Complete this sentence: "${userInput}"`,
        max_tokens: 30,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      // Handle errors returned by the API
      console.error("OpenAI API Error:", response.statusText);
      return res.status(response.status).send("Error with OpenAI API");
    }

    const data = await response.json(); // Parse JSON response
    const suggestion = data.choices[0].text.trim(); // Extract the suggestion

    console.log("Suggestion:", suggestion);
    res.json({ suggestion }); // Send suggestion to the client
  } catch (error) {
    console.error("Error generating suggestion:", error);
    res.status(500).send("Error generating suggestion");
  }
});

server.listen(4000, () => {
  console.log("Socket server listening on port 4000...");
});
