/**
 * Returns a boolean on whether a feature is enabled or not
 * @param {number} a ratio for the likely hood of the feature being enabled 0 - 1
 * @return {boolean} enabled or disabled
 */
module.exports.getFeatureState = (ratio: number) => {
    return Math.random() < ratio;
}