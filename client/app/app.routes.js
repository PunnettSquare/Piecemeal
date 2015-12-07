var firstLog = true;

(function() {
  'use strict';

  angular.module('Piecemeal')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider, $window) {

    console.log('window.sessionStorage =', window.sessionStorage);
    $urlRouterProvider.otherwise('home');
    // $urlRouterProvider.otherwise(function($injector, $window) {
    // console.log('$window =', $window);
    // console.log('$window.$$path =', $window.$$path);
    // var state = $injector.get('$state');
    // // if ($window.$$path === '' || $window.$$path === '/' || $window.$$path === '/home' || $window.$$path === '/undefined') {
    // if (!window.sessionStorage.username || window.sessionStorage.username === "undefined") {
    // state.go('home');
    // } else {
    //   state.go('allDishes');
    // }
    // });

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
        },
        resolve: {

        }

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
        resolve: {
          guestBillData: ['$http', function($http) {
            return $http({
              method: 'GET',
              url: '/guestBill',
              params: {
                username: window.sessionStorage.getItem('username')
              }
            });
          }]
        }

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
