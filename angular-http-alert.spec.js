describe('http-alert', function() {
    var interceptor, interceptorProvider, alerter, responseParser, filter;

    beforeEach(function() {
        module('http-alert');

        module(function(httpAlertInterceptorProvider) {
            alerter = {};
            alerter.error = jasmine.createSpy();

            filter = function(response) {
                return response.data == "foobar";
            };

            responseParser = jasmine.createSpy().and.returnValue("Error!");

            httpAlertInterceptorProvider.setAlerter(alerter);
            httpAlertInterceptorProvider.setResponseParser(responseParser);
            httpAlertInterceptorProvider.setFilter(filter);
        });

        inject(function(httpAlertInterceptor) {
            interceptor = httpAlertInterceptor;
        });
    });

    it('should have a response error handler', function() {
        var configMock = {data: 'foobar'};

        expect(interceptor.responseError(configMock)).toBe(configMock);

        expect(responseParser).toHaveBeenCalled();

        expect(alerter.error).toHaveBeenCalledWith("Error!");
    });

    it('should not alert error when filter returns false', function() {
        var configMock = {data: 'error!!'};

        expect(alerter.error).not.toHaveBeenCalledWith();
    });
});
