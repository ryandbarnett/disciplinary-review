const express = require('express');
const router = express.Router();
const db = require('../models/database');

// Endpoint to create a new infraction
router.post('/api/infractions', (req, res) => {
    const { description, studentName, studentSNumber, assignedVoters } = req.body;

    // Ensure all required data is present
    if (!description || !studentName || !studentSNumber || !assignedVoters || assignedVoters.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.serialize(() => {
        // Insert the new infraction
        const insertInfraction = `
            INSERT INTO Infractions (description, student_name, student_id, created_by)
            VALUES (?, ?, ?, ?)
        `;
        const createdBy = 1; // Replace with the ID of the admin creating the infraction
        db.run(insertInfraction, [description, studentName, studentSNumber, createdBy], function (err) {
            if (err) {
                console.error('Failed to insert infraction:', err);
                return res.status(500).json({ error: 'Failed to create infraction' });
            }

            const infractionId = this.lastID;

            // Insert assigned voters
            const insertVoters = `
                INSERT INTO Voters (infraction_id, user_id)
                VALUES (?, ?)
            `;

            const stmt = db.prepare(insertVoters);
            assignedVoters.forEach((voterId) => {
                stmt.run(infractionId, voterId, (err) => {
                    if (err) {
                        console.error('Failed to insert voter:', err);
                    }
                });
            });

            stmt.finalize((err) => {
                if (err) {
                    console.error('Failed to finalize statement:', err);
                    return res.status(500).json({ error: 'Failed to assign voters' });
                }

                res.status(201).json({ message: 'Infraction created successfully', infractionId });
            });
        });
    });
});

module.exports = router;