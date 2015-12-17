(function() {
  'use strict';

  angular.module('Piecemeal')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {
    var usernameCache = {};

    var getInfoOnRefresh = function($http) {
      if (!usernameCache[window.sessionStorage.user_id]) {
        usernameCache[window.sessionStorage.user_id] = true;
        return $http({
          method: 'POST',
          url: '/' + window.sessionStorage.code,
          data: {
            user_id: parseInt(window.sessionStorage.user_id)
          }
        });
      }
    };

    console.log('window.sessionStorage =', window.sessionStorage);
    $urlRouterProvider.otherwise(function($injector) {
      var state = $injector.get('$state');
      if (!window.sessionStorage.username || window.sessionStorage.username === "undefined") {
        state.go('home');
        // state.go('404');
      } else {
        state.go('event.allDishes');
      }
    });

    $stateProvider
      .state('home', {
        url: '/home',
        views: {
          'navbar': {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbar'
          },
          '@': {
            templateUrl: 'app/home/home.html',
            controller: 'HomeCtrl',
            controllerAs: 'home'
          }
        }
      })
      .state('oAuth', {
        url: '/oAuth',
        views: {
          'navbar': {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbar'
          },
          '@': {
            templateUrl: 'app/oAuth/oAuth.html',
            controller: 'OAuthCtrl',
            controllerAs: 'oAuth'
          }
        }
      })
      .state('dashboard', {
        url: '/dashboard',
        views: {
          'navbar': {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbar'
          },
          '@': {
            templateUrl: 'app/dashboard/dashboard.html',
            controller: 'DashboardCtrl',
            controllerAs: 'dashboard'
          }
        }
      })
      .state('404', {
        url: '/404',
        views: {
          'navbar': {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbar'
          },
          '@': {
            templateUrl: '404.html'
          }
        }
      })
      .state('event', {
        url: '/:id',
        views: {
          'navbar': {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbar'
          }

        }
      })
      .state('event.addDish', {
        url: '/addDish',
        views: {
          '@': {
            templateUrl: 'app/addDish/addDish.html',
            controller: 'AddDishCtrl',
            controllerAs: 'addDish'
          }
        },
        resolve: {
          getEventInfo: ['$http', getInfoOnRefresh]
        }
      })
      .state('event.allDishes', {
        url: '/allDishes',
        views: {
          '@': {
            templateUrl: 'app/allDishes/allDishes.html',
            controller: 'AllDishesCtrl',
            controllerAs: 'allDishes',
          }
        },
        resolve: {
          getEventInfo: ['$http', getInfoOnRefresh]
        }
      })
      .state('event.guestBill', {
        url: '/guestBill',
        views: {
          '@': {
            templateUrl: 'app/guestBill/guestBill.html',
            controller: 'GuestBillCtrl',
            controllerAs: 'guestBill'
          }
        },
        resolve: {
          getEventInfo: ['$http', getInfoOnRefresh]
        }
      })
      .state('event.hostReceipt', {
        url: '/hostReceipt',
        views: {
          '@': {
            templateUrl: 'app/hostReceipt/hostReceipt.html',
            controller: 'HostReceipt',
            controllerAs: 'hostReceipt'
          }
        },
        resolve: {}

      })
      .state('event.hostBill', {
        url: '/hostBill',
        views: {
          '@': {
            templateUrl: 'app/hostBill/hostBill.html',
            controller: 'HostBillCtrl',
            controllerAs: 'hostBill'
          }
        },
        resolve: {
          getEventInfo: ['$http', getInfoOnRefresh]
        }
      })
      .state('event.loading', {
        url: '/loading',
        views: {
          '@': {
            templateUrl: 'app/loading/loading.html',
            controller: 'LoadingCtrl',
            controllerAs: 'loading'
          }
        },
        resolve: {

        }
      });
  }
})();
