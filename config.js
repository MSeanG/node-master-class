/*
 * Create and export configuration variables
 *
 */

// Container for all the enviroments
var environments = {};

// Staging (default) environment
environments.staging = {
    'port' : 3000,
    'envName' : 'staging'
};

// Production enviroment
environments.production = {
    'port' : 5000,
    'envName' : 'production'
};

// Determine which environment was padded as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
