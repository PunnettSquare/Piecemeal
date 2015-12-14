(function() {
  'use strict';

  angular.module('Piecemeal')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {
    console.log('window.sessionStorage =', window.sessionStorage);
    $urlRouterProvider.otherwise(function($injector) {
      var state = $injector.get('$state');
      // use $window.$$path if we stop using window.sessionStorage
      if (!window.sessionStorage.username || window.sessionStorage.username === "undefined") {
        state.go('home');
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
          'navbar': {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbar'
          },
          '@': {
            templateUrl: 'app/addDish/addDish.html',
            controller: 'AddDishCtrl',
            controllerAs: 'addDish'
          }
        },
        resolve: {

        }
      })
      .state('event.allDishes', {
        url: '/allDishes',
        views: {
          'navbar': {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbar'
          },
          '@': {
            templateUrl: 'app/allDishes/allDishes.html',
            controller: 'AllDishesCtrl',
            controllerAs: 'allDishes',
          }
        }
        // ,
        // resolve: {
        //   getEventInfo: ['$http', function($http) {
            // return $http({
            //   method: 'POST',
            //   url: '/' + window.sessionStorage.code,
            //   data: {
            //     user_id: parseInt(window.sessionStorage.user_id)
            //   }
            // });
        //   }]
        // }
      })
      .state('event.guestBill', {
        url: '/guestBill',
        views: {
          'navbar': {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbar'
          },
          '@': {
            templateUrl: 'app/guestBill/guestBill.html',
            controller: 'GuestBillCtrl',
            controllerAs: 'guestBill'
          }
        },
        resolve: {}

      })
      .state('event.hostReceipt', {
        url: '/hostReceipt',
        views: {
          'navbar': {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbar'
          },
          '@': {
            templateUrl: 'app/hostReceipt/hostReceipt.html',
            controller: 'HostReceipt',
            controllerAs: 'hostReceipt'
          }
        },
        resolve: {

        }

      })
      .state('event.hostBill', {
        url: '/hostBill',
        views: {
          'navbar': {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbar'
          },
          '@': {
            templateUrl: 'app/hostBill/hostBill.html',
            controller: 'HostBillCtrl',
            controllerAs: 'hostBill'
          }
        },
        resolve: {

        }

      })
      .state('event.loading', {
        url: '/loading',

        templateUrl: 'app/loading/loading.html',
        controller: 'LoadingCtrl',
        controllerAs: 'loading',
        resolve: {

        }

      });
  }
})();
