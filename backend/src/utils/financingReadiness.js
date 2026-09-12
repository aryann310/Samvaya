export function calculateFinancingReadiness(cashFlowStability, dti, vintageYears, margin) {
    let cfScore = cashFlowStability; // assume 0-100 provided
    let dtiScore = Math.max(0, 100 - dti);
    let vintageScore = Math.min(100, vintageYears * 10);
    let marginScore = Math.min(100, margin * 4);
    const score = (cfScore * 0.3) + (dtiScore * 0.25) + (vintageScore * 0.25) + (marginScore * 0.2);
    return Math.round(score);
}
//# sourceMappingURL=financingReadiness.js.map