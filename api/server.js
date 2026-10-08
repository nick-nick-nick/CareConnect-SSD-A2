const express = require("express");
const cors = require("cors");
const pool = require("./db");
const patientsRouter = require("./routes/patients");
const clinicsRouter = require("./routes/clinics");
const appointmentsRouter = require("./routes/appointments");
const bookingsRouter = require("./routes/bookings");
const appointmentStatusRouter = require("./routes/appointmentStatus");
const auditLogsRouter = require("./routes/auditLogs");
const analyticsRouter = require("./routes/analytics");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/patients", patientsRouter);
app.use("/api/clinics", clinicsRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/appointments", appointmentStatusRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/audit-logs", auditLogsRouter);
app.use("/api/analytics", analyticsRouter);
app.get("/", (req, res) => {
    res.json({ message: "CareConnect API is running" });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT COUNT(*) FROM patients"
        );

        res.json({
            patients: result.rows[0].count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database connection failed" });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});