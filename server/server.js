import express from "express"
import * as dotenv from "dotenv" // import everything -- *
import cors from "cors"
import { Configuration, OpenAIApi } from "openai"

// tu be able to use dotenv In vanilla JS
dotenv.config()

console.log(process.env.SECRET_KEY_OPENAI)

const configuration = new Configuration({
  apiKey: process.env.SECRET_KEY_OPENAI,
})

// pass Json from the FrontEnd To the BackEnd
const openai = new OpenAIApi(configuration)
const app = express()
// MiddleWare
app.use(cors())
app.use(express.json())

// dommy get and post routes

app.get("/", async (req, res) => {
  res.status(200).send({
    msg: "Hello from Codex",
  })
})

// THIS IS THE CODE TO GET THE RESPONSE FROM THE
// allow to have a body
app.post("/", async (req, res) => {
  try {
    // remember  get the prompt
    const prompt = req.body.prompt

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    })
    res.status(200).send({
      bot: response.data.choices[0].text,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send(error || "Something went wrong")
  }
})
// SERVER ALWAYS LISTEN !!!
app.listen(4000, () =>
  console.log("AI server started on http://localhost:4000")
)
