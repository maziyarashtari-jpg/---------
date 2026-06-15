/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ORingDimension {
  dash: string;        // e.g., "010", "214", "905"
  series: string;      // e.g., "000", "100", "200", "300", "400", "900"
  idIn: number;        // Inner Diameter in inches
  idMm: number;        // Inner Diameter in mm
  csIn: number;        // Cross Section (Thickness) in inches
  csMm: number;        // Cross Section (Thickness) in mm
  idTolIn: number;     // ID Tolerance in inches (+)
  idTolMm: number;     // ID Tolerance in mm (+)
  csTolIn: number;     // CS Tolerance in inches (+)
  csTolMm: number;     // CS Tolerance in mm (+)
  nominalIdIn?: string; // Fractional nominal ID (e.g. "1/4")
  nominalCsIn?: string; // Fractional nominal CS (e.g. "1/16")
}

export interface SearchResult {
  oRing: ORingDimension;
  deviationMm: number; // For distance comparison when finding closest
  idSqueezeRatio?: number; // Technical static calculation
  stretchRatio?: number;
}

export interface MaterialProps {
  name: string;        // e.g., "NBR", "Viton (FKM)"
  persianName: string;
  minTemp: number;     // in Celsius
  maxTemp: number;     // in Celsius
  hardness: string;    // Shore A range
  description: string;
  advantages: string[];
  disadvantages: string[];
  applications: string;
  color: string;
}

export interface GlandDesignProps {
  series: string;
  csMm: number;
  staticPistonDepth: string; // Rec depth
  staticPistonWidth: string; // Rec width
  dynamicPistonDepth: string;
  dynamicPistonWidth: string;
  radialClearance: string;
  squeezeStaticRange: string;
}
