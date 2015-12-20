describe('http-alert', function() {
    var interceptor, interceptorProvider, alerter, responseParser, filter, ngFilter, q, rejectReturnValue;

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

            $provide.service('$q', function () {
                rejectReturnValue = true;
                this.reject = jasmine.createSpy('$q.reject').and.returnValue(rejectReturnValue);
            });
        });

        inject(function(httpAlertInterceptor, $filter, $q) {
            interceptor = httpAlertInterceptor;
            ngFilter = $filter;
            q = $q;
        });
    });

    it('should have a response error handler', function() {
        var configMock = {data: 'foobar'};

        var result = interceptor.responseError(configMock);

        expect(responseParser).toHaveBeenCalled();

        expect(alerter.error).toHaveBeenCalledWith("Error!");

        expect(q.reject).toHaveBeenCalledWith(configMock);

        expect(result).toBe(rejectReturnValue);
    });

    it('should not alert error when filter returns false', function() {
        var configMock = {data: 'error!!'};

        expect(alerter.error).not.toHaveBeenCalledWith();
    });

    it('should set translation parser', function() {
        var configMock = {data: 'foobar'};

        interceptorProvider.setUseTranslate(true);

        interceptor.responseError(configMock);

        expect(ngFilter).toHaveBeenCalledWith('translate');
    });
});
