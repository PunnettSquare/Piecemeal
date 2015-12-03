(function() {
  'use strict';

  angular.module('Piecemeal')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home',

      })
      .state('addMeal', {
        url: '/addMeal',
        views: {
          'navbar': {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbar'
          },
          '@': {
            templateUrl: 'app/addMeal/addMeal.html',
            controller: 'AddMealCtrl',
            controllerAs: 'addMeal'
          }
        },
        resolve: {

        }
      })
      .state('allMeals', {
        url: '/allMeals',
        views: {
          'navbar': {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbar'
          },
          '@': {
            templateUrl: 'app/allMeals/allMeals.html',
            controller: 'AllMealsCtrl',
            controllerAs: 'allMeals',
          }
        },
        resolve: {

        }

      })
      .state('guestBill', {
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

        }

      })
      .state('guestBill', {
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

        }

      })
      .state('hostCurrentBill', {
        url: '/hostCurrentBill',
        views: {
          'navbar': {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbar'
          },
          '@': {
            templateUrl: 'app/hostCurrentBill/hostCurrentBill.html',
            controller: 'HostCurrentBill',
            controllerAs: 'hostCurrentBill'
          }
        },
        resolve: {

        }

      })
      .state('hostTotal', {
        url: '/hostTotal',
        views: {
          'navbar': {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbar'
          },
          '@': {
            templateUrl: 'app/hostTotal/hostTotal.html',
            controller: 'HostTotalCtrl',
            controllerAs: 'hostTotal'
          }
        },
        resolve: {

        }

      })
      .state('loading', {
        url: '/loading',
        views: {
          'navbar': {
            templateUrl: 'components/navbar/navbar.html',
            controller: 'NavbarCtrl',
            controllerAs: 'navbar'
          },
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
