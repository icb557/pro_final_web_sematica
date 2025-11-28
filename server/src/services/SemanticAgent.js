const daltonismOntology = require('../ontology/DaltonismOntology');
const VisualResource = require('../models/VisualResource');

class SemanticAgentService {
  
  async adaptContent(elementsToAnalyze, userProfile) {
    const daltonismType = userProfile.daltonismType || 'none';
    const adaptationRules = daltonismOntology.types[daltonismType];
    
    const adaptedElements = [];

    for (const element of elementsToAnalyze) {
      // 1. Retrieve Knowledge (Metadata) about the visual element
      // In a real system, this might involve computer vision or querying a triple store.
      // Here we look up our MongoDB "Knowledge Base".
      let resource = await VisualResource.findOne({ elementId: element.id }).lean();
      
      // Fallback if not found in DB (simulate dynamic analysis or unknown content)
      if (!resource) {
        resource = {
            elementId: element.id,
            type: 'unknown',
            description: "Elemento visual no identificado en la base de conocimiento.",
            semanticMetadata: { 
                type: 'Thing',
                context: 'http://schema.org'
            }
        };
      }

      // 2. Infer Adaptations based on Ontology rules
      const adaptationResult = this.inferAdaptation(resource, daltonismType, adaptationRules);
      
      adaptedElements.push(adaptationResult);
    }

    return {
      pageTitle: "Color Sense - Contenido Adaptado",
      userType: daltonismType,
      ontologyUsed: "ColorSenseDaltonismOntology",
      adaptedElements: adaptedElements
    };
  }

  inferAdaptation(resource, daltonismType, rules) {
    const result = {
      id: resource.elementId,
      type: resource.type,
      description: resource.description,
      semanticMetadata: {
        "@context": resource.semanticMetadata.context,
        "@type": resource.semanticMetadata.type,
        ...resource.semanticMetadata
      }
    };

    // Apply adaptations based on type
    if (daltonismType === 'none') {
      return result; // No changes needed
    }

    // Logic for Images
    if (resource.type === 'image') {
        // Suggest a CSS filter based on the ontology matrix
        result.cssFilters = `filter: url(#${daltonismType});`; 
        // Also provide text description for screen readers/overlays
        result.description = `${resource.description} (Adaptado para ${daltonismType})`;
        
        // Map colors in palette if available
        if (resource.semanticMetadata.colorPalette) {
            result.semanticMetadata.colorPalette = resource.semanticMetadata.colorPalette.map(c => {
                const mapping = daltonismOntology.colorMappings.find(m => m.name === c.colorName);
                return {
                    ...c,
                    adaptedHex: mapping ? mapping.adaptation[daltonismType] : c.hex
                };
            });
        }
    }
    
    // Logic for Charts
    if (resource.type === 'chart') {
        // Provide explicit color mappings for the chart bars/lines
        if (resource.semanticMetadata.colorPalette) {
             result.colorMappings = resource.semanticMetadata.colorPalette.map(c => {
                const mapping = daltonismOntology.colorMappings.find(m => m.name === c.colorName);
                const originalHex = c.hex;
                const adaptedHex = mapping ? mapping.adaptation[daltonismType] : c.hex;
                return {
                    original: originalHex,
                    adapted: adaptedHex,
                    label: c.colorName // Simplified
                };
            });
        }
    }

    return result;
  }
}

module.exports = new SemanticAgentService();

