(function () {

  angular.module('MyApp.Auth')
  .factory('$localStorage', function ($window) {
        return {
            store: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            remove: function (key) {
                $window.localStorage.removeItem(key);
            },
            storeObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key, defaultValue) {
                return JSON.parse($window.localStorage[key] || defaultValue);
            }
        }
    })
  .factory('AuthFactory', function($resource, $http, $localStorage, $rootScope){
      
      var authFac = {};
      var TOKEN_KEY = 'Token';
      var isAuthenticated = false;
      var username = '';
      var authToken = undefined;
      

      function loadUserCredentials() {
        var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
        if (credentials.username != undefined) {
          useCredentials(credentials);
        }
      }
     
      function storeUserCredentials(credentials) {
        $localStorage.storeObject(TOKEN_KEY, credentials);
        useCredentials(credentials);
      }
     
      function useCredentials(credentials) {
        isAuthenticated = true;
        username = credentials.username;
        authToken = credentials.token;
     
        // Set the token as header for your requests!
        $http.defaults.headers.common['x-access-token'] = authToken;
      }
     
      function destroyUserCredentials() {
        authToken = undefined;
        username = '';
        isAuthenticated = false;
        $http.defaults.headers.common['x-access-token'] = authToken;
        $localStorage.remove(TOKEN_KEY);
      }
       
      authFac.login = function(loginData) {
          
          $resource("/api/users/login")
          .save(loginData,
             function(response) {
                storeUserCredentials({username:loginData.username, token: response.token});
                $rootScope.$broadcast('login:Successful');
             },
             function(response){
                isAuthenticated = false;
             }
          
          );

      };
      
      authFac.logout = function() {
          $resource("/api/users/logout").get(function(response){
            console.log('response: ', response);
          });
          destroyUserCredentials();
      };
      
      authFac.register = function(registerData) {
          
          $resource("/api/users/register")
          .save(registerData,
             function(response) {
                authFac.login({username:registerData.username, password:registerData.password});
              if (registerData.rememberMe) {
                  $localStorage.storeObject('userinfo',
                      {username:registerData.username, password:registerData.password});
              }
             
                $rootScope.$broadcast('registration:Successful');
             },
             function(response){

             }
          
          );
      };
      
      authFac.isAuthenticated = function() {
          return isAuthenticated;
      };
      
      authFac.getUsername = function() {
          return username;  
      };

      loadUserCredentials();
      
      return authFac;
      
  });

})();