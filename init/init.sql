CREATE TABLE user (
    userID int NOT NULL AUTO_INCREMENT,
    userEmail varchar(255) NOT NULL,
    PRIMARY KEY (userID)
);

INSERT INTO user (userEmail)
VALUES ('elliot@test.com');

CREATE TABLE featureFlag (
    featureFlagID int NOT NULL AUTO_INCREMENT,
    featureFlagFeature varchar(255) NOT NULL,
    PRIMARY KEY (featureFlagID)
);

INSERT INTO featureFlag (featureFlagFeature)
VALUES ('SuperCoolFeature'),
('MarketingBanner'),
('SimplifiedNavBar'),
('EnhancedDashboardFeature'),
('NewUserOnboardingJourney');

CREATE TABLE featureFlagOption (
    featureFlagOptionID int NOT NULL AUTO_INCREMENT,
    userID int NOT NULL,
    featureFlagID int NOT NULL,
    featureFlagOptionState BOOLEAN NOT NULL,
    PRIMARY KEY (featureFlagOptionID),
    FOREIGN KEY (userID) REFERENCES user(userID),
    FOREIGN KEY (featureFlagID) REFERENCES featureFlag(featureFlagID)
);

INSERT INTO featureFlagOption (userID, featureFlagID, featureFlagOptionState)
VALUES (1, 1, 0),
(1, 2, 1),
(1, 3, 0),
(1, 4, 1),
(1, 5, 0);