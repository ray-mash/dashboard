'use strict';

describe('myApp.view1 module', function() {

  beforeEach(module('app.viewDashboard'));

  describe('view1 controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var view1Ctrl = $controller('MyUpdatesDashBoardCtrl');
      expect(view1Ctrl).toBeDefined();
    }));

  });
});