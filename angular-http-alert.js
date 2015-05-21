(function() {
    angular
        .module('http-alert', ['angular-growl'])
        .provider('httpAlertInterceptor', [httpAlertInterceptor])

    function httpAlertInterceptor() {
        var growlObj;
        var alerter = {};
        var filter = function(response) {return true;};
        var responseParser = function(response) {
            return 'An error ocurred. Http Response Body: ' + JSON.stringify(response.data);
        };
        var useTranslate = false;

        alerter.error = function(message) {growlObj.error(message);};

        this.getAlerter = function() {return alerter;};
        this.setAlerter = function(newAlerter) {alerter = newAlerter;};

        this.getFilter = function() {return filter;};
        this.setFilter = function(newFilter) {filter = newFilter;};

        this.getResponseParser = function() {return responseParser;};
        this.setResponseParser = function(newResponseParser) {responseParser = newResponseParser;};

        this.setUseTranslate = function(newUseTranslate) { useTranslate = newUseTranslate; };


        this.$get = ['growl', '$filter', function(growl, $filter) {
            growlObj = growl;
            var service = {};

            service.responseError = function(config) {
                var message = responseParser(config);

                if(!filter(config)) {
                    return config;
                }

                if (useTranslate) {
                    message = $filter('translate')(message);
                }

                alerter.error(message);

                return config;
            }

            return service;
        }];
    }
})();
