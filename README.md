# request-extension-debug

Standalone extension to request with the same functionality as request-debug, but with the option for colored output and the ability to enable debug output on a per-request basis, instead of globally.

## Install
```
$ npm install --save request-extension-debug
```


## Usage

```
require('request-extension-debug')({ color: true })(require('request'));

// can now use the 'debug' property in a call to request, e.g.

require('request')({
  method: 'GET',
  url: 'http://google.com',
  debug: true
}, function (err, resp, body) {});

// will output colored debugging output pertaining to the request and response
```

## License

MIT.

## Author

Raymond Pulver
