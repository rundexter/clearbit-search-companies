var util = require('./util.js');
var request = require('request').defaults({
    baseUrl: 'https://discovery.clearbit.com/'
});

var pickInputs = {
        'query': 'query',
        'sort': 'sort'
    },
    pickOutputs = {
        'id': { keyName: 'results', fields: ['id'] },
        'name': { keyName: 'results', fields: ['name'] },
        'legalName': { keyName: 'results', fields: ['legalName'] },
        'domain': { keyName: 'results', fields: ['domain'] },
        'tags': { keyName: 'results', fields: ['tags'] },
        'description': { keyName: 'results', fields: ['description'] },
        'location': { keyName: 'results', fields: ['location'] },
        'metrics': { keyName: 'results', fields: ['metrics'] }
    };

module.exports = {

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs),
            apiKey = dexter.environment('clearbit_api_key'),
            api = '/v1/companies/search';

        if (!apiKey)
            return this.fail('A [clearbit_api_key] environment variable is required for this module');

        if (validateErrors)
            return this.fail(validateErrors);

        request.get({uri: api, qs: inputs, auth: { user: apiKey, pass: '' }, json: true}, function (error, response, body) {
            if (error)
                this.fail(error);
            else if (body && body.error)
                this.fail(body.error);
            else
                this.complete(util.pickOutputs(body, pickOutputs));
        }.bind(this));
    }
};
