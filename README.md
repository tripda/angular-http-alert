#angular-http-alert

This package serves as an interceptor for Angular's $http service for displaying error messages whenever an HTTP error response is received. This is particularly helpful if your application is constantly calling an API and verifying whether the response is an error and then taking action, it's then likely that you're duplicating code.

##Installing

Get [Bower](http://bower.io) and then

>bower install angular-http-alert

##Usage

First you need to inject angular-http-alert in your module definition.

```javascript
angular.module('myAngularApp', ['http-alert']);
```

As this module serves as an HTTP Interceptor for Angular's $http service, the setup occurs at the config phase of angular

```javascript
angular
    .module('sampleApp')
    .config(function($httpProvider, httpAlertInterceptorProvider) {
        $httpProvider.interceptors.push('httpAlertInterceptor');
    })
```

##Customizing Messages

By default, the error responses will be displayed 'as-is', in other words, the whole HTTP body stringified. For those that want to 'parse' the error body and do something with it, it's possible to have a custom function that does whatever you want with the error message:

```javascript
.config(function($httpProvider, httpAlertInterceptorProvider) {
    var parser = function(response) {
        // do something with the response...

        return transformed_message;
    }

    $httpProvider.setResponseParser(parser);
    $httpProvider.interceptors.push('httpAlertInterceptor');
})
```

##Filtering Errors

You might not want to display ALL errors, for instance, you may want to display a message only when the HTTP response contains a JSON field called 'error_message', this is possible by creating custom filters:

```javascript
.config(function($httpProvider, httpAlertInterceptorProvider) {
    var filter = function(response) {
        return response.data.hasOwnProperty('error_message');
    }

    $httpProvider.setFilter(filter);
    $httpProvider.interceptors.push('httpAlertInterceptor');
})
```

This will only display error messages when the error response comes with a 'error_message' field.
