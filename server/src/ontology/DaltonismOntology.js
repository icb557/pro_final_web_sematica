// This acts as our Semantic Knowledge Base (Ontology)
// Defines rules and relationships between daltonism types and adaptations

const daltonismOntology = {
  types: {
    protanopia: {
      description: "Ceguera al rojo. Dificultad para distinguir entre rojo y verde.",
      affectedColors: ["red", "green", "purple", "brown", "pink", "orange"],
      colorMatrix: "0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0", 
      strategies: ["color_shift", "pattern_overlay", "text_label"]
    },
    deuteranopia: {
      description: "Ceguera al verde. El tipo más común. Dificultad similar a protanopia.",
      affectedColors: ["green", "red", "purple", "brown", "pink", "orange"],
      colorMatrix: "0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0",
      strategies: ["color_shift", "contrast_boost"]
    },
    tritanopia: {
      description: "Ceguera al azul. Menos común. Confunde azul/verde y amarillo/violeta.",
      affectedColors: ["blue", "yellow", "green", "violet", "orange"],
      colorMatrix: "0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0",
      strategies: ["blue_boost"]
    },
    none: {
      description: "Visión normal.",
      colorMatrix: "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0",
      strategies: []
    }
  },
  colorMappings: [
    { 
      name: "Rojo", 
      hex: "#FF0000", 
      properties: ["cálido", "alerta"], 
      adaptation: { protanopia: "#A0A0A0", deuteranopia: "#A0A000", tritanopia: "#FF0000" } 
    },
    { 
      name: "Naranja", 
      hex: "#FFA500", 
      properties: ["cálido", "energía"], 
      adaptation: { protanopia: "#CCCC00", deuteranopia: "#E0E000", tritanopia: "#FF6666" } 
    },
    { 
      name: "Amarillo", 
      hex: "#FFFF00", 
      properties: ["brillante", "advertencia"], 
      adaptation: { protanopia: "#FFFF00", deuteranopia: "#FFFF00", tritanopia: "#FFE0E0" } 
    },
    { 
      name: "Verde", 
      hex: "#00FF00", 
      properties: ["fresco", "naturaleza", "éxito"], 
      adaptation: { protanopia: "#FFFF00", deuteranopia: "#FFD700", tritanopia: "#008080" } 
    },
    { 
      name: "Cian", 
      hex: "#00FFFF", 
      properties: ["fresco", "agua"], 
      adaptation: { protanopia: "#E0E0E0", deuteranopia: "#E0E0E0", tritanopia: "#00FFFF" } 
    },
    { 
      name: "Azul", 
      hex: "#0000FF", 
      properties: ["frío", "calma"], 
      adaptation: { protanopia: "#0000FF", deuteranopia: "#0000FF", tritanopia: "#004C4C" } 
    },
    { 
      name: "Índigo", 
      hex: "#4B0082", 
      properties: ["profundo", "misterio"], 
      adaptation: { protanopia: "#4B4B82", deuteranopia: "#4B4B82", tritanopia: "#800000" } 
    },
    { 
      name: "Violeta", 
      hex: "#800080", 
      properties: ["espiritual", "lujo"], 
      adaptation: { protanopia: "#000080", deuteranopia: "#000080", tritanopia: "#800000" } 
    },
    { 
      name: "Marrón", 
      hex: "#A52A2A", 
      properties: ["tierra", "estabilidad"], 
      adaptation: { protanopia: "#808080", deuteranopia: "#808000", tritanopia: "#A52A2A" } 
    },
    { 
      name: "Rosa", 
      hex: "#FFC0CB", 
      properties: ["suave", "dulce"], 
      adaptation: { protanopia: "#D3D3D3", deuteranopia: "#D3D3D3", tritanopia: "#FFC0CB" } 
    }
  ]
};

module.exports = daltonismOntology;
