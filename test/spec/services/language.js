'use strict';

describe('Service: Language', function () {

  // load the service's module
  beforeEach(module('worldSkillsAppApp'));

  // instantiate service
  var Language;
  beforeEach(inject(function (_Language_) {
    Language = _Language_;
  }));

  it('should do something', function () {
    expect(!!Language).toBe(true);
  });

});
