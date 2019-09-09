var Crypto = exports.Crypto = require('./lib/Crypto').Crypto;
require('./lib/CryptoMath')
require('./lib/BlockModes')
require('./lib/DES')
require('./lib/AES')
require('./lib/HMAC')
require('./lib/MARC4')
require('./lib/MD5')
require('./lib/PBKDF2')
require('./lib/PBKDF2Async')
require('./lib/Rabbit')
require('./lib/SHA1')
require('./lib/SHA256')
//二傻的微信不支持动态引用 我凸
// [ 'CryptoMath'
// , 'BlockModes'
// , 'DES'
// , 'AES'
// , 'HMAC'
// , 'MARC4'
// , 'MD5'
// , 'PBKDF2'
// , 'PBKDF2Async'
// , 'Rabbit'
// , 'SHA1'
// , 'SHA256'
// ].forEach( function (path) { 
// 	require('./lib/' + path);
// });
