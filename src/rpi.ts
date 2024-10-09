// Mock Raspberry Pi server for testing purposes
import axios from "axios";
import express from "express";

const piApp = express();
let token = "";

piApp.use(express.urlencoded({ extended: true }));
piApp.use(express.json());

piApp.post("/api/token", async (req, res) => {
  token = req.body.access_token;

  console.log("Received token successfully");

  const response = await axios.get(
    "https://ca-aksjonapp-api.kindisland-edecf2b1.westeurope.azurecontainerapps.io/BukStatus/personal",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("Current BUK Status:", response.data);

  res.sendStatus(200);
});

piApp.listen(4000, () => {
  console.log("Mock Raspberry Pi running at http://localhost:4000");
});
