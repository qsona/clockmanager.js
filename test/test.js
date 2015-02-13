var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

var clockManager = require('../lib/clockmanager');
var _Date = clockManager.WrappedDate;

var ALLOWED_DELAY_MS = 30;
function nearlyEqual(oldTime, newTime) {
  var diff = newTime - oldTime;
  return 0 <= diff && diff <= ALLOWED_DELAY_MS;
};

function isInvalid(date) {
  // if date is "Invalid Date", date.getTime() should be NaN
  var time = date.getTime();
  return time !== time;
}

describe('WrappedDate performs as date', function() {
  it('call constructor with no args', function() {
    var date1 = new Date();
    var date2 = new _Date();

    var date1now = date2.getTime();
    var date2now = date2.getTime();
    var diff = date2now - date1now;

    assert(0 <= diff && diff <= ALLOWED_DELAY_MS, 'yeah');
    assert.equal(date2now, +date2);
  });

  it('call static now()', function() {
    var now1 = Date.now();
    var now2 = _Date.now();
    var diff = now2 - now1;

    assert(0 <= diff && diff <= ALLOWED_DELAY_MS, 'yeah');
  });

  describe('call constructor with some args', function() {
    it('1 number arg', function() {
      var date1 = new Date(100);
      var date2 = new _Date(100);
      assert.equal(date1.toString(), date2.toString());
      assert.equal(date1.getTime(), date2.getTime());
    });
    it('1 string arg', function() {
      var date1 = new  Date('2038/1/19 03:14:07');
      var date2 = new _Date('2038/1/19 03:14:07');
      assert.equal(date1.toString(), date2.toString());
      assert.equal(date1.getTime(), date2.getTime());
    });
    it('6 args', function() {
      var date1 = new  Date(2000, 1, 1, 0, 0, 0);
      var date2 = new _Date(2000, 1, 1, 0, 0, 0);
      assert.equal(date1.toString(), date2.toString());
      assert.equal(date1.getTime(), date2.getTime());
    });
  });
});

describe('delay', function() {
  var ONE_HOUR = 60 * 60 * 1000;

  afterEach(clockManager.clear);

  it('should be delayed', function() {
    clockManager.delay(ONE_HOUR);
    var date1 = new Date();
    var date2 = new _Date();
    assert(nearlyEqual(date1.getTime(), date2.getTime() - ONE_HOUR), 'yeah');
  });

});

describe('freeze', function() {
  beforeEach(function(done) {
    clockManager.freeze();
    done();
  });
  afterEach(function(done) {
    clockManager.clear();
    done();
  });

  it('should return constant time', function(done) {
    var beforeFreeze = _Date.now();
    clockManager.freeze();

    var firstNow = _Date.now();
    var firstDate = new _Date();
    setTimeout(function() {
      var secondNow = _Date.now();
      var secondDate = new _Date();
      assert.equal(firstNow, secondNow);
      assert.equal(firstDate.getTime(), secondDate.getTime());
      assert.equal(firstDate.toString(), secondDate.toString());
      assert.equal(firstDate.getTime(), firstNow);

      expect(clockManager.isFrozen()).to.be.true;
      done();
    }, 10);
  });

  it('should create proper date', function() {
    var date = new _Date(100);
    expect(date.getTime()).to.equal(100);
  });
});
