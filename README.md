# How to run
* Clone the project
* Be sure to have docker installed and ready
* In your terminal head to the project and run docker compose up

# How to test
* Ensure that the docker containers are running
* Open a REST API client e.b., Insomnia/Postman and POST to http://localhost:6868/getFeatureFlag with the payload {"user":"email=test@test.com&location=US"}

# What I could do better with more time
* Unit tests with a multistage dockerfile 
* Add API authorisation e.g., bearer token
* Move over to AWS lambdas for scalability

# Plan

* Add a dockerfile to the project
* setup a Docker database
* Use express and nodmon for the server setup.
* Create a POST route /getFeatureFlag
* Validate the payload (valid email and location given)
* Get the database connection
* Query the database to see if the email has previously had features enabled if results returned return the features
* map through the feature flag objects the result being an array of enabled features which we filter out null values using .filter(boolean)
* Check if the email is in enabledEmails, if it is return (within the map) the feature else continue
* Check if the location is included or the array blank, continue else return null (within the map)
* Create a ratio function which accepts the ratio for the feature and returns a boolean from Math.random() < ratio;
* if the result from the ratio function is true return the feature else return null
* Add to the database the email and enabled/disabled features
* return the enabled features array

* Test the following: option (expected return value)
    * blank payload (400 - invalid request)
    * invalid email (400 - invalid request)
    * invalid location (400 - invalid request)
    * invalid email and location (400 - invalid request)
    * invalid request body data type (400 - invalid request)
    * existing user with enabled features (200 - array of enabled features)
    * existing user with no enabled features (200 - array of enabled features)
    * existing user with all enabled features (200 - array of enabled features)
    * new user with excluded country (200 - array of enabled features)
    * new user with blank included country array (200 - array of enabled features)
    * new user with country not in either included or excluded (200 - array of enabled features)
    * new user with included country (200 - array of enabled features)
    * new user with enabled email for a feature (200 - array of enabled features)
    * new user with 50/50 ratio (200 - array of enabled features)
    * new user with 90/10 ratio (200 - array of enabled features)


# Assumptions

* The api will be called with only 1 user's info (email, location)
* The api's requesting payload must contain a valid email and location otherwise a 400 error is returned
* The returned response will be an array of enabled features:strings
* The overall ratio will not be an exact split e.g., 50/50
* If the user's location changes but has previously been accepted then they will still receive the same features even if a feature is disabled for that location






# Feature flag test

Your task is to create a simple feature flag API. A feature flag is, according to Wikipedia:

> A feature toggle (also feature switch, feature flag, feature flipper, conditional feature, etc.) is a technique in software development that attempts to provide an alternative to maintaining multiple source-code branches (known as feature branches), such that a feature can be tested even before it is completed and ready for release. Feature toggle is used to hide, enable or disable the feature during run time. For example, during the development process, a developer can enable the feature for testing and disable it for other users.

Source:
https://en.wikipedia.org/wiki/Feature_toggle

> Additionally, a feature toggle may be used to perform A/B testing on users in a controlled experimental fashion.  For example, to test hwther a particular colour scheme is more likely to get a user's attention, we may setup a feature flag with a ratio of 50:50, where 50% of users see a red background, whilst 50% see a blue background.

For this task, we want to create feature flags to allow us to conduct an A/B test. Each flag document has:

```
{
    "name": "feature_foo", # Name of the feature
    "ratio": 0.5, # Percentage of users that should get the feature (50/50 in this case)
    "enabledEmails": ["bar@baz.com"], # List of emails the feature is always enabled for, regardless of other criteria
    "includedCountries": ["US"], # List of countries the user must be from, if empty it is enabled for all countries
    "excludedCountries": ["GB"], # List of countries the user must not be from
}
```

Each user the API will be presented with the user's `email` and `location`, for example:

```
email=foo@bar.com&location=GB
```

Given the list of feature flags in `features.json` , your task is to create an API endpoint that returns a list of the features that are enabled for a given user’s email and location. **The feature flags returned by the API for a given user must always be consistent**. A list of example users are included in `example_users.json`, but these are not exhaustive as the API should process any combination of email and location given to it.


You can use any frameworks/libraries you like. Be sure to include tests and instructions on how to run the project.

# Submission

Clone this repository and make your commits to that (removing origin and making a new public repository) and send us the link to the repository when you are finished.

# Notes

This exercise should not take more than 3 hours.

Ideally we'd like to see a plan, any assumptions, implementation code, and your thoughts on what you would do better / add given more time.

If you have any questions you can email shaun@fantastec.io