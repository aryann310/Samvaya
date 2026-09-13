import type { HyperlocalEvidence, DataProvenance } from '../types/hyperlocal.types.js';

export class HyperlocalEvidenceService {
  static createEvidence(claim: string, value: string | number | undefined, provenance: DataProvenance): HyperlocalEvidence {
    const evidence: HyperlocalEvidence = {
      claim,
      source: provenance.source,
      status: provenance.status
    };
    if (value !== undefined) evidence.value = value;
    if (provenance.retrievedAt !== undefined) evidence.retrievedAt = provenance.retrievedAt;
    if (provenance.confidence !== undefined) evidence.confidence = provenance.confidence;
    return evidence;
  }
}
