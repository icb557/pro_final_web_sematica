document.addEventListener('DOMContentLoaded', () => {
    const applyBtn = document.getElementById('applyAdaptation');
    const daltonismSelect = document.getElementById('daltonismType');
    const seedBtn = document.getElementById('seedDb');

    // Seed database on click (for demo purposes)
    seedBtn.addEventListener('click', async () => {
        try {
            const res = await fetch('/api/seed', { method: 'POST' });
            const data = await res.json();
            alert(data.message);
        } catch (err) {
            alert("Error seeding database: " + err.message);
        }
    });

    applyBtn.addEventListener('click', async () => {
        const selectedDaltonismType = daltonismSelect.value;
        
        // 1. Identify elements to analyze
        const elementsToAnalyze = [
            { id: 'img1', type: 'image' },
            { id: 'chart1', type: 'chart' },
            { id: 'rainbow1', type: 'image' } // Added rainbow spectrum
        ];

        const userProfile = {
            daltonismType: selectedDaltonismType,
            preferences: { contrastLevel: 'high' }
        };

        console.log("Requesting adaptation for:", elementsToAnalyze, "Profile:", userProfile);

        try {
            // 2. Call the Semantic Agent (Backend)
            const response = await fetch('/api/adapt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ elementsToAnalyze, userProfile })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const adaptationResponse = await response.json();
            console.log("Adaptation received:", adaptationResponse);

            // 3. Apply Adaptations
            applyAdaptations(adaptationResponse, selectedDaltonismType);

        } catch (error) {
            console.error("Error requesting adaptation:", error);
            alert("Error applying adaptation. Check console.");
        }
    });

    function applyAdaptations(adaptationResponse, daltonismType) {
        // Generate SVG filters first if needed
        createSVGColorFilters(daltonismType);

        adaptationResponse.adaptedElements.forEach(adapted => {
            const element = document.getElementById(adapted.id);
            const descContainer = document.getElementById(`desc-${adapted.id}`);

            if (!element) return;

            // Reset filters
            element.style.filter = 'none';
            
            // Apply visual changes
            if (adapted.type === 'image') {
                // Apply CSS Filter
                if (daltonismType !== 'none') {
                    element.style.filter = `url(#${daltonismType})`;
                }

                // Special handling for rainbow blocks to show explicit mapping if available
                if (adapted.id === 'rainbow1') {
                    renderRainbowBlocks(adapted, daltonismType);
                }
            } 
            else if (adapted.type === 'chart') {
                // Apply specific color mappings to bars
                if (adapted.colorMappings) {
                    const bars = element.querySelectorAll('.bar');
                    bars.forEach(bar => {
                        const originalColor = bar.getAttribute('data-color');
                        const mapping = adapted.colorMappings.find(m => m.original === originalColor);
                        
                        if (mapping) {
                            bar.style.backgroundColor = mapping.adapted;
                        } else {
                            bar.style.backgroundColor = originalColor;
                        }
                    });
                }
                updateChartLegend(adapted, daltonismType);
            }

            // 4. Inject Semantic Description
            if (descContainer) {
                if (daltonismType !== 'none' && adapted.description) {
                    descContainer.innerHTML = `
                        <strong>Descripción Semántica:</strong> ${adapted.description}
                        <br>
                        <small>JSON-LD Type: ${adapted.semanticMetadata['@type']}</small>
                    `;
                    descContainer.classList.add('visible');
                } else {
                    descContainer.classList.remove('visible');
                    descContainer.innerHTML = '';
                }
            }
        });
    }

    function renderRainbowBlocks(adaptedData, daltonismType) {
        const container = document.getElementById('rainbow1-blocks');
        if (!container) return;
        container.innerHTML = '';

        if (daltonismType === 'none') return; // Show gradient only for normal view, or maybe show blocks too? Let's show blocks only on adaptation to see the shift.

        // Check if we have color palette info
        if (adaptedData.semanticMetadata && adaptedData.semanticMetadata.colorPalette) {
            adaptedData.semanticMetadata.colorPalette.forEach(colorInfo => {
                // colorInfo has { colorName, hex, adaptedHex }
                const block = document.createElement('div');
                block.className = 'color-block';
                // Show adapted color background
                block.style.backgroundColor = colorInfo.adaptedHex || colorInfo.hex;
                
                // Tooltip or text showing original vs adapted
                block.title = `${colorInfo.colorName}: ${colorInfo.hex} -> ${colorInfo.adaptedHex}`;
                block.innerHTML = `<span>${colorInfo.colorName}<br><small>${colorInfo.adaptedHex}</small></span>`;
                
                container.appendChild(block);
            });
        }
    }

    function updateChartLegend(adaptedData, daltonismType) {
        const legend = document.getElementById('chartLegend');
        legend.innerHTML = '';
        
        if (daltonismType === 'none') return;

        if (adaptedData.colorMappings) {
            adaptedData.colorMappings.forEach(map => {
                const span = document.createElement('span');
                span.innerHTML = `<strong>${map.label}</strong>: <span style="color:${map.original}">■</span> &rarr; <span style="color:${map.adapted}">■</span>`;
                legend.appendChild(span);
            });
        }
    }

    function createSVGColorFilters(daltonismType) {
        const container = document.getElementById('svgFiltersContainer');
        container.innerHTML = ''; // Clear previous

        if (daltonismType === 'none') return;

        // Matrix values should ideally come from backend, but defined here for this demo
        let matrix = "";
        if (daltonismType === 'protanopia') {
            // Protanopia (Red blind) - Severely reduced red sensitivity
            matrix = "0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"; 
        } else if (daltonismType === 'deuteranopia') {
            // Deuteranopia (Green blind) - Severely reduced green sensitivity
            matrix = "0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0";
        } else if (daltonismType === 'tritanopia') {
            // Tritanopia (Blue blind) - Blue channel is constructed from Red and Green
            // This matrix creates a stronger effect: Blue becomes dark/greenish, Yellow becomes Pinkish
            matrix = "0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0";
        }

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        filter.setAttribute("id", daltonismType);
        
        const feColorMatrix = document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
        feColorMatrix.setAttribute("type", "matrix");
        feColorMatrix.setAttribute("values", matrix);
        
        filter.appendChild(feColorMatrix);
        svg.appendChild(filter);
        container.appendChild(svg);
    }
});
