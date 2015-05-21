describe('http-alert', function() {
    var interceptor, interceptorProvider, alerter, responseParser, filter, ngFilter;

    beforeEach(function() {
        module('http-alert');

        module(function(httpAlertInterceptorProvider, $provide) {
            interceptorProvider = httpAlertInterceptorProvider;
            alerter = {};
            alerter.error = jasmine.createSpy();

            filter = function(response) {
                return response.data == "foobar";
            };

            responseParser = jasmine.createSpy().and.returnValue("Error!");

            httpAlertInterceptorProvider.setAlerter(alerter);
            httpAlertInterceptorProvider.setResponseParser(responseParser);
            httpAlertInterceptorProvider.setFilter(filter);

            $provide.service('$filter', function () {
                return jasmine.createSpy('$filter').and.returnValue(jasmine.createSpy('$filter.func'));
            });
        });

        inject(function(httpAlertInterceptor, $filter) {
            interceptor = httpAlertInterceptor;
            ngFilter = $filter;
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

    it('should set translation parser', function() {
        var configMock = {data: 'foobar'};

        interceptorProvider.setUseTranslate(true);

        console.log(ngFilter)
        interceptor.responseError(configMock);

        expect(ngFilter).toHaveBeenCalledWith('translate');
    });
});
