describe('http-alert', function() {
    var interceptor, interceptorProvider, alerter, responseParser;

    beforeEach(function() {
        module('http-alert');

        module(function(httpAlertInterceptorProvider) {
            alerter = {};
            alerter.error = jasmine.createSpy();

            responseParser = jasmine.createSpy().and.returnValue("Error!");

            httpAlertInterceptorProvider.setAlerter(alerter);
            httpAlertInterceptorProvider.setResponseParser(responseParser);
        });

        inject(function(httpAlertInterceptor) {
            interceptor = httpAlertInterceptor;
        });
    });

    it('should have a response error handler', function() {
        var configMock = {};

        expect(interceptor.responseError(configMock)).toBe(configMock);

        expect(responseParser).toHaveBeenCalled();

        expect(alerter.error).toHaveBeenCalledWith("Error!");
    });
});
