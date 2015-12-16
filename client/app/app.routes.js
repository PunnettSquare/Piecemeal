(function() {
  'use strict';

  angular.module('Piecemeal')
    .config(config);

  config.$inject = ['$stateProvider', '$urlRouterProvider'];

  function config($stateProvider, $urlRouterProvider) {

    var usernameCache = {};

    console.log('window.sessionStorage =', window.sessionStorage);
    $urlRouterProvider.otherwise(function($injector) {
      var state = $injector.get('$state');
      // use $window.$$path if we stop using window.sessionStorage
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
          // 'navbar': {
          //   templateUrl: 'components/navbar/navbar.html',
          //   controller: 'NavbarCtrl',
          //   controllerAs: 'navbar'
          // },
          '@': {
            templateUrl: 'app/addDish/addDish.html',
            controller: 'AddDishCtrl',
            controllerAs: 'addDish'
          }
        },
        resolve: {
          // getInfo: ['$http', 'appFactory', 'socketFactory', function($http, appFactory, socketFactory) {
          //   if (!appFactory.data) {
          //     socketFactory.init();
          //     appFactory.initListeners();
          //     return $http({
          //       method: 'GET',
          //       url: '/' + window.sessionStorage.code + '/refresh',
          //     })
          //     .then(function(data) {
          //       console.log('data on resolve', data)
          //       // appFactory.data = data.data;
          //       return data.data;
          //     })
          //   }
          // }]
        }
      })
      .state('event.allDishes', {
        url: '/allDishes',
        views: {
          // 'navbar': {
          //   templateUrl: 'components/navbar/navbar.html',
          //   controller: 'NavbarCtrl',
          //   controllerAs: 'navbar'
          // },
          '@': {
            templateUrl: 'app/allDishes/allDishes.html',
            controller: 'AllDishesCtrl',
            controllerAs: 'allDishes',
          }
        },
        resolve: {
          getEventInfo: ['$http', function($http) {
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
          }]
        }
      })
      .state('event.guestBill', {
        url: '/guestBill',
        views: {
          // 'navbar': {
          //   templateUrl: 'components/navbar/navbar.html',
          //   controller: 'NavbarCtrl',
          //   controllerAs: 'navbar'
          // },
          '@': {
            templateUrl: 'app/guestBill/guestBill.html',
            controller: 'GuestBillCtrl',
            controllerAs: 'guestBill'
          }
        },
        resolve: {       
        }

      })
      .state('event.hostReceipt', {
        url: '/hostReceipt',
        views: {
          // 'navbar': {
          //   templateUrl: 'components/navbar/navbar.html',
          //   controller: 'NavbarCtrl',
          //   controllerAs: 'navbar'
          // },
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
          // 'navbar': {
          //   templateUrl: 'components/navbar/navbar.html',
          //   controller: 'NavbarCtrl',
          //   controllerAs: 'navbar'
          // },
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
        views: {
          // 'navbar': {
          //   templateUrl: 'components/navbar/navbar.html',
          //   controller: 'NavbarCtrl',
          //   controllerAs: 'navbar'
          // },
          '@': {
            templateUrl: 'app/loading/loading.html',
            controller: 'LoadingCtrl',
            controllerAs: 'loading'
          }
        }
      });
  }
})();
