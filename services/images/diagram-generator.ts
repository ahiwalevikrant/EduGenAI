export interface EducationalDiagram {
  id: string;
  title: string;
  topic: string;
  svgCode: string;
  caption: string;
  labels: { text: string; description: string }[];
}

export class DiagramGenerator {
  /**
   * Generates dynamic, clean educational SVG diagrams for common school science & math concepts.
   */
  static getPrebuiltOrGeneratedSVG(topic: string, title: string): EducationalDiagram {
    const lower = (topic + ' ' + title).toLowerCase();

    // 1. Distance-Displacement / Motion Graph
    if (lower.includes('motion') || lower.includes('displacement') || lower.includes('distance') || lower.includes('velocity')) {
      return {
        id: `diag-motion-${Date.now()}`,
        title: 'Distance vs Displacement Vector Representation',
        topic: 'Motion',
        caption: 'Figure: Curved path represents actual path length (Distance), whereas straight vector AB represents minimum displacement.',
        labels: [
          { text: 'Point A', description: 'Initial Reference Position' },
          { text: 'Point B', description: 'Final Position' },
          { text: 'Displacement (s)', description: 'Straight line vector directed from A to B' },
          { text: 'Distance (d)', description: 'Total scalar path length traversed' }
        ],
        svgCode: `
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0052CC" />
    </marker>
    <linearGradient id="gridGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#EBF3FF"/>
      <stop offset="100%" stop-color="#FFFFFF"/>
    </linearGradient>
  </defs>
  <rect width="500" height="300" rx="8" fill="url(#gridGrad)" stroke="#DFE1E6" stroke-width="1.5"/>
  <!-- Grid Lines -->
  <path d="M 50 50 H 450 M 50 100 H 450 M 50 150 H 450 M 50 200 H 450 M 50 250 H 450" stroke="#EBECF0" stroke-width="1" stroke-dasharray="4,4"/>
  <path d="M 100 30 V 270 M 200 30 V 270 M 300 30 V 270 M 400 30 V 270" stroke="#EBECF0" stroke-width="1" stroke-dasharray="4,4"/>
  <!-- Curved Distance Path -->
  <path d="M 80 200 C 120 70, 220 280, 280 100 S 380 220, 420 120" fill="none" stroke="#FF5630" stroke-width="3.5" stroke-dasharray="6,4"/>
  <!-- Straight Displacement Vector -->
  <line x1="80" y1="200" x2="420" y2="120" stroke="#0052CC" stroke-width="4" marker-end="url(#arrow)"/>
  <!-- Points -->
  <circle cx="80" cy="200" r="7" fill="#0747A6"/>
  <text x="65" y="230" font-family="Arial" font-size="14" font-weight="bold" fill="#091E42">Position A (Initial)</text>
  <circle cx="420" cy="120" r="7" fill="#006644"/>
  <text x="390" y="100" font-family="Arial" font-size="14" font-weight="bold" fill="#006644">Position B (Final)</text>
  <!-- Legend / Badges -->
  <rect x="140" y="240" width="220" height="40" rx="6" fill="#FFFFFF" stroke="#C1C7D0" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))"/>
  <line x1="150" y1="255" x2="180" y2="255" stroke="#0052CC" stroke-width="3"/>
  <text x="190" y="258" font-family="Arial" font-size="11" font-weight="bold" fill="#172B4D">Displacement (Straight Vector)</text>
  <line x1="150" y1="270" x2="180" y2="270" stroke="#FF5630" stroke-width="2.5" stroke-dasharray="4,2"/>
  <text x="190" y="273" font-family="Arial" font-size="11" font-weight="bold" fill="#172B4D">Distance (Total Path Length)</text>
</svg>
        `.trim()
      };
    }

    // 2. Electric Circuit / Ohm's Law
    if (lower.includes('electric') || lower.includes('current') || lower.includes('resistor') || lower.includes('circuit')) {
      return {
        id: `diag-elec-${Date.now()}`,
        title: 'Standard Ohm Law Electric Circuit Diagram',
        topic: 'Electricity',
        caption: 'Figure: Schematic circuit with Battery, Plug Key, Resistor, Series Ammeter (A), and Parallel Voltmeter (V).',
        labels: [
          { text: 'Ammeter (A)', description: 'Connected in series to measure current I' },
          { text: 'Voltmeter (V)', description: 'Connected in parallel to measure potential difference V' },
          { text: 'Resistor (R)', description: 'Conductor offering resistance' },
          { text: 'Rheostat (Rh)', description: 'Variable resistance to control current' }
        ],
        svgCode: `
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
  <rect width="500" height="300" rx="8" fill="#FFFFFF" stroke="#DFE1E6" stroke-width="1.5"/>
  <!-- Circuit Wires -->
  <path d="M 80 180 V 80 H 420 V 180" fill="none" stroke="#172B4D" stroke-width="3"/>
  <path d="M 80 180 V 240 H 420 V 180" fill="none" stroke="#172B4D" stroke-width="3"/>
  <!-- Resistor -->
  <rect x="210" y="65" width="80" height="30" fill="#EAE6FF" stroke="#6554C0" stroke-width="2.5" rx="4"/>
  <text x="235" y="85" font-family="Arial" font-size="14" font-weight="bold" fill="#403294">R (Ω)</text>
  <!-- Voltmeter in Parallel -->
  <path d="M 180 80 V 40 H 320 V 80" fill="none" stroke="#00B8D9" stroke-width="2" stroke-dasharray="4,2"/>
  <circle cx="250" cy="40" r="18" fill="#E6FCFF" stroke="#008DA6" stroke-width="2"/>
  <text x="244" y="46" font-family="Arial" font-size="16" font-weight="bold" fill="#008DA6">V</text>
  <!-- Ammeter in Series -->
  <circle cx="370" cy="80" r="18" fill="#FFEBE6" stroke="#DE350B" stroke-width="2"/>
  <text x="364" y="86" font-family="Arial" font-size="16" font-weight="bold" fill="#DE350B">A</text>
  <!-- Battery -->
  <line x1="230" y1="225" x2="230" y2="255" stroke="#0052CC" stroke-width="4"/>
  <line x1="240" y1="232" x2="240" y2="248" stroke="#172B4D" stroke-width="2"/>
  <line x1="250" y1="225" x2="250" y2="255" stroke="#0052CC" stroke-width="4"/>
  <line x1="260" y1="232" x2="260" y2="248" stroke="#172B4D" stroke-width="2"/>
  <text x="215" y="275" font-family="Arial" font-size="12" font-weight="bold" fill="#0747A6">Battery (+ / -)</text>
  <!-- Key / Switch -->
  <circle cx="130" cy="240" r="10" fill="#FFFFFF" stroke="#172B4D" stroke-width="2"/>
  <text x="110" y="275" font-family="Arial" font-size="12" font-weight="bold" fill="#5E6C84">Key (K)</text>
</svg>
        `.trim()
      };
    }

    // 3. Chemical Reaction / Redox / Atom
    return {
      id: `diag-gen-${Date.now()}`,
      title: `${title} - Conceptual Diagram`,
      topic: topic,
      caption: `Figure: Pedagogical schematic representation for ${title}.`,
      labels: [
        { text: 'Core Mechanism', description: 'Primary principle underlying the concept' },
        { text: 'Inputs / Conditions', description: 'Reactants / parameters required' },
        { text: 'Observable Output', description: 'Measurable result or physical change' }
      ],
      svgCode: `
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
  <rect width="500" height="300" rx="8" fill="#F4F5F7" stroke="#DFE1E6" stroke-width="1.5"/>
  <rect x="40" y="40" width="420" height="220" rx="8" fill="#FFFFFF" stroke="#0052CC" stroke-width="2"/>
  <circle cx="140" cy="140" r="50" fill="#DEEBFF" stroke="#0052CC" stroke-width="2.5"/>
  <text x="115" y="145" font-family="Arial" font-size="14" font-weight="bold" fill="#0747A6">INPUT</text>
  <!-- Process Arrow -->
  <path d="M 210 140 H 280" stroke="#36B37E" stroke-width="4" marker-end="url(#arrow)"/>
  <text x="215" y="125" font-family="Arial" font-size="11" font-weight="bold" fill="#006644">TRANSFORM</text>
  <!-- Output Circle -->
  <circle cx="350" cy="140" r="50" fill="#E3FCEF" stroke="#36B37E" stroke-width="2.5"/>
  <text x="320" y="145" font-family="Arial" font-size="14" font-weight="bold" fill="#006644">OUTPUT</text>
  <text x="160" y="230" font-family="Arial" font-size="13" font-weight="bold" fill="#172B4D">${title}</text>
</svg>
      `.trim()
    };
  }
}
