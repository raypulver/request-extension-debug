const expect = require('chai').expect,
  spawnSync = require('child_process').spawnSync;

describe('request-extension-debug module', function () {
  this.timeout(50000);
  it('causes request to produce debug output', function () {
    expect(spawnSync('node', ['-e', "require(\'.\')({ color: true })(require(\'request\')); require(\'request\')({ method: \'GET\', url: \'http://google.com\', debug: true }, function (err, resp, body) { console.log(\'body\'); });"]).stderr.toString('utf8')).to.be.ok;
  });
});
