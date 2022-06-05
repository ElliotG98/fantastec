interface UserEnabledFeatures {
    Feature: string;
    State: number;
}

interface FeaturesJSON {
    name: string;
    ratio: number;
    enabledEmails: Array<string>;
    includedCountries: Array<string>;
    excludedCountries: Array<string>;
}

interface FeatureFlag {
    featureFlagID: number;
    featureFlagFeature: string;
}

export {UserEnabledFeatures, FeaturesJSON, FeatureFlag};