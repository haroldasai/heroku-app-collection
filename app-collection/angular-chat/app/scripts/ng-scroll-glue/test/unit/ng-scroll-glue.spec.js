'use strict';

describe('ngScroll directive', function () {
  var $scope, $compile, $window;

  var delay = 100;

  function template(value) {
    return $('<div/>', {
      html: $('<div/>', {
        attr: {
          'scroll-glue': value
        },

        css: {
          height: '40px',
          overflowY: 'scroll'
        },

        html: $('<div/>', {
          text: 'Hello, {{ name }}!',

          css: {
            height: '100px'
          }
        })
      })
    }).html();
  }

  var templates = {
    withSubPropertyBinding: template('prop.glued'),
    withBindingTop: template('glued'),
    withBinding: template('glued'),
    deactivated: template('false'),
    simple: template('')
  };

  beforeEach(module('ngScrollGlue'));

  beforeEach(inject(function ($injector) {
    $scope = $injector.get('$rootScope');
    $compile = $injector.get('$compile');
    $window = $injector.get('$window');
  }));

  afterEach(function () {
    $scope.$destroy();
  });

  function compile(template) {
    return $compile($(template))($scope).appendTo($('body'));
  }

  it('should scroll to bottom of element on changes', function (done) {
    var $element = compile(templates.simple)[0];

    $scope.name = "World";
    $scope.$digest();

    setTimeout(function () {
      expect($element.scrollTop).to.equal($element.scrollHeight - $element.clientHeight);
      done();
    }, delay);
  });

  it('should be deactivated if the scroll-glue attribute is set to "false"', function () {
    var $element = compile(templates.deactivated)[0];

    $scope.name = "World";
    $scope.$digest();

    setTimeout(function () {
      expect($element.scrollTop).to.equal(0);
    }, delay);
  });

  it('should turn off auto scroll after user scrolled manually', function (done) {
    var $element = compile(templates.simple)[0];

    $scope.$digest();

    $element.scrollTop = 0;

    setTimeout(function () {
      $scope.name = "World";
      $scope.$digest();

      expect($element.scrollTop).to.equal(0);

      done();
    }, delay);
  });

  it('should turn on auto scroll after user scrolled manually to bottom of element', function (done) {
    var $element = compile(templates.simple)[0];

    $scope.$digest();
    $element.scrollTop = 0;

    setTimeout(function () {
      $scope.$digest();

      expect($element.scrollTop).to.equal(0);

      $element.scrollTop = $element.scrollHeight;

      setTimeout(function () {
        $scope.$digest();

        expect($element.scrollTop).to.equal($element.scrollHeight - $element.clientHeight);

        done();
      }, delay);
    });
  });

  it('should turn off when the bound value is false', function (done) {
    $scope.glued = true;

    var $element = compile(templates.withBinding)[0];

    $scope.glued = false;
    $scope.$digest();

    setTimeout(function () {
      expect($element.scrollTop).to.equal(0);
      done();
    }, delay);
  });

  it('should update the bound value', function (done) {
    $scope.glued = true;

    var $element = compile(templates.withBinding)[0];

    $scope.$digest();

    $element.scrollTop = 0;

    setTimeout(function () {
      expect($scope.glued).to.be.false;
      done();
    }, delay);
  });

  it('should update the bound value in sub properties', function (done) {
    $scope.prop = {
      glued: true
    };

    var $element = compile(templates.withSubPropertyBinding)[0];

    $scope.$digest();

    $element.scrollTop = 0;

    setTimeout(function () {
      expect($scope.prop.glued).to.be.false;
      done();
    }, delay);
  });

  it('should scroll to top when using scroll-glue-top', function (done) {
    var $element = compile(templates.withBindingTop)[0];

    $element.scrollTop = 100;

    $scope.name = "World";
    $scope.$digest();

    setTimeout(function () {
      expect($element.scrollTop).to.equal($element.scrollHeight - $element.clientHeight);
      done();
    }, delay);
  });

  it('should scroll on window resize if glued', function (done) {
    var event = document.createEvent("HTMLEvents");
    var $element = compile(templates.simple)[0];

    event.initEvent("resize", true, true);

    $window.dispatchEvent(event);

    setTimeout(function () {
      expect($element.scrollTop).to.equal($element.scrollHeight - $element.clientHeight);
      done();
    }, delay);
  });
});
