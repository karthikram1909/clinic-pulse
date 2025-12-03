// controllers/patientController.js
const Patient = require("../models/patientModel");

module.exports = {
  async addPatient(req, res) {
    try {
      const { name, age, purpose, notes } = req.body;

      if (!name) return res.status(400).json({ error: "Name required" });

      const patient = await Patient.createPatient({ name, age, purpose, notes });

      res.status(201).json(patient);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to add patient" });
    }
  },

  async getQueue(req, res) {
    try {
      const { status } = req.query;
      const list = await Patient.getQueue(status);
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: "Failed to load queue" });
    }
  },

  async getWaiting(req, res) {
    try {
      const waiting = await Patient.getWaiting();
      res.json(waiting);
    } catch (err) {
      res.status(500).json({ error: "Failed to load waiting list" });
    }
  },

  async startConsultation(req, res) {
    try {
      const updated = await Patient.updateStatus(req.params.id, "In Consultation");
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update status" });
    }
  },

  async markCompleted(req, res) {
    try {
      const updated = await Patient.updateStatus(req.params.id, "Completed");
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to complete consultation" });
    }
  },

  async cancelPatient(req, res) {
    try {
      const updated = await Patient.updateStatus(req.params.id, "Cancelled");
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to cancel patient" });
    }
  },

  async dashboardStats(req, res) {
    try {
      const stats = await Patient.getDashboardCounts();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: "Failed load stats" });
    }
  },
};
