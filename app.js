(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItems);

function FoundItems() {
  var ddo = {
    templateUrl: 'items.html',
    scope: {
      list: '=myList',
      notNeeded: '&'
    }
  };
  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;
  menu.searchTerm = "";
  menu.found = [];
  menu.message = "";

  menu.narrow = function() {
    if (menu.searchTerm) {
      menu.found = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
    } else {
      menu.message = "Nothing found";
    }
  };
  menu.notNeeded = function(itemIndex) {
    console.log(menu.found);
    console.log(itemIndex);
    menu.found.splice(itemIndex, 1);
    console.log(menu.found);
  };

}


MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath, searchTerm) {
  var service = this;

  service.getMatchedMenuItems = function(searchTerm) {
    var foundItems = [];
    var promise = service.getMenuItems();
    promise.then(function(response) {
      for (var i = 0; i < response.data.menu_items.length; i++ ) {
        if (response.data.menu_items[i].description.indexOf(searchTerm) != -1) {
          foundItems.push(response.data.menu_items[i]);
        }
      }
    });
    return foundItems;
  };

  service.getMenuItems = function() {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json"),
    });
    return response;
  };

}

})();
