const express = require('express');
const router = express.Router();
const SemanticAgent = require('../services/SemanticAgent');
const UserProfile = require('../models/UserProfile');

// POST /api/adapt
// Receives: { url, userProfile: { daltonismType, ... }, elementsToAnalyze: [...] }
router.post('/adapt', async (req, res) => {
  try {
    const { elementsToAnalyze, userProfile } = req.body;
    
    if (!elementsToAnalyze || !userProfile) {
      return res.status(400).json({ error: "Missing elementsToAnalyze or userProfile" });
    }

    // Call the Semantic Agent
    const adaptationResponse = await SemanticAgent.adaptContent(elementsToAnalyze, userProfile);
    
    res.json(adaptationResponse);
  } catch (error) {
    console.error("Error in adaptation agent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/user/profile
// Save user preferences
router.post('/user/profile', async (req, res) => {
    try {
        const profile = new UserProfile(req.body);
        await profile.save();
        res.json({ status: 'success', message: 'Profile saved', id: profile._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/seed
// Helper to seed database with knowledge for demo
const VisualResource = require('../models/VisualResource');
router.post('/seed', async (req, res) => {
    try {
        await VisualResource.deleteMany({}); // Clear existing
        
        const resources = [
            {
                elementId: "img1",
                type: "image",
                description: "Un semáforo mostrando luz roja.",
                semanticMetadata: {
                    type: "ImageObject",
                    caption: "Semáforo Rojo",
                    colorPalette: [
                        { colorName: "Rojo", hex: "#FF0000" },
                        { colorName: "Amarillo", hex: "#FFFF00" },
                        { colorName: "Verde", hex: "#00FF00" }
                    ]
                }
            },
            {
                elementId: "chart1",
                type: "chart",
                description: "Gráfico de ventas trimestrales con desglose completo del año.",
                semanticMetadata: {
                    type: "DataFeed",
                    name: "Ventas 2023",
                    colorPalette: [
                        { colorName: "Rojo", hex: "#FF0000" },      // Q1
                        { colorName: "Verde", hex: "#00FF00" },     // Q2
                        { colorName: "Amarillo", hex: "#FFFF00" },  // Q3
                        { colorName: "Azul", hex: "#0000FF" }       // Q4
                    ]
                }
            },
            {
                elementId: "rainbow1",
                type: "image", // Treating it as an image for CSS filter application, but we'll also visualize palette
                description: "Espectro de colores del arcoíris ampliado.",
                semanticMetadata: {
                    type: "ImageObject",
                    caption: "Paleta de Colores Completa",
                    colorPalette: [
                        { colorName: "Rojo", hex: "#FF0000" },
                        { colorName: "Naranja", hex: "#FFA500" },
                        { colorName: "Amarillo", hex: "#FFFF00" },
                        { colorName: "Verde", hex: "#00FF00" },
                        { colorName: "Cian", hex: "#00FFFF" },
                        { colorName: "Azul", hex: "#0000FF" },
                        { colorName: "Índigo", hex: "#4B0082" },
                        { colorName: "Violeta", hex: "#800080" },
                        { colorName: "Rosa", hex: "#FFC0CB" },
                        { colorName: "Marrón", hex: "#A52A2A" }
                    ]
                }
            }
        ];

        await VisualResource.insertMany(resources);
        res.json({ message: "Database seeded with semantic knowledge (Including Rainbow)." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
