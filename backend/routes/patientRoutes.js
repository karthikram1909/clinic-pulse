// routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/patientController");

router.post("/patients", controller.addPatient);
router.get("/queue", controller.getQueue);
router.get("/waiting", controller.getWaiting);
router.post("/patients/:id/start", controller.startConsultation);
router.post("/patients/:id/complete", controller.markCompleted);
router.post("/patients/:id/cancel", controller.cancelPatient);
router.get("/dashboard", controller.dashboardStats);

module.exports = router;
