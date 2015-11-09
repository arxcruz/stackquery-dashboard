angular.module('stackquery', ['ngRoute', 'users', 'stackalitics', 'projects', 'teams', 'reports', 'harvester', 'stackqueryDirectives'])
    .config(function($interpolateProvider) {
        //$interpolateProvider.startSymbol('((');
        //$interpolateProvider.endSymbol('))');
    })
    .config(function($routeProvider) {
        $routeProvider.when('/users', {
            templateUrl: '/static/partial/views/users.html'
        });
        $routeProvider.when('/projects', {
            templateUrl: '/static/partial/views/projects.html'
        });
        $routeProvider.when('/teams', {
            templateUrl: '/static/partial/views/teams.html'
        });
        $routeProvider.when('/reports/:tabId', {
            templateUrl: '/static/partial/views/reports.html'
        });
        $routeProvider.when('/bugzilla', {
            templateUrl: '/static/partial/views/bugzilla.html'
        });
        $routeProvider.when('/harvester', {
            templateUrl: '/static/partial/views/harvester.html'
        });
        $routeProvider.otherwise({
            templateUrl: '/static/partial/views/reports.html'
        });
    })
    .filter('sumByKey', function() {
        return function(data, key) {
            if (typeof(data) === 'undefined' || typeof(key) === 'undefined' || data === null) {
                return 0;
            }

            var sum = 0;
            for (var i = data.length - 1; i >= 0; i--) {
                sum += parseInt(data[i][key]);
            }
            return sum;
        };
    })
    .filter('truncate', function () {
        return function (text, length, end) {
            if (text !== undefined) {
                if (isNaN(length)){
                    length = 10;
                }

                end = end || "...";

                if (text.length <= length || text.length - end.length <= length) {
                    return text;
                } else {
                    return String(text).substring(0, length - end.length) + end;
                }
            }
        };
    })
    .filter('capitalize', function() {
        return function(input, scope) {
            if (input!=null)
                input = input.toLowerCase();
            return input.substring(0,1).toUpperCase()+input.substring(1);
            }
    })
    .factory('restApi', restApi)
    .directive('showErrors', function() {
        return {
            restrict: 'A',
            require:  '^form',
            link: function (scope, el, attrs, formCtrl) {
                // find the text box element, which has the 'name' attribute
                var inputEl   = el[0].querySelector("[name]");
                // convert the native text box element to an angular element
                var inputNgEl = angular.element(inputEl);
                // get the name on the text box so we know the property to check
                // on the form controller
                var inputName = inputNgEl.attr('name');

                // only apply the has-error class after the user leaves the text box
                inputNgEl.bind('blur', function() {
                    el.toggleClass('has-error', formCtrl[inputName].$invalid);
                });

                scope.$on('show-errors-check-validity', function() {
                    el.toggleClass('has-error', formCtrl[inputName].$invalid);
                });
            }
        }
    });

function restApi($http) {

    function request(verb, param, apiUrl, data) {
        var req = {
            method: verb,
            url: url(param, apiUrl),
            data: data
        };

        return $http(req);
    }

    function url(param, apiUrl) {
        if (param == null || !angular.isDefined(param)) {
            param = '';
        }
        return apiUrl + param;
    }

    return {
        get: function get(param, apiUrl) {
            return request("GET", param, apiUrl);
        },
        post: function post(data, apiUrl) {
            return request("POST", null, apiUrl, data);
        },
        put: function put(data, apiUrl) {
            return request("PUT", null, apiUrl, data);
        },
        del: function del(param, apiUrl) {
            return request("DELETE", param, apiUrl);
        },
    };
}

