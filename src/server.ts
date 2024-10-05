import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/login/:piId", (req: Request, res: Response) => {
  const piId = req.params.piId;
  // Redirect user to BCC login (this will need the actual BCC endpoint for authentication)
  const loginUrl = `https://login.bcc.no/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&state=${piId}`;
  res.redirect(loginUrl);
});

app.get("/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {
    // Exchange authorization code for an access token
    const response = await axios.post("https://login.bcc.no/oauth/token", {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: process.env.REDIRECT_URI,
    });

    const accessToken = response.data.access_token;
    console.log("datas", req.body);

    // Send token to the Raspberry Pi (which can be done via a local network or other means)
    await axios.post(`http://localhost:4000/api/token`, {
      access_token: accessToken,
    });

    res.send("Login successful! You can now close this page.");
  } catch (error) {
    console.error("Error during token exchange:", error);
    res.status(500).send("An error occurred.");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
