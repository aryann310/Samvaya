import type { Evidence } from '../types/intelligence.types.js';

export class EvidenceEngine {
  private evidenceList: Evidence[] = [];

  addEvidence(
    metric: string,
    value: any,
    unit: string,
    source: string,
    status: Evidence['status'] = 'CALCULATED'
  ) {
    this.evidenceList.push({ metric, value, unit, source, status });
  }

  getEvidence(): Evidence[] {
    return this.evidenceList;
  }

  clear() {
    this.evidenceList = [];
  }
}
