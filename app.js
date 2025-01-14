import "dotenv/config";
import express from "express";
import path from "path";
import fetch from "node-fetch";
import { error } from "console";

//https://api.openai.com/v1/chat/completions

const app = express();
const port = 3000;

const env = process.env;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, resp) => {
  resp.render("index", {
    corrected: "",
    originalText: "",
  });
});

app.post("/correct", async (req, resp) => {
  const text = req.body.text.trim();
  if (!text) {
    return resp.render("index", {
      corrected: "Please enter some text",
      originalText: text,
    });
  }
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant" },
          {
            role: "user",
            content: `Correct the following text: ${text}`,
          },
        ],
        max_tokens: 100,
        n: 1,
        stop: null,
        temperature: 1,
      }),
    });
    if (!response.ok) {
      console.log(response);
      return resp.render("index", {
        corrected: "Error Please Try Again Later",
        originalText: text,
      });
    }
    const data = await response.json();
    const correctedText = data.choices[0].message.content;
    return resp.render("index", {
      corrected: correctedText,
      originalText: text,
    });
  } catch (error) {
    return resp.render("index", {
      corrected: error,
      originalText: text,
    });
  }
});

app.listen(port, () => {
  console.log(`Server Started at port:${port}`);
});
