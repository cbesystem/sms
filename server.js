const express = require("express");
const AfricasTalking = require("africastalking");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const africastalking = AfricasTalking({
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME
});

const sms = africastalking.SMS;

app.post("/api/send-sms", async (req, res) => {
    try {
        const { phone, message } = req.body;

        if (!phone || !message) {
            return res.status(400).json({
                success: false,
                error: "Phone and message are required"
            });
        }

        if (!/^\+254[17]\d{8}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                error: "Invalid Kenyan phone number"
            });
        }

        if (typeof message !== "string" ||
            !message.trim() || message.length > 1000) {
            return res.status(400).json({
                success: false,
                error: "Invalid message"
            });
        }

        const result = await sms.send({
            to: [phone],
            message: message.trim()
        });

        res.json({
            success: true,
            message: "SMS request accepted",
            result: result
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "SMS sending failed. Check API credentials."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("AVTECH SMS running on port " + PORT);
});