const express = require ('express');
const cors = require ('cors');
const dotenv = require ('dotenv');
const { GoogleGenerativeAI } = require ('@google/generative-ai');

dotenv.config();

const app = express();
const port = 3000;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//Gemini Setup
const GenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = GenAI.getGenerativeModel({ model: "gemini-1.5-flash"});
   
app.listen(port, () => {
  console.log('Gemini CHATBOT RUNNING ON http://localhost:${PORT}' );
});

//Route penting!
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
     return res.status(400).json({ reply: "Message is required." });
    }

  try {
      const result = await model.generateContent(userMessage);
      const response = await result.response;
      const text = response.text();

      res.json({ reply: text });

    } catch (err) {
      console.error(err);
      res.status(500).json({ reply: "Something went wrong." });
    }
});