(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("pwdgen2", [], factory);
	else if(typeof exports === 'object')
		exports["pwdgen2"] = factory();
	else
		root["pwdgen2"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 3836:
/***/ (function(module) {

/*! MIT License. Copyright 2015-2018 Richard Moore <me@ricmoo.com>. See LICENSE.txt. */
(function(root) {
    "use strict";

    function checkInt(value) {
        return (parseInt(value) === value);
    }

    function checkInts(arrayish) {
        if (!checkInt(arrayish.length)) { return false; }

        for (var i = 0; i < arrayish.length; i++) {
            if (!checkInt(arrayish[i]) || arrayish[i] < 0 || arrayish[i] > 255) {
                return false;
            }
        }

        return true;
    }

    function coerceArray(arg, copy) {

        // ArrayBuffer view
        if (arg.buffer && arg.name === 'Uint8Array') {

            if (copy) {
                if (arg.slice) {
                    arg = arg.slice();
                } else {
                    arg = Array.prototype.slice.call(arg);
                }
            }

            return arg;
        }

        // It's an array; check it is a valid representation of a byte
        if (Array.isArray(arg)) {
            if (!checkInts(arg)) {
                throw new Error('Array contains invalid value: ' + arg);
            }

            return new Uint8Array(arg);
        }

        // Something else, but behaves like an array (maybe a Buffer? Arguments?)
        if (checkInt(arg.length) && checkInts(arg)) {
            return new Uint8Array(arg);
        }

        throw new Error('unsupported array-like object');
    }

    function createArray(length) {
        return new Uint8Array(length);
    }

    function copyArray(sourceArray, targetArray, targetStart, sourceStart, sourceEnd) {
        if (sourceStart != null || sourceEnd != null) {
            if (sourceArray.slice) {
                sourceArray = sourceArray.slice(sourceStart, sourceEnd);
            } else {
                sourceArray = Array.prototype.slice.call(sourceArray, sourceStart, sourceEnd);
            }
        }
        targetArray.set(sourceArray, targetStart);
    }



    var convertUtf8 = (function() {
        function toBytes(text) {
            var result = [], i = 0;
            text = encodeURI(text);
            while (i < text.length) {
                var c = text.charCodeAt(i++);

                // if it is a % sign, encode the following 2 bytes as a hex value
                if (c === 37) {
                    result.push(parseInt(text.substr(i, 2), 16))
                    i += 2;

                // otherwise, just the actual byte
                } else {
                    result.push(c)
                }
            }

            return coerceArray(result);
        }

        function fromBytes(bytes) {
            var result = [], i = 0;

            while (i < bytes.length) {
                var c = bytes[i];

                if (c < 128) {
                    result.push(String.fromCharCode(c));
                    i++;
                } else if (c > 191 && c < 224) {
                    result.push(String.fromCharCode(((c & 0x1f) << 6) | (bytes[i + 1] & 0x3f)));
                    i += 2;
                } else {
                    result.push(String.fromCharCode(((c & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f)));
                    i += 3;
                }
            }

            return result.join('');
        }

        return {
            toBytes: toBytes,
            fromBytes: fromBytes,
        }
    })();

    var convertHex = (function() {
        function toBytes(text) {
            var result = [];
            for (var i = 0; i < text.length; i += 2) {
                result.push(parseInt(text.substr(i, 2), 16));
            }

            return result;
        }

        // http://ixti.net/development/javascript/2011/11/11/base64-encodedecode-of-utf8-in-browser-with-js.html
        var Hex = '0123456789abcdef';

        function fromBytes(bytes) {
                var result = [];
                for (var i = 0; i < bytes.length; i++) {
                    var v = bytes[i];
                    result.push(Hex[(v & 0xf0) >> 4] + Hex[v & 0x0f]);
                }
                return result.join('');
        }

        return {
            toBytes: toBytes,
            fromBytes: fromBytes,
        }
    })();


    // Number of rounds by keysize
    var numberOfRounds = {16: 10, 24: 12, 32: 14}

    // Round constant words
    var rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91];

    // S-box and Inverse S-box (S is for Substitution)
    var S = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16];
    var Si =[0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb, 0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb, 0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e, 0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92, 0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84, 0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06, 0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b, 0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73, 0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e, 0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b, 0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4, 0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f, 0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef, 0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61, 0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d];

    // Transformations for encryption
    var T1 = [0xc66363a5, 0xf87c7c84, 0xee777799, 0xf67b7b8d, 0xfff2f20d, 0xd66b6bbd, 0xde6f6fb1, 0x91c5c554, 0x60303050, 0x02010103, 0xce6767a9, 0x562b2b7d, 0xe7fefe19, 0xb5d7d762, 0x4dababe6, 0xec76769a, 0x8fcaca45, 0x1f82829d, 0x89c9c940, 0xfa7d7d87, 0xeffafa15, 0xb25959eb, 0x8e4747c9, 0xfbf0f00b, 0x41adadec, 0xb3d4d467, 0x5fa2a2fd, 0x45afafea, 0x239c9cbf, 0x53a4a4f7, 0xe4727296, 0x9bc0c05b, 0x75b7b7c2, 0xe1fdfd1c, 0x3d9393ae, 0x4c26266a, 0x6c36365a, 0x7e3f3f41, 0xf5f7f702, 0x83cccc4f, 0x6834345c, 0x51a5a5f4, 0xd1e5e534, 0xf9f1f108, 0xe2717193, 0xabd8d873, 0x62313153, 0x2a15153f, 0x0804040c, 0x95c7c752, 0x46232365, 0x9dc3c35e, 0x30181828, 0x379696a1, 0x0a05050f, 0x2f9a9ab5, 0x0e070709, 0x24121236, 0x1b80809b, 0xdfe2e23d, 0xcdebeb26, 0x4e272769, 0x7fb2b2cd, 0xea75759f, 0x1209091b, 0x1d83839e, 0x582c2c74, 0x341a1a2e, 0x361b1b2d, 0xdc6e6eb2, 0xb45a5aee, 0x5ba0a0fb, 0xa45252f6, 0x763b3b4d, 0xb7d6d661, 0x7db3b3ce, 0x5229297b, 0xdde3e33e, 0x5e2f2f71, 0x13848497, 0xa65353f5, 0xb9d1d168, 0x00000000, 0xc1eded2c, 0x40202060, 0xe3fcfc1f, 0x79b1b1c8, 0xb65b5bed, 0xd46a6abe, 0x8dcbcb46, 0x67bebed9, 0x7239394b, 0x944a4ade, 0x984c4cd4, 0xb05858e8, 0x85cfcf4a, 0xbbd0d06b, 0xc5efef2a, 0x4faaaae5, 0xedfbfb16, 0x864343c5, 0x9a4d4dd7, 0x66333355, 0x11858594, 0x8a4545cf, 0xe9f9f910, 0x04020206, 0xfe7f7f81, 0xa05050f0, 0x783c3c44, 0x259f9fba, 0x4ba8a8e3, 0xa25151f3, 0x5da3a3fe, 0x804040c0, 0x058f8f8a, 0x3f9292ad, 0x219d9dbc, 0x70383848, 0xf1f5f504, 0x63bcbcdf, 0x77b6b6c1, 0xafdada75, 0x42212163, 0x20101030, 0xe5ffff1a, 0xfdf3f30e, 0xbfd2d26d, 0x81cdcd4c, 0x180c0c14, 0x26131335, 0xc3ecec2f, 0xbe5f5fe1, 0x359797a2, 0x884444cc, 0x2e171739, 0x93c4c457, 0x55a7a7f2, 0xfc7e7e82, 0x7a3d3d47, 0xc86464ac, 0xba5d5de7, 0x3219192b, 0xe6737395, 0xc06060a0, 0x19818198, 0x9e4f4fd1, 0xa3dcdc7f, 0x44222266, 0x542a2a7e, 0x3b9090ab, 0x0b888883, 0x8c4646ca, 0xc7eeee29, 0x6bb8b8d3, 0x2814143c, 0xa7dede79, 0xbc5e5ee2, 0x160b0b1d, 0xaddbdb76, 0xdbe0e03b, 0x64323256, 0x743a3a4e, 0x140a0a1e, 0x924949db, 0x0c06060a, 0x4824246c, 0xb85c5ce4, 0x9fc2c25d, 0xbdd3d36e, 0x43acacef, 0xc46262a6, 0x399191a8, 0x319595a4, 0xd3e4e437, 0xf279798b, 0xd5e7e732, 0x8bc8c843, 0x6e373759, 0xda6d6db7, 0x018d8d8c, 0xb1d5d564, 0x9c4e4ed2, 0x49a9a9e0, 0xd86c6cb4, 0xac5656fa, 0xf3f4f407, 0xcfeaea25, 0xca6565af, 0xf47a7a8e, 0x47aeaee9, 0x10080818, 0x6fbabad5, 0xf0787888, 0x4a25256f, 0x5c2e2e72, 0x381c1c24, 0x57a6a6f1, 0x73b4b4c7, 0x97c6c651, 0xcbe8e823, 0xa1dddd7c, 0xe874749c, 0x3e1f1f21, 0x964b4bdd, 0x61bdbddc, 0x0d8b8b86, 0x0f8a8a85, 0xe0707090, 0x7c3e3e42, 0x71b5b5c4, 0xcc6666aa, 0x904848d8, 0x06030305, 0xf7f6f601, 0x1c0e0e12, 0xc26161a3, 0x6a35355f, 0xae5757f9, 0x69b9b9d0, 0x17868691, 0x99c1c158, 0x3a1d1d27, 0x279e9eb9, 0xd9e1e138, 0xebf8f813, 0x2b9898b3, 0x22111133, 0xd26969bb, 0xa9d9d970, 0x078e8e89, 0x339494a7, 0x2d9b9bb6, 0x3c1e1e22, 0x15878792, 0xc9e9e920, 0x87cece49, 0xaa5555ff, 0x50282878, 0xa5dfdf7a, 0x038c8c8f, 0x59a1a1f8, 0x09898980, 0x1a0d0d17, 0x65bfbfda, 0xd7e6e631, 0x844242c6, 0xd06868b8, 0x824141c3, 0x299999b0, 0x5a2d2d77, 0x1e0f0f11, 0x7bb0b0cb, 0xa85454fc, 0x6dbbbbd6, 0x2c16163a];
    var T2 = [0xa5c66363, 0x84f87c7c, 0x99ee7777, 0x8df67b7b, 0x0dfff2f2, 0xbdd66b6b, 0xb1de6f6f, 0x5491c5c5, 0x50603030, 0x03020101, 0xa9ce6767, 0x7d562b2b, 0x19e7fefe, 0x62b5d7d7, 0xe64dabab, 0x9aec7676, 0x458fcaca, 0x9d1f8282, 0x4089c9c9, 0x87fa7d7d, 0x15effafa, 0xebb25959, 0xc98e4747, 0x0bfbf0f0, 0xec41adad, 0x67b3d4d4, 0xfd5fa2a2, 0xea45afaf, 0xbf239c9c, 0xf753a4a4, 0x96e47272, 0x5b9bc0c0, 0xc275b7b7, 0x1ce1fdfd, 0xae3d9393, 0x6a4c2626, 0x5a6c3636, 0x417e3f3f, 0x02f5f7f7, 0x4f83cccc, 0x5c683434, 0xf451a5a5, 0x34d1e5e5, 0x08f9f1f1, 0x93e27171, 0x73abd8d8, 0x53623131, 0x3f2a1515, 0x0c080404, 0x5295c7c7, 0x65462323, 0x5e9dc3c3, 0x28301818, 0xa1379696, 0x0f0a0505, 0xb52f9a9a, 0x090e0707, 0x36241212, 0x9b1b8080, 0x3ddfe2e2, 0x26cdebeb, 0x694e2727, 0xcd7fb2b2, 0x9fea7575, 0x1b120909, 0x9e1d8383, 0x74582c2c, 0x2e341a1a, 0x2d361b1b, 0xb2dc6e6e, 0xeeb45a5a, 0xfb5ba0a0, 0xf6a45252, 0x4d763b3b, 0x61b7d6d6, 0xce7db3b3, 0x7b522929, 0x3edde3e3, 0x715e2f2f, 0x97138484, 0xf5a65353, 0x68b9d1d1, 0x00000000, 0x2cc1eded, 0x60402020, 0x1fe3fcfc, 0xc879b1b1, 0xedb65b5b, 0xbed46a6a, 0x468dcbcb, 0xd967bebe, 0x4b723939, 0xde944a4a, 0xd4984c4c, 0xe8b05858, 0x4a85cfcf, 0x6bbbd0d0, 0x2ac5efef, 0xe54faaaa, 0x16edfbfb, 0xc5864343, 0xd79a4d4d, 0x55663333, 0x94118585, 0xcf8a4545, 0x10e9f9f9, 0x06040202, 0x81fe7f7f, 0xf0a05050, 0x44783c3c, 0xba259f9f, 0xe34ba8a8, 0xf3a25151, 0xfe5da3a3, 0xc0804040, 0x8a058f8f, 0xad3f9292, 0xbc219d9d, 0x48703838, 0x04f1f5f5, 0xdf63bcbc, 0xc177b6b6, 0x75afdada, 0x63422121, 0x30201010, 0x1ae5ffff, 0x0efdf3f3, 0x6dbfd2d2, 0x4c81cdcd, 0x14180c0c, 0x35261313, 0x2fc3ecec, 0xe1be5f5f, 0xa2359797, 0xcc884444, 0x392e1717, 0x5793c4c4, 0xf255a7a7, 0x82fc7e7e, 0x477a3d3d, 0xacc86464, 0xe7ba5d5d, 0x2b321919, 0x95e67373, 0xa0c06060, 0x98198181, 0xd19e4f4f, 0x7fa3dcdc, 0x66442222, 0x7e542a2a, 0xab3b9090, 0x830b8888, 0xca8c4646, 0x29c7eeee, 0xd36bb8b8, 0x3c281414, 0x79a7dede, 0xe2bc5e5e, 0x1d160b0b, 0x76addbdb, 0x3bdbe0e0, 0x56643232, 0x4e743a3a, 0x1e140a0a, 0xdb924949, 0x0a0c0606, 0x6c482424, 0xe4b85c5c, 0x5d9fc2c2, 0x6ebdd3d3, 0xef43acac, 0xa6c46262, 0xa8399191, 0xa4319595, 0x37d3e4e4, 0x8bf27979, 0x32d5e7e7, 0x438bc8c8, 0x596e3737, 0xb7da6d6d, 0x8c018d8d, 0x64b1d5d5, 0xd29c4e4e, 0xe049a9a9, 0xb4d86c6c, 0xfaac5656, 0x07f3f4f4, 0x25cfeaea, 0xafca6565, 0x8ef47a7a, 0xe947aeae, 0x18100808, 0xd56fbaba, 0x88f07878, 0x6f4a2525, 0x725c2e2e, 0x24381c1c, 0xf157a6a6, 0xc773b4b4, 0x5197c6c6, 0x23cbe8e8, 0x7ca1dddd, 0x9ce87474, 0x213e1f1f, 0xdd964b4b, 0xdc61bdbd, 0x860d8b8b, 0x850f8a8a, 0x90e07070, 0x427c3e3e, 0xc471b5b5, 0xaacc6666, 0xd8904848, 0x05060303, 0x01f7f6f6, 0x121c0e0e, 0xa3c26161, 0x5f6a3535, 0xf9ae5757, 0xd069b9b9, 0x91178686, 0x5899c1c1, 0x273a1d1d, 0xb9279e9e, 0x38d9e1e1, 0x13ebf8f8, 0xb32b9898, 0x33221111, 0xbbd26969, 0x70a9d9d9, 0x89078e8e, 0xa7339494, 0xb62d9b9b, 0x223c1e1e, 0x92158787, 0x20c9e9e9, 0x4987cece, 0xffaa5555, 0x78502828, 0x7aa5dfdf, 0x8f038c8c, 0xf859a1a1, 0x80098989, 0x171a0d0d, 0xda65bfbf, 0x31d7e6e6, 0xc6844242, 0xb8d06868, 0xc3824141, 0xb0299999, 0x775a2d2d, 0x111e0f0f, 0xcb7bb0b0, 0xfca85454, 0xd66dbbbb, 0x3a2c1616];
    var T3 = [0x63a5c663, 0x7c84f87c, 0x7799ee77, 0x7b8df67b, 0xf20dfff2, 0x6bbdd66b, 0x6fb1de6f, 0xc55491c5, 0x30506030, 0x01030201, 0x67a9ce67, 0x2b7d562b, 0xfe19e7fe, 0xd762b5d7, 0xabe64dab, 0x769aec76, 0xca458fca, 0x829d1f82, 0xc94089c9, 0x7d87fa7d, 0xfa15effa, 0x59ebb259, 0x47c98e47, 0xf00bfbf0, 0xadec41ad, 0xd467b3d4, 0xa2fd5fa2, 0xafea45af, 0x9cbf239c, 0xa4f753a4, 0x7296e472, 0xc05b9bc0, 0xb7c275b7, 0xfd1ce1fd, 0x93ae3d93, 0x266a4c26, 0x365a6c36, 0x3f417e3f, 0xf702f5f7, 0xcc4f83cc, 0x345c6834, 0xa5f451a5, 0xe534d1e5, 0xf108f9f1, 0x7193e271, 0xd873abd8, 0x31536231, 0x153f2a15, 0x040c0804, 0xc75295c7, 0x23654623, 0xc35e9dc3, 0x18283018, 0x96a13796, 0x050f0a05, 0x9ab52f9a, 0x07090e07, 0x12362412, 0x809b1b80, 0xe23ddfe2, 0xeb26cdeb, 0x27694e27, 0xb2cd7fb2, 0x759fea75, 0x091b1209, 0x839e1d83, 0x2c74582c, 0x1a2e341a, 0x1b2d361b, 0x6eb2dc6e, 0x5aeeb45a, 0xa0fb5ba0, 0x52f6a452, 0x3b4d763b, 0xd661b7d6, 0xb3ce7db3, 0x297b5229, 0xe33edde3, 0x2f715e2f, 0x84971384, 0x53f5a653, 0xd168b9d1, 0x00000000, 0xed2cc1ed, 0x20604020, 0xfc1fe3fc, 0xb1c879b1, 0x5bedb65b, 0x6abed46a, 0xcb468dcb, 0xbed967be, 0x394b7239, 0x4ade944a, 0x4cd4984c, 0x58e8b058, 0xcf4a85cf, 0xd06bbbd0, 0xef2ac5ef, 0xaae54faa, 0xfb16edfb, 0x43c58643, 0x4dd79a4d, 0x33556633, 0x85941185, 0x45cf8a45, 0xf910e9f9, 0x02060402, 0x7f81fe7f, 0x50f0a050, 0x3c44783c, 0x9fba259f, 0xa8e34ba8, 0x51f3a251, 0xa3fe5da3, 0x40c08040, 0x8f8a058f, 0x92ad3f92, 0x9dbc219d, 0x38487038, 0xf504f1f5, 0xbcdf63bc, 0xb6c177b6, 0xda75afda, 0x21634221, 0x10302010, 0xff1ae5ff, 0xf30efdf3, 0xd26dbfd2, 0xcd4c81cd, 0x0c14180c, 0x13352613, 0xec2fc3ec, 0x5fe1be5f, 0x97a23597, 0x44cc8844, 0x17392e17, 0xc45793c4, 0xa7f255a7, 0x7e82fc7e, 0x3d477a3d, 0x64acc864, 0x5de7ba5d, 0x192b3219, 0x7395e673, 0x60a0c060, 0x81981981, 0x4fd19e4f, 0xdc7fa3dc, 0x22664422, 0x2a7e542a, 0x90ab3b90, 0x88830b88, 0x46ca8c46, 0xee29c7ee, 0xb8d36bb8, 0x143c2814, 0xde79a7de, 0x5ee2bc5e, 0x0b1d160b, 0xdb76addb, 0xe03bdbe0, 0x32566432, 0x3a4e743a, 0x0a1e140a, 0x49db9249, 0x060a0c06, 0x246c4824, 0x5ce4b85c, 0xc25d9fc2, 0xd36ebdd3, 0xacef43ac, 0x62a6c462, 0x91a83991, 0x95a43195, 0xe437d3e4, 0x798bf279, 0xe732d5e7, 0xc8438bc8, 0x37596e37, 0x6db7da6d, 0x8d8c018d, 0xd564b1d5, 0x4ed29c4e, 0xa9e049a9, 0x6cb4d86c, 0x56faac56, 0xf407f3f4, 0xea25cfea, 0x65afca65, 0x7a8ef47a, 0xaee947ae, 0x08181008, 0xbad56fba, 0x7888f078, 0x256f4a25, 0x2e725c2e, 0x1c24381c, 0xa6f157a6, 0xb4c773b4, 0xc65197c6, 0xe823cbe8, 0xdd7ca1dd, 0x749ce874, 0x1f213e1f, 0x4bdd964b, 0xbddc61bd, 0x8b860d8b, 0x8a850f8a, 0x7090e070, 0x3e427c3e, 0xb5c471b5, 0x66aacc66, 0x48d89048, 0x03050603, 0xf601f7f6, 0x0e121c0e, 0x61a3c261, 0x355f6a35, 0x57f9ae57, 0xb9d069b9, 0x86911786, 0xc15899c1, 0x1d273a1d, 0x9eb9279e, 0xe138d9e1, 0xf813ebf8, 0x98b32b98, 0x11332211, 0x69bbd269, 0xd970a9d9, 0x8e89078e, 0x94a73394, 0x9bb62d9b, 0x1e223c1e, 0x87921587, 0xe920c9e9, 0xce4987ce, 0x55ffaa55, 0x28785028, 0xdf7aa5df, 0x8c8f038c, 0xa1f859a1, 0x89800989, 0x0d171a0d, 0xbfda65bf, 0xe631d7e6, 0x42c68442, 0x68b8d068, 0x41c38241, 0x99b02999, 0x2d775a2d, 0x0f111e0f, 0xb0cb7bb0, 0x54fca854, 0xbbd66dbb, 0x163a2c16];
    var T4 = [0x6363a5c6, 0x7c7c84f8, 0x777799ee, 0x7b7b8df6, 0xf2f20dff, 0x6b6bbdd6, 0x6f6fb1de, 0xc5c55491, 0x30305060, 0x01010302, 0x6767a9ce, 0x2b2b7d56, 0xfefe19e7, 0xd7d762b5, 0xababe64d, 0x76769aec, 0xcaca458f, 0x82829d1f, 0xc9c94089, 0x7d7d87fa, 0xfafa15ef, 0x5959ebb2, 0x4747c98e, 0xf0f00bfb, 0xadadec41, 0xd4d467b3, 0xa2a2fd5f, 0xafafea45, 0x9c9cbf23, 0xa4a4f753, 0x727296e4, 0xc0c05b9b, 0xb7b7c275, 0xfdfd1ce1, 0x9393ae3d, 0x26266a4c, 0x36365a6c, 0x3f3f417e, 0xf7f702f5, 0xcccc4f83, 0x34345c68, 0xa5a5f451, 0xe5e534d1, 0xf1f108f9, 0x717193e2, 0xd8d873ab, 0x31315362, 0x15153f2a, 0x04040c08, 0xc7c75295, 0x23236546, 0xc3c35e9d, 0x18182830, 0x9696a137, 0x05050f0a, 0x9a9ab52f, 0x0707090e, 0x12123624, 0x80809b1b, 0xe2e23ddf, 0xebeb26cd, 0x2727694e, 0xb2b2cd7f, 0x75759fea, 0x09091b12, 0x83839e1d, 0x2c2c7458, 0x1a1a2e34, 0x1b1b2d36, 0x6e6eb2dc, 0x5a5aeeb4, 0xa0a0fb5b, 0x5252f6a4, 0x3b3b4d76, 0xd6d661b7, 0xb3b3ce7d, 0x29297b52, 0xe3e33edd, 0x2f2f715e, 0x84849713, 0x5353f5a6, 0xd1d168b9, 0x00000000, 0xeded2cc1, 0x20206040, 0xfcfc1fe3, 0xb1b1c879, 0x5b5bedb6, 0x6a6abed4, 0xcbcb468d, 0xbebed967, 0x39394b72, 0x4a4ade94, 0x4c4cd498, 0x5858e8b0, 0xcfcf4a85, 0xd0d06bbb, 0xefef2ac5, 0xaaaae54f, 0xfbfb16ed, 0x4343c586, 0x4d4dd79a, 0x33335566, 0x85859411, 0x4545cf8a, 0xf9f910e9, 0x02020604, 0x7f7f81fe, 0x5050f0a0, 0x3c3c4478, 0x9f9fba25, 0xa8a8e34b, 0x5151f3a2, 0xa3a3fe5d, 0x4040c080, 0x8f8f8a05, 0x9292ad3f, 0x9d9dbc21, 0x38384870, 0xf5f504f1, 0xbcbcdf63, 0xb6b6c177, 0xdada75af, 0x21216342, 0x10103020, 0xffff1ae5, 0xf3f30efd, 0xd2d26dbf, 0xcdcd4c81, 0x0c0c1418, 0x13133526, 0xecec2fc3, 0x5f5fe1be, 0x9797a235, 0x4444cc88, 0x1717392e, 0xc4c45793, 0xa7a7f255, 0x7e7e82fc, 0x3d3d477a, 0x6464acc8, 0x5d5de7ba, 0x19192b32, 0x737395e6, 0x6060a0c0, 0x81819819, 0x4f4fd19e, 0xdcdc7fa3, 0x22226644, 0x2a2a7e54, 0x9090ab3b, 0x8888830b, 0x4646ca8c, 0xeeee29c7, 0xb8b8d36b, 0x14143c28, 0xdede79a7, 0x5e5ee2bc, 0x0b0b1d16, 0xdbdb76ad, 0xe0e03bdb, 0x32325664, 0x3a3a4e74, 0x0a0a1e14, 0x4949db92, 0x06060a0c, 0x24246c48, 0x5c5ce4b8, 0xc2c25d9f, 0xd3d36ebd, 0xacacef43, 0x6262a6c4, 0x9191a839, 0x9595a431, 0xe4e437d3, 0x79798bf2, 0xe7e732d5, 0xc8c8438b, 0x3737596e, 0x6d6db7da, 0x8d8d8c01, 0xd5d564b1, 0x4e4ed29c, 0xa9a9e049, 0x6c6cb4d8, 0x5656faac, 0xf4f407f3, 0xeaea25cf, 0x6565afca, 0x7a7a8ef4, 0xaeaee947, 0x08081810, 0xbabad56f, 0x787888f0, 0x25256f4a, 0x2e2e725c, 0x1c1c2438, 0xa6a6f157, 0xb4b4c773, 0xc6c65197, 0xe8e823cb, 0xdddd7ca1, 0x74749ce8, 0x1f1f213e, 0x4b4bdd96, 0xbdbddc61, 0x8b8b860d, 0x8a8a850f, 0x707090e0, 0x3e3e427c, 0xb5b5c471, 0x6666aacc, 0x4848d890, 0x03030506, 0xf6f601f7, 0x0e0e121c, 0x6161a3c2, 0x35355f6a, 0x5757f9ae, 0xb9b9d069, 0x86869117, 0xc1c15899, 0x1d1d273a, 0x9e9eb927, 0xe1e138d9, 0xf8f813eb, 0x9898b32b, 0x11113322, 0x6969bbd2, 0xd9d970a9, 0x8e8e8907, 0x9494a733, 0x9b9bb62d, 0x1e1e223c, 0x87879215, 0xe9e920c9, 0xcece4987, 0x5555ffaa, 0x28287850, 0xdfdf7aa5, 0x8c8c8f03, 0xa1a1f859, 0x89898009, 0x0d0d171a, 0xbfbfda65, 0xe6e631d7, 0x4242c684, 0x6868b8d0, 0x4141c382, 0x9999b029, 0x2d2d775a, 0x0f0f111e, 0xb0b0cb7b, 0x5454fca8, 0xbbbbd66d, 0x16163a2c];

    // Transformations for decryption
    var T5 = [0x51f4a750, 0x7e416553, 0x1a17a4c3, 0x3a275e96, 0x3bab6bcb, 0x1f9d45f1, 0xacfa58ab, 0x4be30393, 0x2030fa55, 0xad766df6, 0x88cc7691, 0xf5024c25, 0x4fe5d7fc, 0xc52acbd7, 0x26354480, 0xb562a38f, 0xdeb15a49, 0x25ba1b67, 0x45ea0e98, 0x5dfec0e1, 0xc32f7502, 0x814cf012, 0x8d4697a3, 0x6bd3f9c6, 0x038f5fe7, 0x15929c95, 0xbf6d7aeb, 0x955259da, 0xd4be832d, 0x587421d3, 0x49e06929, 0x8ec9c844, 0x75c2896a, 0xf48e7978, 0x99583e6b, 0x27b971dd, 0xbee14fb6, 0xf088ad17, 0xc920ac66, 0x7dce3ab4, 0x63df4a18, 0xe51a3182, 0x97513360, 0x62537f45, 0xb16477e0, 0xbb6bae84, 0xfe81a01c, 0xf9082b94, 0x70486858, 0x8f45fd19, 0x94de6c87, 0x527bf8b7, 0xab73d323, 0x724b02e2, 0xe31f8f57, 0x6655ab2a, 0xb2eb2807, 0x2fb5c203, 0x86c57b9a, 0xd33708a5, 0x302887f2, 0x23bfa5b2, 0x02036aba, 0xed16825c, 0x8acf1c2b, 0xa779b492, 0xf307f2f0, 0x4e69e2a1, 0x65daf4cd, 0x0605bed5, 0xd134621f, 0xc4a6fe8a, 0x342e539d, 0xa2f355a0, 0x058ae132, 0xa4f6eb75, 0x0b83ec39, 0x4060efaa, 0x5e719f06, 0xbd6e1051, 0x3e218af9, 0x96dd063d, 0xdd3e05ae, 0x4de6bd46, 0x91548db5, 0x71c45d05, 0x0406d46f, 0x605015ff, 0x1998fb24, 0xd6bde997, 0x894043cc, 0x67d99e77, 0xb0e842bd, 0x07898b88, 0xe7195b38, 0x79c8eedb, 0xa17c0a47, 0x7c420fe9, 0xf8841ec9, 0x00000000, 0x09808683, 0x322bed48, 0x1e1170ac, 0x6c5a724e, 0xfd0efffb, 0x0f853856, 0x3daed51e, 0x362d3927, 0x0a0fd964, 0x685ca621, 0x9b5b54d1, 0x24362e3a, 0x0c0a67b1, 0x9357e70f, 0xb4ee96d2, 0x1b9b919e, 0x80c0c54f, 0x61dc20a2, 0x5a774b69, 0x1c121a16, 0xe293ba0a, 0xc0a02ae5, 0x3c22e043, 0x121b171d, 0x0e090d0b, 0xf28bc7ad, 0x2db6a8b9, 0x141ea9c8, 0x57f11985, 0xaf75074c, 0xee99ddbb, 0xa37f60fd, 0xf701269f, 0x5c72f5bc, 0x44663bc5, 0x5bfb7e34, 0x8b432976, 0xcb23c6dc, 0xb6edfc68, 0xb8e4f163, 0xd731dcca, 0x42638510, 0x13972240, 0x84c61120, 0x854a247d, 0xd2bb3df8, 0xaef93211, 0xc729a16d, 0x1d9e2f4b, 0xdcb230f3, 0x0d8652ec, 0x77c1e3d0, 0x2bb3166c, 0xa970b999, 0x119448fa, 0x47e96422, 0xa8fc8cc4, 0xa0f03f1a, 0x567d2cd8, 0x223390ef, 0x87494ec7, 0xd938d1c1, 0x8ccaa2fe, 0x98d40b36, 0xa6f581cf, 0xa57ade28, 0xdab78e26, 0x3fadbfa4, 0x2c3a9de4, 0x5078920d, 0x6a5fcc9b, 0x547e4662, 0xf68d13c2, 0x90d8b8e8, 0x2e39f75e, 0x82c3aff5, 0x9f5d80be, 0x69d0937c, 0x6fd52da9, 0xcf2512b3, 0xc8ac993b, 0x10187da7, 0xe89c636e, 0xdb3bbb7b, 0xcd267809, 0x6e5918f4, 0xec9ab701, 0x834f9aa8, 0xe6956e65, 0xaaffe67e, 0x21bccf08, 0xef15e8e6, 0xbae79bd9, 0x4a6f36ce, 0xea9f09d4, 0x29b07cd6, 0x31a4b2af, 0x2a3f2331, 0xc6a59430, 0x35a266c0, 0x744ebc37, 0xfc82caa6, 0xe090d0b0, 0x33a7d815, 0xf104984a, 0x41ecdaf7, 0x7fcd500e, 0x1791f62f, 0x764dd68d, 0x43efb04d, 0xccaa4d54, 0xe49604df, 0x9ed1b5e3, 0x4c6a881b, 0xc12c1fb8, 0x4665517f, 0x9d5eea04, 0x018c355d, 0xfa877473, 0xfb0b412e, 0xb3671d5a, 0x92dbd252, 0xe9105633, 0x6dd64713, 0x9ad7618c, 0x37a10c7a, 0x59f8148e, 0xeb133c89, 0xcea927ee, 0xb761c935, 0xe11ce5ed, 0x7a47b13c, 0x9cd2df59, 0x55f2733f, 0x1814ce79, 0x73c737bf, 0x53f7cdea, 0x5ffdaa5b, 0xdf3d6f14, 0x7844db86, 0xcaaff381, 0xb968c43e, 0x3824342c, 0xc2a3405f, 0x161dc372, 0xbce2250c, 0x283c498b, 0xff0d9541, 0x39a80171, 0x080cb3de, 0xd8b4e49c, 0x6456c190, 0x7bcb8461, 0xd532b670, 0x486c5c74, 0xd0b85742];
    var T6 = [0x5051f4a7, 0x537e4165, 0xc31a17a4, 0x963a275e, 0xcb3bab6b, 0xf11f9d45, 0xabacfa58, 0x934be303, 0x552030fa, 0xf6ad766d, 0x9188cc76, 0x25f5024c, 0xfc4fe5d7, 0xd7c52acb, 0x80263544, 0x8fb562a3, 0x49deb15a, 0x6725ba1b, 0x9845ea0e, 0xe15dfec0, 0x02c32f75, 0x12814cf0, 0xa38d4697, 0xc66bd3f9, 0xe7038f5f, 0x9515929c, 0xebbf6d7a, 0xda955259, 0x2dd4be83, 0xd3587421, 0x2949e069, 0x448ec9c8, 0x6a75c289, 0x78f48e79, 0x6b99583e, 0xdd27b971, 0xb6bee14f, 0x17f088ad, 0x66c920ac, 0xb47dce3a, 0x1863df4a, 0x82e51a31, 0x60975133, 0x4562537f, 0xe0b16477, 0x84bb6bae, 0x1cfe81a0, 0x94f9082b, 0x58704868, 0x198f45fd, 0x8794de6c, 0xb7527bf8, 0x23ab73d3, 0xe2724b02, 0x57e31f8f, 0x2a6655ab, 0x07b2eb28, 0x032fb5c2, 0x9a86c57b, 0xa5d33708, 0xf2302887, 0xb223bfa5, 0xba02036a, 0x5ced1682, 0x2b8acf1c, 0x92a779b4, 0xf0f307f2, 0xa14e69e2, 0xcd65daf4, 0xd50605be, 0x1fd13462, 0x8ac4a6fe, 0x9d342e53, 0xa0a2f355, 0x32058ae1, 0x75a4f6eb, 0x390b83ec, 0xaa4060ef, 0x065e719f, 0x51bd6e10, 0xf93e218a, 0x3d96dd06, 0xaedd3e05, 0x464de6bd, 0xb591548d, 0x0571c45d, 0x6f0406d4, 0xff605015, 0x241998fb, 0x97d6bde9, 0xcc894043, 0x7767d99e, 0xbdb0e842, 0x8807898b, 0x38e7195b, 0xdb79c8ee, 0x47a17c0a, 0xe97c420f, 0xc9f8841e, 0x00000000, 0x83098086, 0x48322bed, 0xac1e1170, 0x4e6c5a72, 0xfbfd0eff, 0x560f8538, 0x1e3daed5, 0x27362d39, 0x640a0fd9, 0x21685ca6, 0xd19b5b54, 0x3a24362e, 0xb10c0a67, 0x0f9357e7, 0xd2b4ee96, 0x9e1b9b91, 0x4f80c0c5, 0xa261dc20, 0x695a774b, 0x161c121a, 0x0ae293ba, 0xe5c0a02a, 0x433c22e0, 0x1d121b17, 0x0b0e090d, 0xadf28bc7, 0xb92db6a8, 0xc8141ea9, 0x8557f119, 0x4caf7507, 0xbbee99dd, 0xfda37f60, 0x9ff70126, 0xbc5c72f5, 0xc544663b, 0x345bfb7e, 0x768b4329, 0xdccb23c6, 0x68b6edfc, 0x63b8e4f1, 0xcad731dc, 0x10426385, 0x40139722, 0x2084c611, 0x7d854a24, 0xf8d2bb3d, 0x11aef932, 0x6dc729a1, 0x4b1d9e2f, 0xf3dcb230, 0xec0d8652, 0xd077c1e3, 0x6c2bb316, 0x99a970b9, 0xfa119448, 0x2247e964, 0xc4a8fc8c, 0x1aa0f03f, 0xd8567d2c, 0xef223390, 0xc787494e, 0xc1d938d1, 0xfe8ccaa2, 0x3698d40b, 0xcfa6f581, 0x28a57ade, 0x26dab78e, 0xa43fadbf, 0xe42c3a9d, 0x0d507892, 0x9b6a5fcc, 0x62547e46, 0xc2f68d13, 0xe890d8b8, 0x5e2e39f7, 0xf582c3af, 0xbe9f5d80, 0x7c69d093, 0xa96fd52d, 0xb3cf2512, 0x3bc8ac99, 0xa710187d, 0x6ee89c63, 0x7bdb3bbb, 0x09cd2678, 0xf46e5918, 0x01ec9ab7, 0xa8834f9a, 0x65e6956e, 0x7eaaffe6, 0x0821bccf, 0xe6ef15e8, 0xd9bae79b, 0xce4a6f36, 0xd4ea9f09, 0xd629b07c, 0xaf31a4b2, 0x312a3f23, 0x30c6a594, 0xc035a266, 0x37744ebc, 0xa6fc82ca, 0xb0e090d0, 0x1533a7d8, 0x4af10498, 0xf741ecda, 0x0e7fcd50, 0x2f1791f6, 0x8d764dd6, 0x4d43efb0, 0x54ccaa4d, 0xdfe49604, 0xe39ed1b5, 0x1b4c6a88, 0xb8c12c1f, 0x7f466551, 0x049d5eea, 0x5d018c35, 0x73fa8774, 0x2efb0b41, 0x5ab3671d, 0x5292dbd2, 0x33e91056, 0x136dd647, 0x8c9ad761, 0x7a37a10c, 0x8e59f814, 0x89eb133c, 0xeecea927, 0x35b761c9, 0xede11ce5, 0x3c7a47b1, 0x599cd2df, 0x3f55f273, 0x791814ce, 0xbf73c737, 0xea53f7cd, 0x5b5ffdaa, 0x14df3d6f, 0x867844db, 0x81caaff3, 0x3eb968c4, 0x2c382434, 0x5fc2a340, 0x72161dc3, 0x0cbce225, 0x8b283c49, 0x41ff0d95, 0x7139a801, 0xde080cb3, 0x9cd8b4e4, 0x906456c1, 0x617bcb84, 0x70d532b6, 0x74486c5c, 0x42d0b857];
    var T7 = [0xa75051f4, 0x65537e41, 0xa4c31a17, 0x5e963a27, 0x6bcb3bab, 0x45f11f9d, 0x58abacfa, 0x03934be3, 0xfa552030, 0x6df6ad76, 0x769188cc, 0x4c25f502, 0xd7fc4fe5, 0xcbd7c52a, 0x44802635, 0xa38fb562, 0x5a49deb1, 0x1b6725ba, 0x0e9845ea, 0xc0e15dfe, 0x7502c32f, 0xf012814c, 0x97a38d46, 0xf9c66bd3, 0x5fe7038f, 0x9c951592, 0x7aebbf6d, 0x59da9552, 0x832dd4be, 0x21d35874, 0x692949e0, 0xc8448ec9, 0x896a75c2, 0x7978f48e, 0x3e6b9958, 0x71dd27b9, 0x4fb6bee1, 0xad17f088, 0xac66c920, 0x3ab47dce, 0x4a1863df, 0x3182e51a, 0x33609751, 0x7f456253, 0x77e0b164, 0xae84bb6b, 0xa01cfe81, 0x2b94f908, 0x68587048, 0xfd198f45, 0x6c8794de, 0xf8b7527b, 0xd323ab73, 0x02e2724b, 0x8f57e31f, 0xab2a6655, 0x2807b2eb, 0xc2032fb5, 0x7b9a86c5, 0x08a5d337, 0x87f23028, 0xa5b223bf, 0x6aba0203, 0x825ced16, 0x1c2b8acf, 0xb492a779, 0xf2f0f307, 0xe2a14e69, 0xf4cd65da, 0xbed50605, 0x621fd134, 0xfe8ac4a6, 0x539d342e, 0x55a0a2f3, 0xe132058a, 0xeb75a4f6, 0xec390b83, 0xefaa4060, 0x9f065e71, 0x1051bd6e, 0x8af93e21, 0x063d96dd, 0x05aedd3e, 0xbd464de6, 0x8db59154, 0x5d0571c4, 0xd46f0406, 0x15ff6050, 0xfb241998, 0xe997d6bd, 0x43cc8940, 0x9e7767d9, 0x42bdb0e8, 0x8b880789, 0x5b38e719, 0xeedb79c8, 0x0a47a17c, 0x0fe97c42, 0x1ec9f884, 0x00000000, 0x86830980, 0xed48322b, 0x70ac1e11, 0x724e6c5a, 0xfffbfd0e, 0x38560f85, 0xd51e3dae, 0x3927362d, 0xd9640a0f, 0xa621685c, 0x54d19b5b, 0x2e3a2436, 0x67b10c0a, 0xe70f9357, 0x96d2b4ee, 0x919e1b9b, 0xc54f80c0, 0x20a261dc, 0x4b695a77, 0x1a161c12, 0xba0ae293, 0x2ae5c0a0, 0xe0433c22, 0x171d121b, 0x0d0b0e09, 0xc7adf28b, 0xa8b92db6, 0xa9c8141e, 0x198557f1, 0x074caf75, 0xddbbee99, 0x60fda37f, 0x269ff701, 0xf5bc5c72, 0x3bc54466, 0x7e345bfb, 0x29768b43, 0xc6dccb23, 0xfc68b6ed, 0xf163b8e4, 0xdccad731, 0x85104263, 0x22401397, 0x112084c6, 0x247d854a, 0x3df8d2bb, 0x3211aef9, 0xa16dc729, 0x2f4b1d9e, 0x30f3dcb2, 0x52ec0d86, 0xe3d077c1, 0x166c2bb3, 0xb999a970, 0x48fa1194, 0x642247e9, 0x8cc4a8fc, 0x3f1aa0f0, 0x2cd8567d, 0x90ef2233, 0x4ec78749, 0xd1c1d938, 0xa2fe8cca, 0x0b3698d4, 0x81cfa6f5, 0xde28a57a, 0x8e26dab7, 0xbfa43fad, 0x9de42c3a, 0x920d5078, 0xcc9b6a5f, 0x4662547e, 0x13c2f68d, 0xb8e890d8, 0xf75e2e39, 0xaff582c3, 0x80be9f5d, 0x937c69d0, 0x2da96fd5, 0x12b3cf25, 0x993bc8ac, 0x7da71018, 0x636ee89c, 0xbb7bdb3b, 0x7809cd26, 0x18f46e59, 0xb701ec9a, 0x9aa8834f, 0x6e65e695, 0xe67eaaff, 0xcf0821bc, 0xe8e6ef15, 0x9bd9bae7, 0x36ce4a6f, 0x09d4ea9f, 0x7cd629b0, 0xb2af31a4, 0x23312a3f, 0x9430c6a5, 0x66c035a2, 0xbc37744e, 0xcaa6fc82, 0xd0b0e090, 0xd81533a7, 0x984af104, 0xdaf741ec, 0x500e7fcd, 0xf62f1791, 0xd68d764d, 0xb04d43ef, 0x4d54ccaa, 0x04dfe496, 0xb5e39ed1, 0x881b4c6a, 0x1fb8c12c, 0x517f4665, 0xea049d5e, 0x355d018c, 0x7473fa87, 0x412efb0b, 0x1d5ab367, 0xd25292db, 0x5633e910, 0x47136dd6, 0x618c9ad7, 0x0c7a37a1, 0x148e59f8, 0x3c89eb13, 0x27eecea9, 0xc935b761, 0xe5ede11c, 0xb13c7a47, 0xdf599cd2, 0x733f55f2, 0xce791814, 0x37bf73c7, 0xcdea53f7, 0xaa5b5ffd, 0x6f14df3d, 0xdb867844, 0xf381caaf, 0xc43eb968, 0x342c3824, 0x405fc2a3, 0xc372161d, 0x250cbce2, 0x498b283c, 0x9541ff0d, 0x017139a8, 0xb3de080c, 0xe49cd8b4, 0xc1906456, 0x84617bcb, 0xb670d532, 0x5c74486c, 0x5742d0b8];
    var T8 = [0xf4a75051, 0x4165537e, 0x17a4c31a, 0x275e963a, 0xab6bcb3b, 0x9d45f11f, 0xfa58abac, 0xe303934b, 0x30fa5520, 0x766df6ad, 0xcc769188, 0x024c25f5, 0xe5d7fc4f, 0x2acbd7c5, 0x35448026, 0x62a38fb5, 0xb15a49de, 0xba1b6725, 0xea0e9845, 0xfec0e15d, 0x2f7502c3, 0x4cf01281, 0x4697a38d, 0xd3f9c66b, 0x8f5fe703, 0x929c9515, 0x6d7aebbf, 0x5259da95, 0xbe832dd4, 0x7421d358, 0xe0692949, 0xc9c8448e, 0xc2896a75, 0x8e7978f4, 0x583e6b99, 0xb971dd27, 0xe14fb6be, 0x88ad17f0, 0x20ac66c9, 0xce3ab47d, 0xdf4a1863, 0x1a3182e5, 0x51336097, 0x537f4562, 0x6477e0b1, 0x6bae84bb, 0x81a01cfe, 0x082b94f9, 0x48685870, 0x45fd198f, 0xde6c8794, 0x7bf8b752, 0x73d323ab, 0x4b02e272, 0x1f8f57e3, 0x55ab2a66, 0xeb2807b2, 0xb5c2032f, 0xc57b9a86, 0x3708a5d3, 0x2887f230, 0xbfa5b223, 0x036aba02, 0x16825ced, 0xcf1c2b8a, 0x79b492a7, 0x07f2f0f3, 0x69e2a14e, 0xdaf4cd65, 0x05bed506, 0x34621fd1, 0xa6fe8ac4, 0x2e539d34, 0xf355a0a2, 0x8ae13205, 0xf6eb75a4, 0x83ec390b, 0x60efaa40, 0x719f065e, 0x6e1051bd, 0x218af93e, 0xdd063d96, 0x3e05aedd, 0xe6bd464d, 0x548db591, 0xc45d0571, 0x06d46f04, 0x5015ff60, 0x98fb2419, 0xbde997d6, 0x4043cc89, 0xd99e7767, 0xe842bdb0, 0x898b8807, 0x195b38e7, 0xc8eedb79, 0x7c0a47a1, 0x420fe97c, 0x841ec9f8, 0x00000000, 0x80868309, 0x2bed4832, 0x1170ac1e, 0x5a724e6c, 0x0efffbfd, 0x8538560f, 0xaed51e3d, 0x2d392736, 0x0fd9640a, 0x5ca62168, 0x5b54d19b, 0x362e3a24, 0x0a67b10c, 0x57e70f93, 0xee96d2b4, 0x9b919e1b, 0xc0c54f80, 0xdc20a261, 0x774b695a, 0x121a161c, 0x93ba0ae2, 0xa02ae5c0, 0x22e0433c, 0x1b171d12, 0x090d0b0e, 0x8bc7adf2, 0xb6a8b92d, 0x1ea9c814, 0xf1198557, 0x75074caf, 0x99ddbbee, 0x7f60fda3, 0x01269ff7, 0x72f5bc5c, 0x663bc544, 0xfb7e345b, 0x4329768b, 0x23c6dccb, 0xedfc68b6, 0xe4f163b8, 0x31dccad7, 0x63851042, 0x97224013, 0xc6112084, 0x4a247d85, 0xbb3df8d2, 0xf93211ae, 0x29a16dc7, 0x9e2f4b1d, 0xb230f3dc, 0x8652ec0d, 0xc1e3d077, 0xb3166c2b, 0x70b999a9, 0x9448fa11, 0xe9642247, 0xfc8cc4a8, 0xf03f1aa0, 0x7d2cd856, 0x3390ef22, 0x494ec787, 0x38d1c1d9, 0xcaa2fe8c, 0xd40b3698, 0xf581cfa6, 0x7ade28a5, 0xb78e26da, 0xadbfa43f, 0x3a9de42c, 0x78920d50, 0x5fcc9b6a, 0x7e466254, 0x8d13c2f6, 0xd8b8e890, 0x39f75e2e, 0xc3aff582, 0x5d80be9f, 0xd0937c69, 0xd52da96f, 0x2512b3cf, 0xac993bc8, 0x187da710, 0x9c636ee8, 0x3bbb7bdb, 0x267809cd, 0x5918f46e, 0x9ab701ec, 0x4f9aa883, 0x956e65e6, 0xffe67eaa, 0xbccf0821, 0x15e8e6ef, 0xe79bd9ba, 0x6f36ce4a, 0x9f09d4ea, 0xb07cd629, 0xa4b2af31, 0x3f23312a, 0xa59430c6, 0xa266c035, 0x4ebc3774, 0x82caa6fc, 0x90d0b0e0, 0xa7d81533, 0x04984af1, 0xecdaf741, 0xcd500e7f, 0x91f62f17, 0x4dd68d76, 0xefb04d43, 0xaa4d54cc, 0x9604dfe4, 0xd1b5e39e, 0x6a881b4c, 0x2c1fb8c1, 0x65517f46, 0x5eea049d, 0x8c355d01, 0x877473fa, 0x0b412efb, 0x671d5ab3, 0xdbd25292, 0x105633e9, 0xd647136d, 0xd7618c9a, 0xa10c7a37, 0xf8148e59, 0x133c89eb, 0xa927eece, 0x61c935b7, 0x1ce5ede1, 0x47b13c7a, 0xd2df599c, 0xf2733f55, 0x14ce7918, 0xc737bf73, 0xf7cdea53, 0xfdaa5b5f, 0x3d6f14df, 0x44db8678, 0xaff381ca, 0x68c43eb9, 0x24342c38, 0xa3405fc2, 0x1dc37216, 0xe2250cbc, 0x3c498b28, 0x0d9541ff, 0xa8017139, 0x0cb3de08, 0xb4e49cd8, 0x56c19064, 0xcb84617b, 0x32b670d5, 0x6c5c7448, 0xb85742d0];

    // Transformations for decryption key expansion
    var U1 = [0x00000000, 0x0e090d0b, 0x1c121a16, 0x121b171d, 0x3824342c, 0x362d3927, 0x24362e3a, 0x2a3f2331, 0x70486858, 0x7e416553, 0x6c5a724e, 0x62537f45, 0x486c5c74, 0x4665517f, 0x547e4662, 0x5a774b69, 0xe090d0b0, 0xee99ddbb, 0xfc82caa6, 0xf28bc7ad, 0xd8b4e49c, 0xd6bde997, 0xc4a6fe8a, 0xcaaff381, 0x90d8b8e8, 0x9ed1b5e3, 0x8ccaa2fe, 0x82c3aff5, 0xa8fc8cc4, 0xa6f581cf, 0xb4ee96d2, 0xbae79bd9, 0xdb3bbb7b, 0xd532b670, 0xc729a16d, 0xc920ac66, 0xe31f8f57, 0xed16825c, 0xff0d9541, 0xf104984a, 0xab73d323, 0xa57ade28, 0xb761c935, 0xb968c43e, 0x9357e70f, 0x9d5eea04, 0x8f45fd19, 0x814cf012, 0x3bab6bcb, 0x35a266c0, 0x27b971dd, 0x29b07cd6, 0x038f5fe7, 0x0d8652ec, 0x1f9d45f1, 0x119448fa, 0x4be30393, 0x45ea0e98, 0x57f11985, 0x59f8148e, 0x73c737bf, 0x7dce3ab4, 0x6fd52da9, 0x61dc20a2, 0xad766df6, 0xa37f60fd, 0xb16477e0, 0xbf6d7aeb, 0x955259da, 0x9b5b54d1, 0x894043cc, 0x87494ec7, 0xdd3e05ae, 0xd33708a5, 0xc12c1fb8, 0xcf2512b3, 0xe51a3182, 0xeb133c89, 0xf9082b94, 0xf701269f, 0x4de6bd46, 0x43efb04d, 0x51f4a750, 0x5ffdaa5b, 0x75c2896a, 0x7bcb8461, 0x69d0937c, 0x67d99e77, 0x3daed51e, 0x33a7d815, 0x21bccf08, 0x2fb5c203, 0x058ae132, 0x0b83ec39, 0x1998fb24, 0x1791f62f, 0x764dd68d, 0x7844db86, 0x6a5fcc9b, 0x6456c190, 0x4e69e2a1, 0x4060efaa, 0x527bf8b7, 0x5c72f5bc, 0x0605bed5, 0x080cb3de, 0x1a17a4c3, 0x141ea9c8, 0x3e218af9, 0x302887f2, 0x223390ef, 0x2c3a9de4, 0x96dd063d, 0x98d40b36, 0x8acf1c2b, 0x84c61120, 0xaef93211, 0xa0f03f1a, 0xb2eb2807, 0xbce2250c, 0xe6956e65, 0xe89c636e, 0xfa877473, 0xf48e7978, 0xdeb15a49, 0xd0b85742, 0xc2a3405f, 0xccaa4d54, 0x41ecdaf7, 0x4fe5d7fc, 0x5dfec0e1, 0x53f7cdea, 0x79c8eedb, 0x77c1e3d0, 0x65daf4cd, 0x6bd3f9c6, 0x31a4b2af, 0x3fadbfa4, 0x2db6a8b9, 0x23bfa5b2, 0x09808683, 0x07898b88, 0x15929c95, 0x1b9b919e, 0xa17c0a47, 0xaf75074c, 0xbd6e1051, 0xb3671d5a, 0x99583e6b, 0x97513360, 0x854a247d, 0x8b432976, 0xd134621f, 0xdf3d6f14, 0xcd267809, 0xc32f7502, 0xe9105633, 0xe7195b38, 0xf5024c25, 0xfb0b412e, 0x9ad7618c, 0x94de6c87, 0x86c57b9a, 0x88cc7691, 0xa2f355a0, 0xacfa58ab, 0xbee14fb6, 0xb0e842bd, 0xea9f09d4, 0xe49604df, 0xf68d13c2, 0xf8841ec9, 0xd2bb3df8, 0xdcb230f3, 0xcea927ee, 0xc0a02ae5, 0x7a47b13c, 0x744ebc37, 0x6655ab2a, 0x685ca621, 0x42638510, 0x4c6a881b, 0x5e719f06, 0x5078920d, 0x0a0fd964, 0x0406d46f, 0x161dc372, 0x1814ce79, 0x322bed48, 0x3c22e043, 0x2e39f75e, 0x2030fa55, 0xec9ab701, 0xe293ba0a, 0xf088ad17, 0xfe81a01c, 0xd4be832d, 0xdab78e26, 0xc8ac993b, 0xc6a59430, 0x9cd2df59, 0x92dbd252, 0x80c0c54f, 0x8ec9c844, 0xa4f6eb75, 0xaaffe67e, 0xb8e4f163, 0xb6edfc68, 0x0c0a67b1, 0x02036aba, 0x10187da7, 0x1e1170ac, 0x342e539d, 0x3a275e96, 0x283c498b, 0x26354480, 0x7c420fe9, 0x724b02e2, 0x605015ff, 0x6e5918f4, 0x44663bc5, 0x4a6f36ce, 0x587421d3, 0x567d2cd8, 0x37a10c7a, 0x39a80171, 0x2bb3166c, 0x25ba1b67, 0x0f853856, 0x018c355d, 0x13972240, 0x1d9e2f4b, 0x47e96422, 0x49e06929, 0x5bfb7e34, 0x55f2733f, 0x7fcd500e, 0x71c45d05, 0x63df4a18, 0x6dd64713, 0xd731dcca, 0xd938d1c1, 0xcb23c6dc, 0xc52acbd7, 0xef15e8e6, 0xe11ce5ed, 0xf307f2f0, 0xfd0efffb, 0xa779b492, 0xa970b999, 0xbb6bae84, 0xb562a38f, 0x9f5d80be, 0x91548db5, 0x834f9aa8, 0x8d4697a3];
    var U2 = [0x00000000, 0x0b0e090d, 0x161c121a, 0x1d121b17, 0x2c382434, 0x27362d39, 0x3a24362e, 0x312a3f23, 0x58704868, 0x537e4165, 0x4e6c5a72, 0x4562537f, 0x74486c5c, 0x7f466551, 0x62547e46, 0x695a774b, 0xb0e090d0, 0xbbee99dd, 0xa6fc82ca, 0xadf28bc7, 0x9cd8b4e4, 0x97d6bde9, 0x8ac4a6fe, 0x81caaff3, 0xe890d8b8, 0xe39ed1b5, 0xfe8ccaa2, 0xf582c3af, 0xc4a8fc8c, 0xcfa6f581, 0xd2b4ee96, 0xd9bae79b, 0x7bdb3bbb, 0x70d532b6, 0x6dc729a1, 0x66c920ac, 0x57e31f8f, 0x5ced1682, 0x41ff0d95, 0x4af10498, 0x23ab73d3, 0x28a57ade, 0x35b761c9, 0x3eb968c4, 0x0f9357e7, 0x049d5eea, 0x198f45fd, 0x12814cf0, 0xcb3bab6b, 0xc035a266, 0xdd27b971, 0xd629b07c, 0xe7038f5f, 0xec0d8652, 0xf11f9d45, 0xfa119448, 0x934be303, 0x9845ea0e, 0x8557f119, 0x8e59f814, 0xbf73c737, 0xb47dce3a, 0xa96fd52d, 0xa261dc20, 0xf6ad766d, 0xfda37f60, 0xe0b16477, 0xebbf6d7a, 0xda955259, 0xd19b5b54, 0xcc894043, 0xc787494e, 0xaedd3e05, 0xa5d33708, 0xb8c12c1f, 0xb3cf2512, 0x82e51a31, 0x89eb133c, 0x94f9082b, 0x9ff70126, 0x464de6bd, 0x4d43efb0, 0x5051f4a7, 0x5b5ffdaa, 0x6a75c289, 0x617bcb84, 0x7c69d093, 0x7767d99e, 0x1e3daed5, 0x1533a7d8, 0x0821bccf, 0x032fb5c2, 0x32058ae1, 0x390b83ec, 0x241998fb, 0x2f1791f6, 0x8d764dd6, 0x867844db, 0x9b6a5fcc, 0x906456c1, 0xa14e69e2, 0xaa4060ef, 0xb7527bf8, 0xbc5c72f5, 0xd50605be, 0xde080cb3, 0xc31a17a4, 0xc8141ea9, 0xf93e218a, 0xf2302887, 0xef223390, 0xe42c3a9d, 0x3d96dd06, 0x3698d40b, 0x2b8acf1c, 0x2084c611, 0x11aef932, 0x1aa0f03f, 0x07b2eb28, 0x0cbce225, 0x65e6956e, 0x6ee89c63, 0x73fa8774, 0x78f48e79, 0x49deb15a, 0x42d0b857, 0x5fc2a340, 0x54ccaa4d, 0xf741ecda, 0xfc4fe5d7, 0xe15dfec0, 0xea53f7cd, 0xdb79c8ee, 0xd077c1e3, 0xcd65daf4, 0xc66bd3f9, 0xaf31a4b2, 0xa43fadbf, 0xb92db6a8, 0xb223bfa5, 0x83098086, 0x8807898b, 0x9515929c, 0x9e1b9b91, 0x47a17c0a, 0x4caf7507, 0x51bd6e10, 0x5ab3671d, 0x6b99583e, 0x60975133, 0x7d854a24, 0x768b4329, 0x1fd13462, 0x14df3d6f, 0x09cd2678, 0x02c32f75, 0x33e91056, 0x38e7195b, 0x25f5024c, 0x2efb0b41, 0x8c9ad761, 0x8794de6c, 0x9a86c57b, 0x9188cc76, 0xa0a2f355, 0xabacfa58, 0xb6bee14f, 0xbdb0e842, 0xd4ea9f09, 0xdfe49604, 0xc2f68d13, 0xc9f8841e, 0xf8d2bb3d, 0xf3dcb230, 0xeecea927, 0xe5c0a02a, 0x3c7a47b1, 0x37744ebc, 0x2a6655ab, 0x21685ca6, 0x10426385, 0x1b4c6a88, 0x065e719f, 0x0d507892, 0x640a0fd9, 0x6f0406d4, 0x72161dc3, 0x791814ce, 0x48322bed, 0x433c22e0, 0x5e2e39f7, 0x552030fa, 0x01ec9ab7, 0x0ae293ba, 0x17f088ad, 0x1cfe81a0, 0x2dd4be83, 0x26dab78e, 0x3bc8ac99, 0x30c6a594, 0x599cd2df, 0x5292dbd2, 0x4f80c0c5, 0x448ec9c8, 0x75a4f6eb, 0x7eaaffe6, 0x63b8e4f1, 0x68b6edfc, 0xb10c0a67, 0xba02036a, 0xa710187d, 0xac1e1170, 0x9d342e53, 0x963a275e, 0x8b283c49, 0x80263544, 0xe97c420f, 0xe2724b02, 0xff605015, 0xf46e5918, 0xc544663b, 0xce4a6f36, 0xd3587421, 0xd8567d2c, 0x7a37a10c, 0x7139a801, 0x6c2bb316, 0x6725ba1b, 0x560f8538, 0x5d018c35, 0x40139722, 0x4b1d9e2f, 0x2247e964, 0x2949e069, 0x345bfb7e, 0x3f55f273, 0x0e7fcd50, 0x0571c45d, 0x1863df4a, 0x136dd647, 0xcad731dc, 0xc1d938d1, 0xdccb23c6, 0xd7c52acb, 0xe6ef15e8, 0xede11ce5, 0xf0f307f2, 0xfbfd0eff, 0x92a779b4, 0x99a970b9, 0x84bb6bae, 0x8fb562a3, 0xbe9f5d80, 0xb591548d, 0xa8834f9a, 0xa38d4697];
    var U3 = [0x00000000, 0x0d0b0e09, 0x1a161c12, 0x171d121b, 0x342c3824, 0x3927362d, 0x2e3a2436, 0x23312a3f, 0x68587048, 0x65537e41, 0x724e6c5a, 0x7f456253, 0x5c74486c, 0x517f4665, 0x4662547e, 0x4b695a77, 0xd0b0e090, 0xddbbee99, 0xcaa6fc82, 0xc7adf28b, 0xe49cd8b4, 0xe997d6bd, 0xfe8ac4a6, 0xf381caaf, 0xb8e890d8, 0xb5e39ed1, 0xa2fe8cca, 0xaff582c3, 0x8cc4a8fc, 0x81cfa6f5, 0x96d2b4ee, 0x9bd9bae7, 0xbb7bdb3b, 0xb670d532, 0xa16dc729, 0xac66c920, 0x8f57e31f, 0x825ced16, 0x9541ff0d, 0x984af104, 0xd323ab73, 0xde28a57a, 0xc935b761, 0xc43eb968, 0xe70f9357, 0xea049d5e, 0xfd198f45, 0xf012814c, 0x6bcb3bab, 0x66c035a2, 0x71dd27b9, 0x7cd629b0, 0x5fe7038f, 0x52ec0d86, 0x45f11f9d, 0x48fa1194, 0x03934be3, 0x0e9845ea, 0x198557f1, 0x148e59f8, 0x37bf73c7, 0x3ab47dce, 0x2da96fd5, 0x20a261dc, 0x6df6ad76, 0x60fda37f, 0x77e0b164, 0x7aebbf6d, 0x59da9552, 0x54d19b5b, 0x43cc8940, 0x4ec78749, 0x05aedd3e, 0x08a5d337, 0x1fb8c12c, 0x12b3cf25, 0x3182e51a, 0x3c89eb13, 0x2b94f908, 0x269ff701, 0xbd464de6, 0xb04d43ef, 0xa75051f4, 0xaa5b5ffd, 0x896a75c2, 0x84617bcb, 0x937c69d0, 0x9e7767d9, 0xd51e3dae, 0xd81533a7, 0xcf0821bc, 0xc2032fb5, 0xe132058a, 0xec390b83, 0xfb241998, 0xf62f1791, 0xd68d764d, 0xdb867844, 0xcc9b6a5f, 0xc1906456, 0xe2a14e69, 0xefaa4060, 0xf8b7527b, 0xf5bc5c72, 0xbed50605, 0xb3de080c, 0xa4c31a17, 0xa9c8141e, 0x8af93e21, 0x87f23028, 0x90ef2233, 0x9de42c3a, 0x063d96dd, 0x0b3698d4, 0x1c2b8acf, 0x112084c6, 0x3211aef9, 0x3f1aa0f0, 0x2807b2eb, 0x250cbce2, 0x6e65e695, 0x636ee89c, 0x7473fa87, 0x7978f48e, 0x5a49deb1, 0x5742d0b8, 0x405fc2a3, 0x4d54ccaa, 0xdaf741ec, 0xd7fc4fe5, 0xc0e15dfe, 0xcdea53f7, 0xeedb79c8, 0xe3d077c1, 0xf4cd65da, 0xf9c66bd3, 0xb2af31a4, 0xbfa43fad, 0xa8b92db6, 0xa5b223bf, 0x86830980, 0x8b880789, 0x9c951592, 0x919e1b9b, 0x0a47a17c, 0x074caf75, 0x1051bd6e, 0x1d5ab367, 0x3e6b9958, 0x33609751, 0x247d854a, 0x29768b43, 0x621fd134, 0x6f14df3d, 0x7809cd26, 0x7502c32f, 0x5633e910, 0x5b38e719, 0x4c25f502, 0x412efb0b, 0x618c9ad7, 0x6c8794de, 0x7b9a86c5, 0x769188cc, 0x55a0a2f3, 0x58abacfa, 0x4fb6bee1, 0x42bdb0e8, 0x09d4ea9f, 0x04dfe496, 0x13c2f68d, 0x1ec9f884, 0x3df8d2bb, 0x30f3dcb2, 0x27eecea9, 0x2ae5c0a0, 0xb13c7a47, 0xbc37744e, 0xab2a6655, 0xa621685c, 0x85104263, 0x881b4c6a, 0x9f065e71, 0x920d5078, 0xd9640a0f, 0xd46f0406, 0xc372161d, 0xce791814, 0xed48322b, 0xe0433c22, 0xf75e2e39, 0xfa552030, 0xb701ec9a, 0xba0ae293, 0xad17f088, 0xa01cfe81, 0x832dd4be, 0x8e26dab7, 0x993bc8ac, 0x9430c6a5, 0xdf599cd2, 0xd25292db, 0xc54f80c0, 0xc8448ec9, 0xeb75a4f6, 0xe67eaaff, 0xf163b8e4, 0xfc68b6ed, 0x67b10c0a, 0x6aba0203, 0x7da71018, 0x70ac1e11, 0x539d342e, 0x5e963a27, 0x498b283c, 0x44802635, 0x0fe97c42, 0x02e2724b, 0x15ff6050, 0x18f46e59, 0x3bc54466, 0x36ce4a6f, 0x21d35874, 0x2cd8567d, 0x0c7a37a1, 0x017139a8, 0x166c2bb3, 0x1b6725ba, 0x38560f85, 0x355d018c, 0x22401397, 0x2f4b1d9e, 0x642247e9, 0x692949e0, 0x7e345bfb, 0x733f55f2, 0x500e7fcd, 0x5d0571c4, 0x4a1863df, 0x47136dd6, 0xdccad731, 0xd1c1d938, 0xc6dccb23, 0xcbd7c52a, 0xe8e6ef15, 0xe5ede11c, 0xf2f0f307, 0xfffbfd0e, 0xb492a779, 0xb999a970, 0xae84bb6b, 0xa38fb562, 0x80be9f5d, 0x8db59154, 0x9aa8834f, 0x97a38d46];
    var U4 = [0x00000000, 0x090d0b0e, 0x121a161c, 0x1b171d12, 0x24342c38, 0x2d392736, 0x362e3a24, 0x3f23312a, 0x48685870, 0x4165537e, 0x5a724e6c, 0x537f4562, 0x6c5c7448, 0x65517f46, 0x7e466254, 0x774b695a, 0x90d0b0e0, 0x99ddbbee, 0x82caa6fc, 0x8bc7adf2, 0xb4e49cd8, 0xbde997d6, 0xa6fe8ac4, 0xaff381ca, 0xd8b8e890, 0xd1b5e39e, 0xcaa2fe8c, 0xc3aff582, 0xfc8cc4a8, 0xf581cfa6, 0xee96d2b4, 0xe79bd9ba, 0x3bbb7bdb, 0x32b670d5, 0x29a16dc7, 0x20ac66c9, 0x1f8f57e3, 0x16825ced, 0x0d9541ff, 0x04984af1, 0x73d323ab, 0x7ade28a5, 0x61c935b7, 0x68c43eb9, 0x57e70f93, 0x5eea049d, 0x45fd198f, 0x4cf01281, 0xab6bcb3b, 0xa266c035, 0xb971dd27, 0xb07cd629, 0x8f5fe703, 0x8652ec0d, 0x9d45f11f, 0x9448fa11, 0xe303934b, 0xea0e9845, 0xf1198557, 0xf8148e59, 0xc737bf73, 0xce3ab47d, 0xd52da96f, 0xdc20a261, 0x766df6ad, 0x7f60fda3, 0x6477e0b1, 0x6d7aebbf, 0x5259da95, 0x5b54d19b, 0x4043cc89, 0x494ec787, 0x3e05aedd, 0x3708a5d3, 0x2c1fb8c1, 0x2512b3cf, 0x1a3182e5, 0x133c89eb, 0x082b94f9, 0x01269ff7, 0xe6bd464d, 0xefb04d43, 0xf4a75051, 0xfdaa5b5f, 0xc2896a75, 0xcb84617b, 0xd0937c69, 0xd99e7767, 0xaed51e3d, 0xa7d81533, 0xbccf0821, 0xb5c2032f, 0x8ae13205, 0x83ec390b, 0x98fb2419, 0x91f62f17, 0x4dd68d76, 0x44db8678, 0x5fcc9b6a, 0x56c19064, 0x69e2a14e, 0x60efaa40, 0x7bf8b752, 0x72f5bc5c, 0x05bed506, 0x0cb3de08, 0x17a4c31a, 0x1ea9c814, 0x218af93e, 0x2887f230, 0x3390ef22, 0x3a9de42c, 0xdd063d96, 0xd40b3698, 0xcf1c2b8a, 0xc6112084, 0xf93211ae, 0xf03f1aa0, 0xeb2807b2, 0xe2250cbc, 0x956e65e6, 0x9c636ee8, 0x877473fa, 0x8e7978f4, 0xb15a49de, 0xb85742d0, 0xa3405fc2, 0xaa4d54cc, 0xecdaf741, 0xe5d7fc4f, 0xfec0e15d, 0xf7cdea53, 0xc8eedb79, 0xc1e3d077, 0xdaf4cd65, 0xd3f9c66b, 0xa4b2af31, 0xadbfa43f, 0xb6a8b92d, 0xbfa5b223, 0x80868309, 0x898b8807, 0x929c9515, 0x9b919e1b, 0x7c0a47a1, 0x75074caf, 0x6e1051bd, 0x671d5ab3, 0x583e6b99, 0x51336097, 0x4a247d85, 0x4329768b, 0x34621fd1, 0x3d6f14df, 0x267809cd, 0x2f7502c3, 0x105633e9, 0x195b38e7, 0x024c25f5, 0x0b412efb, 0xd7618c9a, 0xde6c8794, 0xc57b9a86, 0xcc769188, 0xf355a0a2, 0xfa58abac, 0xe14fb6be, 0xe842bdb0, 0x9f09d4ea, 0x9604dfe4, 0x8d13c2f6, 0x841ec9f8, 0xbb3df8d2, 0xb230f3dc, 0xa927eece, 0xa02ae5c0, 0x47b13c7a, 0x4ebc3774, 0x55ab2a66, 0x5ca62168, 0x63851042, 0x6a881b4c, 0x719f065e, 0x78920d50, 0x0fd9640a, 0x06d46f04, 0x1dc37216, 0x14ce7918, 0x2bed4832, 0x22e0433c, 0x39f75e2e, 0x30fa5520, 0x9ab701ec, 0x93ba0ae2, 0x88ad17f0, 0x81a01cfe, 0xbe832dd4, 0xb78e26da, 0xac993bc8, 0xa59430c6, 0xd2df599c, 0xdbd25292, 0xc0c54f80, 0xc9c8448e, 0xf6eb75a4, 0xffe67eaa, 0xe4f163b8, 0xedfc68b6, 0x0a67b10c, 0x036aba02, 0x187da710, 0x1170ac1e, 0x2e539d34, 0x275e963a, 0x3c498b28, 0x35448026, 0x420fe97c, 0x4b02e272, 0x5015ff60, 0x5918f46e, 0x663bc544, 0x6f36ce4a, 0x7421d358, 0x7d2cd856, 0xa10c7a37, 0xa8017139, 0xb3166c2b, 0xba1b6725, 0x8538560f, 0x8c355d01, 0x97224013, 0x9e2f4b1d, 0xe9642247, 0xe0692949, 0xfb7e345b, 0xf2733f55, 0xcd500e7f, 0xc45d0571, 0xdf4a1863, 0xd647136d, 0x31dccad7, 0x38d1c1d9, 0x23c6dccb, 0x2acbd7c5, 0x15e8e6ef, 0x1ce5ede1, 0x07f2f0f3, 0x0efffbfd, 0x79b492a7, 0x70b999a9, 0x6bae84bb, 0x62a38fb5, 0x5d80be9f, 0x548db591, 0x4f9aa883, 0x4697a38d];

    function convertToInt32(bytes) {
        var result = [];
        for (var i = 0; i < bytes.length; i += 4) {
            result.push(
                (bytes[i    ] << 24) |
                (bytes[i + 1] << 16) |
                (bytes[i + 2] <<  8) |
                 bytes[i + 3]
            );
        }
        return result;
    }

    var AES = function(key) {
        if (!(this instanceof AES)) {
            throw Error('AES must be instanitated with `new`');
        }

        Object.defineProperty(this, 'key', {
            value: coerceArray(key, true)
        });

        this._prepare();
    }


    AES.prototype._prepare = function() {

        var rounds = numberOfRounds[this.key.length];
        if (rounds == null) {
            throw new Error('invalid key size (must be 16, 24 or 32 bytes)');
        }

        // encryption round keys
        this._Ke = [];

        // decryption round keys
        this._Kd = [];

        for (var i = 0; i <= rounds; i++) {
            this._Ke.push([0, 0, 0, 0]);
            this._Kd.push([0, 0, 0, 0]);
        }

        var roundKeyCount = (rounds + 1) * 4;
        var KC = this.key.length / 4;

        // convert the key into ints
        var tk = convertToInt32(this.key);

        // copy values into round key arrays
        var index;
        for (var i = 0; i < KC; i++) {
            index = i >> 2;
            this._Ke[index][i % 4] = tk[i];
            this._Kd[rounds - index][i % 4] = tk[i];
        }

        // key expansion (fips-197 section 5.2)
        var rconpointer = 0;
        var t = KC, tt;
        while (t < roundKeyCount) {
            tt = tk[KC - 1];
            tk[0] ^= ((S[(tt >> 16) & 0xFF] << 24) ^
                      (S[(tt >>  8) & 0xFF] << 16) ^
                      (S[ tt        & 0xFF] <<  8) ^
                       S[(tt >> 24) & 0xFF]        ^
                      (rcon[rconpointer] << 24));
            rconpointer += 1;

            // key expansion (for non-256 bit)
            if (KC != 8) {
                for (var i = 1; i < KC; i++) {
                    tk[i] ^= tk[i - 1];
                }

            // key expansion for 256-bit keys is "slightly different" (fips-197)
            } else {
                for (var i = 1; i < (KC / 2); i++) {
                    tk[i] ^= tk[i - 1];
                }
                tt = tk[(KC / 2) - 1];

                tk[KC / 2] ^= (S[ tt        & 0xFF]        ^
                              (S[(tt >>  8) & 0xFF] <<  8) ^
                              (S[(tt >> 16) & 0xFF] << 16) ^
                              (S[(tt >> 24) & 0xFF] << 24));

                for (var i = (KC / 2) + 1; i < KC; i++) {
                    tk[i] ^= tk[i - 1];
                }
            }

            // copy values into round key arrays
            var i = 0, r, c;
            while (i < KC && t < roundKeyCount) {
                r = t >> 2;
                c = t % 4;
                this._Ke[r][c] = tk[i];
                this._Kd[rounds - r][c] = tk[i++];
                t++;
            }
        }

        // inverse-cipher-ify the decryption round key (fips-197 section 5.3)
        for (var r = 1; r < rounds; r++) {
            for (var c = 0; c < 4; c++) {
                tt = this._Kd[r][c];
                this._Kd[r][c] = (U1[(tt >> 24) & 0xFF] ^
                                  U2[(tt >> 16) & 0xFF] ^
                                  U3[(tt >>  8) & 0xFF] ^
                                  U4[ tt        & 0xFF]);
            }
        }
    }

    AES.prototype.encrypt = function(plaintext) {
        if (plaintext.length != 16) {
            throw new Error('invalid plaintext size (must be 16 bytes)');
        }

        var rounds = this._Ke.length - 1;
        var a = [0, 0, 0, 0];

        // convert plaintext to (ints ^ key)
        var t = convertToInt32(plaintext);
        for (var i = 0; i < 4; i++) {
            t[i] ^= this._Ke[0][i];
        }

        // apply round transforms
        for (var r = 1; r < rounds; r++) {
            for (var i = 0; i < 4; i++) {
                a[i] = (T1[(t[ i         ] >> 24) & 0xff] ^
                        T2[(t[(i + 1) % 4] >> 16) & 0xff] ^
                        T3[(t[(i + 2) % 4] >>  8) & 0xff] ^
                        T4[ t[(i + 3) % 4]        & 0xff] ^
                        this._Ke[r][i]);
            }
            t = a.slice();
        }

        // the last round is special
        var result = createArray(16), tt;
        for (var i = 0; i < 4; i++) {
            tt = this._Ke[rounds][i];
            result[4 * i    ] = (S[(t[ i         ] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
            result[4 * i + 1] = (S[(t[(i + 1) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
            result[4 * i + 2] = (S[(t[(i + 2) % 4] >>  8) & 0xff] ^ (tt >>  8)) & 0xff;
            result[4 * i + 3] = (S[ t[(i + 3) % 4]        & 0xff] ^  tt       ) & 0xff;
        }

        return result;
    }

    AES.prototype.decrypt = function(ciphertext) {
        if (ciphertext.length != 16) {
            throw new Error('invalid ciphertext size (must be 16 bytes)');
        }

        var rounds = this._Kd.length - 1;
        var a = [0, 0, 0, 0];

        // convert plaintext to (ints ^ key)
        var t = convertToInt32(ciphertext);
        for (var i = 0; i < 4; i++) {
            t[i] ^= this._Kd[0][i];
        }

        // apply round transforms
        for (var r = 1; r < rounds; r++) {
            for (var i = 0; i < 4; i++) {
                a[i] = (T5[(t[ i          ] >> 24) & 0xff] ^
                        T6[(t[(i + 3) % 4] >> 16) & 0xff] ^
                        T7[(t[(i + 2) % 4] >>  8) & 0xff] ^
                        T8[ t[(i + 1) % 4]        & 0xff] ^
                        this._Kd[r][i]);
            }
            t = a.slice();
        }

        // the last round is special
        var result = createArray(16), tt;
        for (var i = 0; i < 4; i++) {
            tt = this._Kd[rounds][i];
            result[4 * i    ] = (Si[(t[ i         ] >> 24) & 0xff] ^ (tt >> 24)) & 0xff;
            result[4 * i + 1] = (Si[(t[(i + 3) % 4] >> 16) & 0xff] ^ (tt >> 16)) & 0xff;
            result[4 * i + 2] = (Si[(t[(i + 2) % 4] >>  8) & 0xff] ^ (tt >>  8)) & 0xff;
            result[4 * i + 3] = (Si[ t[(i + 1) % 4]        & 0xff] ^  tt       ) & 0xff;
        }

        return result;
    }


    /**
     *  Mode Of Operation - Electonic Codebook (ECB)
     */
    var ModeOfOperationECB = function(key) {
        if (!(this instanceof ModeOfOperationECB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Electronic Code Block";
        this.name = "ecb";

        this._aes = new AES(key);
    }

    ModeOfOperationECB.prototype.encrypt = function(plaintext) {
        plaintext = coerceArray(plaintext);

        if ((plaintext.length % 16) !== 0) {
            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
        }

        var ciphertext = createArray(plaintext.length);
        var block = createArray(16);

        for (var i = 0; i < plaintext.length; i += 16) {
            copyArray(plaintext, block, 0, i, i + 16);
            block = this._aes.encrypt(block);
            copyArray(block, ciphertext, i);
        }

        return ciphertext;
    }

    ModeOfOperationECB.prototype.decrypt = function(ciphertext) {
        ciphertext = coerceArray(ciphertext);

        if ((ciphertext.length % 16) !== 0) {
            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
        }

        var plaintext = createArray(ciphertext.length);
        var block = createArray(16);

        for (var i = 0; i < ciphertext.length; i += 16) {
            copyArray(ciphertext, block, 0, i, i + 16);
            block = this._aes.decrypt(block);
            copyArray(block, plaintext, i);
        }

        return plaintext;
    }


    /**
     *  Mode Of Operation - Cipher Block Chaining (CBC)
     */
    var ModeOfOperationCBC = function(key, iv) {
        if (!(this instanceof ModeOfOperationCBC)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Cipher Block Chaining";
        this.name = "cbc";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 bytes)');
        }

        this._lastCipherblock = coerceArray(iv, true);

        this._aes = new AES(key);
    }

    ModeOfOperationCBC.prototype.encrypt = function(plaintext) {
        plaintext = coerceArray(plaintext);

        if ((plaintext.length % 16) !== 0) {
            throw new Error('invalid plaintext size (must be multiple of 16 bytes)');
        }

        var ciphertext = createArray(plaintext.length);
        var block = createArray(16);

        for (var i = 0; i < plaintext.length; i += 16) {
            copyArray(plaintext, block, 0, i, i + 16);

            for (var j = 0; j < 16; j++) {
                block[j] ^= this._lastCipherblock[j];
            }

            this._lastCipherblock = this._aes.encrypt(block);
            copyArray(this._lastCipherblock, ciphertext, i);
        }

        return ciphertext;
    }

    ModeOfOperationCBC.prototype.decrypt = function(ciphertext) {
        ciphertext = coerceArray(ciphertext);

        if ((ciphertext.length % 16) !== 0) {
            throw new Error('invalid ciphertext size (must be multiple of 16 bytes)');
        }

        var plaintext = createArray(ciphertext.length);
        var block = createArray(16);

        for (var i = 0; i < ciphertext.length; i += 16) {
            copyArray(ciphertext, block, 0, i, i + 16);
            block = this._aes.decrypt(block);

            for (var j = 0; j < 16; j++) {
                plaintext[i + j] = block[j] ^ this._lastCipherblock[j];
            }

            copyArray(ciphertext, this._lastCipherblock, 0, i, i + 16);
        }

        return plaintext;
    }


    /**
     *  Mode Of Operation - Cipher Feedback (CFB)
     */
    var ModeOfOperationCFB = function(key, iv, segmentSize) {
        if (!(this instanceof ModeOfOperationCFB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Cipher Feedback";
        this.name = "cfb";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 size)');
        }

        if (!segmentSize) { segmentSize = 1; }

        this.segmentSize = segmentSize;

        this._shiftRegister = coerceArray(iv, true);

        this._aes = new AES(key);
    }

    ModeOfOperationCFB.prototype.encrypt = function(plaintext) {
        if ((plaintext.length % this.segmentSize) != 0) {
            throw new Error('invalid plaintext size (must be segmentSize bytes)');
        }

        var encrypted = coerceArray(plaintext, true);

        var xorSegment;
        for (var i = 0; i < encrypted.length; i += this.segmentSize) {
            xorSegment = this._aes.encrypt(this._shiftRegister);
            for (var j = 0; j < this.segmentSize; j++) {
                encrypted[i + j] ^= xorSegment[j];
            }

            // Shift the register
            copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
            copyArray(encrypted, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
        }

        return encrypted;
    }

    ModeOfOperationCFB.prototype.decrypt = function(ciphertext) {
        if ((ciphertext.length % this.segmentSize) != 0) {
            throw new Error('invalid ciphertext size (must be segmentSize bytes)');
        }

        var plaintext = coerceArray(ciphertext, true);

        var xorSegment;
        for (var i = 0; i < plaintext.length; i += this.segmentSize) {
            xorSegment = this._aes.encrypt(this._shiftRegister);

            for (var j = 0; j < this.segmentSize; j++) {
                plaintext[i + j] ^= xorSegment[j];
            }

            // Shift the register
            copyArray(this._shiftRegister, this._shiftRegister, 0, this.segmentSize);
            copyArray(ciphertext, this._shiftRegister, 16 - this.segmentSize, i, i + this.segmentSize);
        }

        return plaintext;
    }

    /**
     *  Mode Of Operation - Output Feedback (OFB)
     */
    var ModeOfOperationOFB = function(key, iv) {
        if (!(this instanceof ModeOfOperationOFB)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Output Feedback";
        this.name = "ofb";

        if (!iv) {
            iv = createArray(16);

        } else if (iv.length != 16) {
            throw new Error('invalid initialation vector size (must be 16 bytes)');
        }

        this._lastPrecipher = coerceArray(iv, true);
        this._lastPrecipherIndex = 16;

        this._aes = new AES(key);
    }

    ModeOfOperationOFB.prototype.encrypt = function(plaintext) {
        var encrypted = coerceArray(plaintext, true);

        for (var i = 0; i < encrypted.length; i++) {
            if (this._lastPrecipherIndex === 16) {
                this._lastPrecipher = this._aes.encrypt(this._lastPrecipher);
                this._lastPrecipherIndex = 0;
            }
            encrypted[i] ^= this._lastPrecipher[this._lastPrecipherIndex++];
        }

        return encrypted;
    }

    // Decryption is symetric
    ModeOfOperationOFB.prototype.decrypt = ModeOfOperationOFB.prototype.encrypt;


    /**
     *  Counter object for CTR common mode of operation
     */
    var Counter = function(initialValue) {
        if (!(this instanceof Counter)) {
            throw Error('Counter must be instanitated with `new`');
        }

        // We allow 0, but anything false-ish uses the default 1
        if (initialValue !== 0 && !initialValue) { initialValue = 1; }

        if (typeof(initialValue) === 'number') {
            this._counter = createArray(16);
            this.setValue(initialValue);

        } else {
            this.setBytes(initialValue);
        }
    }

    Counter.prototype.setValue = function(value) {
        if (typeof(value) !== 'number' || parseInt(value) != value) {
            throw new Error('invalid counter value (must be an integer)');
        }

        // We cannot safely handle numbers beyond the safe range for integers
        if (value > Number.MAX_SAFE_INTEGER) {
            throw new Error('integer value out of safe range');
        }

        for (var index = 15; index >= 0; --index) {
            this._counter[index] = value % 256;
            value = parseInt(value / 256);
        }
    }

    Counter.prototype.setBytes = function(bytes) {
        bytes = coerceArray(bytes, true);

        if (bytes.length != 16) {
            throw new Error('invalid counter bytes size (must be 16 bytes)');
        }

        this._counter = bytes;
    };

    Counter.prototype.increment = function() {
        for (var i = 15; i >= 0; i--) {
            if (this._counter[i] === 255) {
                this._counter[i] = 0;
            } else {
                this._counter[i]++;
                break;
            }
        }
    }


    /**
     *  Mode Of Operation - Counter (CTR)
     */
    var ModeOfOperationCTR = function(key, counter) {
        if (!(this instanceof ModeOfOperationCTR)) {
            throw Error('AES must be instanitated with `new`');
        }

        this.description = "Counter";
        this.name = "ctr";

        if (!(counter instanceof Counter)) {
            counter = new Counter(counter)
        }

        this._counter = counter;

        this._remainingCounter = null;
        this._remainingCounterIndex = 16;

        this._aes = new AES(key);
    }

    ModeOfOperationCTR.prototype.encrypt = function(plaintext) {
        var encrypted = coerceArray(plaintext, true);

        for (var i = 0; i < encrypted.length; i++) {
            if (this._remainingCounterIndex === 16) {
                this._remainingCounter = this._aes.encrypt(this._counter._counter);
                this._remainingCounterIndex = 0;
                this._counter.increment();
            }
            encrypted[i] ^= this._remainingCounter[this._remainingCounterIndex++];
        }

        return encrypted;
    }

    // Decryption is symetric
    ModeOfOperationCTR.prototype.decrypt = ModeOfOperationCTR.prototype.encrypt;


    ///////////////////////
    // Padding

    // See:https://tools.ietf.org/html/rfc2315
    function pkcs7pad(data) {
        data = coerceArray(data, true);
        var padder = 16 - (data.length % 16);
        var result = createArray(data.length + padder);
        copyArray(data, result);
        for (var i = data.length; i < result.length; i++) {
            result[i] = padder;
        }
        return result;
    }

    function pkcs7strip(data) {
        data = coerceArray(data, true);
        if (data.length < 16) { throw new Error('PKCS#7 invalid length'); }

        var padder = data[data.length - 1];
        if (padder > 16) { throw new Error('PKCS#7 padding byte out of range'); }

        var length = data.length - padder;
        for (var i = 0; i < padder; i++) {
            if (data[length + i] !== padder) {
                throw new Error('PKCS#7 invalid padding byte');
            }
        }

        var result = createArray(length);
        copyArray(data, result, 0, 0, length);
        return result;
    }

    ///////////////////////
    // Exporting


    // The block cipher
    var aesjs = {
        AES: AES,
        Counter: Counter,

        ModeOfOperation: {
            ecb: ModeOfOperationECB,
            cbc: ModeOfOperationCBC,
            cfb: ModeOfOperationCFB,
            ofb: ModeOfOperationOFB,
            ctr: ModeOfOperationCTR
        },

        utils: {
            hex: convertHex,
            utf8: convertUtf8
        },

        padding: {
            pkcs7: {
                pad: pkcs7pad,
                strip: pkcs7strip
            }
        },

        _arrayTest: {
            coerceArray: coerceArray,
            createArray: createArray,
            copyArray: copyArray,
        }
    };


    // node.js
    if (true) {
        module.exports = aesjs

    // RequireJS/AMD
    // http://www.requirejs.org/docs/api.html
    // https://github.com/amdjs/amdjs-api/wiki/AMD
    } else {}


})(this);


/***/ }),

/***/ 2151:
/***/ ((module) => {

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;


/***/ }),

/***/ 3939:
/***/ ((module) => {

(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();


/***/ }),

/***/ 4263:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(343)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function ErrorStackParser(StackFrame) {
    'use strict';

    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;

    return {
        /**
         * Given an Error object, extract the most information from it.
         *
         * @param {Error} error object
         * @return {Array} of StackFrames
         */
        parse: function ErrorStackParser$$parse(error) {
            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
                return this.parseOpera(error);
            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
                return this.parseV8OrIE(error);
            } else if (error.stack) {
                return this.parseFFOrSafari(error);
            } else {
                throw new Error('Cannot parse given Error object');
            }
        },

        // Separate line and column numbers from a string of the form: (URI:Line:Column)
        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
            // Fail-fast but return locations like "(native)"
            if (urlLike.indexOf(':') === -1) {
                return [urlLike];
            }

            var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
            var parts = regExp.exec(urlLike.replace(/[()]/g, ''));
            return [parts[1], parts[2] || undefined, parts[3] || undefined];
        },

        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
            var filtered = error.stack.split('\n').filter(function(line) {
                return !!line.match(CHROME_IE_STACK_REGEXP);
            }, this);

            return filtered.map(function(line) {
                if (line.indexOf('(eval ') > -1) {
                    // Throw away eval information until we implement stacktrace.js/stackframe#8
                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(,.*$)/g, '');
                }
                var sanitizedLine = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').replace(/^.*?\s+/, '');

                // capture and preseve the parenthesized location "(/foo/my bar.js:12:87)" in
                // case it has spaces in it, as the string is split on \s+ later on
                var location = sanitizedLine.match(/ (\(.+\)$)/);

                // remove the parenthesized location from the line, if it was matched
                sanitizedLine = location ? sanitizedLine.replace(location[0], '') : sanitizedLine;

                // if a location was matched, pass it to extractLocation() otherwise pass all sanitizedLine
                // because this line doesn't have function name
                var locationParts = this.extractLocation(location ? location[1] : sanitizedLine);
                var functionName = location && sanitizedLine || undefined;
                var fileName = ['eval', '<anonymous>'].indexOf(locationParts[0]) > -1 ? undefined : locationParts[0];

                return new StackFrame({
                    functionName: functionName,
                    fileName: fileName,
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2],
                    source: line
                });
            }, this);
        },

        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
            var filtered = error.stack.split('\n').filter(function(line) {
                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
            }, this);

            return filtered.map(function(line) {
                // Throw away eval information until we implement stacktrace.js/stackframe#8
                if (line.indexOf(' > eval') > -1) {
                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1');
                }

                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
                    // Safari eval frames only have function names and nothing else
                    return new StackFrame({
                        functionName: line
                    });
                } else {
                    var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
                    var matches = line.match(functionNameRegex);
                    var functionName = matches && matches[1] ? matches[1] : undefined;
                    var locationParts = this.extractLocation(line.replace(functionNameRegex, ''));

                    return new StackFrame({
                        functionName: functionName,
                        fileName: locationParts[0],
                        lineNumber: locationParts[1],
                        columnNumber: locationParts[2],
                        source: line
                    });
                }
            }, this);
        },

        parseOpera: function ErrorStackParser$$parseOpera(e) {
            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
                return this.parseOpera9(e);
            } else if (!e.stack) {
                return this.parseOpera10(e);
            } else {
                return this.parseOpera11(e);
            }
        },

        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
            var lines = e.message.split('\n');
            var result = [];

            for (var i = 2, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame({
                        fileName: match[2],
                        lineNumber: match[1],
                        source: lines[i]
                    }));
                }
            }

            return result;
        },

        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            var lines = e.stacktrace.split('\n');
            var result = [];

            for (var i = 0, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(
                        new StackFrame({
                            functionName: match[3] || undefined,
                            fileName: match[2],
                            lineNumber: match[1],
                            source: lines[i]
                        })
                    );
                }
            }

            return result;
        },

        // Opera 10.65+ Error.stack very similar to FF/Safari
        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
            var filtered = error.stack.split('\n').filter(function(line) {
                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
            }, this);

            return filtered.map(function(line) {
                var tokens = line.split('@');
                var locationParts = this.extractLocation(tokens.pop());
                var functionCall = (tokens.shift() || '');
                var functionName = functionCall
                    .replace(/<anonymous function(: (\w+))?>/, '$2')
                    .replace(/\([^)]*\)/g, '') || undefined;
                var argsRaw;
                if (functionCall.match(/\(([^)]*)\)/)) {
                    argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, '$1');
                }
                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
                    undefined : argsRaw.split(',');

                return new StackFrame({
                    functionName: functionName,
                    args: args,
                    fileName: locationParts[0],
                    lineNumber: locationParts[1],
                    columnNumber: locationParts[2],
                    source: line
                });
            }, this);
        }
    };
}));


/***/ }),

/***/ 8904:
/***/ ((module) => {

/* Font Face Observer v2.3.0 - © Bram Stein. License: BSD-3-Clause */(function(){function p(a,c){document.addEventListener?a.addEventListener("scroll",c,!1):a.attachEvent("scroll",c)}function u(a){document.body?a():document.addEventListener?document.addEventListener("DOMContentLoaded",function b(){document.removeEventListener("DOMContentLoaded",b);a()}):document.attachEvent("onreadystatechange",function g(){if("interactive"==document.readyState||"complete"==document.readyState)document.detachEvent("onreadystatechange",g),a()})};function w(a){this.g=document.createElement("div");this.g.setAttribute("aria-hidden","true");this.g.appendChild(document.createTextNode(a));this.h=document.createElement("span");this.i=document.createElement("span");this.m=document.createElement("span");this.j=document.createElement("span");this.l=-1;this.h.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.i.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
this.j.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.m.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";this.h.appendChild(this.m);this.i.appendChild(this.j);this.g.appendChild(this.h);this.g.appendChild(this.i)}
function x(a,c){a.g.style.cssText="max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:"+c+";"}function B(a){var c=a.g.offsetWidth,b=c+100;a.j.style.width=b+"px";a.i.scrollLeft=b;a.h.scrollLeft=a.h.scrollWidth+100;return a.l!==c?(a.l=c,!0):!1}function C(a,c){function b(){var e=g;B(e)&&null!==e.g.parentNode&&c(e.l)}var g=a;p(a.h,b);p(a.i,b);B(a)};function D(a,c,b){c=c||{};b=b||window;this.family=a;this.style=c.style||"normal";this.weight=c.weight||"normal";this.stretch=c.stretch||"normal";this.context=b}var E=null,F=null,G=null,H=null;function I(a){null===F&&(M(a)&&/Apple/.test(window.navigator.vendor)?(a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent),F=!!a&&603>parseInt(a[1],10)):F=!1);return F}function M(a){null===H&&(H=!!a.document.fonts);return H}
function N(a,c){var b=a.style,g=a.weight;if(null===G){var e=document.createElement("div");try{e.style.font="condensed 100px sans-serif"}catch(q){}G=""!==e.style.font}return[b,g,G?a.stretch:"","100px",c].join(" ")}
D.prototype.load=function(a,c){var b=this,g=a||"BESbswy",e=0,q=c||3E3,J=(new Date).getTime();return new Promise(function(K,L){if(M(b.context)&&!I(b.context)){var O=new Promise(function(r,t){function h(){(new Date).getTime()-J>=q?t(Error(""+q+"ms timeout exceeded")):b.context.document.fonts.load(N(b,'"'+b.family+'"'),g).then(function(n){1<=n.length?r():setTimeout(h,25)},t)}h()}),P=new Promise(function(r,t){e=setTimeout(function(){t(Error(""+q+"ms timeout exceeded"))},q)});Promise.race([P,O]).then(function(){clearTimeout(e);
K(b)},L)}else u(function(){function r(){var d;if(d=-1!=k&&-1!=l||-1!=k&&-1!=m||-1!=l&&-1!=m)(d=k!=l&&k!=m&&l!=m)||(null===E&&(d=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent),E=!!d&&(536>parseInt(d[1],10)||536===parseInt(d[1],10)&&11>=parseInt(d[2],10))),d=E&&(k==y&&l==y&&m==y||k==z&&l==z&&m==z||k==A&&l==A&&m==A)),d=!d;d&&(null!==f.parentNode&&f.parentNode.removeChild(f),clearTimeout(e),K(b))}function t(){if((new Date).getTime()-J>=q)null!==f.parentNode&&f.parentNode.removeChild(f),
L(Error(""+q+"ms timeout exceeded"));else{var d=b.context.document.hidden;if(!0===d||void 0===d)k=h.g.offsetWidth,l=n.g.offsetWidth,m=v.g.offsetWidth,r();e=setTimeout(t,50)}}var h=new w(g),n=new w(g),v=new w(g),k=-1,l=-1,m=-1,y=-1,z=-1,A=-1,f=document.createElement("div");f.dir="ltr";x(h,N(b,"sans-serif"));x(n,N(b,"serif"));x(v,N(b,"monospace"));f.appendChild(h.g);f.appendChild(n.g);f.appendChild(v.g);b.context.document.body.appendChild(f);y=h.g.offsetWidth;z=n.g.offsetWidth;A=v.g.offsetWidth;t();
C(h,function(d){k=d;r()});x(h,N(b,'"'+b.family+'",sans-serif'));C(n,function(d){l=d;r()});x(n,N(b,'"'+b.family+'",serif'));C(v,function(d){m=d;r()});x(v,N(b,'"'+b.family+'",monospace'))})})}; true?module.exports=D:(0);}());


/***/ }),

/***/ 7206:
/***/ ((module) => {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ 5580:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(6110),
    root = __webpack_require__(9325);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),

/***/ 1549:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var hashClear = __webpack_require__(2032),
    hashDelete = __webpack_require__(3862),
    hashGet = __webpack_require__(6721),
    hashHas = __webpack_require__(2749),
    hashSet = __webpack_require__(5749);

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;


/***/ }),

/***/ 79:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var listCacheClear = __webpack_require__(3702),
    listCacheDelete = __webpack_require__(80),
    listCacheGet = __webpack_require__(4739),
    listCacheHas = __webpack_require__(8655),
    listCacheSet = __webpack_require__(1175);

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;


/***/ }),

/***/ 8223:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(6110),
    root = __webpack_require__(9325);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ 3661:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var mapCacheClear = __webpack_require__(3040),
    mapCacheDelete = __webpack_require__(7670),
    mapCacheGet = __webpack_require__(289),
    mapCacheHas = __webpack_require__(4509),
    mapCacheSet = __webpack_require__(2949);

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;


/***/ }),

/***/ 2804:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(6110),
    root = __webpack_require__(9325);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),

/***/ 6545:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(6110),
    root = __webpack_require__(9325);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),

/***/ 7217:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(79),
    stackClear = __webpack_require__(1420),
    stackDelete = __webpack_require__(938),
    stackGet = __webpack_require__(3605),
    stackHas = __webpack_require__(9817),
    stackSet = __webpack_require__(945);

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;


/***/ }),

/***/ 1873:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(9325);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ 7828:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(9325);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),

/***/ 8303:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(6110),
    root = __webpack_require__(9325);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),

/***/ 3729:
/***/ ((module) => {

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;


/***/ }),

/***/ 9770:
/***/ ((module) => {

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;


/***/ }),

/***/ 695:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTimes = __webpack_require__(8096),
    isArguments = __webpack_require__(2428),
    isArray = __webpack_require__(6449),
    isBuffer = __webpack_require__(3656),
    isIndex = __webpack_require__(361),
    isTypedArray = __webpack_require__(7167);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;


/***/ }),

/***/ 4528:
/***/ ((module) => {

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;


/***/ }),

/***/ 6547:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseAssignValue = __webpack_require__(3360),
    eq = __webpack_require__(5288);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;


/***/ }),

/***/ 6025:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var eq = __webpack_require__(5288);

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;


/***/ }),

/***/ 4733:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(1791),
    keys = __webpack_require__(5950);

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;


/***/ }),

/***/ 3838:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(1791),
    keysIn = __webpack_require__(7241);

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;


/***/ }),

/***/ 3360:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var defineProperty = __webpack_require__(3243);

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;


/***/ }),

/***/ 9999:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Stack = __webpack_require__(7217),
    arrayEach = __webpack_require__(3729),
    assignValue = __webpack_require__(6547),
    baseAssign = __webpack_require__(4733),
    baseAssignIn = __webpack_require__(3838),
    cloneBuffer = __webpack_require__(3290),
    copyArray = __webpack_require__(3007),
    copySymbols = __webpack_require__(2271),
    copySymbolsIn = __webpack_require__(8948),
    getAllKeys = __webpack_require__(2),
    getAllKeysIn = __webpack_require__(3349),
    getTag = __webpack_require__(5861),
    initCloneArray = __webpack_require__(6189),
    initCloneByTag = __webpack_require__(7199),
    initCloneObject = __webpack_require__(5529),
    isArray = __webpack_require__(6449),
    isBuffer = __webpack_require__(3656),
    isMap = __webpack_require__(7730),
    isObject = __webpack_require__(3805),
    isSet = __webpack_require__(8440),
    keys = __webpack_require__(5950),
    keysIn = __webpack_require__(7241);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function(subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;


/***/ }),

/***/ 9344:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(3805);

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),

/***/ 2199:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(4528),
    isArray = __webpack_require__(6449);

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;


/***/ }),

/***/ 2552:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(1873),
    getRawTag = __webpack_require__(659),
    objectToString = __webpack_require__(9350);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ 7534:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(2552),
    isObjectLike = __webpack_require__(346);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;


/***/ }),

/***/ 9172:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getTag = __webpack_require__(5861),
    isObjectLike = __webpack_require__(346);

/** `Object#toString` result references. */
var mapTag = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike(value) && getTag(value) == mapTag;
}

module.exports = baseIsMap;


/***/ }),

/***/ 5083:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(1882),
    isMasked = __webpack_require__(7296),
    isObject = __webpack_require__(3805),
    toSource = __webpack_require__(7473);

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;


/***/ }),

/***/ 6038:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getTag = __webpack_require__(5861),
    isObjectLike = __webpack_require__(346);

/** `Object#toString` result references. */
var setTag = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike(value) && getTag(value) == setTag;
}

module.exports = baseIsSet;


/***/ }),

/***/ 4901:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(2552),
    isLength = __webpack_require__(294),
    isObjectLike = __webpack_require__(346);

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;


/***/ }),

/***/ 8984:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isPrototype = __webpack_require__(5527),
    nativeKeys = __webpack_require__(3650);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;


/***/ }),

/***/ 2903:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(3805),
    isPrototype = __webpack_require__(5527),
    nativeKeysIn = __webpack_require__(181);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;


/***/ }),

/***/ 8096:
/***/ ((module) => {

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;


/***/ }),

/***/ 7301:
/***/ ((module) => {

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;


/***/ }),

/***/ 9653:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Uint8Array = __webpack_require__(7828);

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),

/***/ 3290:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(9325);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;


/***/ }),

/***/ 6169:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(9653);

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;


/***/ }),

/***/ 3201:
/***/ ((module) => {

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;


/***/ }),

/***/ 3736:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(1873);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;


/***/ }),

/***/ 1961:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(9653);

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),

/***/ 3007:
/***/ ((module) => {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),

/***/ 1791:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assignValue = __webpack_require__(6547),
    baseAssignValue = __webpack_require__(3360);

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),

/***/ 2271:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(1791),
    getSymbols = __webpack_require__(4664);

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;


/***/ }),

/***/ 8948:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var copyObject = __webpack_require__(1791),
    getSymbolsIn = __webpack_require__(6375);

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;


/***/ }),

/***/ 5481:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(9325);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ 3243:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(6110);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),

/***/ 4840:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),

/***/ 2:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(2199),
    getSymbols = __webpack_require__(4664),
    keys = __webpack_require__(5950);

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;


/***/ }),

/***/ 3349:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetAllKeys = __webpack_require__(2199),
    getSymbolsIn = __webpack_require__(6375),
    keysIn = __webpack_require__(7241);

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;


/***/ }),

/***/ 2651:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isKeyable = __webpack_require__(4218);

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;


/***/ }),

/***/ 6110:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsNative = __webpack_require__(5083),
    getValue = __webpack_require__(392);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;


/***/ }),

/***/ 8879:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(4335);

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),

/***/ 659:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(1873);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ 4664:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayFilter = __webpack_require__(9770),
    stubArray = __webpack_require__(3345);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;


/***/ }),

/***/ 6375:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayPush = __webpack_require__(4528),
    getPrototype = __webpack_require__(8879),
    getSymbols = __webpack_require__(4664),
    stubArray = __webpack_require__(3345);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;


/***/ }),

/***/ 5861:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var DataView = __webpack_require__(5580),
    Map = __webpack_require__(8223),
    Promise = __webpack_require__(2804),
    Set = __webpack_require__(6545),
    WeakMap = __webpack_require__(8303),
    baseGetTag = __webpack_require__(2552),
    toSource = __webpack_require__(7473);

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;


/***/ }),

/***/ 392:
/***/ ((module) => {

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;


/***/ }),

/***/ 2032:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(1042);

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;


/***/ }),

/***/ 3862:
/***/ ((module) => {

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;


/***/ }),

/***/ 6721:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(1042);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;


/***/ }),

/***/ 2749:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(1042);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;


/***/ }),

/***/ 5749:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var nativeCreate = __webpack_require__(1042);

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;


/***/ }),

/***/ 6189:
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;


/***/ }),

/***/ 7199:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var cloneArrayBuffer = __webpack_require__(9653),
    cloneDataView = __webpack_require__(6169),
    cloneRegExp = __webpack_require__(3201),
    cloneSymbol = __webpack_require__(3736),
    cloneTypedArray = __webpack_require__(1961);

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return new Ctor;

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return new Ctor;

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;


/***/ }),

/***/ 5529:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseCreate = __webpack_require__(9344),
    getPrototype = __webpack_require__(8879),
    isPrototype = __webpack_require__(5527);

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),

/***/ 361:
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;


/***/ }),

/***/ 4218:
/***/ ((module) => {

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;


/***/ }),

/***/ 7296:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var coreJsData = __webpack_require__(5481);

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;


/***/ }),

/***/ 5527:
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;


/***/ }),

/***/ 3702:
/***/ ((module) => {

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;


/***/ }),

/***/ 80:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(6025);

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;


/***/ }),

/***/ 4739:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(6025);

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;


/***/ }),

/***/ 8655:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(6025);

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;


/***/ }),

/***/ 1175:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var assocIndexOf = __webpack_require__(6025);

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;


/***/ }),

/***/ 3040:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Hash = __webpack_require__(1549),
    ListCache = __webpack_require__(79),
    Map = __webpack_require__(8223);

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;


/***/ }),

/***/ 7670:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(2651);

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;


/***/ }),

/***/ 289:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(2651);

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;


/***/ }),

/***/ 4509:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(2651);

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;


/***/ }),

/***/ 2949:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getMapData = __webpack_require__(2651);

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;


/***/ }),

/***/ 1042:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var getNative = __webpack_require__(6110);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ 3650:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var overArg = __webpack_require__(4335);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),

/***/ 181:
/***/ ((module) => {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;


/***/ }),

/***/ 6009:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var freeGlobal = __webpack_require__(4840);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;


/***/ }),

/***/ 9350:
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ 4335:
/***/ ((module) => {

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;


/***/ }),

/***/ 9325:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(4840);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ 1420:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(79);

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;


/***/ }),

/***/ 938:
/***/ ((module) => {

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;


/***/ }),

/***/ 3605:
/***/ ((module) => {

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;


/***/ }),

/***/ 9817:
/***/ ((module) => {

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;


/***/ }),

/***/ 945:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var ListCache = __webpack_require__(79),
    Map = __webpack_require__(8223),
    MapCache = __webpack_require__(3661);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;


/***/ }),

/***/ 7473:
/***/ ((module) => {

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;


/***/ }),

/***/ 8055:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseClone = __webpack_require__(9999);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

module.exports = cloneDeep;


/***/ }),

/***/ 5288:
/***/ ((module) => {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;


/***/ }),

/***/ 2428:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsArguments = __webpack_require__(7534),
    isObjectLike = __webpack_require__(346);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;


/***/ }),

/***/ 6449:
/***/ ((module) => {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),

/***/ 4894:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isFunction = __webpack_require__(1882),
    isLength = __webpack_require__(294);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;


/***/ }),

/***/ 3656:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var root = __webpack_require__(9325),
    stubFalse = __webpack_require__(9935);

/** Detect free variable `exports`. */
var freeExports =  true && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && "object" == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;


/***/ }),

/***/ 1882:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(2552),
    isObject = __webpack_require__(3805);

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;


/***/ }),

/***/ 294:
/***/ ((module) => {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;


/***/ }),

/***/ 7730:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsMap = __webpack_require__(9172),
    baseUnary = __webpack_require__(7301),
    nodeUtil = __webpack_require__(6009);

/* Node.js helper references. */
var nodeIsMap = nodeUtil && nodeUtil.isMap;

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

module.exports = isMap;


/***/ }),

/***/ 3805:
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ 346:
/***/ ((module) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ 8440:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsSet = __webpack_require__(6038),
    baseUnary = __webpack_require__(7301),
    nodeUtil = __webpack_require__(6009);

/* Node.js helper references. */
var nodeIsSet = nodeUtil && nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

module.exports = isSet;


/***/ }),

/***/ 7167:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseIsTypedArray = __webpack_require__(4901),
    baseUnary = __webpack_require__(7301),
    nodeUtil = __webpack_require__(6009);

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;


/***/ }),

/***/ 5950:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(695),
    baseKeys = __webpack_require__(8984),
    isArrayLike = __webpack_require__(4894);

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;


/***/ }),

/***/ 7241:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeKeys = __webpack_require__(695),
    baseKeysIn = __webpack_require__(2903),
    isArrayLike = __webpack_require__(4894);

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;


/***/ }),

/***/ 3345:
/***/ ((module) => {

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;


/***/ }),

/***/ 9935:
/***/ ((module) => {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),

/***/ 3503:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

(function(){
  var crypt = __webpack_require__(3939),
      utf8 = (__webpack_require__(2151).utf8),
      isBuffer = __webpack_require__(7206),
      bin = (__webpack_require__(2151).bin),

  // The core
  md5 = function (message, options) {
    // Convert to byte array
    if (message.constructor == String)
      if (options && options.encoding === 'binary')
        message = bin.stringToBytes(message);
      else
        message = utf8.stringToBytes(message);
    else if (isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message) && message.constructor !== Uint8Array)
      message = message.toString();
    // else, assume byte array already

    var m = crypt.bytesToWords(message),
        l = message.length * 8,
        a =  1732584193,
        b = -271733879,
        c = -1732584194,
        d =  271733878;

    // Swap endian
    for (var i = 0; i < m.length; i++) {
      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
    }

    // Padding
    m[l >>> 5] |= 0x80 << (l % 32);
    m[(((l + 64) >>> 9) << 4) + 14] = l;

    // Method shortcuts
    var FF = md5._ff,
        GG = md5._gg,
        HH = md5._hh,
        II = md5._ii;

    for (var i = 0; i < m.length; i += 16) {

      var aa = a,
          bb = b,
          cc = c,
          dd = d;

      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
      c = FF(c, d, a, b, m[i+10], 17, -42063);
      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
      d = FF(d, a, b, c, m[i+13], 12, -40341101);
      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
      b = FF(b, c, d, a, m[i+15], 22,  1236535329);

      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
      c = GG(c, d, a, b, m[i+11], 14,  643717713);
      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
      d = GG(d, a, b, c, m[i+10],  9,  38016083);
      c = GG(c, d, a, b, m[i+15], 14, -660478335);
      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
      b = GG(b, c, d, a, m[i+12], 20, -1926607734);

      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
      b = HH(b, c, d, a, m[i+14], 23, -35309556);
      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
      a = HH(a, b, c, d, m[i+13],  4,  681279174);
      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
      d = HH(d, a, b, c, m[i+12], 11, -421815835);
      c = HH(c, d, a, b, m[i+15], 16,  530742520);
      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
      c = II(c, d, a, b, m[i+14], 15, -1416354905);
      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
      a = II(a, b, c, d, m[i+12],  6,  1700485571);
      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
      c = II(c, d, a, b, m[i+10], 15, -1051523);
      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
      d = II(d, a, b, c, m[i+15], 10, -30611744);
      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
      b = II(b, c, d, a, m[i+13], 21,  1309151649);
      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
      d = II(d, a, b, c, m[i+11], 10, -1120210379);
      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
      b = II(b, c, d, a, m[i+ 9], 21, -343485551);

      a = (a + aa) >>> 0;
      b = (b + bb) >>> 0;
      c = (c + cc) >>> 0;
      d = (d + dd) >>> 0;
    }

    return crypt.endian([a, b, c, d]);
  };

  // Auxiliary functions
  md5._ff  = function (a, b, c, d, x, s, t) {
    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._gg  = function (a, b, c, d, x, s, t) {
    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._hh  = function (a, b, c, d, x, s, t) {
    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };
  md5._ii  = function (a, b, c, d, x, s, t) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
    return ((n << s) | (n >>> (32 - s))) + b;
  };

  // Package private blocksize
  md5._blocksize = 16;
  md5._digestsize = 16;

  module.exports = function (message, options) {
    if (message === undefined || message === null)
      throw new Error('Illegal argument ' + message);

    var digestbytes = crypt.wordsToBytes(md5(message, options));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

})();


/***/ }),

/***/ 8887:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(343)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function(StackFrame) {
    return {
        backtrace: function StackGenerator$$backtrace(opts) {
            var stack = [];
            var maxStackSize = 10;

            if (typeof opts === 'object' && typeof opts.maxStackSize === 'number') {
                maxStackSize = opts.maxStackSize;
            }

            var curr = arguments.callee;
            while (curr && stack.length < maxStackSize && curr['arguments']) {
                // Allow V8 optimizations
                var args = new Array(curr['arguments'].length);
                for (var i = 0; i < args.length; ++i) {
                    args[i] = curr['arguments'][i];
                }
                if (/function(?:\s+([\w$]+))+\s*\(/.test(curr.toString())) {
                    stack.push(new StackFrame({functionName: RegExp.$1 || undefined, args: args}));
                } else {
                    stack.push(new StackFrame({args: args}));
                }

                try {
                    curr = curr.caller;
                } catch (e) {
                    break;
                }
            }
            return stack;
        }
    };
}));


/***/ }),

/***/ 343:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function() {
    'use strict';
    function _isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function _capitalize(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }

    function _getter(p) {
        return function() {
            return this[p];
        };
    }

    var booleanProps = ['isConstructor', 'isEval', 'isNative', 'isToplevel'];
    var numericProps = ['columnNumber', 'lineNumber'];
    var stringProps = ['fileName', 'functionName', 'source'];
    var arrayProps = ['args'];
    var objectProps = ['evalOrigin'];

    var props = booleanProps.concat(numericProps, stringProps, arrayProps, objectProps);

    function StackFrame(obj) {
        if (!obj) return;
        for (var i = 0; i < props.length; i++) {
            if (obj[props[i]] !== undefined) {
                this['set' + _capitalize(props[i])](obj[props[i]]);
            }
        }
    }

    StackFrame.prototype = {
        getArgs: function() {
            return this.args;
        },
        setArgs: function(v) {
            if (Object.prototype.toString.call(v) !== '[object Array]') {
                throw new TypeError('Args must be an Array');
            }
            this.args = v;
        },

        getEvalOrigin: function() {
            return this.evalOrigin;
        },
        setEvalOrigin: function(v) {
            if (v instanceof StackFrame) {
                this.evalOrigin = v;
            } else if (v instanceof Object) {
                this.evalOrigin = new StackFrame(v);
            } else {
                throw new TypeError('Eval Origin must be an Object or StackFrame');
            }
        },

        toString: function() {
            var fileName = this.getFileName() || '';
            var lineNumber = this.getLineNumber() || '';
            var columnNumber = this.getColumnNumber() || '';
            var functionName = this.getFunctionName() || '';
            if (this.getIsEval()) {
                if (fileName) {
                    return '[eval] (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
                }
                return '[eval]:' + lineNumber + ':' + columnNumber;
            }
            if (functionName) {
                return functionName + ' (' + fileName + ':' + lineNumber + ':' + columnNumber + ')';
            }
            return fileName + ':' + lineNumber + ':' + columnNumber;
        }
    };

    StackFrame.fromString = function StackFrame$$fromString(str) {
        var argsStartIndex = str.indexOf('(');
        var argsEndIndex = str.lastIndexOf(')');

        var functionName = str.substring(0, argsStartIndex);
        var args = str.substring(argsStartIndex + 1, argsEndIndex).split(',');
        var locationString = str.substring(argsEndIndex + 1);

        if (locationString.indexOf('@') === 0) {
            var parts = /@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(locationString, '');
            var fileName = parts[1];
            var lineNumber = parts[2];
            var columnNumber = parts[3];
        }

        return new StackFrame({
            functionName: functionName,
            args: args || undefined,
            fileName: fileName,
            lineNumber: lineNumber || undefined,
            columnNumber: columnNumber || undefined
        });
    };

    for (var i = 0; i < booleanProps.length; i++) {
        StackFrame.prototype['get' + _capitalize(booleanProps[i])] = _getter(booleanProps[i]);
        StackFrame.prototype['set' + _capitalize(booleanProps[i])] = (function(p) {
            return function(v) {
                this[p] = Boolean(v);
            };
        })(booleanProps[i]);
    }

    for (var j = 0; j < numericProps.length; j++) {
        StackFrame.prototype['get' + _capitalize(numericProps[j])] = _getter(numericProps[j]);
        StackFrame.prototype['set' + _capitalize(numericProps[j])] = (function(p) {
            return function(v) {
                if (!_isNumber(v)) {
                    throw new TypeError(p + ' must be a Number');
                }
                this[p] = Number(v);
            };
        })(numericProps[j]);
    }

    for (var k = 0; k < stringProps.length; k++) {
        StackFrame.prototype['get' + _capitalize(stringProps[k])] = _getter(stringProps[k]);
        StackFrame.prototype['set' + _capitalize(stringProps[k])] = (function(p) {
            return function(v) {
                this[p] = String(v);
            };
        })(stringProps[k]);
    }

    return StackFrame;
}));


/***/ }),

/***/ 671:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(3835);
var has = Object.prototype.hasOwnProperty;

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = util.toSetString(aStr);
  var isDuplicate = has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    this._set[sStr] = idx;
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  var sStr = util.toSetString(aStr);
  return has.call(this._set, sStr);
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  var sStr = util.toSetString(aStr);
  if (has.call(this._set, sStr)) {
    return this._set[sStr];
  }
  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

exports.C = ArraySet;


/***/ }),

/***/ 1860:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = __webpack_require__(9900);

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
exports.encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};


/***/ }),

/***/ 9900:
/***/ ((__unused_webpack_module, exports) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
exports.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
exports.decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};


/***/ }),

/***/ 5035:
/***/ ((__unused_webpack_module, exports) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};


/***/ }),

/***/ 7238:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(3835);

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = {generatedLine: -1, generatedColumn: 0};
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList.prototype.unsortedForEach =
  function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

exports.P = MappingList;


/***/ }),

/***/ 1737:
/***/ ((__unused_webpack_module, exports) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
exports.g = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};


/***/ }),

/***/ 1606:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = __webpack_require__(3835);
var binarySearch = __webpack_require__(5035);
var ArraySet = (__webpack_require__(671)/* .ArraySet */ .C);
var base64VLQ = __webpack_require__(1860);
var quickSort = (__webpack_require__(1737)/* .quickSort */ .g);

function SourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap)
    : new BasicSourceMapConsumer(sourceMap);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
}

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      if (source != null && sourceRoot != null) {
        source = util.join(sourceRoot, source);
      }
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: Optional. the column number in the original source.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    if (this.sourceRoot != null) {
      needle.source = util.relative(this.sourceRoot, needle.source);
    }
    if (!this._sources.has(needle.source)) {
      return [];
    }
    needle.source = this._sources.indexOf(needle.source);

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

exports.SourceMapConsumer = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The only parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._sources.toArray().map(function (s) {
      return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
    }, this);
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          if (this.sourceRoot != null) {
            source = util.join(this.sourceRoot, source);
          }
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    if (this.sourceRoot != null) {
      aSource = util.relative(this.sourceRoot, aSource);
    }

    if (this._sources.has(aSource)) {
      return this.sourcesContent[this._sources.indexOf(aSource)];
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + aSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + aSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    if (this.sourceRoot != null) {
      source = util.relative(this.sourceRoot, source);
    }
    if (!this._sources.has(source)) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }
    source = this._sources.indexOf(source);

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

__webpack_unused_export__ = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The only parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'))
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        if (section.consumer.sourceRoot !== null) {
          source = util.join(section.consumer.sourceRoot, source);
        }
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = section.consumer._names.at(mapping.name);
        this._names.add(name);
        name = this._names.indexOf(name);

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };

__webpack_unused_export__ = IndexedSourceMapConsumer;


/***/ }),

/***/ 1945:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ = __webpack_require__(1860);
var util = __webpack_require__(3835);
var ArraySet = (__webpack_require__(671)/* .ArraySet */ .C);
var MappingList = (__webpack_require__(7238)/* .MappingList */ .P);

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util.getArg(aArgs, 'file', null);
  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
  this._sources = new ArraySet();
  this._names = new ArraySet();
  this._mappings = new MappingList();
  this._sourcesContents = null;
}

SourceMapGenerator.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator.fromSourceMap =
  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    });
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, 'generated');
    var original = util.getArg(aArgs, 'original', null);
    var source = util.getArg(aArgs, 'source', null);
    var name = util.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };

/**
 * Set the source content for a source file.
 */
SourceMapGenerator.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet();
    var newNames = new ArraySet();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source)
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util.join(aSourceMapPath, sourceFile);
        }
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                              aName) {
    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    }
    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.
      return;
    }
    else {
      throw new Error('Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = ''

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      }
      else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ',';
        }
      }

      next += base64VLQ.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64VLQ.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

SourceMapGenerator.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  };

/**
 * Externalize the source map.
 */
SourceMapGenerator.prototype.toJSON =
  function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

exports.SourceMapGenerator = SourceMapGenerator;


/***/ }),

/***/ 1171:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator = (__webpack_require__(1945).SourceMapGenerator);
var util = __webpack_require__(3835);

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are removed from this array, by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var shiftNextLine = function() {
      var lineContents = remainingLines.shift();
      // The last line of a file might not have a newline.
      var newLine = remainingLines.shift() || "";
      return lineContents + newLine;
    };

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null;

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[0];
          var code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[0] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[0];
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[0] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLines.length > 0) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  };

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length-1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    }
    else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
                     line: this.line,
                     column: this.column,
                     name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len-1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  }
  else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  }
  else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent =
  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null
        && original.line !== null
        && original.column !== null) {
      if(lastOriginalSource !== original.source
         || lastOriginalLine !== original.line
         || lastOriginalColumn !== original.column
         || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

exports.SourceNode = SourceNode;


/***/ }),

/***/ 3835:
/***/ ((__unused_webpack_module, exports) => {

/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || !!aPath.match(urlRegexp);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;


/***/ }),

/***/ 65:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = __webpack_require__(1945).SourceMapGenerator;
exports.SourceMapConsumer = __webpack_require__(1606).SourceMapConsumer;
exports.SourceNode = __webpack_require__(1171).SourceNode;


/***/ }),

/***/ 7885:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(65), __webpack_require__(343)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function(SourceMap, StackFrame) {
    'use strict';

    /**
     * Make a X-Domain request to url and callback.
     *
     * @param {String} url
     * @returns {Promise} with response text if fulfilled
     */
    function _xdr(url) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('get', url);
            req.onerror = reject;
            req.onreadystatechange = function onreadystatechange() {
                if (req.readyState === 4) {
                    if ((req.status >= 200 && req.status < 300) ||
                        (url.substr(0, 7) === 'file://' && req.responseText)) {
                        resolve(req.responseText);
                    } else {
                        reject(new Error('HTTP status: ' + req.status + ' retrieving ' + url));
                    }
                }
            };
            req.send();
        });

    }

    /**
     * Convert a Base64-encoded string into its original representation.
     * Used for inline sourcemaps.
     *
     * @param {String} b64str Base-64 encoded string
     * @returns {String} original representation of the base64-encoded string.
     */
    function _atob(b64str) {
        if (typeof window !== 'undefined' && window.atob) {
            return window.atob(b64str);
        } else {
            throw new Error('You must supply a polyfill for window.atob in this environment');
        }
    }

    function _parseJson(string) {
        if (typeof JSON !== 'undefined' && JSON.parse) {
            return JSON.parse(string);
        } else {
            throw new Error('You must supply a polyfill for JSON.parse in this environment');
        }
    }

    function _findFunctionName(source, lineNumber/*, columnNumber*/) {
        var syntaxes = [
            // {name} = function ({args}) TODO args capture
            /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*function\b/,
            // function {name}({args}) m[1]=name m[2]=args
            /function\s+([^('"`]*?)\s*\(([^)]*)\)/,
            // {name} = eval()
            /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*(?:eval|new Function)\b/,
            // fn_name() {
            /\b(?!(?:if|for|switch|while|with|catch)\b)(?:(?:static)\s+)?(\S+)\s*\(.*?\)\s*\{/,
            // {name} = () => {
            /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*\(.*?\)\s*=>/
        ];
        var lines = source.split('\n');

        // Walk backwards in the source lines until we find the line which matches one of the patterns above
        var code = '';
        var maxLines = Math.min(lineNumber, 20);
        for (var i = 0; i < maxLines; ++i) {
            // lineNo is 1-based, source[] is 0-based
            var line = lines[lineNumber - i - 1];
            var commentPos = line.indexOf('//');
            if (commentPos >= 0) {
                line = line.substr(0, commentPos);
            }

            if (line) {
                code = line + code;
                var len = syntaxes.length;
                for (var index = 0; index < len; index++) {
                    var m = syntaxes[index].exec(code);
                    if (m && m[1]) {
                        return m[1];
                    }
                }
            }
        }
        return undefined;
    }

    function _ensureSupportedEnvironment() {
        if (typeof Object.defineProperty !== 'function' || typeof Object.create !== 'function') {
            throw new Error('Unable to consume source maps in older browsers');
        }
    }

    function _ensureStackFrameIsLegit(stackframe) {
        if (typeof stackframe !== 'object') {
            throw new TypeError('Given StackFrame is not an object');
        } else if (typeof stackframe.fileName !== 'string') {
            throw new TypeError('Given file name is not a String');
        } else if (typeof stackframe.lineNumber !== 'number' ||
            stackframe.lineNumber % 1 !== 0 ||
            stackframe.lineNumber < 1) {
            throw new TypeError('Given line number must be a positive integer');
        } else if (typeof stackframe.columnNumber !== 'number' ||
            stackframe.columnNumber % 1 !== 0 ||
            stackframe.columnNumber < 0) {
            throw new TypeError('Given column number must be a non-negative integer');
        }
        return true;
    }

    function _findSourceMappingURL(source) {
        var sourceMappingUrlRegExp = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/mg;
        var lastSourceMappingUrl;
        var matchSourceMappingUrl;
        // eslint-disable-next-line no-cond-assign
        while (matchSourceMappingUrl = sourceMappingUrlRegExp.exec(source)) {
            lastSourceMappingUrl = matchSourceMappingUrl[1];
        }
        if (lastSourceMappingUrl) {
            return lastSourceMappingUrl;
        } else {
            throw new Error('sourceMappingURL not found');
        }
    }

    function _extractLocationInfoFromSourceMapSource(stackframe, sourceMapConsumer, sourceCache) {
        return new Promise(function(resolve, reject) {
            var loc = sourceMapConsumer.originalPositionFor({
                line: stackframe.lineNumber,
                column: stackframe.columnNumber
            });

            if (loc.source) {
                // cache mapped sources
                var mappedSource = sourceMapConsumer.sourceContentFor(loc.source);
                if (mappedSource) {
                    sourceCache[loc.source] = mappedSource;
                }

                resolve(
                    // given stackframe and source location, update stackframe
                    new StackFrame({
                        functionName: loc.name || stackframe.functionName,
                        args: stackframe.args,
                        fileName: loc.source,
                        lineNumber: loc.line,
                        columnNumber: loc.column
                    }));
            } else {
                reject(new Error('Could not get original source for given stackframe and source map'));
            }
        });
    }

    /**
     * @constructor
     * @param {Object} opts
     *      opts.sourceCache = {url: "Source String"} => preload source cache
     *      opts.sourceMapConsumerCache = {/path/file.js.map: SourceMapConsumer}
     *      opts.offline = True to prevent network requests.
     *              Best effort without sources or source maps.
     *      opts.ajax = Promise returning function to make X-Domain requests
     */
    return function StackTraceGPS(opts) {
        if (!(this instanceof StackTraceGPS)) {
            return new StackTraceGPS(opts);
        }
        opts = opts || {};

        this.sourceCache = opts.sourceCache || {};
        this.sourceMapConsumerCache = opts.sourceMapConsumerCache || {};

        this.ajax = opts.ajax || _xdr;

        this._atob = opts.atob || _atob;

        this._get = function _get(location) {
            return new Promise(function(resolve, reject) {
                var isDataUrl = location.substr(0, 5) === 'data:';
                if (this.sourceCache[location]) {
                    resolve(this.sourceCache[location]);
                } else if (opts.offline && !isDataUrl) {
                    reject(new Error('Cannot make network requests in offline mode'));
                } else {
                    if (isDataUrl) {
                        // data URLs can have parameters.
                        // see http://tools.ietf.org/html/rfc2397
                        var supportedEncodingRegexp =
                            /^data:application\/json;([\w=:"-]+;)*base64,/;
                        var match = location.match(supportedEncodingRegexp);
                        if (match) {
                            var sourceMapStart = match[0].length;
                            var encodedSource = location.substr(sourceMapStart);
                            var source = this._atob(encodedSource);
                            this.sourceCache[location] = source;
                            resolve(source);
                        } else {
                            reject(new Error('The encoding of the inline sourcemap is not supported'));
                        }
                    } else {
                        var xhrPromise = this.ajax(location, {method: 'get'});
                        // Cache the Promise to prevent duplicate in-flight requests
                        this.sourceCache[location] = xhrPromise;
                        xhrPromise.then(resolve, reject);
                    }
                }
            }.bind(this));
        };

        /**
         * Creating SourceMapConsumers is expensive, so this wraps the creation of a
         * SourceMapConsumer in a per-instance cache.
         *
         * @param {String} sourceMappingURL = URL to fetch source map from
         * @param {String} defaultSourceRoot = Default source root for source map if undefined
         * @returns {Promise} that resolves a SourceMapConsumer
         */
        this._getSourceMapConsumer = function _getSourceMapConsumer(sourceMappingURL, defaultSourceRoot) {
            return new Promise(function(resolve) {
                if (this.sourceMapConsumerCache[sourceMappingURL]) {
                    resolve(this.sourceMapConsumerCache[sourceMappingURL]);
                } else {
                    var sourceMapConsumerPromise = new Promise(function(resolve, reject) {
                        return this._get(sourceMappingURL).then(function(sourceMapSource) {
                            if (typeof sourceMapSource === 'string') {
                                sourceMapSource = _parseJson(sourceMapSource.replace(/^\)\]\}'/, ''));
                            }
                            if (typeof sourceMapSource.sourceRoot === 'undefined') {
                                sourceMapSource.sourceRoot = defaultSourceRoot;
                            }

                            resolve(new SourceMap.SourceMapConsumer(sourceMapSource));
                        }).catch(reject);
                    }.bind(this));
                    this.sourceMapConsumerCache[sourceMappingURL] = sourceMapConsumerPromise;
                    resolve(sourceMapConsumerPromise);
                }
            }.bind(this));
        };

        /**
         * Given a StackFrame, enhance function name and use source maps for a
         * better StackFrame.
         *
         * @param {StackFrame} stackframe object
         * @returns {Promise} that resolves with with source-mapped StackFrame
         */
        this.pinpoint = function StackTraceGPS$$pinpoint(stackframe) {
            return new Promise(function(resolve, reject) {
                this.getMappedLocation(stackframe).then(function(mappedStackFrame) {
                    function resolveMappedStackFrame() {
                        resolve(mappedStackFrame);
                    }

                    this.findFunctionName(mappedStackFrame)
                        .then(resolve, resolveMappedStackFrame)
                        // eslint-disable-next-line no-unexpected-multiline
                        ['catch'](resolveMappedStackFrame);
                }.bind(this), reject);
            }.bind(this));
        };

        /**
         * Given a StackFrame, guess function name from location information.
         *
         * @param {StackFrame} stackframe
         * @returns {Promise} that resolves with enhanced StackFrame.
         */
        this.findFunctionName = function StackTraceGPS$$findFunctionName(stackframe) {
            return new Promise(function(resolve, reject) {
                _ensureStackFrameIsLegit(stackframe);
                this._get(stackframe.fileName).then(function getSourceCallback(source) {
                    var lineNumber = stackframe.lineNumber;
                    var columnNumber = stackframe.columnNumber;
                    var guessedFunctionName = _findFunctionName(source, lineNumber, columnNumber);
                    // Only replace functionName if we found something
                    if (guessedFunctionName) {
                        resolve(new StackFrame({
                            functionName: guessedFunctionName,
                            args: stackframe.args,
                            fileName: stackframe.fileName,
                            lineNumber: lineNumber,
                            columnNumber: columnNumber
                        }));
                    } else {
                        resolve(stackframe);
                    }
                }, reject)['catch'](reject);
            }.bind(this));
        };

        /**
         * Given a StackFrame, seek source-mapped location and return new enhanced StackFrame.
         *
         * @param {StackFrame} stackframe
         * @returns {Promise} that resolves with enhanced StackFrame.
         */
        this.getMappedLocation = function StackTraceGPS$$getMappedLocation(stackframe) {
            return new Promise(function(resolve, reject) {
                _ensureSupportedEnvironment();
                _ensureStackFrameIsLegit(stackframe);

                var sourceCache = this.sourceCache;
                var fileName = stackframe.fileName;
                this._get(fileName).then(function(source) {
                    var sourceMappingURL = _findSourceMappingURL(source);
                    var isDataUrl = sourceMappingURL.substr(0, 5) === 'data:';
                    var defaultSourceRoot = fileName.substring(0, fileName.lastIndexOf('/') + 1);

                    if (sourceMappingURL[0] !== '/' && !isDataUrl && !(/^https?:\/\/|^\/\//i).test(sourceMappingURL)) {
                        sourceMappingURL = defaultSourceRoot + sourceMappingURL;
                    }

                    return this._getSourceMapConsumer(sourceMappingURL, defaultSourceRoot)
                        .then(function(sourceMapConsumer) {
                            return _extractLocationInfoFromSourceMapSource(stackframe, sourceMapConsumer, sourceCache)
                                .then(resolve)['catch'](function() {
                                    resolve(stackframe);
                                });
                        });
                }.bind(this), reject)['catch'](reject);
            }.bind(this));
        };
    };
}));


/***/ }),

/***/ 8139:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4263), __webpack_require__(8887), __webpack_require__(7885)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function StackTrace(ErrorStackParser, StackGenerator, StackTraceGPS) {
    var _options = {
        filter: function(stackframe) {
            // Filter out stackframes for this library by default
            return (stackframe.functionName || '').indexOf('StackTrace$$') === -1 &&
                (stackframe.functionName || '').indexOf('ErrorStackParser$$') === -1 &&
                (stackframe.functionName || '').indexOf('StackTraceGPS$$') === -1 &&
                (stackframe.functionName || '').indexOf('StackGenerator$$') === -1;
        },
        sourceCache: {}
    };

    var _generateError = function StackTrace$$GenerateError() {
        try {
            // Error must be thrown to get stack in IE
            throw new Error();
        } catch (err) {
            return err;
        }
    };

    /**
     * Merge 2 given Objects. If a conflict occurs the second object wins.
     * Does not do deep merges.
     *
     * @param {Object} first base object
     * @param {Object} second overrides
     * @returns {Object} merged first and second
     * @private
     */
    function _merge(first, second) {
        var target = {};

        [first, second].forEach(function(obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    target[prop] = obj[prop];
                }
            }
            return target;
        });

        return target;
    }

    function _isShapedLikeParsableError(err) {
        return err.stack || err['opera#sourceloc'];
    }

    function _filtered(stackframes, filter) {
        if (typeof filter === 'function') {
            return stackframes.filter(filter);
        }
        return stackframes;
    }

    return {
        /**
         * Get a backtrace from invocation point.
         *
         * @param {Object} opts
         * @returns {Array} of StackFrame
         */
        get: function StackTrace$$get(opts) {
            var err = _generateError();
            return _isShapedLikeParsableError(err) ? this.fromError(err, opts) : this.generateArtificially(opts);
        },

        /**
         * Get a backtrace from invocation point.
         * IMPORTANT: Does not handle source maps or guess function names!
         *
         * @param {Object} opts
         * @returns {Array} of StackFrame
         */
        getSync: function StackTrace$$getSync(opts) {
            opts = _merge(_options, opts);
            var err = _generateError();
            var stack = _isShapedLikeParsableError(err) ? ErrorStackParser.parse(err) : StackGenerator.backtrace(opts);
            return _filtered(stack, opts.filter);
        },

        /**
         * Given an error object, parse it.
         *
         * @param {Error} error object
         * @param {Object} opts
         * @returns {Promise} for Array[StackFrame}
         */
        fromError: function StackTrace$$fromError(error, opts) {
            opts = _merge(_options, opts);
            var gps = new StackTraceGPS(opts);
            return new Promise(function(resolve) {
                var stackframes = _filtered(ErrorStackParser.parse(error), opts.filter);
                resolve(Promise.all(stackframes.map(function(sf) {
                    return new Promise(function(resolve) {
                        function resolveOriginal() {
                            resolve(sf);
                        }

                        gps.pinpoint(sf).then(resolve, resolveOriginal)['catch'](resolveOriginal);
                    });
                })));
            }.bind(this));
        },

        /**
         * Use StackGenerator to generate a backtrace.
         *
         * @param {Object} opts
         * @returns {Promise} of Array[StackFrame]
         */
        generateArtificially: function StackTrace$$generateArtificially(opts) {
            opts = _merge(_options, opts);
            var stackFrames = StackGenerator.backtrace(opts);
            if (typeof opts.filter === 'function') {
                stackFrames = stackFrames.filter(opts.filter);
            }
            return Promise.resolve(stackFrames);
        },

        /**
         * Given a function, wrap it such that invocations trigger a callback that
         * is called with a stack trace.
         *
         * @param {Function} fn to be instrumented
         * @param {Function} callback function to call with a stack trace on invocation
         * @param {Function} errback optional function to call with error if unable to get stack trace.
         * @param {Object} thisArg optional context object (e.g. window)
         */
        instrument: function StackTrace$$instrument(fn, callback, errback, thisArg) {
            if (typeof fn !== 'function') {
                throw new Error('Cannot instrument non-function object');
            } else if (typeof fn.__stacktraceOriginalFn === 'function') {
                // Already instrumented, return given Function
                return fn;
            }

            var instrumented = function StackTrace$$instrumented() {
                try {
                    this.get().then(callback, errback)['catch'](errback);
                    return fn.apply(thisArg || this, arguments);
                } catch (e) {
                    if (_isShapedLikeParsableError(e)) {
                        this.fromError(e).then(callback, errback)['catch'](errback);
                    }
                    throw e;
                }
            }.bind(this);
            instrumented.__stacktraceOriginalFn = fn;

            return instrumented;
        },

        /**
         * Given a function that has been instrumented,
         * revert the function to it's original (non-instrumented) state.
         *
         * @param {Function} fn to de-instrument
         */
        deinstrument: function StackTrace$$deinstrument(fn) {
            if (typeof fn !== 'function') {
                throw new Error('Cannot de-instrument non-function object');
            } else if (typeof fn.__stacktraceOriginalFn === 'function') {
                return fn.__stacktraceOriginalFn;
            } else {
                // Function not instrumented, return original
                return fn;
            }
        },

        /**
         * Given an error message and Array of StackFrames, serialize and POST to given URL.
         *
         * @param {Array} stackframes
         * @param {String} url
         * @param {String} errorMsg
         * @param {Object} requestOptions
         */
        report: function StackTrace$$report(stackframes, url, errorMsg, requestOptions) {
            return new Promise(function(resolve, reject) {
                var req = new XMLHttpRequest();
                req.onerror = reject;
                req.onreadystatechange = function onreadystatechange() {
                    if (req.readyState === 4) {
                        if (req.status >= 200 && req.status < 400) {
                            resolve(req.responseText);
                        } else {
                            reject(new Error('POST to ' + url + ' failed with status: ' + req.status));
                        }
                    }
                };
                req.open('post', url);

                // Set request headers
                req.setRequestHeader('Content-Type', 'application/json');
                if (requestOptions && typeof requestOptions.headers === 'object') {
                    var headers = requestOptions.headers;
                    for (var header in headers) {
                        if (Object.prototype.hasOwnProperty.call(headers, header)) {
                            req.setRequestHeader(header, headers[header]);
                        }
                    }
                }

                var reportPayload = {stack: stackframes};
                if (errorMsg !== undefined && errorMsg !== null) {
                    reportPayload.message = errorMsg;
                }

                req.send(JSON.stringify(reportPayload));
            });
        }
    };
}));


/***/ }),

/***/ 8416:
/***/ ((module) => {

/* eslint-disable no-multi-assign */

function deepFreeze(obj) {
  if (obj instanceof Map) {
    obj.clear =
      obj.delete =
      obj.set =
        function () {
          throw new Error('map is read-only');
        };
  } else if (obj instanceof Set) {
    obj.add =
      obj.clear =
      obj.delete =
        function () {
          throw new Error('set is read-only');
        };
  }

  // Freeze self
  Object.freeze(obj);

  Object.getOwnPropertyNames(obj).forEach((name) => {
    const prop = obj[name];
    const type = typeof prop;

    // Freeze prop if it is an object or function and also not already frozen
    if ((type === 'object' || type === 'function') && !Object.isFrozen(prop)) {
      deepFreeze(prop);
    }
  });

  return obj;
}

/** @typedef {import('highlight.js').CallbackResponse} CallbackResponse */
/** @typedef {import('highlight.js').CompiledMode} CompiledMode */
/** @implements CallbackResponse */

class Response {
  /**
   * @param {CompiledMode} mode
   */
  constructor(mode) {
    // eslint-disable-next-line no-undefined
    if (mode.data === undefined) mode.data = {};

    this.data = mode.data;
    this.isMatchIgnored = false;
  }

  ignoreMatch() {
    this.isMatchIgnored = true;
  }
}

/**
 * @param {string} value
 * @returns {string}
 */
function escapeHTML(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * performs a shallow merge of multiple objects into one
 *
 * @template T
 * @param {T} original
 * @param {Record<string,any>[]} objects
 * @returns {T} a single new object
 */
function inherit$1(original, ...objects) {
  /** @type Record<string,any> */
  const result = Object.create(null);

  for (const key in original) {
    result[key] = original[key];
  }
  objects.forEach(function(obj) {
    for (const key in obj) {
      result[key] = obj[key];
    }
  });
  return /** @type {T} */ (result);
}

/**
 * @typedef {object} Renderer
 * @property {(text: string) => void} addText
 * @property {(node: Node) => void} openNode
 * @property {(node: Node) => void} closeNode
 * @property {() => string} value
 */

/** @typedef {{scope?: string, language?: string, sublanguage?: boolean}} Node */
/** @typedef {{walk: (r: Renderer) => void}} Tree */
/** */

const SPAN_CLOSE = '</span>';

/**
 * Determines if a node needs to be wrapped in <span>
 *
 * @param {Node} node */
const emitsWrappingTags = (node) => {
  // rarely we can have a sublanguage where language is undefined
  // TODO: track down why
  return !!node.scope;
};

/**
 *
 * @param {string} name
 * @param {{prefix:string}} options
 */
const scopeToCSSClass = (name, { prefix }) => {
  // sub-language
  if (name.startsWith("language:")) {
    return name.replace("language:", "language-");
  }
  // tiered scope: comment.line
  if (name.includes(".")) {
    const pieces = name.split(".");
    return [
      `${prefix}${pieces.shift()}`,
      ...(pieces.map((x, i) => `${x}${"_".repeat(i + 1)}`))
    ].join(" ");
  }
  // simple scope
  return `${prefix}${name}`;
};

/** @type {Renderer} */
class HTMLRenderer {
  /**
   * Creates a new HTMLRenderer
   *
   * @param {Tree} parseTree - the parse tree (must support `walk` API)
   * @param {{classPrefix: string}} options
   */
  constructor(parseTree, options) {
    this.buffer = "";
    this.classPrefix = options.classPrefix;
    parseTree.walk(this);
  }

  /**
   * Adds texts to the output stream
   *
   * @param {string} text */
  addText(text) {
    this.buffer += escapeHTML(text);
  }

  /**
   * Adds a node open to the output stream (if needed)
   *
   * @param {Node} node */
  openNode(node) {
    if (!emitsWrappingTags(node)) return;

    const className = scopeToCSSClass(node.scope,
      { prefix: this.classPrefix });
    this.span(className);
  }

  /**
   * Adds a node close to the output stream (if needed)
   *
   * @param {Node} node */
  closeNode(node) {
    if (!emitsWrappingTags(node)) return;

    this.buffer += SPAN_CLOSE;
  }

  /**
   * returns the accumulated buffer
  */
  value() {
    return this.buffer;
  }

  // helpers

  /**
   * Builds a span element
   *
   * @param {string} className */
  span(className) {
    this.buffer += `<span class="${className}">`;
  }
}

/** @typedef {{scope?: string, language?: string, children: Node[]} | string} Node */
/** @typedef {{scope?: string, language?: string, children: Node[]} } DataNode */
/** @typedef {import('highlight.js').Emitter} Emitter */
/**  */

/** @returns {DataNode} */
const newNode = (opts = {}) => {
  /** @type DataNode */
  const result = { children: [] };
  Object.assign(result, opts);
  return result;
};

class TokenTree {
  constructor() {
    /** @type DataNode */
    this.rootNode = newNode();
    this.stack = [this.rootNode];
  }

  get top() {
    return this.stack[this.stack.length - 1];
  }

  get root() { return this.rootNode; }

  /** @param {Node} node */
  add(node) {
    this.top.children.push(node);
  }

  /** @param {string} scope */
  openNode(scope) {
    /** @type Node */
    const node = newNode({ scope });
    this.add(node);
    this.stack.push(node);
  }

  closeNode() {
    if (this.stack.length > 1) {
      return this.stack.pop();
    }
    // eslint-disable-next-line no-undefined
    return undefined;
  }

  closeAllNodes() {
    while (this.closeNode());
  }

  toJSON() {
    return JSON.stringify(this.rootNode, null, 4);
  }

  /**
   * @typedef { import("./html_renderer").Renderer } Renderer
   * @param {Renderer} builder
   */
  walk(builder) {
    // this does not
    return this.constructor._walk(builder, this.rootNode);
    // this works
    // return TokenTree._walk(builder, this.rootNode);
  }

  /**
   * @param {Renderer} builder
   * @param {Node} node
   */
  static _walk(builder, node) {
    if (typeof node === "string") {
      builder.addText(node);
    } else if (node.children) {
      builder.openNode(node);
      node.children.forEach((child) => this._walk(builder, child));
      builder.closeNode(node);
    }
    return builder;
  }

  /**
   * @param {Node} node
   */
  static _collapse(node) {
    if (typeof node === "string") return;
    if (!node.children) return;

    if (node.children.every(el => typeof el === "string")) {
      // node.text = node.children.join("");
      // delete node.children;
      node.children = [node.children.join("")];
    } else {
      node.children.forEach((child) => {
        TokenTree._collapse(child);
      });
    }
  }
}

/**
  Currently this is all private API, but this is the minimal API necessary
  that an Emitter must implement to fully support the parser.

  Minimal interface:

  - addText(text)
  - __addSublanguage(emitter, subLanguageName)
  - startScope(scope)
  - endScope()
  - finalize()
  - toHTML()

*/

/**
 * @implements {Emitter}
 */
class TokenTreeEmitter extends TokenTree {
  /**
   * @param {*} options
   */
  constructor(options) {
    super();
    this.options = options;
  }

  /**
   * @param {string} text
   */
  addText(text) {
    if (text === "") { return; }

    this.add(text);
  }

  /** @param {string} scope */
  startScope(scope) {
    this.openNode(scope);
  }

  endScope() {
    this.closeNode();
  }

  /**
   * @param {Emitter & {root: DataNode}} emitter
   * @param {string} name
   */
  __addSublanguage(emitter, name) {
    /** @type DataNode */
    const node = emitter.root;
    if (name) node.scope = `language:${name}`;

    this.add(node);
  }

  toHTML() {
    const renderer = new HTMLRenderer(this, this.options);
    return renderer.value();
  }

  finalize() {
    this.closeAllNodes();
    return true;
  }
}

/**
 * @param {string} value
 * @returns {RegExp}
 * */

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function source(re) {
  if (!re) return null;
  if (typeof re === "string") return re;

  return re.source;
}

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function lookahead(re) {
  return concat('(?=', re, ')');
}

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function anyNumberOfTimes(re) {
  return concat('(?:', re, ')*');
}

/**
 * @param {RegExp | string } re
 * @returns {string}
 */
function optional(re) {
  return concat('(?:', re, ')?');
}

/**
 * @param {...(RegExp | string) } args
 * @returns {string}
 */
function concat(...args) {
  const joined = args.map((x) => source(x)).join("");
  return joined;
}

/**
 * @param { Array<string | RegExp | Object> } args
 * @returns {object}
 */
function stripOptionsFromArgs(args) {
  const opts = args[args.length - 1];

  if (typeof opts === 'object' && opts.constructor === Object) {
    args.splice(args.length - 1, 1);
    return opts;
  } else {
    return {};
  }
}

/** @typedef { {capture?: boolean} } RegexEitherOptions */

/**
 * Any of the passed expresssions may match
 *
 * Creates a huge this | this | that | that match
 * @param {(RegExp | string)[] | [...(RegExp | string)[], RegexEitherOptions]} args
 * @returns {string}
 */
function either(...args) {
  /** @type { object & {capture?: boolean} }  */
  const opts = stripOptionsFromArgs(args);
  const joined = '('
    + (opts.capture ? "" : "?:")
    + args.map((x) => source(x)).join("|") + ")";
  return joined;
}

/**
 * @param {RegExp | string} re
 * @returns {number}
 */
function countMatchGroups(re) {
  return (new RegExp(re.toString() + '|')).exec('').length - 1;
}

/**
 * Does lexeme start with a regular expression match at the beginning
 * @param {RegExp} re
 * @param {string} lexeme
 */
function startsWith(re, lexeme) {
  const match = re && re.exec(lexeme);
  return match && match.index === 0;
}

// BACKREF_RE matches an open parenthesis or backreference. To avoid
// an incorrect parse, it additionally matches the following:
// - [...] elements, where the meaning of parentheses and escapes change
// - other escape sequences, so we do not misparse escape sequences as
//   interesting elements
// - non-matching or lookahead parentheses, which do not capture. These
//   follow the '(' with a '?'.
const BACKREF_RE = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;

// **INTERNAL** Not intended for outside usage
// join logically computes regexps.join(separator), but fixes the
// backreferences so they continue to match.
// it also places each individual regular expression into it's own
// match group, keeping track of the sequencing of those match groups
// is currently an exercise for the caller. :-)
/**
 * @param {(string | RegExp)[]} regexps
 * @param {{joinWith: string}} opts
 * @returns {string}
 */
function _rewriteBackreferences(regexps, { joinWith }) {
  let numCaptures = 0;

  return regexps.map((regex) => {
    numCaptures += 1;
    const offset = numCaptures;
    let re = source(regex);
    let out = '';

    while (re.length > 0) {
      const match = BACKREF_RE.exec(re);
      if (!match) {
        out += re;
        break;
      }
      out += re.substring(0, match.index);
      re = re.substring(match.index + match[0].length);
      if (match[0][0] === '\\' && match[1]) {
        // Adjust the backreference.
        out += '\\' + String(Number(match[1]) + offset);
      } else {
        out += match[0];
        if (match[0] === '(') {
          numCaptures++;
        }
      }
    }
    return out;
  }).map(re => `(${re})`).join(joinWith);
}

/** @typedef {import('highlight.js').Mode} Mode */
/** @typedef {import('highlight.js').ModeCallback} ModeCallback */

// Common regexps
const MATCH_NOTHING_RE = /\b\B/;
const IDENT_RE = '[a-zA-Z]\\w*';
const UNDERSCORE_IDENT_RE = '[a-zA-Z_]\\w*';
const NUMBER_RE = '\\b\\d+(\\.\\d+)?';
const C_NUMBER_RE = '(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
const BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
const RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

/**
* @param { Partial<Mode> & {binary?: string | RegExp} } opts
*/
const SHEBANG = (opts = {}) => {
  const beginShebang = /^#![ ]*\//;
  if (opts.binary) {
    opts.begin = concat(
      beginShebang,
      /.*\b/,
      opts.binary,
      /\b.*/);
  }
  return inherit$1({
    scope: 'meta',
    begin: beginShebang,
    end: /$/,
    relevance: 0,
    /** @type {ModeCallback} */
    "on:begin": (m, resp) => {
      if (m.index !== 0) resp.ignoreMatch();
    }
  }, opts);
};

// Common modes
const BACKSLASH_ESCAPE = {
  begin: '\\\\[\\s\\S]', relevance: 0
};
const APOS_STRING_MODE = {
  scope: 'string',
  begin: '\'',
  end: '\'',
  illegal: '\\n',
  contains: [BACKSLASH_ESCAPE]
};
const QUOTE_STRING_MODE = {
  scope: 'string',
  begin: '"',
  end: '"',
  illegal: '\\n',
  contains: [BACKSLASH_ESCAPE]
};
const PHRASAL_WORDS_MODE = {
  begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
};
/**
 * Creates a comment mode
 *
 * @param {string | RegExp} begin
 * @param {string | RegExp} end
 * @param {Mode | {}} [modeOptions]
 * @returns {Partial<Mode>}
 */
const COMMENT = function(begin, end, modeOptions = {}) {
  const mode = inherit$1(
    {
      scope: 'comment',
      begin,
      end,
      contains: []
    },
    modeOptions
  );
  mode.contains.push({
    scope: 'doctag',
    // hack to avoid the space from being included. the space is necessary to
    // match here to prevent the plain text rule below from gobbling up doctags
    begin: '[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)',
    end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
    excludeBegin: true,
    relevance: 0
  });
  const ENGLISH_WORD = either(
    // list of common 1 and 2 letter words in English
    "I",
    "a",
    "is",
    "so",
    "us",
    "to",
    "at",
    "if",
    "in",
    "it",
    "on",
    // note: this is not an exhaustive list of contractions, just popular ones
    /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, // contractions - can't we'd they're let's, etc
    /[A-Za-z]+[-][a-z]+/, // `no-way`, etc.
    /[A-Za-z][a-z]{2,}/ // allow capitalized words at beginning of sentences
  );
  // looking like plain text, more likely to be a comment
  mode.contains.push(
    {
      // TODO: how to include ", (, ) without breaking grammars that use these for
      // comment delimiters?
      // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
      // ---

      // this tries to find sequences of 3 english words in a row (without any
      // "programming" type syntax) this gives us a strong signal that we've
      // TRULY found a comment - vs perhaps scanning with the wrong language.
      // It's possible to find something that LOOKS like the start of the
      // comment - but then if there is no readable text - good chance it is a
      // false match and not a comment.
      //
      // for a visual example please see:
      // https://github.com/highlightjs/highlight.js/issues/2827

      begin: concat(
        /[ ]+/, // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
        '(',
        ENGLISH_WORD,
        /[.]?[:]?([.][ ]|[ ])/,
        '){3}') // look for 3 words in a row
    }
  );
  return mode;
};
const C_LINE_COMMENT_MODE = COMMENT('//', '$');
const C_BLOCK_COMMENT_MODE = COMMENT('/\\*', '\\*/');
const HASH_COMMENT_MODE = COMMENT('#', '$');
const NUMBER_MODE = {
  scope: 'number',
  begin: NUMBER_RE,
  relevance: 0
};
const C_NUMBER_MODE = {
  scope: 'number',
  begin: C_NUMBER_RE,
  relevance: 0
};
const BINARY_NUMBER_MODE = {
  scope: 'number',
  begin: BINARY_NUMBER_RE,
  relevance: 0
};
const REGEXP_MODE = {
  scope: "regexp",
  begin: /\/(?=[^/\n]*\/)/,
  end: /\/[gimuy]*/,
  contains: [
    BACKSLASH_ESCAPE,
    {
      begin: /\[/,
      end: /\]/,
      relevance: 0,
      contains: [BACKSLASH_ESCAPE]
    }
  ]
};
const TITLE_MODE = {
  scope: 'title',
  begin: IDENT_RE,
  relevance: 0
};
const UNDERSCORE_TITLE_MODE = {
  scope: 'title',
  begin: UNDERSCORE_IDENT_RE,
  relevance: 0
};
const METHOD_GUARD = {
  // excludes method names from keyword processing
  begin: '\\.\\s*' + UNDERSCORE_IDENT_RE,
  relevance: 0
};

/**
 * Adds end same as begin mechanics to a mode
 *
 * Your mode must include at least a single () match group as that first match
 * group is what is used for comparison
 * @param {Partial<Mode>} mode
 */
const END_SAME_AS_BEGIN = function(mode) {
  return Object.assign(mode,
    {
      /** @type {ModeCallback} */
      'on:begin': (m, resp) => { resp.data._beginMatch = m[1]; },
      /** @type {ModeCallback} */
      'on:end': (m, resp) => { if (resp.data._beginMatch !== m[1]) resp.ignoreMatch(); }
    });
};

var MODES = /*#__PURE__*/Object.freeze({
  __proto__: null,
  APOS_STRING_MODE: APOS_STRING_MODE,
  BACKSLASH_ESCAPE: BACKSLASH_ESCAPE,
  BINARY_NUMBER_MODE: BINARY_NUMBER_MODE,
  BINARY_NUMBER_RE: BINARY_NUMBER_RE,
  COMMENT: COMMENT,
  C_BLOCK_COMMENT_MODE: C_BLOCK_COMMENT_MODE,
  C_LINE_COMMENT_MODE: C_LINE_COMMENT_MODE,
  C_NUMBER_MODE: C_NUMBER_MODE,
  C_NUMBER_RE: C_NUMBER_RE,
  END_SAME_AS_BEGIN: END_SAME_AS_BEGIN,
  HASH_COMMENT_MODE: HASH_COMMENT_MODE,
  IDENT_RE: IDENT_RE,
  MATCH_NOTHING_RE: MATCH_NOTHING_RE,
  METHOD_GUARD: METHOD_GUARD,
  NUMBER_MODE: NUMBER_MODE,
  NUMBER_RE: NUMBER_RE,
  PHRASAL_WORDS_MODE: PHRASAL_WORDS_MODE,
  QUOTE_STRING_MODE: QUOTE_STRING_MODE,
  REGEXP_MODE: REGEXP_MODE,
  RE_STARTERS_RE: RE_STARTERS_RE,
  SHEBANG: SHEBANG,
  TITLE_MODE: TITLE_MODE,
  UNDERSCORE_IDENT_RE: UNDERSCORE_IDENT_RE,
  UNDERSCORE_TITLE_MODE: UNDERSCORE_TITLE_MODE
});

/**
@typedef {import('highlight.js').CallbackResponse} CallbackResponse
@typedef {import('highlight.js').CompilerExt} CompilerExt
*/

// Grammar extensions / plugins
// See: https://github.com/highlightjs/highlight.js/issues/2833

// Grammar extensions allow "syntactic sugar" to be added to the grammar modes
// without requiring any underlying changes to the compiler internals.

// `compileMatch` being the perfect small example of now allowing a grammar
// author to write `match` when they desire to match a single expression rather
// than being forced to use `begin`.  The extension then just moves `match` into
// `begin` when it runs.  Ie, no features have been added, but we've just made
// the experience of writing (and reading grammars) a little bit nicer.

// ------

// TODO: We need negative look-behind support to do this properly
/**
 * Skip a match if it has a preceding dot
 *
 * This is used for `beginKeywords` to prevent matching expressions such as
 * `bob.keyword.do()`. The mode compiler automatically wires this up as a
 * special _internal_ 'on:begin' callback for modes with `beginKeywords`
 * @param {RegExpMatchArray} match
 * @param {CallbackResponse} response
 */
function skipIfHasPrecedingDot(match, response) {
  const before = match.input[match.index - 1];
  if (before === ".") {
    response.ignoreMatch();
  }
}

/**
 *
 * @type {CompilerExt}
 */
function scopeClassName(mode, _parent) {
  // eslint-disable-next-line no-undefined
  if (mode.className !== undefined) {
    mode.scope = mode.className;
    delete mode.className;
  }
}

/**
 * `beginKeywords` syntactic sugar
 * @type {CompilerExt}
 */
function beginKeywords(mode, parent) {
  if (!parent) return;
  if (!mode.beginKeywords) return;

  // for languages with keywords that include non-word characters checking for
  // a word boundary is not sufficient, so instead we check for a word boundary
  // or whitespace - this does no harm in any case since our keyword engine
  // doesn't allow spaces in keywords anyways and we still check for the boundary
  // first
  mode.begin = '\\b(' + mode.beginKeywords.split(' ').join('|') + ')(?!\\.)(?=\\b|\\s)';
  mode.__beforeBegin = skipIfHasPrecedingDot;
  mode.keywords = mode.keywords || mode.beginKeywords;
  delete mode.beginKeywords;

  // prevents double relevance, the keywords themselves provide
  // relevance, the mode doesn't need to double it
  // eslint-disable-next-line no-undefined
  if (mode.relevance === undefined) mode.relevance = 0;
}

/**
 * Allow `illegal` to contain an array of illegal values
 * @type {CompilerExt}
 */
function compileIllegal(mode, _parent) {
  if (!Array.isArray(mode.illegal)) return;

  mode.illegal = either(...mode.illegal);
}

/**
 * `match` to match a single expression for readability
 * @type {CompilerExt}
 */
function compileMatch(mode, _parent) {
  if (!mode.match) return;
  if (mode.begin || mode.end) throw new Error("begin & end are not supported with match");

  mode.begin = mode.match;
  delete mode.match;
}

/**
 * provides the default 1 relevance to all modes
 * @type {CompilerExt}
 */
function compileRelevance(mode, _parent) {
  // eslint-disable-next-line no-undefined
  if (mode.relevance === undefined) mode.relevance = 1;
}

// allow beforeMatch to act as a "qualifier" for the match
// the full match begin must be [beforeMatch][begin]
const beforeMatchExt = (mode, parent) => {
  if (!mode.beforeMatch) return;
  // starts conflicts with endsParent which we need to make sure the child
  // rule is not matched multiple times
  if (mode.starts) throw new Error("beforeMatch cannot be used with starts");

  const originalMode = Object.assign({}, mode);
  Object.keys(mode).forEach((key) => { delete mode[key]; });

  mode.keywords = originalMode.keywords;
  mode.begin = concat(originalMode.beforeMatch, lookahead(originalMode.begin));
  mode.starts = {
    relevance: 0,
    contains: [
      Object.assign(originalMode, { endsParent: true })
    ]
  };
  mode.relevance = 0;

  delete originalMode.beforeMatch;
};

// keywords that should have no default relevance value
const COMMON_KEYWORDS = [
  'of',
  'and',
  'for',
  'in',
  'not',
  'or',
  'if',
  'then',
  'parent', // common variable name
  'list', // common variable name
  'value' // common variable name
];

const DEFAULT_KEYWORD_SCOPE = "keyword";

/**
 * Given raw keywords from a language definition, compile them.
 *
 * @param {string | Record<string,string|string[]> | Array<string>} rawKeywords
 * @param {boolean} caseInsensitive
 */
function compileKeywords(rawKeywords, caseInsensitive, scopeName = DEFAULT_KEYWORD_SCOPE) {
  /** @type {import("highlight.js/private").KeywordDict} */
  const compiledKeywords = Object.create(null);

  // input can be a string of keywords, an array of keywords, or a object with
  // named keys representing scopeName (which can then point to a string or array)
  if (typeof rawKeywords === 'string') {
    compileList(scopeName, rawKeywords.split(" "));
  } else if (Array.isArray(rawKeywords)) {
    compileList(scopeName, rawKeywords);
  } else {
    Object.keys(rawKeywords).forEach(function(scopeName) {
      // collapse all our objects back into the parent object
      Object.assign(
        compiledKeywords,
        compileKeywords(rawKeywords[scopeName], caseInsensitive, scopeName)
      );
    });
  }
  return compiledKeywords;

  // ---

  /**
   * Compiles an individual list of keywords
   *
   * Ex: "for if when while|5"
   *
   * @param {string} scopeName
   * @param {Array<string>} keywordList
   */
  function compileList(scopeName, keywordList) {
    if (caseInsensitive) {
      keywordList = keywordList.map(x => x.toLowerCase());
    }
    keywordList.forEach(function(keyword) {
      const pair = keyword.split('|');
      compiledKeywords[pair[0]] = [scopeName, scoreForKeyword(pair[0], pair[1])];
    });
  }
}

/**
 * Returns the proper score for a given keyword
 *
 * Also takes into account comment keywords, which will be scored 0 UNLESS
 * another score has been manually assigned.
 * @param {string} keyword
 * @param {string} [providedScore]
 */
function scoreForKeyword(keyword, providedScore) {
  // manual scores always win over common keywords
  // so you can force a score of 1 if you really insist
  if (providedScore) {
    return Number(providedScore);
  }

  return commonKeyword(keyword) ? 0 : 1;
}

/**
 * Determines if a given keyword is common or not
 *
 * @param {string} keyword */
function commonKeyword(keyword) {
  return COMMON_KEYWORDS.includes(keyword.toLowerCase());
}

/*

For the reasoning behind this please see:
https://github.com/highlightjs/highlight.js/issues/2880#issuecomment-747275419

*/

/**
 * @type {Record<string, boolean>}
 */
const seenDeprecations = {};

/**
 * @param {string} message
 */
const error = (message) => {
  console.error(message);
};

/**
 * @param {string} message
 * @param {any} args
 */
const warn = (message, ...args) => {
  console.log(`WARN: ${message}`, ...args);
};

/**
 * @param {string} version
 * @param {string} message
 */
const deprecated = (version, message) => {
  if (seenDeprecations[`${version}/${message}`]) return;

  console.log(`Deprecated as of ${version}. ${message}`);
  seenDeprecations[`${version}/${message}`] = true;
};

/* eslint-disable no-throw-literal */

/**
@typedef {import('highlight.js').CompiledMode} CompiledMode
*/

const MultiClassError = new Error();

/**
 * Renumbers labeled scope names to account for additional inner match
 * groups that otherwise would break everything.
 *
 * Lets say we 3 match scopes:
 *
 *   { 1 => ..., 2 => ..., 3 => ... }
 *
 * So what we need is a clean match like this:
 *
 *   (a)(b)(c) => [ "a", "b", "c" ]
 *
 * But this falls apart with inner match groups:
 *
 * (a)(((b)))(c) => ["a", "b", "b", "b", "c" ]
 *
 * Our scopes are now "out of alignment" and we're repeating `b` 3 times.
 * What needs to happen is the numbers are remapped:
 *
 *   { 1 => ..., 2 => ..., 5 => ... }
 *
 * We also need to know that the ONLY groups that should be output
 * are 1, 2, and 5.  This function handles this behavior.
 *
 * @param {CompiledMode} mode
 * @param {Array<RegExp | string>} regexes
 * @param {{key: "beginScope"|"endScope"}} opts
 */
function remapScopeNames(mode, regexes, { key }) {
  let offset = 0;
  const scopeNames = mode[key];
  /** @type Record<number,boolean> */
  const emit = {};
  /** @type Record<number,string> */
  const positions = {};

  for (let i = 1; i <= regexes.length; i++) {
    positions[i + offset] = scopeNames[i];
    emit[i + offset] = true;
    offset += countMatchGroups(regexes[i - 1]);
  }
  // we use _emit to keep track of which match groups are "top-level" to avoid double
  // output from inside match groups
  mode[key] = positions;
  mode[key]._emit = emit;
  mode[key]._multi = true;
}

/**
 * @param {CompiledMode} mode
 */
function beginMultiClass(mode) {
  if (!Array.isArray(mode.begin)) return;

  if (mode.skip || mode.excludeBegin || mode.returnBegin) {
    error("skip, excludeBegin, returnBegin not compatible with beginScope: {}");
    throw MultiClassError;
  }

  if (typeof mode.beginScope !== "object" || mode.beginScope === null) {
    error("beginScope must be object");
    throw MultiClassError;
  }

  remapScopeNames(mode, mode.begin, { key: "beginScope" });
  mode.begin = _rewriteBackreferences(mode.begin, { joinWith: "" });
}

/**
 * @param {CompiledMode} mode
 */
function endMultiClass(mode) {
  if (!Array.isArray(mode.end)) return;

  if (mode.skip || mode.excludeEnd || mode.returnEnd) {
    error("skip, excludeEnd, returnEnd not compatible with endScope: {}");
    throw MultiClassError;
  }

  if (typeof mode.endScope !== "object" || mode.endScope === null) {
    error("endScope must be object");
    throw MultiClassError;
  }

  remapScopeNames(mode, mode.end, { key: "endScope" });
  mode.end = _rewriteBackreferences(mode.end, { joinWith: "" });
}

/**
 * this exists only to allow `scope: {}` to be used beside `match:`
 * Otherwise `beginScope` would necessary and that would look weird

  {
    match: [ /def/, /\w+/ ]
    scope: { 1: "keyword" , 2: "title" }
  }

 * @param {CompiledMode} mode
 */
function scopeSugar(mode) {
  if (mode.scope && typeof mode.scope === "object" && mode.scope !== null) {
    mode.beginScope = mode.scope;
    delete mode.scope;
  }
}

/**
 * @param {CompiledMode} mode
 */
function MultiClass(mode) {
  scopeSugar(mode);

  if (typeof mode.beginScope === "string") {
    mode.beginScope = { _wrap: mode.beginScope };
  }
  if (typeof mode.endScope === "string") {
    mode.endScope = { _wrap: mode.endScope };
  }

  beginMultiClass(mode);
  endMultiClass(mode);
}

/**
@typedef {import('highlight.js').Mode} Mode
@typedef {import('highlight.js').CompiledMode} CompiledMode
@typedef {import('highlight.js').Language} Language
@typedef {import('highlight.js').HLJSPlugin} HLJSPlugin
@typedef {import('highlight.js').CompiledLanguage} CompiledLanguage
*/

// compilation

/**
 * Compiles a language definition result
 *
 * Given the raw result of a language definition (Language), compiles this so
 * that it is ready for highlighting code.
 * @param {Language} language
 * @returns {CompiledLanguage}
 */
function compileLanguage(language) {
  /**
   * Builds a regex with the case sensitivity of the current language
   *
   * @param {RegExp | string} value
   * @param {boolean} [global]
   */
  function langRe(value, global) {
    return new RegExp(
      source(value),
      'm'
      + (language.case_insensitive ? 'i' : '')
      + (language.unicodeRegex ? 'u' : '')
      + (global ? 'g' : '')
    );
  }

  /**
    Stores multiple regular expressions and allows you to quickly search for
    them all in a string simultaneously - returning the first match.  It does
    this by creating a huge (a|b|c) regex - each individual item wrapped with ()
    and joined by `|` - using match groups to track position.  When a match is
    found checking which position in the array has content allows us to figure
    out which of the original regexes / match groups triggered the match.

    The match object itself (the result of `Regex.exec`) is returned but also
    enhanced by merging in any meta-data that was registered with the regex.
    This is how we keep track of which mode matched, and what type of rule
    (`illegal`, `begin`, end, etc).
  */
  class MultiRegex {
    constructor() {
      this.matchIndexes = {};
      // @ts-ignore
      this.regexes = [];
      this.matchAt = 1;
      this.position = 0;
    }

    // @ts-ignore
    addRule(re, opts) {
      opts.position = this.position++;
      // @ts-ignore
      this.matchIndexes[this.matchAt] = opts;
      this.regexes.push([opts, re]);
      this.matchAt += countMatchGroups(re) + 1;
    }

    compile() {
      if (this.regexes.length === 0) {
        // avoids the need to check length every time exec is called
        // @ts-ignore
        this.exec = () => null;
      }
      const terminators = this.regexes.map(el => el[1]);
      this.matcherRe = langRe(_rewriteBackreferences(terminators, { joinWith: '|' }), true);
      this.lastIndex = 0;
    }

    /** @param {string} s */
    exec(s) {
      this.matcherRe.lastIndex = this.lastIndex;
      const match = this.matcherRe.exec(s);
      if (!match) { return null; }

      // eslint-disable-next-line no-undefined
      const i = match.findIndex((el, i) => i > 0 && el !== undefined);
      // @ts-ignore
      const matchData = this.matchIndexes[i];
      // trim off any earlier non-relevant match groups (ie, the other regex
      // match groups that make up the multi-matcher)
      match.splice(0, i);

      return Object.assign(match, matchData);
    }
  }

  /*
    Created to solve the key deficiently with MultiRegex - there is no way to
    test for multiple matches at a single location.  Why would we need to do
    that?  In the future a more dynamic engine will allow certain matches to be
    ignored.  An example: if we matched say the 3rd regex in a large group but
    decided to ignore it - we'd need to started testing again at the 4th
    regex... but MultiRegex itself gives us no real way to do that.

    So what this class creates MultiRegexs on the fly for whatever search
    position they are needed.

    NOTE: These additional MultiRegex objects are created dynamically.  For most
    grammars most of the time we will never actually need anything more than the
    first MultiRegex - so this shouldn't have too much overhead.

    Say this is our search group, and we match regex3, but wish to ignore it.

      regex1 | regex2 | regex3 | regex4 | regex5    ' ie, startAt = 0

    What we need is a new MultiRegex that only includes the remaining
    possibilities:

      regex4 | regex5                               ' ie, startAt = 3

    This class wraps all that complexity up in a simple API... `startAt` decides
    where in the array of expressions to start doing the matching. It
    auto-increments, so if a match is found at position 2, then startAt will be
    set to 3.  If the end is reached startAt will return to 0.

    MOST of the time the parser will be setting startAt manually to 0.
  */
  class ResumableMultiRegex {
    constructor() {
      // @ts-ignore
      this.rules = [];
      // @ts-ignore
      this.multiRegexes = [];
      this.count = 0;

      this.lastIndex = 0;
      this.regexIndex = 0;
    }

    // @ts-ignore
    getMatcher(index) {
      if (this.multiRegexes[index]) return this.multiRegexes[index];

      const matcher = new MultiRegex();
      this.rules.slice(index).forEach(([re, opts]) => matcher.addRule(re, opts));
      matcher.compile();
      this.multiRegexes[index] = matcher;
      return matcher;
    }

    resumingScanAtSamePosition() {
      return this.regexIndex !== 0;
    }

    considerAll() {
      this.regexIndex = 0;
    }

    // @ts-ignore
    addRule(re, opts) {
      this.rules.push([re, opts]);
      if (opts.type === "begin") this.count++;
    }

    /** @param {string} s */
    exec(s) {
      const m = this.getMatcher(this.regexIndex);
      m.lastIndex = this.lastIndex;
      let result = m.exec(s);

      // The following is because we have no easy way to say "resume scanning at the
      // existing position but also skip the current rule ONLY". What happens is
      // all prior rules are also skipped which can result in matching the wrong
      // thing. Example of matching "booger":

      // our matcher is [string, "booger", number]
      //
      // ....booger....

      // if "booger" is ignored then we'd really need a regex to scan from the
      // SAME position for only: [string, number] but ignoring "booger" (if it
      // was the first match), a simple resume would scan ahead who knows how
      // far looking only for "number", ignoring potential string matches (or
      // future "booger" matches that might be valid.)

      // So what we do: We execute two matchers, one resuming at the same
      // position, but the second full matcher starting at the position after:

      //     /--- resume first regex match here (for [number])
      //     |/---- full match here for [string, "booger", number]
      //     vv
      // ....booger....

      // Which ever results in a match first is then used. So this 3-4 step
      // process essentially allows us to say "match at this position, excluding
      // a prior rule that was ignored".
      //
      // 1. Match "booger" first, ignore. Also proves that [string] does non match.
      // 2. Resume matching for [number]
      // 3. Match at index + 1 for [string, "booger", number]
      // 4. If #2 and #3 result in matches, which came first?
      if (this.resumingScanAtSamePosition()) {
        if (result && result.index === this.lastIndex) ; else { // use the second matcher result
          const m2 = this.getMatcher(0);
          m2.lastIndex = this.lastIndex + 1;
          result = m2.exec(s);
        }
      }

      if (result) {
        this.regexIndex += result.position + 1;
        if (this.regexIndex === this.count) {
          // wrap-around to considering all matches again
          this.considerAll();
        }
      }

      return result;
    }
  }

  /**
   * Given a mode, builds a huge ResumableMultiRegex that can be used to walk
   * the content and find matches.
   *
   * @param {CompiledMode} mode
   * @returns {ResumableMultiRegex}
   */
  function buildModeRegex(mode) {
    const mm = new ResumableMultiRegex();

    mode.contains.forEach(term => mm.addRule(term.begin, { rule: term, type: "begin" }));

    if (mode.terminatorEnd) {
      mm.addRule(mode.terminatorEnd, { type: "end" });
    }
    if (mode.illegal) {
      mm.addRule(mode.illegal, { type: "illegal" });
    }

    return mm;
  }

  /** skip vs abort vs ignore
   *
   * @skip   - The mode is still entered and exited normally (and contains rules apply),
   *           but all content is held and added to the parent buffer rather than being
   *           output when the mode ends.  Mostly used with `sublanguage` to build up
   *           a single large buffer than can be parsed by sublanguage.
   *
   *             - The mode begin ands ends normally.
   *             - Content matched is added to the parent mode buffer.
   *             - The parser cursor is moved forward normally.
   *
   * @abort  - A hack placeholder until we have ignore.  Aborts the mode (as if it
   *           never matched) but DOES NOT continue to match subsequent `contains`
   *           modes.  Abort is bad/suboptimal because it can result in modes
   *           farther down not getting applied because an earlier rule eats the
   *           content but then aborts.
   *
   *             - The mode does not begin.
   *             - Content matched by `begin` is added to the mode buffer.
   *             - The parser cursor is moved forward accordingly.
   *
   * @ignore - Ignores the mode (as if it never matched) and continues to match any
   *           subsequent `contains` modes.  Ignore isn't technically possible with
   *           the current parser implementation.
   *
   *             - The mode does not begin.
   *             - Content matched by `begin` is ignored.
   *             - The parser cursor is not moved forward.
   */

  /**
   * Compiles an individual mode
   *
   * This can raise an error if the mode contains certain detectable known logic
   * issues.
   * @param {Mode} mode
   * @param {CompiledMode | null} [parent]
   * @returns {CompiledMode | never}
   */
  function compileMode(mode, parent) {
    const cmode = /** @type CompiledMode */ (mode);
    if (mode.isCompiled) return cmode;

    [
      scopeClassName,
      // do this early so compiler extensions generally don't have to worry about
      // the distinction between match/begin
      compileMatch,
      MultiClass,
      beforeMatchExt
    ].forEach(ext => ext(mode, parent));

    language.compilerExtensions.forEach(ext => ext(mode, parent));

    // __beforeBegin is considered private API, internal use only
    mode.__beforeBegin = null;

    [
      beginKeywords,
      // do this later so compiler extensions that come earlier have access to the
      // raw array if they wanted to perhaps manipulate it, etc.
      compileIllegal,
      // default to 1 relevance if not specified
      compileRelevance
    ].forEach(ext => ext(mode, parent));

    mode.isCompiled = true;

    let keywordPattern = null;
    if (typeof mode.keywords === "object" && mode.keywords.$pattern) {
      // we need a copy because keywords might be compiled multiple times
      // so we can't go deleting $pattern from the original on the first
      // pass
      mode.keywords = Object.assign({}, mode.keywords);
      keywordPattern = mode.keywords.$pattern;
      delete mode.keywords.$pattern;
    }
    keywordPattern = keywordPattern || /\w+/;

    if (mode.keywords) {
      mode.keywords = compileKeywords(mode.keywords, language.case_insensitive);
    }

    cmode.keywordPatternRe = langRe(keywordPattern, true);

    if (parent) {
      if (!mode.begin) mode.begin = /\B|\b/;
      cmode.beginRe = langRe(cmode.begin);
      if (!mode.end && !mode.endsWithParent) mode.end = /\B|\b/;
      if (mode.end) cmode.endRe = langRe(cmode.end);
      cmode.terminatorEnd = source(cmode.end) || '';
      if (mode.endsWithParent && parent.terminatorEnd) {
        cmode.terminatorEnd += (mode.end ? '|' : '') + parent.terminatorEnd;
      }
    }
    if (mode.illegal) cmode.illegalRe = langRe(/** @type {RegExp | string} */ (mode.illegal));
    if (!mode.contains) mode.contains = [];

    mode.contains = [].concat(...mode.contains.map(function(c) {
      return expandOrCloneMode(c === 'self' ? mode : c);
    }));
    mode.contains.forEach(function(c) { compileMode(/** @type Mode */ (c), cmode); });

    if (mode.starts) {
      compileMode(mode.starts, parent);
    }

    cmode.matcher = buildModeRegex(cmode);
    return cmode;
  }

  if (!language.compilerExtensions) language.compilerExtensions = [];

  // self is not valid at the top-level
  if (language.contains && language.contains.includes('self')) {
    throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
  }

  // we need a null object, which inherit will guarantee
  language.classNameAliases = inherit$1(language.classNameAliases || {});

  return compileMode(/** @type Mode */ (language));
}

/**
 * Determines if a mode has a dependency on it's parent or not
 *
 * If a mode does have a parent dependency then often we need to clone it if
 * it's used in multiple places so that each copy points to the correct parent,
 * where-as modes without a parent can often safely be re-used at the bottom of
 * a mode chain.
 *
 * @param {Mode | null} mode
 * @returns {boolean} - is there a dependency on the parent?
 * */
function dependencyOnParent(mode) {
  if (!mode) return false;

  return mode.endsWithParent || dependencyOnParent(mode.starts);
}

/**
 * Expands a mode or clones it if necessary
 *
 * This is necessary for modes with parental dependenceis (see notes on
 * `dependencyOnParent`) and for nodes that have `variants` - which must then be
 * exploded into their own individual modes at compile time.
 *
 * @param {Mode} mode
 * @returns {Mode | Mode[]}
 * */
function expandOrCloneMode(mode) {
  if (mode.variants && !mode.cachedVariants) {
    mode.cachedVariants = mode.variants.map(function(variant) {
      return inherit$1(mode, { variants: null }, variant);
    });
  }

  // EXPAND
  // if we have variants then essentially "replace" the mode with the variants
  // this happens in compileMode, where this function is called from
  if (mode.cachedVariants) {
    return mode.cachedVariants;
  }

  // CLONE
  // if we have dependencies on parents then we need a unique
  // instance of ourselves, so we can be reused with many
  // different parents without issue
  if (dependencyOnParent(mode)) {
    return inherit$1(mode, { starts: mode.starts ? inherit$1(mode.starts) : null });
  }

  if (Object.isFrozen(mode)) {
    return inherit$1(mode);
  }

  // no special dependency issues, just return ourselves
  return mode;
}

var version = "11.9.0";

class HTMLInjectionError extends Error {
  constructor(reason, html) {
    super(reason);
    this.name = "HTMLInjectionError";
    this.html = html;
  }
}

/*
Syntax highlighting with language autodetection.
https://highlightjs.org/
*/



/**
@typedef {import('highlight.js').Mode} Mode
@typedef {import('highlight.js').CompiledMode} CompiledMode
@typedef {import('highlight.js').CompiledScope} CompiledScope
@typedef {import('highlight.js').Language} Language
@typedef {import('highlight.js').HLJSApi} HLJSApi
@typedef {import('highlight.js').HLJSPlugin} HLJSPlugin
@typedef {import('highlight.js').PluginEvent} PluginEvent
@typedef {import('highlight.js').HLJSOptions} HLJSOptions
@typedef {import('highlight.js').LanguageFn} LanguageFn
@typedef {import('highlight.js').HighlightedHTMLElement} HighlightedHTMLElement
@typedef {import('highlight.js').BeforeHighlightContext} BeforeHighlightContext
@typedef {import('highlight.js/private').MatchType} MatchType
@typedef {import('highlight.js/private').KeywordData} KeywordData
@typedef {import('highlight.js/private').EnhancedMatch} EnhancedMatch
@typedef {import('highlight.js/private').AnnotatedError} AnnotatedError
@typedef {import('highlight.js').AutoHighlightResult} AutoHighlightResult
@typedef {import('highlight.js').HighlightOptions} HighlightOptions
@typedef {import('highlight.js').HighlightResult} HighlightResult
*/


const escape = escapeHTML;
const inherit = inherit$1;
const NO_MATCH = Symbol("nomatch");
const MAX_KEYWORD_HITS = 7;

/**
 * @param {any} hljs - object that is extended (legacy)
 * @returns {HLJSApi}
 */
const HLJS = function(hljs) {
  // Global internal variables used within the highlight.js library.
  /** @type {Record<string, Language>} */
  const languages = Object.create(null);
  /** @type {Record<string, string>} */
  const aliases = Object.create(null);
  /** @type {HLJSPlugin[]} */
  const plugins = [];

  // safe/production mode - swallows more errors, tries to keep running
  // even if a single syntax or parse hits a fatal error
  let SAFE_MODE = true;
  const LANGUAGE_NOT_FOUND = "Could not find the language '{}', did you forget to load/include a language module?";
  /** @type {Language} */
  const PLAINTEXT_LANGUAGE = { disableAutodetect: true, name: 'Plain text', contains: [] };

  // Global options used when within external APIs. This is modified when
  // calling the `hljs.configure` function.
  /** @type HLJSOptions */
  let options = {
    ignoreUnescapedHTML: false,
    throwUnescapedHTML: false,
    noHighlightRe: /^(no-?highlight)$/i,
    languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
    classPrefix: 'hljs-',
    cssSelector: 'pre code',
    languages: null,
    // beta configuration options, subject to change, welcome to discuss
    // https://github.com/highlightjs/highlight.js/issues/1086
    __emitter: TokenTreeEmitter
  };

  /* Utility functions */

  /**
   * Tests a language name to see if highlighting should be skipped
   * @param {string} languageName
   */
  function shouldNotHighlight(languageName) {
    return options.noHighlightRe.test(languageName);
  }

  /**
   * @param {HighlightedHTMLElement} block - the HTML element to determine language for
   */
  function blockLanguage(block) {
    let classes = block.className + ' ';

    classes += block.parentNode ? block.parentNode.className : '';

    // language-* takes precedence over non-prefixed class names.
    const match = options.languageDetectRe.exec(classes);
    if (match) {
      const language = getLanguage(match[1]);
      if (!language) {
        warn(LANGUAGE_NOT_FOUND.replace("{}", match[1]));
        warn("Falling back to no-highlight mode for this block.", block);
      }
      return language ? match[1] : 'no-highlight';
    }

    return classes
      .split(/\s+/)
      .find((_class) => shouldNotHighlight(_class) || getLanguage(_class));
  }

  /**
   * Core highlighting function.
   *
   * OLD API
   * highlight(lang, code, ignoreIllegals, continuation)
   *
   * NEW API
   * highlight(code, {lang, ignoreIllegals})
   *
   * @param {string} codeOrLanguageName - the language to use for highlighting
   * @param {string | HighlightOptions} optionsOrCode - the code to highlight
   * @param {boolean} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
   *
   * @returns {HighlightResult} Result - an object that represents the result
   * @property {string} language - the language name
   * @property {number} relevance - the relevance score
   * @property {string} value - the highlighted HTML code
   * @property {string} code - the original raw code
   * @property {CompiledMode} top - top of the current mode stack
   * @property {boolean} illegal - indicates whether any illegal matches were found
  */
  function highlight(codeOrLanguageName, optionsOrCode, ignoreIllegals) {
    let code = "";
    let languageName = "";
    if (typeof optionsOrCode === "object") {
      code = codeOrLanguageName;
      ignoreIllegals = optionsOrCode.ignoreIllegals;
      languageName = optionsOrCode.language;
    } else {
      // old API
      deprecated("10.7.0", "highlight(lang, code, ...args) has been deprecated.");
      deprecated("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277");
      languageName = codeOrLanguageName;
      code = optionsOrCode;
    }

    // https://github.com/highlightjs/highlight.js/issues/3149
    // eslint-disable-next-line no-undefined
    if (ignoreIllegals === undefined) { ignoreIllegals = true; }

    /** @type {BeforeHighlightContext} */
    const context = {
      code,
      language: languageName
    };
    // the plugin can change the desired language or the code to be highlighted
    // just be changing the object it was passed
    fire("before:highlight", context);

    // a before plugin can usurp the result completely by providing it's own
    // in which case we don't even need to call highlight
    const result = context.result
      ? context.result
      : _highlight(context.language, context.code, ignoreIllegals);

    result.code = context.code;
    // the plugin can change anything in result to suite it
    fire("after:highlight", result);

    return result;
  }

  /**
   * private highlight that's used internally and does not fire callbacks
   *
   * @param {string} languageName - the language to use for highlighting
   * @param {string} codeToHighlight - the code to highlight
   * @param {boolean?} [ignoreIllegals] - whether to ignore illegal matches, default is to bail
   * @param {CompiledMode?} [continuation] - current continuation mode, if any
   * @returns {HighlightResult} - result of the highlight operation
  */
  function _highlight(languageName, codeToHighlight, ignoreIllegals, continuation) {
    const keywordHits = Object.create(null);

    /**
     * Return keyword data if a match is a keyword
     * @param {CompiledMode} mode - current mode
     * @param {string} matchText - the textual match
     * @returns {KeywordData | false}
     */
    function keywordData(mode, matchText) {
      return mode.keywords[matchText];
    }

    function processKeywords() {
      if (!top.keywords) {
        emitter.addText(modeBuffer);
        return;
      }

      let lastIndex = 0;
      top.keywordPatternRe.lastIndex = 0;
      let match = top.keywordPatternRe.exec(modeBuffer);
      let buf = "";

      while (match) {
        buf += modeBuffer.substring(lastIndex, match.index);
        const word = language.case_insensitive ? match[0].toLowerCase() : match[0];
        const data = keywordData(top, word);
        if (data) {
          const [kind, keywordRelevance] = data;
          emitter.addText(buf);
          buf = "";

          keywordHits[word] = (keywordHits[word] || 0) + 1;
          if (keywordHits[word] <= MAX_KEYWORD_HITS) relevance += keywordRelevance;
          if (kind.startsWith("_")) {
            // _ implied for relevance only, do not highlight
            // by applying a class name
            buf += match[0];
          } else {
            const cssClass = language.classNameAliases[kind] || kind;
            emitKeyword(match[0], cssClass);
          }
        } else {
          buf += match[0];
        }
        lastIndex = top.keywordPatternRe.lastIndex;
        match = top.keywordPatternRe.exec(modeBuffer);
      }
      buf += modeBuffer.substring(lastIndex);
      emitter.addText(buf);
    }

    function processSubLanguage() {
      if (modeBuffer === "") return;
      /** @type HighlightResult */
      let result = null;

      if (typeof top.subLanguage === 'string') {
        if (!languages[top.subLanguage]) {
          emitter.addText(modeBuffer);
          return;
        }
        result = _highlight(top.subLanguage, modeBuffer, true, continuations[top.subLanguage]);
        continuations[top.subLanguage] = /** @type {CompiledMode} */ (result._top);
      } else {
        result = highlightAuto(modeBuffer, top.subLanguage.length ? top.subLanguage : null);
      }

      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Use case in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        relevance += result.relevance;
      }
      emitter.__addSublanguage(result._emitter, result.language);
    }

    function processBuffer() {
      if (top.subLanguage != null) {
        processSubLanguage();
      } else {
        processKeywords();
      }
      modeBuffer = '';
    }

    /**
     * @param {string} text
     * @param {string} scope
     */
    function emitKeyword(keyword, scope) {
      if (keyword === "") return;

      emitter.startScope(scope);
      emitter.addText(keyword);
      emitter.endScope();
    }

    /**
     * @param {CompiledScope} scope
     * @param {RegExpMatchArray} match
     */
    function emitMultiClass(scope, match) {
      let i = 1;
      const max = match.length - 1;
      while (i <= max) {
        if (!scope._emit[i]) { i++; continue; }
        const klass = language.classNameAliases[scope[i]] || scope[i];
        const text = match[i];
        if (klass) {
          emitKeyword(text, klass);
        } else {
          modeBuffer = text;
          processKeywords();
          modeBuffer = "";
        }
        i++;
      }
    }

    /**
     * @param {CompiledMode} mode - new mode to start
     * @param {RegExpMatchArray} match
     */
    function startNewMode(mode, match) {
      if (mode.scope && typeof mode.scope === "string") {
        emitter.openNode(language.classNameAliases[mode.scope] || mode.scope);
      }
      if (mode.beginScope) {
        // beginScope just wraps the begin match itself in a scope
        if (mode.beginScope._wrap) {
          emitKeyword(modeBuffer, language.classNameAliases[mode.beginScope._wrap] || mode.beginScope._wrap);
          modeBuffer = "";
        } else if (mode.beginScope._multi) {
          // at this point modeBuffer should just be the match
          emitMultiClass(mode.beginScope, match);
          modeBuffer = "";
        }
      }

      top = Object.create(mode, { parent: { value: top } });
      return top;
    }

    /**
     * @param {CompiledMode } mode - the mode to potentially end
     * @param {RegExpMatchArray} match - the latest match
     * @param {string} matchPlusRemainder - match plus remainder of content
     * @returns {CompiledMode | void} - the next mode, or if void continue on in current mode
     */
    function endOfMode(mode, match, matchPlusRemainder) {
      let matched = startsWith(mode.endRe, matchPlusRemainder);

      if (matched) {
        if (mode["on:end"]) {
          const resp = new Response(mode);
          mode["on:end"](match, resp);
          if (resp.isMatchIgnored) matched = false;
        }

        if (matched) {
          while (mode.endsParent && mode.parent) {
            mode = mode.parent;
          }
          return mode;
        }
      }
      // even if on:end fires an `ignore` it's still possible
      // that we might trigger the end node because of a parent mode
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, match, matchPlusRemainder);
      }
    }

    /**
     * Handle matching but then ignoring a sequence of text
     *
     * @param {string} lexeme - string containing full match text
     */
    function doIgnore(lexeme) {
      if (top.matcher.regexIndex === 0) {
        // no more regexes to potentially match here, so we move the cursor forward one
        // space
        modeBuffer += lexeme[0];
        return 1;
      } else {
        // no need to move the cursor, we still have additional regexes to try and
        // match at this very spot
        resumeScanAtSamePosition = true;
        return 0;
      }
    }

    /**
     * Handle the start of a new potential mode match
     *
     * @param {EnhancedMatch} match - the current match
     * @returns {number} how far to advance the parse cursor
     */
    function doBeginMatch(match) {
      const lexeme = match[0];
      const newMode = match.rule;

      const resp = new Response(newMode);
      // first internal before callbacks, then the public ones
      const beforeCallbacks = [newMode.__beforeBegin, newMode["on:begin"]];
      for (const cb of beforeCallbacks) {
        if (!cb) continue;
        cb(match, resp);
        if (resp.isMatchIgnored) return doIgnore(lexeme);
      }

      if (newMode.skip) {
        modeBuffer += lexeme;
      } else {
        if (newMode.excludeBegin) {
          modeBuffer += lexeme;
        }
        processBuffer();
        if (!newMode.returnBegin && !newMode.excludeBegin) {
          modeBuffer = lexeme;
        }
      }
      startNewMode(newMode, match);
      return newMode.returnBegin ? 0 : lexeme.length;
    }

    /**
     * Handle the potential end of mode
     *
     * @param {RegExpMatchArray} match - the current match
     */
    function doEndMatch(match) {
      const lexeme = match[0];
      const matchPlusRemainder = codeToHighlight.substring(match.index);

      const endMode = endOfMode(top, match, matchPlusRemainder);
      if (!endMode) { return NO_MATCH; }

      const origin = top;
      if (top.endScope && top.endScope._wrap) {
        processBuffer();
        emitKeyword(lexeme, top.endScope._wrap);
      } else if (top.endScope && top.endScope._multi) {
        processBuffer();
        emitMultiClass(top.endScope, match);
      } else if (origin.skip) {
        modeBuffer += lexeme;
      } else {
        if (!(origin.returnEnd || origin.excludeEnd)) {
          modeBuffer += lexeme;
        }
        processBuffer();
        if (origin.excludeEnd) {
          modeBuffer = lexeme;
        }
      }
      do {
        if (top.scope) {
          emitter.closeNode();
        }
        if (!top.skip && !top.subLanguage) {
          relevance += top.relevance;
        }
        top = top.parent;
      } while (top !== endMode.parent);
      if (endMode.starts) {
        startNewMode(endMode.starts, match);
      }
      return origin.returnEnd ? 0 : lexeme.length;
    }

    function processContinuations() {
      const list = [];
      for (let current = top; current !== language; current = current.parent) {
        if (current.scope) {
          list.unshift(current.scope);
        }
      }
      list.forEach(item => emitter.openNode(item));
    }

    /** @type {{type?: MatchType, index?: number, rule?: Mode}}} */
    let lastMatch = {};

    /**
     *  Process an individual match
     *
     * @param {string} textBeforeMatch - text preceding the match (since the last match)
     * @param {EnhancedMatch} [match] - the match itself
     */
    function processLexeme(textBeforeMatch, match) {
      const lexeme = match && match[0];

      // add non-matched text to the current mode buffer
      modeBuffer += textBeforeMatch;

      if (lexeme == null) {
        processBuffer();
        return 0;
      }

      // we've found a 0 width match and we're stuck, so we need to advance
      // this happens when we have badly behaved rules that have optional matchers to the degree that
      // sometimes they can end up matching nothing at all
      // Ref: https://github.com/highlightjs/highlight.js/issues/2140
      if (lastMatch.type === "begin" && match.type === "end" && lastMatch.index === match.index && lexeme === "") {
        // spit the "skipped" character that our regex choked on back into the output sequence
        modeBuffer += codeToHighlight.slice(match.index, match.index + 1);
        if (!SAFE_MODE) {
          /** @type {AnnotatedError} */
          const err = new Error(`0 width match regex (${languageName})`);
          err.languageName = languageName;
          err.badRule = lastMatch.rule;
          throw err;
        }
        return 1;
      }
      lastMatch = match;

      if (match.type === "begin") {
        return doBeginMatch(match);
      } else if (match.type === "illegal" && !ignoreIllegals) {
        // illegal match, we do not continue processing
        /** @type {AnnotatedError} */
        const err = new Error('Illegal lexeme "' + lexeme + '" for mode "' + (top.scope || '<unnamed>') + '"');
        err.mode = top;
        throw err;
      } else if (match.type === "end") {
        const processed = doEndMatch(match);
        if (processed !== NO_MATCH) {
          return processed;
        }
      }

      // edge case for when illegal matches $ (end of line) which is technically
      // a 0 width match but not a begin/end match so it's not caught by the
      // first handler (when ignoreIllegals is true)
      if (match.type === "illegal" && lexeme === "") {
        // advance so we aren't stuck in an infinite loop
        return 1;
      }

      // infinite loops are BAD, this is a last ditch catch all. if we have a
      // decent number of iterations yet our index (cursor position in our
      // parsing) still 3x behind our index then something is very wrong
      // so we bail
      if (iterations > 100000 && iterations > match.index * 3) {
        const err = new Error('potential infinite loop, way more iterations than matches');
        throw err;
      }

      /*
      Why might be find ourselves here?  An potential end match that was
      triggered but could not be completed.  IE, `doEndMatch` returned NO_MATCH.
      (this could be because a callback requests the match be ignored, etc)

      This causes no real harm other than stopping a few times too many.
      */

      modeBuffer += lexeme;
      return lexeme.length;
    }

    const language = getLanguage(languageName);
    if (!language) {
      error(LANGUAGE_NOT_FOUND.replace("{}", languageName));
      throw new Error('Unknown language: "' + languageName + '"');
    }

    const md = compileLanguage(language);
    let result = '';
    /** @type {CompiledMode} */
    let top = continuation || md;
    /** @type Record<string,CompiledMode> */
    const continuations = {}; // keep continuations for sub-languages
    const emitter = new options.__emitter(options);
    processContinuations();
    let modeBuffer = '';
    let relevance = 0;
    let index = 0;
    let iterations = 0;
    let resumeScanAtSamePosition = false;

    try {
      if (!language.__emitTokens) {
        top.matcher.considerAll();

        for (;;) {
          iterations++;
          if (resumeScanAtSamePosition) {
            // only regexes not matched previously will now be
            // considered for a potential match
            resumeScanAtSamePosition = false;
          } else {
            top.matcher.considerAll();
          }
          top.matcher.lastIndex = index;

          const match = top.matcher.exec(codeToHighlight);
          // console.log("match", match[0], match.rule && match.rule.begin)

          if (!match) break;

          const beforeMatch = codeToHighlight.substring(index, match.index);
          const processedCount = processLexeme(beforeMatch, match);
          index = match.index + processedCount;
        }
        processLexeme(codeToHighlight.substring(index));
      } else {
        language.__emitTokens(codeToHighlight, emitter);
      }

      emitter.finalize();
      result = emitter.toHTML();

      return {
        language: languageName,
        value: result,
        relevance,
        illegal: false,
        _emitter: emitter,
        _top: top
      };
    } catch (err) {
      if (err.message && err.message.includes('Illegal')) {
        return {
          language: languageName,
          value: escape(codeToHighlight),
          illegal: true,
          relevance: 0,
          _illegalBy: {
            message: err.message,
            index,
            context: codeToHighlight.slice(index - 100, index + 100),
            mode: err.mode,
            resultSoFar: result
          },
          _emitter: emitter
        };
      } else if (SAFE_MODE) {
        return {
          language: languageName,
          value: escape(codeToHighlight),
          illegal: false,
          relevance: 0,
          errorRaised: err,
          _emitter: emitter,
          _top: top
        };
      } else {
        throw err;
      }
    }
  }

  /**
   * returns a valid highlight result, without actually doing any actual work,
   * auto highlight starts with this and it's possible for small snippets that
   * auto-detection may not find a better match
   * @param {string} code
   * @returns {HighlightResult}
   */
  function justTextHighlightResult(code) {
    const result = {
      value: escape(code),
      illegal: false,
      relevance: 0,
      _top: PLAINTEXT_LANGUAGE,
      _emitter: new options.__emitter(options)
    };
    result._emitter.addText(code);
    return result;
  }

  /**
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:

  - language (detected language)
  - relevance (int)
  - value (an HTML string with highlighting markup)
  - secondBest (object with the same structure for second-best heuristically
    detected language, may be absent)

    @param {string} code
    @param {Array<string>} [languageSubset]
    @returns {AutoHighlightResult}
  */
  function highlightAuto(code, languageSubset) {
    languageSubset = languageSubset || options.languages || Object.keys(languages);
    const plaintext = justTextHighlightResult(code);

    const results = languageSubset.filter(getLanguage).filter(autoDetection).map(name =>
      _highlight(name, code, false)
    );
    results.unshift(plaintext); // plaintext is always an option

    const sorted = results.sort((a, b) => {
      // sort base on relevance
      if (a.relevance !== b.relevance) return b.relevance - a.relevance;

      // always award the tie to the base language
      // ie if C++ and Arduino are tied, it's more likely to be C++
      if (a.language && b.language) {
        if (getLanguage(a.language).supersetOf === b.language) {
          return 1;
        } else if (getLanguage(b.language).supersetOf === a.language) {
          return -1;
        }
      }

      // otherwise say they are equal, which has the effect of sorting on
      // relevance while preserving the original ordering - which is how ties
      // have historically been settled, ie the language that comes first always
      // wins in the case of a tie
      return 0;
    });

    const [best, secondBest] = sorted;

    /** @type {AutoHighlightResult} */
    const result = best;
    result.secondBest = secondBest;

    return result;
  }

  /**
   * Builds new class name for block given the language name
   *
   * @param {HTMLElement} element
   * @param {string} [currentLang]
   * @param {string} [resultLang]
   */
  function updateClassName(element, currentLang, resultLang) {
    const language = (currentLang && aliases[currentLang]) || resultLang;

    element.classList.add("hljs");
    element.classList.add(`language-${language}`);
  }

  /**
   * Applies highlighting to a DOM node containing code.
   *
   * @param {HighlightedHTMLElement} element - the HTML element to highlight
  */
  function highlightElement(element) {
    /** @type HTMLElement */
    let node = null;
    const language = blockLanguage(element);

    if (shouldNotHighlight(language)) return;

    fire("before:highlightElement",
      { el: element, language });

    if (element.dataset.highlighted) {
      console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", element);
      return;
    }

    // we should be all text, no child nodes (unescaped HTML) - this is possibly
    // an HTML injection attack - it's likely too late if this is already in
    // production (the code has likely already done its damage by the time
    // we're seeing it)... but we yell loudly about this so that hopefully it's
    // more likely to be caught in development before making it to production
    if (element.children.length > 0) {
      if (!options.ignoreUnescapedHTML) {
        console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk.");
        console.warn("https://github.com/highlightjs/highlight.js/wiki/security");
        console.warn("The element with unescaped HTML:");
        console.warn(element);
      }
      if (options.throwUnescapedHTML) {
        const err = new HTMLInjectionError(
          "One of your code blocks includes unescaped HTML.",
          element.innerHTML
        );
        throw err;
      }
    }

    node = element;
    const text = node.textContent;
    const result = language ? highlight(text, { language, ignoreIllegals: true }) : highlightAuto(text);

    element.innerHTML = result.value;
    element.dataset.highlighted = "yes";
    updateClassName(element, language, result.language);
    element.result = {
      language: result.language,
      // TODO: remove with version 11.0
      re: result.relevance,
      relevance: result.relevance
    };
    if (result.secondBest) {
      element.secondBest = {
        language: result.secondBest.language,
        relevance: result.secondBest.relevance
      };
    }

    fire("after:highlightElement", { el: element, result, text });
  }

  /**
   * Updates highlight.js global options with the passed options
   *
   * @param {Partial<HLJSOptions>} userOptions
   */
  function configure(userOptions) {
    options = inherit(options, userOptions);
  }

  // TODO: remove v12, deprecated
  const initHighlighting = () => {
    highlightAll();
    deprecated("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
  };

  // TODO: remove v12, deprecated
  function initHighlightingOnLoad() {
    highlightAll();
    deprecated("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
  }

  let wantsHighlight = false;

  /**
   * auto-highlights all pre>code elements on the page
   */
  function highlightAll() {
    // if we are called too early in the loading process
    if (document.readyState === "loading") {
      wantsHighlight = true;
      return;
    }

    const blocks = document.querySelectorAll(options.cssSelector);
    blocks.forEach(highlightElement);
  }

  function boot() {
    // if a highlight was requested before DOM was loaded, do now
    if (wantsHighlight) highlightAll();
  }

  // make sure we are in the browser environment
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('DOMContentLoaded', boot, false);
  }

  /**
   * Register a language grammar module
   *
   * @param {string} languageName
   * @param {LanguageFn} languageDefinition
   */
  function registerLanguage(languageName, languageDefinition) {
    let lang = null;
    try {
      lang = languageDefinition(hljs);
    } catch (error$1) {
      error("Language definition for '{}' could not be registered.".replace("{}", languageName));
      // hard or soft error
      if (!SAFE_MODE) { throw error$1; } else { error(error$1); }
      // languages that have serious errors are replaced with essentially a
      // "plaintext" stand-in so that the code blocks will still get normal
      // css classes applied to them - and one bad language won't break the
      // entire highlighter
      lang = PLAINTEXT_LANGUAGE;
    }
    // give it a temporary name if it doesn't have one in the meta-data
    if (!lang.name) lang.name = languageName;
    languages[languageName] = lang;
    lang.rawDefinition = languageDefinition.bind(null, hljs);

    if (lang.aliases) {
      registerAliases(lang.aliases, { languageName });
    }
  }

  /**
   * Remove a language grammar module
   *
   * @param {string} languageName
   */
  function unregisterLanguage(languageName) {
    delete languages[languageName];
    for (const alias of Object.keys(aliases)) {
      if (aliases[alias] === languageName) {
        delete aliases[alias];
      }
    }
  }

  /**
   * @returns {string[]} List of language internal names
   */
  function listLanguages() {
    return Object.keys(languages);
  }

  /**
   * @param {string} name - name of the language to retrieve
   * @returns {Language | undefined}
   */
  function getLanguage(name) {
    name = (name || '').toLowerCase();
    return languages[name] || languages[aliases[name]];
  }

  /**
   *
   * @param {string|string[]} aliasList - single alias or list of aliases
   * @param {{languageName: string}} opts
   */
  function registerAliases(aliasList, { languageName }) {
    if (typeof aliasList === 'string') {
      aliasList = [aliasList];
    }
    aliasList.forEach(alias => { aliases[alias.toLowerCase()] = languageName; });
  }

  /**
   * Determines if a given language has auto-detection enabled
   * @param {string} name - name of the language
   */
  function autoDetection(name) {
    const lang = getLanguage(name);
    return lang && !lang.disableAutodetect;
  }

  /**
   * Upgrades the old highlightBlock plugins to the new
   * highlightElement API
   * @param {HLJSPlugin} plugin
   */
  function upgradePluginAPI(plugin) {
    // TODO: remove with v12
    if (plugin["before:highlightBlock"] && !plugin["before:highlightElement"]) {
      plugin["before:highlightElement"] = (data) => {
        plugin["before:highlightBlock"](
          Object.assign({ block: data.el }, data)
        );
      };
    }
    if (plugin["after:highlightBlock"] && !plugin["after:highlightElement"]) {
      plugin["after:highlightElement"] = (data) => {
        plugin["after:highlightBlock"](
          Object.assign({ block: data.el }, data)
        );
      };
    }
  }

  /**
   * @param {HLJSPlugin} plugin
   */
  function addPlugin(plugin) {
    upgradePluginAPI(plugin);
    plugins.push(plugin);
  }

  /**
   * @param {HLJSPlugin} plugin
   */
  function removePlugin(plugin) {
    const index = plugins.indexOf(plugin);
    if (index !== -1) {
      plugins.splice(index, 1);
    }
  }

  /**
   *
   * @param {PluginEvent} event
   * @param {any} args
   */
  function fire(event, args) {
    const cb = event;
    plugins.forEach(function(plugin) {
      if (plugin[cb]) {
        plugin[cb](args);
      }
    });
  }

  /**
   * DEPRECATED
   * @param {HighlightedHTMLElement} el
   */
  function deprecateHighlightBlock(el) {
    deprecated("10.7.0", "highlightBlock will be removed entirely in v12.0");
    deprecated("10.7.0", "Please use highlightElement now.");

    return highlightElement(el);
  }

  /* Interface definition */
  Object.assign(hljs, {
    highlight,
    highlightAuto,
    highlightAll,
    highlightElement,
    // TODO: Remove with v12 API
    highlightBlock: deprecateHighlightBlock,
    configure,
    initHighlighting,
    initHighlightingOnLoad,
    registerLanguage,
    unregisterLanguage,
    listLanguages,
    getLanguage,
    registerAliases,
    autoDetection,
    inherit,
    addPlugin,
    removePlugin
  });

  hljs.debugMode = function() { SAFE_MODE = false; };
  hljs.safeMode = function() { SAFE_MODE = true; };
  hljs.versionString = version;

  hljs.regex = {
    concat: concat,
    lookahead: lookahead,
    either: either,
    optional: optional,
    anyNumberOfTimes: anyNumberOfTimes
  };

  for (const key in MODES) {
    // @ts-ignore
    if (typeof MODES[key] === "object") {
      // @ts-ignore
      deepFreeze(MODES[key]);
    }
  }

  // merge all the modes/regexes into our main object
  Object.assign(hljs, MODES);

  return hljs;
};

// Other names for the variable may break build script
const highlight = HLJS({});

// returns a new instance of the highlighter to be used for extensions
// check https://github.com/wooorm/lowlight/issues/47
highlight.newInstance = () => HLJS({});

module.exports = highlight;
highlight.HighlightJS = highlight;
highlight.default = highlight;


/***/ }),

/***/ 621:
/***/ ((module) => {

/*
Language: JSON
Description: JSON (JavaScript Object Notation) is a lightweight data-interchange format.
Author: Ivan Sagalaev <maniac@softwaremaniacs.org>
Website: http://www.json.org
Category: common, protocols, web
*/

function json(hljs) {
  const ATTRIBUTE = {
    className: 'attr',
    begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
    relevance: 1.01
  };
  const PUNCTUATION = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  };
  const LITERALS = [
    "true",
    "false",
    "null"
  ];
  // NOTE: normally we would rely on `keywords` for this but using a mode here allows us
  // - to use the very tight `illegal: \S` rule later to flag any other character
  // - as illegal indicating that despite looking like JSON we do not truly have
  // - JSON and thus improve false-positively greatly since JSON will try and claim
  // - all sorts of JSON looking stuff
  const LITERALS_MODE = {
    scope: "literal",
    beginKeywords: LITERALS.join(" "),
  };

  return {
    name: 'JSON',
    keywords:{
      literal: LITERALS,
    },
    contains: [
      ATTRIBUTE,
      PUNCTUATION,
      hljs.QUOTE_STRING_MODE,
      LITERALS_MODE,
      hljs.C_NUMBER_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE
    ],
    illegal: '\\S'
  };
}

module.exports = json;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ src)
});

;// CONCATENATED MODULE: ./src/user-interfaces/icons.ts
var icon_arrow = "<svg stroke-miterlimit=\"10\" style=\"fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;\" version=\"1.1\" viewBox=\"0 0 64 64\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M19.8046 0.9191L49.1309 30.2454C49.4094 30.5239 49.6044 30.8024 49.7158 31.0809C49.8272 31.3594 49.8829 31.6658 49.8829 32C49.8829 32.3342 49.8272 32.6406 49.7158 32.9191C49.6044 33.1976 49.4094 33.4761 49.1309 33.7546L19.8046 63.0809C19.1918 63.6936 18.412 64 17.4651 64C16.5182 64 15.7384 63.6936 15.1257 63.0809C14.4573 62.4125 14.1231 61.6188 14.1231 60.6997C14.1231 59.7807 14.4573 58.987 15.1257 58.3185L41.4442 32L15.1257 5.6815C14.4016 4.9574 14.0674 4.1497 14.1231 3.2585C14.1788 2.3673 14.513 1.6153 15.1257 1.0026C15.7941 0.3342 16.5878 7.10543e-15 17.5069 7.10543e-15C18.426 7.10543e-15 19.1918 0.3064 19.8046 0.9191Z\" fill-rule=\"nonzero\" opacity=\"1\" stroke=\"none\"/></svg>";
var icon_copy = "<svg stroke-miterlimit=\"10\" style=\"fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;\" version=\"1.1\" viewBox=\"0 0 64 64\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M9.6 64C8.32 64 7.2 63.52 6.24 62.56C5.28 61.6 4.8 60.48 4.8 59.2L4.8 10.96L9.6 10.96L9.6 59.2L47.52 59.2L47.52 64L9.6 64ZM19.2 54.4C17.92 54.4 16.8 53.92 15.84 52.96C14.88 52 14.4 50.88 14.4 49.6L14.4 4.8C14.4 3.52 14.88 2.4 15.84 1.44C16.8 0.48 17.92 0 19.2 0L54.4 0C55.68 0 56.8 0.48 57.76 1.44C58.72 2.4 59.2 3.52 59.2 4.8L59.2 49.6C59.2 50.88 58.72 52 57.76 52.96C56.8 53.92 55.68 54.4 54.4 54.4L19.2 54.4ZM19.2 49.6L54.4 49.6L54.4 4.8L19.2 4.8L19.2 49.6ZM19.2 49.6L19.2 4.8L19.2 49.6Z\" fill-rule=\"nonzero\" opacity=\"1\" stroke=\"none\" /></svg>";
var icon_date = "<svg stroke-miterlimit=\"10\" style=\"fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;\" version=\"1.1\" viewBox=\"0 0 64 64\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M8 64C6.72 64 5.6 63.52 4.64 62.56C3.68 61.6 3.2 60.48 3.2 59.2L3.2 9.6C3.2 8.32 3.68 7.2 4.64 6.24C5.6 5.28 6.72 4.8 8 4.8L13.2 4.8L13.2 0L18.4 0L18.4 4.8L45.6 4.8L45.6 0L50.8 0L50.8 4.8L56 4.8C57.28 4.8 58.4 5.28 59.36 6.24C60.32 7.2 60.8 8.32 60.8 9.6L60.8 59.2C60.8 60.48 60.32 61.6 59.36 62.56C58.4 63.52 57.28 64 56 64L8 64ZM8 59.2L56 59.2L56 24.8L8 24.8L8 59.2ZM8 20L56 20L56 9.6L8 9.6L8 20ZM8 20L8 9.6L8 20Z\" fill-rule=\"nonzero\" opacity=\"1\" stroke=\"none\"/></svg>";
var icon_text = "<svg stroke-miterlimit=\"10\" style=\"fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;\" version=\"1.1\" viewBox=\"0 0 64 64\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M16.0434 49.9403L35.9167 49.9403C36.5231 49.9403 37.0306 49.7343 37.4394 49.3222C37.8481 48.9102 38.0525 48.3986 38.0525 47.7874C38.0525 47.1762 37.8481 46.6703 37.4394 46.2698C37.0306 45.8692 36.5231 45.6688 35.9167 45.6688L16.0434 45.6688C15.4371 45.6688 14.9295 45.8749 14.5207 46.2869C14.112 46.6989 13.9077 47.2105 13.9077 47.8217C13.9077 48.4329 14.112 48.9388 14.5207 49.3393C14.9295 49.74 15.4371 49.9403 16.0434 49.9403ZM16.0434 34.1357L47.9566 34.1357C48.5629 34.1357 49.0705 33.9297 49.4793 33.5177C49.888 33.1056 50.0923 32.594 50.0923 31.9829C50.0923 31.3717 49.888 30.8658 49.4793 30.4652C49.0705 30.0646 48.5629 29.8643 47.9566 29.8643L16.0434 29.8643C15.4371 29.8643 14.9295 30.0703 14.5207 30.4823C14.112 30.8944 13.9077 31.406 13.9077 32.0171C13.9077 32.6283 14.112 33.1342 14.5207 33.5348C14.9295 33.9354 15.4371 34.1357 16.0434 34.1357ZM16.0434 18.3312L47.9566 18.3312C48.5629 18.3312 49.0705 18.1251 49.4793 17.7131C49.888 17.3011 50.0923 16.7895 50.0923 16.1783C50.0923 15.5671 49.888 15.0612 49.4793 14.6607C49.0705 14.26 48.5629 14.0597 47.9566 14.0597L16.0434 14.0597C15.4371 14.0597 14.9295 14.2657 14.5207 14.6778C14.112 15.0898 13.9077 15.6014 13.9077 16.2126C13.9077 16.8238 14.112 17.3297 14.5207 17.7302C14.9295 18.1308 15.4371 18.3312 16.0434 18.3312ZM5.42987 64C3.95353 64 2.67945 63.4641 1.60763 62.3923C0.535815 61.3205-9.41179e-05 60.0464-9.41179e-05 58.5701L-9.41179e-05 5.42995C-9.41179e-05 3.95361 0.535815 2.67954 1.60763 1.60772C2.67945 0.535907 3.95353 0 5.42987 0L58.5701 0C60.0465 0 61.3205 0.535907 62.3924 1.60772C63.4642 2.67954 64.0001 3.95361 64.0001 5.42995L64.0001 58.5701C64.0001 60.0464 63.4642 61.3205 62.3924 62.3923C61.3205 63.4641 60.0465 64 58.5701 64L5.42987 64ZM5.42987 59.7286L58.5701 59.7286C58.8598 59.7286 59.1253 59.6079 59.3667 59.3666C59.608 59.1252 59.7286 58.8597 59.7286 58.5701L59.7286 5.42995C59.7286 5.14031 59.608 4.87481 59.3667 4.63343C59.1253 4.39211 58.8598 4.27145 58.5701 4.27145L5.42987 4.27145C5.14023 4.27145 4.87473 4.39211 4.63334 4.63343C4.39203 4.87481 4.27137 5.14031 4.27137 5.42995L4.27137 58.5701C4.27137 58.8597 4.39203 59.1252 4.63334 59.3666C4.87473 59.6079 5.14023 59.7286 5.42987 59.7286ZM4.27137 4.27145L4.27137 59.7286L4.27137 4.27145Z\" fill-rule=\"nonzero\" opacity=\"1\" stroke=\"none\"/></svg>";
var icon_hashtag = "<svg clip-rule=\"evenodd\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-miterlimit=\"10\" version=\"1.1\" viewBox=\"0 0 64 64\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m10.353 62.118 4.0471-16h-14.4l1.4118-5.647h14.4l4.2353-16.941h-16.282l1.4118-5.647h16.282l3.953-16h5.5529l-3.9529 16h17.035l3.9529-16h5.5529l-3.9529 16h14.4l-1.4118 5.647h-14.4l-4.2353 16.941h16.282l-1.4118 5.647h-16.282l-3.953 16h-5.647l4.047-16h-17.035l-3.9529 16h-5.6471zm11.012-21.647h17.035l4.2353-16.941h-17.035l-4.2353 16.941z\"/></svg>";
var icon_password = "<svg clip-rule=\"evenodd\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-miterlimit=\"10\" version=\"1.1\" viewBox=\"0 0 64 64\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m17.454 49.454c-4.8484 0-8.9696-1.6969-12.364-5.0909-3.3939-3.3939-5.0909-7.5151-5.0909-12.364s1.697-8.9697 5.0909-12.364c3.3939-3.394 7.5152-5.0909 12.364-5.0909 3.7819 0 6.9697 0.909 9.5637 2.7272 2.5939 1.8182 4.5212 4.2303 5.7818 7.2364h31.2v14.982h-7.7091v9.9636h-13.527v-9.9636h-9.9636c-1.2606 3.0061-3.1879 5.4182-5.7818 7.2364-2.594 1.8182-5.7818 2.7272-9.5637 2.7272zm0-4.3636c3.4425 0 6.2667-1.1394 8.4728-3.4182 2.206-2.2788 3.503-4.4606 3.8909-6.5454h17.6v9.9636h4.5091v-9.9636h7.7091v-6.2546h-29.818c-0.3879-2.0848-1.6849-4.2666-3.8909-6.5454-2.2061-2.2788-5.0303-3.4182-8.4728-3.4182-3.6363 0-6.7272 1.2727-9.2727 3.8182-2.5455 2.5454-3.8182 5.6363-3.8182 9.2727s1.2727 6.7273 3.8182 9.2727c2.5455 2.5455 5.6364 3.8182 9.2727 3.8182zm0-8.1454c1.4061 0 2.5819-0.4728 3.5273-1.4182 0.9455-0.9455 1.4182-2.1212 1.4182-3.5273s-0.4727-2.5818-1.4182-3.5273c-0.9454-0.9454-2.1212-1.4182-3.5273-1.4182-1.406 0-2.5818 0.4728-3.5272 1.4182-0.9455 0.9455-1.4182 2.1212-1.4182 3.5273s0.4727 2.5818 1.4182 3.5273c0.9454 0.9454 2.1212 1.4182 3.5272 1.4182z\"/></svg>";
var icon_check_strong = '<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M43.68 27.76C44.9067 27.76 45.9333 27.3467 46.76 26.52C47.5867 25.6933 48 24.6667 48 23.44C48 22.2133 47.5867 21.1867 46.76 20.36C45.9333 19.5333 44.9067 19.12 43.68 19.12C42.4533 19.12 41.4267 19.5333 40.6 20.36C39.7733 21.1867 39.36 22.2133 39.36 23.44C39.36 24.6667 39.7733 25.6933 40.6 26.52C41.4267 27.3467 42.4533 27.76 43.68 27.76ZM20.32 27.76C21.5467 27.76 22.5733 27.3467 23.4 26.52C24.2267 25.6933 24.64 24.6667 24.64 23.44C24.64 22.2133 24.2267 21.1867 23.4 20.36C22.5733 19.5333 21.5467 19.12 20.32 19.12C19.0933 19.12 18.0667 19.5333 17.24 20.36C16.4133 21.1867 16 22.2133 16 23.44C16 24.6667 16.4133 25.6933 17.24 26.52C18.0667 27.3467 19.0933 27.76 20.32 27.76ZM32 49.52C35.52 49.52 38.76 48.5733 41.72 46.68C44.68 44.7867 46.8267 42.2133 48.16 38.96L15.84 38.96C17.2267 42.2133 19.3867 44.7867 22.32 46.68C25.2533 48.5733 28.48 49.52 32 49.52ZM32 64C27.6267 64 23.4933 63.16 19.6 61.48C15.7067 59.8 12.3067 57.5067 9.4 54.6C6.49333 51.6933 4.2 48.2933 2.52 44.4C0.84 40.5067 0 36.3467 0 31.92C0 27.5467 0.84 23.4133 2.52 19.52C4.2 15.6267 6.49333 12.24 9.4 9.36C12.3067 6.48 15.7067 4.2 19.6 2.52C23.4933 0.84 27.6533 0 32.08 0C36.4533 0 40.5867 0.84 44.48 2.52C48.3733 4.2 51.76 6.48 54.64 9.36C57.52 12.24 59.8 15.6267 61.48 19.52C63.16 23.4133 64 27.5733 64 32C64 36.3733 63.16 40.5067 61.48 44.4C59.8 48.2933 57.52 51.6933 54.64 54.6C51.76 57.5067 48.3733 59.8 44.48 61.48C40.5867 63.16 36.4267 64 32 64ZM32 59.2C39.5733 59.2 46 56.5467 51.28 51.24C56.56 45.9333 59.2 39.52 59.2 32C59.2 24.4267 56.56 18 51.28 12.72C46 7.44 39.5733 4.8 32 4.8C24.48 4.8 18.0667 7.44 12.76 12.72C7.45333 18 4.8 24.4267 4.8 32C4.8 39.52 7.45333 45.9333 12.76 51.24C18.0667 56.5467 24.48 59.2 32 59.2Z" fill="var(--check-strong-icon)" fill-rule="nonzero" opacity="1" stroke="none"/></svg>';
var icon_check_passable = '<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M43.68 27.76C44.9067 27.76 45.9333 27.3467 46.76 26.52C47.5867 25.6933 48 24.6667 48 23.44C48 22.2133 47.5867 21.1867 46.76 20.36C45.9333 19.5333 44.9067 19.12 43.68 19.12C42.4533 19.12 41.4267 19.5333 40.6 20.36C39.7733 21.1867 39.36 22.2133 39.36 23.44C39.36 24.6667 39.7733 25.6933 40.6 26.52C41.4267 27.3467 42.4533 27.76 43.68 27.76ZM20.32 27.76C21.5467 27.76 22.5733 27.3467 23.4 26.52C24.2267 25.6933 24.64 24.6667 24.64 23.44C24.64 22.2133 24.2267 21.1867 23.4 20.36C22.5733 19.5333 21.5467 19.12 20.32 19.12C19.0933 19.12 18.0667 19.5333 17.24 20.36C16.4133 21.1867 16 22.2133 16 23.44C16 24.6667 16.4133 25.6933 17.24 26.52C18.0667 27.3467 19.0933 27.76 20.32 27.76ZM32 49.52C35.52 49.52 38.76 48.5733 41.72 46.68C44.68 44.7867 46.8267 42.2133 48.16 38.96L44 38.96C42.7733 41.0933 41.0933 42.7333 38.96 43.88C36.8267 45.0267 34.5333 45.6 32.08 45.6C29.5733 45.6 27.24 45.04 25.08 43.92C22.92 42.8 21.2533 41.1467 20.08 38.96L15.84 38.96C17.2267 42.2133 19.3867 44.7867 22.32 46.68C25.2533 48.5733 28.48 49.52 32 49.52ZM32 64C27.6267 64 23.4933 63.16 19.6 61.48C15.7067 59.8 12.3067 57.5067 9.4 54.6C6.49333 51.6933 4.2 48.2933 2.52 44.4C0.84 40.5067 0 36.3467 0 31.92C0 27.5467 0.84 23.4133 2.52 19.52C4.2 15.6267 6.49333 12.24 9.4 9.36C12.3067 6.48 15.7067 4.2 19.6 2.52C23.4933 0.84 27.6533-3.55271e-15 32.08-3.55271e-15C36.4533-3.55271e-15 40.5867 0.84 44.48 2.52C48.3733 4.2 51.76 6.48 54.64 9.36C57.52 12.24 59.8 15.6267 61.48 19.52C63.16 23.4133 64 27.5733 64 32C64 36.3733 63.16 40.5067 61.48 44.4C59.8 48.2933 57.52 51.6933 54.64 54.6C51.76 57.5067 48.3733 59.8 44.48 61.48C40.5867 63.16 36.4267 64 32 64ZM32 59.2C39.5733 59.2 46 56.5467 51.28 51.24C56.56 45.9333 59.2 39.52 59.2 32C59.2 24.4267 56.56 18 51.28 12.72C46 7.44 39.5733 4.8 32 4.8C24.48 4.8 18.0667 7.44 12.76 12.72C7.45333 18 4.8 24.4267 4.8 32C4.8 39.52 7.45333 45.9333 12.76 51.24C18.0667 56.5467 24.48 59.2 32 59.2Z" fill="var(--check-passable-icon)" fill-rule="nonzero" opacity="1" stroke="none"/></svg>';
var icon_check_fragile = '<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M43.68 27.76C44.9067 27.76 45.9333 27.3467 46.76 26.52C47.5867 25.6933 48 24.6667 48 23.44C48 22.2133 47.5867 21.1867 46.76 20.36C45.9333 19.5333 44.9067 19.12 43.68 19.12C42.4533 19.12 41.4267 19.5333 40.6 20.36C39.7733 21.1867 39.36 22.2133 39.36 23.44C39.36 24.6667 39.7733 25.6933 40.6 26.52C41.4267 27.3467 42.4533 27.76 43.68 27.76ZM20.32 27.76C21.5467 27.76 22.5733 27.3467 23.4 26.52C24.2267 25.6933 24.64 24.6667 24.64 23.44C24.64 22.2133 24.2267 21.1867 23.4 20.36C22.5733 19.5333 21.5467 19.12 20.32 19.12C19.0933 19.12 18.0667 19.5333 17.24 20.36C16.4133 21.1867 16 22.2133 16 23.44C16 24.6667 16.4133 25.6933 17.24 26.52C18.0667 27.3467 19.0933 27.76 20.32 27.76ZM32 37.04C28.4267 37.04 25.1867 38.04 22.28 40.04C19.3733 42.04 17.2267 44.6933 15.84 48L20.08 48C21.2533 45.76 22.92 44.0267 25.08 42.8C27.24 41.5733 29.5733 40.96 32.08 40.96C34.5867 40.96 36.8933 41.5733 39 42.8C41.1067 44.0267 42.7733 45.76 44 48L48.16 48C46.8267 44.6933 44.6933 42.04 41.76 40.04C38.8267 38.04 35.5733 37.04 32 37.04ZM32 64C27.6267 64 23.4933 63.16 19.6 61.48C15.7067 59.8 12.3067 57.5067 9.4 54.6C6.49333 51.6933 4.2 48.2933 2.52 44.4C0.84 40.5067 0 36.3467 0 31.92C0 27.5467 0.84 23.4133 2.52 19.52C4.2 15.6267 6.49333 12.24 9.4 9.36C12.3067 6.48 15.7067 4.2 19.6 2.52C23.4933 0.84 27.6533 0 32.08 0C36.4533 0 40.5867 0.84 44.48 2.52C48.3733 4.2 51.76 6.48 54.64 9.36C57.52 12.24 59.8 15.6267 61.48 19.52C63.16 23.4133 64 27.5733 64 32C64 36.3733 63.16 40.5067 61.48 44.4C59.8 48.2933 57.52 51.6933 54.64 54.6C51.76 57.5067 48.3733 59.8 44.48 61.48C40.5867 63.16 36.4267 64 32 64ZM32 59.2C39.5733 59.2 46 56.5467 51.28 51.24C56.56 45.9333 59.2 39.52 59.2 32C59.2 24.4267 56.56 18 51.28 12.72C46 7.44 39.5733 4.8 32 4.8C24.48 4.8 18.0667 7.44 12.76 12.72C7.45333 18 4.8 24.4267 4.8 32C4.8 39.52 7.45333 45.9333 12.76 51.24C18.0667 56.5467 24.48 59.2 32 59.2Z" fill="var(--check-fragile-icon)" fill-rule="nonzero" opacity="1" stroke="none"/></svg>';
var icon_check_unsafe = '<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M32 37.04C28.4267 37.04 25.1867 38.04 22.28 40.04C19.3733 42.04 17.2267 44.6933 15.84 48L48.16 48C46.8267 44.6933 44.6933 42.04 41.76 40.04C38.8267 38.04 35.5733 37.04 32 37.04ZM17.36 31.28L21.36 27.68L24.96 31.28L27.44 28.4L23.84 24.8L27.44 21.2L24.96 18.32L21.36 21.92L17.36 18.32L14.88 21.2L18.48 24.8L14.88 28.4L17.36 31.28ZM39.12 31.28L42.64 27.68L46.72 31.28L49.2 28.4L45.6 24.8L49.2 21.2L46.72 18.32L42.64 21.92L39.12 18.32L36.64 21.2L40.16 24.8L36.64 28.4L39.12 31.28ZM32 64C27.6267 64 23.4933 63.16 19.6 61.48C15.7067 59.8 12.3067 57.5067 9.4 54.6C6.49333 51.6933 4.2 48.2933 2.52 44.4C0.84 40.5067 0 36.3733 0 32C0 27.5733 0.84 23.4133 2.52 19.52C4.2 15.6267 6.49333 12.24 9.4 9.36C12.3067 6.48 15.7067 4.2 19.6 2.52C23.4933 0.84 27.6267 0 32 0C36.4267 0 40.5867 0.84 44.48 2.52C48.3733 4.2 51.76 6.48 54.64 9.36C57.52 12.24 59.8 15.6267 61.48 19.52C63.16 23.4133 64 27.5733 64 32C64 36.3733 63.16 40.5067 61.48 44.4C59.8 48.2933 57.52 51.6933 54.64 54.6C51.76 57.5067 48.3733 59.8 44.48 61.48C40.5867 63.16 36.4267 64 32 64ZM32 59.2C39.5733 59.2 46 56.5467 51.28 51.24C56.56 45.9333 59.2 39.52 59.2 32C59.2 24.4267 56.56 18 51.28 12.72C46 7.44 39.5733 4.8 32 4.8C24.48 4.8 18.0667 7.44 12.76 12.72C7.45333 18 4.8 24.4267 4.8 32C4.8 39.52 7.45333 45.9333 12.76 51.24C18.0667 56.5467 24.48 59.2 32 59.2Z" fill="var(--check-unsafe-icon)" fill-rule="nonzero" opacity="1" stroke="none"/></svg>';
var icon_regular_expression = "<svg stroke-miterlimit=\"10\" style=\"fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;\" version=\"1.1\" viewBox=\"0 0 64 64\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M0 32.0221C0 28.0684 0.712175 24.2862 2.13653 20.6756C3.56093 17.065 5.57452 13.7706 8.17728 10.7924C8.53982 10.3607 8.99085 10.1223 9.53037 10.0769C10.0699 10.0316 10.5383 10.1967 10.9353 10.5722C11.3324 10.9693 11.5115 11.443 11.4727 11.9934C11.4338 12.5436 11.2223 13.0519 10.8382 13.5181C8.57646 16.0992 6.84131 18.9652 5.63271 22.1161C4.42411 25.267 3.81981 28.5582 3.81981 31.9897C3.81981 35.4083 4.44678 38.6704 5.70071 41.7759C6.9546 44.8815 8.68436 47.753 10.89 50.3902C11.2526 50.8564 11.464 51.3733 11.5245 51.9409C11.5849 52.5084 11.4166 52.9908 11.0195 53.3879C10.6224 53.7849 10.1401 53.964 9.57245 53.9252C9.00488 53.8864 8.53982 53.6512 8.17728 53.2195C5.60903 50.2413 3.60408 46.9436 2.16245 43.3265C0.720817 39.7094 0 35.9413 0 32.0221ZM23.5993 50.8499C22.5936 50.8499 21.7433 50.5024 21.0485 49.8074C20.3535 49.1126 20.006 48.2623 20.006 47.2566C20.006 46.2509 20.3535 45.4006 21.0485 44.7057C21.7433 44.0107 22.5936 43.6632 23.5993 43.6632C24.605 43.6632 25.4553 44.0107 26.1502 44.7057C26.8452 45.4006 27.1926 46.2509 27.1926 47.2566C27.1926 48.2623 26.8452 49.1126 26.1502 49.8074C25.4553 50.5024 24.605 50.8499 23.5993 50.8499ZM38.6654 34.0162C38.1086 34.0162 37.6511 33.8371 37.2929 33.4788C36.9346 33.1206 36.7555 32.6631 36.7555 32.1063L36.7555 26.9137L32.3658 29.5359C31.878 29.8078 31.3838 29.8812 30.8832 29.756C30.3825 29.6308 30.007 29.3244 29.7566 28.8367C29.4847 28.3705 29.4113 27.8871 29.5365 27.3864C29.6617 26.8857 29.9681 26.5102 30.4558 26.2599L34.8456 23.6895L30.404 21.119C29.9163 20.8687 29.6185 20.4932 29.5106 19.9925C29.4027 19.4918 29.4847 18.9976 29.7566 18.5099C30.007 18.0437 30.3825 17.7481 30.8832 17.6229C31.3838 17.4978 31.878 17.5884 32.3658 17.8948L36.7555 20.4652L36.7555 15.2726C36.7555 14.7158 36.9346 14.2583 37.2929 13.9001C37.6511 13.5418 38.1086 13.3627 38.6654 13.3627C39.2223 13.3627 39.6798 13.5418 40.038 13.9001C40.3963 14.2583 40.5754 14.7158 40.5754 15.2726L40.5754 20.4652L44.9975 17.843C45.4637 17.5711 45.9471 17.4978 46.4477 17.6229C46.9484 17.7481 47.3239 18.0437 47.5743 18.5099C47.8462 18.9976 47.9196 19.4918 47.7944 19.9925C47.6692 20.4932 47.3736 20.8687 46.9075 21.119L42.4853 23.6895L46.9592 26.2599C47.4254 26.5102 47.7124 26.8857 47.8203 27.3864C47.9282 27.8871 47.8462 28.3705 47.5743 28.8367C47.3239 29.3244 46.9484 29.6308 46.4477 29.756C45.9471 29.8812 45.4637 29.7905 44.9975 29.4841L40.5754 26.9137L40.5754 32.1063C40.5754 32.6631 40.3963 33.1206 40.038 33.4788C39.6798 33.8371 39.2223 34.0162 38.6654 34.0162ZM64 32.0221C64 35.9758 63.2878 39.758 61.8634 43.3686C60.439 46.9792 58.4254 50.2629 55.8227 53.2195C55.4601 53.6512 55.0091 53.8864 54.4695 53.9252C53.93 53.964 53.4617 53.7849 53.0646 53.3879C52.6675 52.9908 52.4798 52.517 52.5014 51.9667C52.523 51.4164 52.715 50.9082 53.0776 50.442C55.3264 47.8608 57.0723 45.0034 58.3154 41.8698C59.5586 38.7362 60.1801 35.4428 60.1801 31.9897C60.1801 28.5582 59.5532 25.2724 58.2993 22.1323C57.0453 18.9922 55.3156 16.1208 53.11 13.5181C52.7474 13.0519 52.5499 12.5436 52.5175 11.9934C52.4851 11.443 52.6675 10.9693 53.0646 10.5722C53.4617 10.1967 53.93 10.0316 54.4695 10.0769C55.0091 10.1223 55.4601 10.3607 55.8227 10.7924C58.3909 13.7922 60.3958 17.092 61.8375 20.6918C63.2792 24.2916 64 28.0684 64 32.0221Z\" fill-rule=\"nonzero\" opacity=\"1\" stroke=\"none\"/></svg>";
var icon_more_options = "<svg stroke-miterlimit=\"10\" style=\"fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;\" version=\"1.1\" viewBox=\"0 0 64 64\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M14.8894 36C16.0031 36 16.9467 35.6102 17.72 34.8306C18.4933 34.051 18.88 33.1043 18.88 31.9906C18.88 30.8769 18.4902 29.9333 17.7106 29.16C16.931 28.3867 15.9843 28 14.8706 28C13.7569 28 12.8133 28.3898 12.04 29.1694C11.2667 29.949 10.88 30.8957 10.88 32.0094C10.88 33.1231 11.2698 34.0667 12.0494 34.84C12.829 35.6133 13.7757 36 14.8894 36ZM32.0094 36C33.1231 36 34.0667 35.6102 34.84 34.8306C35.6133 34.051 36 33.1043 36 31.9906C36 30.8769 35.6102 29.9333 34.8306 29.16C34.051 28.3867 33.1043 28 31.9906 28C30.8769 28 29.9333 28.3898 29.16 29.1694C28.3867 29.949 28 30.8957 28 32.0094C28 33.1231 28.3898 34.0667 29.1694 34.84C29.949 35.6133 30.8957 36 32.0094 36ZM49.0494 36C50.1631 36 51.1067 35.6102 51.88 34.8306C52.6533 34.051 53.04 33.1043 53.04 31.9906C53.04 30.8769 52.6502 29.9333 51.8706 29.16C51.091 28.3867 50.1443 28 49.0306 28C47.9169 28 46.9733 28.3898 46.2 29.1694C45.4267 29.949 45.04 30.8957 45.04 32.0094C45.04 33.1231 45.4298 34.0667 46.2094 34.84C46.989 35.6133 47.9357 36 49.0494 36ZM32.0213 64C27.6088 64 23.4621 63.16 19.5813 61.48C15.7004 59.8 12.3067 57.5067 9.4 54.6C6.49333 51.6933 4.2 48.2976 2.52 44.4127C0.84 40.5279 7.10543e-15 36.377 7.10543e-15 31.96C7.10543e-15 27.543 0.84 23.3921 2.52 19.5073C4.2 15.6224 6.49333 12.24 9.4 9.36C12.3067 6.48 15.7024 4.2 19.5873 2.52C23.4721 0.84 27.623 0 32.04 0C36.457 0 40.6079 0.84 44.4927 2.52C48.3776 4.2 51.76 6.48 54.64 9.36C57.52 12.24 59.8 15.6267 61.48 19.52C63.16 23.4133 64 27.5662 64 31.9787C64 36.3912 63.16 40.5379 61.48 44.4187C59.8 48.2996 57.52 51.6884 54.64 54.5853C51.76 57.4821 48.3733 59.7755 44.48 61.4653C40.5867 63.1551 36.4338 64 32.0213 64ZM32.04 59.2C39.5867 59.2 46 56.5467 51.28 51.24C56.56 45.9333 59.2 39.5067 59.2 31.96C59.2 24.4133 56.565 18 51.295 12.72C46.025 7.44 39.5933 4.8 32 4.8C24.48 4.8 18.0667 7.43499 12.76 12.705C7.45333 17.975 4.8 24.4067 4.8 32C4.8 39.52 7.45333 45.9333 12.76 51.24C18.0667 56.5467 24.4933 59.2 32.04 59.2Z\" fill-rule=\"nonzero\" opacity=\"1\" stroke=\"none\" /></svg>";
var icon_edit = "<svg stroke-miterlimit=\"10\" style=\"fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;\" version=\"1.1\" viewBox=\"0 0 64 64\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M58.8056 15.0257L48.96 5.18031L52.952 1.1884C53.7537 0.386661 54.7619-0.00454017 55.9765 0.0147986C57.1912 0.0340745 58.2115 0.45667 59.0374 1.28259L62.7974 5.04262C63.5991 5.84436 64 6.84291 64 8.03827C64 9.23363 63.5871 10.2442 62.7612 11.0701L58.8056 15.0257ZM2.71678 63.9859C1.92464 63.9859 1.27381 63.7311 0.764288 63.2215C0.254763 62.712 0 62.0611 0 61.269L0 55.2343C0 54.8817 0.0627881 54.5545 0.188364 54.2526C0.313941 53.9507 0.521612 53.6428 0.81138 53.3289L45.9825 8.19405L55.7917 18.0033L10.6569 63.1744C10.343 63.4642 10.035 63.6719 9.73316 63.7975C9.43134 63.9231 9.10412 63.9859 8.7515 63.9859L2.71678 63.9859Z\" fill-rule=\"nonzero\" opacity=\"1\" stroke=\"none\" /></svg>";
var icon_delete = " <svg stroke-miterlimit=\"10\" style=\"fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;\" version=\"1.1\" viewBox=\"0 0 64 64\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M12.8875 64C11.3969 64 10.113 63.4615 9.03605 62.3845C7.95906 61.3075 7.42056 60.0236 7.42056 58.5329L7.42056 6.96125L5.72206 6.96125C5.11161 6.96125 4.60062 6.75382 4.18911 6.33895C3.77753 5.92409 3.57174 5.409 3.57174 4.79368C3.57174 4.17831 3.77753 3.66893 4.18911 3.26557C4.60062 2.86226 5.11161 2.66061 5.72206 2.66061L19.7831 2.66061C19.7831 1.91225 20.0435 1.28174 20.5644 0.769082C21.0853 0.256361 21.7117 0 22.4437 0L41.5563 0C42.2882 0 42.9147 0.260435 43.4356 0.781306C43.9565 1.30224 44.2169 1.92867 44.2169 2.66061L58.2779 2.66061C58.8884 2.66061 59.3994 2.86804 59.8109 3.28291C60.2225 3.69771 60.4283 4.2128 60.4283 4.82818C60.4283 5.44356 60.2225 5.9529 59.8109 6.3562C59.3994 6.75957 58.8884 6.96125 58.2779 6.96125L56.5794 6.96125L56.5794 58.5329C56.5794 60.0236 56.0409 61.3075 54.964 62.3845C53.887 63.4615 52.6031 64 51.1125 64L12.8875 64ZM52.2789 6.96125L11.7211 6.96125L11.7211 58.5329C11.7211 58.8731 11.8365 59.1526 12.0674 59.3713C12.2983 59.59 12.5717 59.6994 12.8875 59.6994L51.1125 59.6994C51.4283 59.6994 51.7017 59.59 51.9326 59.3713C52.1635 59.1526 52.2789 58.8731 52.2789 58.5329L52.2789 6.96125ZM22.6406 51.6957L26.9412 51.6957L26.9412 14.8701L22.6406 14.8701L22.6406 51.6957ZM37.0588 51.6957L41.3594 51.6957L41.3594 14.8701L37.0588 14.8701L37.0588 51.6957ZM11.7211 6.96125L11.7211 59.6994L11.7211 6.96125Z\" fill-rule=\"nonzero\" opacity=\"1\" stroke=\"none\" /></svg>";
var icon_share = "<svg stroke-miterlimit=\"10\" style=\"fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;\" version=\"1.1\" viewBox=\"0 0 64 64\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M12.9615 63.9998C11.729 63.9998 10.6653 63.5525 9.77055 62.6577C8.87577 61.763 8.42838 60.6993 8.42838 59.4668L8.42838 22.8584C8.42838 21.626 8.87577 20.5624 9.77055 19.6676C10.6653 18.7728 11.729 18.3254 12.9615 18.3254L22.0394 18.3254C22.5456 18.3254 22.9693 18.4974 23.3105 18.8414C23.6517 19.1854 23.8223 19.6125 23.8223 20.1227C23.8223 20.6329 23.6517 21.0553 23.3105 21.3897C22.9693 21.7241 22.5456 21.8914 22.0394 21.8914L12.9615 21.8914C12.7197 21.8914 12.498 21.9921 12.2965 22.1935C12.095 22.3951 11.9943 22.6167 11.9943 22.8584L11.9943 59.4668C11.9943 59.7086 12.095 59.9303 12.2965 60.1318C12.498 60.3333 12.7197 60.434 12.9615 60.434L51.0385 60.434C51.2803 60.434 51.502 60.3333 51.7035 60.1318C51.905 59.9303 52.0057 59.7086 52.0057 59.4668L52.0057 22.8584C52.0057 22.6167 51.905 22.3951 51.7035 22.1935C51.502 21.9921 51.2803 21.8914 51.0385 21.8914L41.8639 21.8914C41.3577 21.8914 40.934 21.7194 40.5927 21.3754C40.2515 21.0314 40.0809 20.6043 40.0809 20.0941C40.0809 19.5838 40.2515 19.1615 40.5927 18.8271C40.934 18.4927 41.3577 18.3254 41.8639 18.3254L51.0385 18.3254C52.271 18.3254 53.3347 18.7728 54.2295 19.6676C55.1242 20.5624 55.5716 21.626 55.5716 22.8584L55.5716 59.4668C55.5716 60.6994 55.1242 61.763 54.2295 62.6577C53.3347 63.5526 52.271 64 51.0385 64L12.9615 64L12.9615 63.9998ZM30.1687 5.99554L24.2092 11.9248C23.8789 12.2753 23.4699 12.4556 22.9823 12.4657C22.4948 12.4758 22.0655 12.2955 21.6945 11.9248C21.3443 11.5742 21.1692 11.1522 21.1692 10.6586C21.1692 10.165 21.3545 9.73283 21.7252 9.36213L30.3621 0.676901C30.8115 0.225634 31.3359 0 31.9352 0C32.5344 0 33.0698 0.225634 33.5412 0.676901L42.2264 9.36213C42.577 9.71267 42.7573 10.1359 42.7674 10.6317C42.7775 11.1275 42.6074 11.5465 42.2571 11.8888C41.8633 12.2512 41.4262 12.4324 40.9458 12.4324C40.4653 12.4324 40.038 12.2471 39.6639 11.8764L33.7346 5.99554L33.7346 39.4553C33.7346 39.9614 33.5626 40.3851 33.2187 40.7263C32.8747 41.0675 32.4475 41.2381 31.9373 41.2381C31.4271 41.2381 31.0048 41.0675 30.6703 40.7263C30.3359 40.3851 30.1687 39.9614 30.1687 39.4553L30.1687 5.99554Z\" fill-rule=\"nonzero\" opacity=\"1\" stroke=\"none\"/></svg>";
var icon_pattern = "<svg stroke-miterlimit=\"10\" style=\"fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;\" version=\"1.1\" viewBox=\"0 0 64 64\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M18.6667 32L24.8889 25.7778C25.4222 25.2444 25.6889 24.5926 25.6889 23.8222C25.6889 23.0519 25.4222 22.4 24.8889 21.8667C24.3556 21.3333 23.7087 21.0667 22.9482 21.0667C22.1876 21.0667 21.5308 21.3333 20.9778 21.8667L12.7111 30.1333C12.4148 30.4296 12.2074 30.7299 12.0889 31.034C11.9704 31.3383 11.9111 31.6642 11.9111 32.0118C11.9111 32.3595 11.9704 32.6815 12.0889 32.9778C12.2074 33.2741 12.4148 33.5704 12.7111 33.8667L21.0667 42.2222C21.6197 42.7556 22.2765 43.0222 23.0371 43.0222C23.7975 43.0222 24.4444 42.7556 24.9778 42.2222C25.5111 41.6889 25.7778 41.037 25.7778 40.2667C25.7778 39.4963 25.5111 38.8444 24.9778 38.3111L18.6667 32ZM45.3333 32L39.0222 38.3111C38.4889 38.8444 38.2222 39.4963 38.2222 40.2667C38.2222 41.037 38.4889 41.6889 39.0222 42.2222C39.5556 42.7556 40.2025 43.0222 40.9629 43.0222C41.7235 43.0222 42.3803 42.7556 42.9333 42.2222L51.2889 33.8667C51.5852 33.5704 51.7926 33.2701 51.9111 32.966C52.0296 32.6617 52.0889 32.3358 52.0889 31.9882C52.0889 31.6405 52.0296 31.3185 51.9111 31.0222C51.7926 30.7259 51.5852 30.4296 51.2889 30.1333L42.9333 21.7778C42.6963 21.4815 42.4 21.2741 42.0444 21.1556C41.6889 21.037 41.3333 20.9778 40.9778 20.9778C40.6222 20.9778 40.2815 21.037 39.9556 21.1556C39.6296 21.2741 39.3284 21.4756 39.0518 21.76C38.4988 22.3289 38.2222 22.9926 38.2222 23.7511C38.2222 24.5096 38.4889 25.1556 39.0222 25.6889L45.3333 32ZM5.33333 64C3.91111 64 2.66667 63.4667 1.6 62.4C0.533333 61.3333 0 60.0889 0 58.6667L0 5.33333C0 3.91111 0.533333 2.66667 1.6 1.6C2.66667 0.533333 3.91111 0 5.33333 0L58.6667 0C60.0889 0 61.3333 0.533333 62.4 1.6C63.4667 2.66667 64 3.91111 64 5.33333L64 58.6667C64 60.0889 63.4667 61.3333 62.4 62.4C61.3333 63.4667 60.0889 64 58.6667 64L5.33333 64ZM5.33333 58.6667L58.6667 58.6667L58.6667 5.33333L5.33333 5.33333L5.33333 58.6667ZM5.33333 5.33333L5.33333 58.6667L5.33333 5.33333Z\" fill-rule=\"nonzero\" opacity=\"1\" stroke=\"none\" /></svg>";
var icon_add = "<svg stroke-miterlimit=\"10\" style=\"fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;\" version=\"1.1\" viewBox=\"0 0 64 64\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M31.98 64C31.0029 64 30.1905 63.6714 29.5429 63.0143C28.8952 62.3571 28.5714 61.5429 28.5714 60.5714L28.5714 35.4286L3.42857 35.4286C2.45714 35.4286 1.64286 35.0981 0.985714 34.4371C0.328571 33.7761 0 32.9571 0 31.98C0 31.0029 0.328571 30.1905 0.985714 29.5429C1.64286 28.8952 2.45714 28.5714 3.42857 28.5714L28.5714 28.5714L28.5714 3.42857C28.5714 2.45714 28.9019 1.64286 29.5629 0.985714C30.2239 0.328571 31.0429 0 32.02 0C32.9971 0 33.8095 0.328571 34.4571 0.985714C35.1048 1.64286 35.4286 2.45714 35.4286 3.42857L35.4286 28.5714L60.5714 28.5714C61.5429 28.5714 62.3571 28.9019 63.0143 29.5629C63.6714 30.2239 64 31.0429 64 32.02C64 32.9971 63.6714 33.8095 63.0143 34.4571C62.3571 35.1048 61.5429 35.4286 60.5714 35.4286L35.4286 35.4286L35.4286 60.5714C35.4286 61.5429 35.0981 62.3571 34.4371 63.0143C33.7761 63.6714 32.9571 64 31.98 64Z\" fill-rule=\"nonzero\" opacity=\"1\" stroke=\"none\" /></svg>";
var icon_save = "<svg stroke-miterlimit=\"10\" style=\"fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;\" version=\"1.1\" viewBox=\"0 0 64 64\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M6.80548 64C4.90379 64 3.29413 63.3412 1.97648 62.0235C0.658825 60.7059 0 59.0962 0 57.1945L0 6.80548C0 4.90379 0.658825 3.29413 1.97648 1.97648C3.29413 0.658825 4.90379 0 6.80548 0L47.2109 0C48.1182 0 48.9906 0.176189 49.828 0.528566C50.6655 0.880881 51.3931 1.36593 52.0109 1.98372L62.0163 11.9891C62.6341 12.6069 63.1191 13.3345 63.4714 14.172C63.8238 15.0094 64 15.8818 64 16.7891L64 57.1945C64 59.0962 63.3412 60.7059 62.0235 62.0235C60.7059 63.3412 59.0962 64 57.1945 64L6.80548 64ZM58.353 16.3764L47.6236 5.64698L6.80548 5.64698C6.4676 5.64698 6.19004 5.75559 5.97282 5.97282C5.75559 6.19004 5.64698 6.4676 5.64698 6.80548L5.64698 57.1945C5.64698 57.5324 5.75559 57.81 5.97282 58.0272C6.19004 58.2444 6.4676 58.353 6.80548 58.353L57.1945 58.353C57.5324 58.353 57.81 58.2444 58.0272 58.0272C58.2444 57.81 58.353 57.5324 58.353 57.1945C58.353 57.1945 58.353 16.3764 58.353 16.3764ZM32 51.837C34.6063 51.837 36.8265 50.9199 38.6605 49.0859C40.4946 47.2518 41.4117 45.0316 41.4117 42.4253C41.4117 39.819 40.4946 37.5988 38.6605 35.7647C36.8265 33.9307 34.6063 33.0137 32 33.0137C29.3937 33.0137 27.1735 33.9307 25.3395 35.7647C23.5054 37.5988 22.5883 39.819 22.5883 42.4253C22.5883 45.0316 23.5054 47.2518 25.3395 49.0859C27.1735 50.9199 29.3937 51.837 32 51.837ZM14.2624 24.0361L38.3709 24.0361C39.3411 24.0361 40.1508 23.7115 40.7999 23.0624C41.4491 22.4132 41.7737 21.6036 41.7737 20.6335L41.7737 14.2624C41.7737 13.2923 41.4491 12.4827 40.7999 11.8335C40.1508 11.1844 39.3411 10.8598 38.3709 10.8598L14.2624 10.8598C13.2923 10.8598 12.4827 11.1844 11.8335 11.8335C11.1844 12.4827 10.8598 13.2923 10.8598 14.2624L10.8598 20.6335C10.8598 21.6036 11.1844 22.4132 11.8335 23.0624C12.4827 23.7115 13.2923 24.0361 14.2624 24.0361ZM5.64698 16.3764L5.64698 58.353L5.64698 5.64698L5.64698 16.3764Z\" fill-rule=\"nonzero\" opacity=\"1\" stroke=\"none\"/></svg>";
var icon_tick = "<svg stroke-miterlimit=\"10\" style=\"fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;\" version=\"1.1\" viewBox=\"0 0 64 64\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M21.6075 47.2204L58.6882 10.1398C59.3056 9.52688 60.0388 9.22043 60.8878 9.22043C61.7368 9.22043 62.4677 9.52869 63.0806 10.1452C63.6935 10.7616 64 11.4937 64 12.3414C64 13.1891 63.6935 13.9194 63.0806 14.5323L23.7527 53.8602C23.1398 54.4731 22.4247 54.7796 21.6075 54.7796C20.7903 54.7796 20.0753 54.4731 19.4624 53.8602L0.870968 35.2688C0.258064 34.6514-0.031362 33.9181 0.00268817 33.0692C0.0367384 32.2202 0.36202 31.4892 0.978532 30.8763C1.59498 30.2634 2.32706 29.957 3.17477 29.957C4.02241 29.957 4.75269 30.2634 5.36559 30.8763L21.6075 47.2204Z\" fill-rule=\"nonzero\" opacity=\"1\" stroke=\"none\" /></svg>";
window.icons = {
  icon_arrow: icon_arrow,
  icon_copy: icon_copy,
  icon_date: icon_date,
  icon_text: icon_text,
  icon_hashtag: icon_hashtag,
  icon_password: icon_password,
  icon_check_strong: icon_check_strong,
  icon_check_passable: icon_check_passable,
  icon_check_fragile: icon_check_fragile,
  icon_check_unsafe: icon_check_unsafe,
  icon_regular_expression: icon_regular_expression,
  icon_more_options: icon_more_options,
  icon_edit: icon_edit,
  icon_delete: icon_delete,
  icon_share: icon_share,
  icon_pattern: icon_pattern,
  icon_add: icon_add,
  icon_save: icon_save,
  icon_tick: icon_tick
};
/* harmony default export */ const icons = (window.icons);
;// CONCATENATED MODULE: ./src/user-interfaces/pattern-editor.ts
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }


var hljs = __webpack_require__(8416);
hljs.registerLanguage('json', __webpack_require__(621));


var _ = {};
_.cloneDeep = __webpack_require__(8055);
window.pattern_editor_current_editor = 'json';
window.pattern_json = {
  pattern_name: 'Email',
  pattern_icon: 'alternate_email',
  pattern: [{
    type: 'regex',
    regex: '/[a-z]/g',
    quantity: 3,
    repeat: false
  }, {
    type: 'group',
    group: [{
      type: 'regex',
      regex: '/[a-z]/g',
      quantity: 8,
      repeat: true
    }, {
      type: 'regex',
      regex: '/[0-9]/g',
      quantity: 5,
      repeat: true
    }],
    actions: ['shuffle']
  }, {
    type: 'string',
    string: '@'
  }, {
    type: 'regex',
    regex: '/[a-z]/g',
    quantity: 10,
    repeat: true
  }, {
    type: 'string',
    string: '.'
  }, {
    type: 'list',
    list: ['com', 'app', 'net', 'one', 'me'],
    quantity: 1,
    repeat: false
  }]
};
window.pattern_json_generation = [];
function initializePatternEditorJSONEditor() {
  pattern_json = interaction.pattern_editor.addIdentityToPattern(pattern_json);
  utilities.qe('.pattern2').innerHTML = JSON.stringify(pattern_json, null, 2);
  utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerText;
  utilities.qe('.pattern2').removeAttribute('data-highlighted');
  utilities.qe('.pattern').removeAttribute('data-highlighted');
  hljs.highlightElement(utilities.qe('.pattern2'));
  hljs.highlightElement(utilities.qe('.pattern'));
  utilities.qe('.pattern_editor .generation_preview').innerHTML = generatePatternPreview();
}
function syncAndFormatPatternEditorJSONEditor() {
  try {
    pattern_json = JSON.parse(utilities.qe('.pattern2').innerText);
    pattern_json = interaction.pattern_editor.addIdentityToPattern(pattern_json);
    utilities.qe('.pattern2').innerHTML = JSON.stringify(pattern_json, null, 2);
    utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerText;
    utilities.qe('.pattern2').removeAttribute('data-highlighted');
    utilities.qe('.pattern').removeAttribute('data-highlighted');
    hljs.highlightElement(utilities.qe('.pattern2'));
    hljs.highlightElement(utilities.qe('.pattern'));
    utilities.qe('.pattern_editor .generation_preview').innerHTML = generatePatternPreview();
  } catch (e) {}
  utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerHTML;
  utilities.qe('.pattern_editor .generation_preview').innerHTML = generatePatternPreview();
}
function syncPatternEditorJSONEditor() {
  try {
    utilities.qe('.pattern').innerHTML = utilities.qe('.pattern2').innerText;
    pattern_json = JSON.parse(utilities.qe('.pattern2').innerText);
    utilities.qe('.pattern').removeAttribute('data-highlighted');
    hljs.highlightElement(utilities.qe('.pattern'));
    utilities.qe('.pattern_editor .generation_preview').innerHTML = generatePatternPreview();
  } catch (e) {}
}
function openPatternEditor(mode, ls_key, event, temporary_id) {
  if (mode === 'edit') {
    if (LS.hasOwnProperty(ls_key)) {
      pattern_json = JSON.parse(String(LS.getItem(ls_key)));
      interaction.pattern_manager.closePatternManager();
      utilities.qe('.pattern_editor .fixed-title-box .btn.right-top-corner').setAttribute('onclick', "interaction.pattern_editor.savePatternWithEditor('edit','".concat(ls_key, "',event)"));
      utilities.qe('.pattern_editor .fixed-title-box .btn.right-top-corner').innerHTML = icons.icon_tick;
      utilities.qe('.pattern_editor .fixed-title-box .btn.left-top-corner').setAttribute('onclick', "interaction.pattern_editor.closePatternEditor('edit')");
    } else {
      return '';
    }
  }
  if (mode === 'new') {
    interaction.options.closeOptions(event);
    utilities.qe('.pattern_editor .fixed-title-box .btn.right-top-corner').setAttribute('onclick', "interaction.pattern_editor.savePatternWithEditor('new','',event)");
    utilities.qe('.pattern_editor .fixed-title-box .btn.right-top-corner').innerHTML = icons.icon_add;
    utilities.qe('.pattern_editor .fixed-title-box .btn.left-top-corner').setAttribute('onclick', "interaction.pattern_editor.closePatternEditor('new')");
  }
  interaction.SASBC(0);
  interaction.show(utilities.qe('.pattern_editor'), 'block');
  interaction.pattern_editor.initializePatternEditorJSONEditor();
  if (pattern_editor_evt === 0) {
    pattern_editor_evt = 1;
    utilities.qe('.pattern2').addEventListener('input', function (event) {
      interaction.pattern_editor.syncPatternEditorJSONEditor();
    });
    utilities.qe('.pattern2').addEventListener('blur', function (event) {
      interaction.pattern_editor.syncAndFormatPatternEditorJSONEditor();
    });
    utilities.qe('.pattern2').addEventListener('scroll', function (event) {
      window.requestAnimationFrame(function () {
        var pattern2 = utilities.qe('.pattern_editor .pattern2');
        var pattern = utilities.qe('.pattern_editor .pattern');
        var scrollTop = pattern2.pageYOffset || pattern2.scrollTop;
        pattern.scrollTop = scrollTop;
        var scrollHeight = pattern2.scrollHeight;
        var clientHeight = pattern2.clientHeight;
        var maxScrollTop = scrollHeight - clientHeight;
        var translateY = scrollTop;
        if (scrollTop < 0 || scrollTop >= maxScrollTop) {
          if (scrollTop < 0) {
            translateY *= -1;
          } else {
            translateY = maxScrollTop - scrollTop;
          }
        } else {
          translateY = 0;
        }
        utilities.qe('.pattern_editor .pattern_editor_json pre code.pattern').style.setProperty('--js-pattern-overscroll-translate', "translateY(".concat(translateY, "px)"));
      });
    });
  }
}
function closePatternEditor(mode) {
  interaction.show(utilities.qe('.pattern_editor'), 'none');
  interaction.SASBC(3);
  if (mode === 'edit') {
    interaction.pattern_manager.openPatternManager();
  }
}
function addIdentityToPattern(obj) {
  var pattern = _.cloneDeep(obj);
  var p = function p(pattern) {
    var pattern_len = pattern.length;
    for (var j = 0; j < pattern_len; j++) {
      var this_item = pattern[j];
      if (!this_item.hasOwnProperty('id')) {
        this_item.id = core_fine_grained_password.generate([{
          type: 'string',
          string: 'c-'
        }, {
          type: 'regex',
          regex: '/[A-Za-z0-9]/g',
          quantity: 16,
          repeat: true
        }], 'production');
      }
      if (this_item.type === 'string' || this_item === 'regex' || this_item === 'list') {} else {
        if (this_item.type === 'group') {
          this_item['group'] = p(this_item['group']);
        }
      }
      pattern.splice(j, 1, this_item);
    }
    return pattern;
  };
  if (pattern.hasOwnProperty('pattern')) {
    pattern.pattern = p(pattern.pattern);
  }
  return pattern;
}
function removeIdentityFromPattern(obj) {
  var pattern = _.cloneDeep(obj);
  var p = function p(pattern) {
    var pattern_len = pattern.length;
    for (var j = 0; j < pattern_len; j++) {
      var this_item = pattern[j];
      if (this_item.hasOwnProperty('id')) {
        delete this_item.id;
      }
      if (this_item.type === 'string' || this_item === 'regex' || this_item === 'list') {} else {
        if (this_item.type === 'group') {
          this_item['group'] = p(this_item['group']);
        }
      }
      pattern.splice(j, 1, this_item);
    }
    return pattern;
  };
  if (pattern.hasOwnProperty('pattern')) {
    pattern.pattern = p(pattern.pattern);
  }
  return pattern;
}
function generatePatternPreview() {
  if (pattern_json.hasOwnProperty('pattern')) {
    var generation = core_fine_grained_password.generate(pattern_json.pattern, 'editor');
    var generation_len = generation.length;
    pattern_json_generation = generation;
    var html = [];
    for (var c = 0; c < generation_len; c++) {
      var this_component = generation[c];
      var component_color = utilities.randomColorSet();
      var path = '--';
      var component_id = core_fine_grained_password.generate([{
        type: 'string',
        string: 'c-'
      }, {
        type: 'regex',
        regex: '/[A-Za-z0-9]/g',
        quantity: 16,
        repeat: true
      }], 'production');
      var component_elt = document.createElement('span');
      component_elt.classList.add('pattern_editor_preview_component');
      component_elt.id = this_component.component.id ? this_component.component.id : component_id;
      component_elt.setAttribute('path', path);
      component_elt.setAttribute('type', this_component.component.type);
      component_elt.style.setProperty('--js-component-color-light-text', component_color.light.text.str);
      component_elt.style.setProperty('--js-component-color-light-bg', component_color.light.bg.str);
      component_elt.style.setProperty('--js-component-color-dark-text', component_color.dark.text.str);
      component_elt.style.setProperty('--js-component-color-dark-bg', component_color.dark.bg.str);
      component_elt.innerText = this_component.result;
      component_elt.setAttribute('onclick', "interaction.pattern_editor.displayPatternComponentInfo('".concat(this_component.component.id ? this_component.component.id : component_id, "',event)"));
      html.push(component_elt.outerHTML);
    }
    return html.join('');
  } else {
    return 'Invalid pattern';
  }
}
function displayPatternComponentInfo(component_id, event) {
  event.preventDefault();
  interaction.SASBC(2);
  var type_icon = {
    regex: icons.icon_regular_expression,
    string: icons.icon_text,
    group: '',
    list: ''
  };
  var existing_info = utilities.qeAll('body .pattern_editor_preview_component_info');
  var existing_info_len = existing_info.length;
  for (var e = 0; e < existing_info_len; e++) {
    removePatternComponentInfo(existing_info[e].id, event);
  }
  var elt = event.target;
  var temporary_id = core_fine_grained_password.generate([{
    type: 'string',
    string: 'pattern-component-info-'
  }, {
    type: 'regex',
    regex: '/[a-z0-9]/g',
    quantity: 16,
    repeat: true
  }], 'production');
  var component = pattern_json_generation.filter(function (j) {
    return j.component.id === component_id ? true : false;
  });
  if (component.length < 1) {
    return '';
  } else {
    component = Object.assign(component[0].component, {
      content: component[0].result
    });
  }
  var items = [];
  var tostr = function tostr(content) {
    if (typeof content === 'string' || typeof content === 'number' || typeof content === 'boolean') {
      return content;
    }
    if (_typeof(content) === 'object' && !Array.isArray(content)) {
      return JSON.stringify(content);
    }
    if (_typeof(content) === 'object' && Array.isArray(content)) {
      return content.map(function (r) {
        return tostr(r);
      }).join(', ');
    }
    return '--';
  };
  for (var i in component) {
    var input_elt = document.createElement('input');
    input_elt.setAttribute('value', tostr(component[i]));
    input_elt.setAttribute('readonly', 'readonly');
    items.push("<div class=\"pattern_editor_preview_component_info_item\"><div class=\"pattern_editor_preview_component_info_item_title\">".concat(i, "</div><div class=\"pattern_editor_preview_component_info_item_value\">").concat(input_elt.outerHTML, "</div></div>"));
  }
  var card_elt = document.createElement('div');
  var path = '--';
  card_elt.classList.add('pattern_editor_preview_component_info');
  card_elt.id = temporary_id;
  card_elt.innerHTML = "<div class=\"pattern_editor_preview_component_info_title\">Component</div><div class=\"pattern_editor_preview_component_info_list_container\"><div class=\"pattern_editor_preview_component_info_list\">".concat(items.join(''), "</div></div><div class=\"pattern_editor_preview_component_info_button_box\"><div class=\"pattern_editor_preview_component_info_show_in_editor\" onclick=\"interaction.pattern_editor.showComponentInEditor('").concat(temporary_id, "','").concat(component.id, "',event)\">Find</div><div class=\"pattern_editor_preview_component_info_close\" onclick=\"interaction.pattern_editor.removePatternComponentInfo('").concat(temporary_id, "',event)\">Close</div></div>");
  var mask_elt = document.createElement('div');
  mask_elt.classList.add('pattern_editor_preview_component_info_mask');
  mask_elt.id = "".concat(temporary_id, "-mask");
  mask_elt.setAttribute("onclick", "interaction.pattern_editor.removePatternComponentInfo('".concat(temporary_id, "',event)"));
  document.body.appendChild(mask_elt);
  document.body.appendChild(card_elt);
  setTimeout(function () {
    utilities.qe("#".concat(temporary_id)).setAttribute('o', '1');
    utilities.qe("#".concat(temporary_id, "-mask")).setAttribute('o', '1');
  }, 1);
}
function removePatternComponentInfo(temporary_id, event) {
  event.preventDefault();
  interaction.SASBC(3);
  utilities.qe("body .pattern_editor_preview_component_info#".concat(temporary_id)).addEventListener('transitionend', function () {
    utilities.qe("body .pattern_editor_preview_component_info#".concat(temporary_id)).remove();
  }, {
    once: true
  });
  utilities.qe("body .pattern_editor_preview_component_info_mask#".concat(temporary_id, "-mask")).addEventListener('transitionend', function () {
    utilities.qe("body .pattern_editor_preview_component_info_mask#".concat(temporary_id, "-mask")).remove();
  }, {
    once: true
  });
  utilities.qe("body .pattern_editor_preview_component_info#".concat(temporary_id)).setAttribute('o', '0');
  utilities.qe("body .pattern_editor_preview_component_info_mask#".concat(temporary_id, "-mask")).setAttribute('o', '0');
}
function showComponentInEditor(temporary_id, component_id, event) {
  if (pattern_editor_current_editor === 'blocks') {}
  if (pattern_editor_current_editor === 'json') {
    var query = "\"".concat(component_id, "\"");
    var elt = utilities.qeAll('.pattern_editor .pattern_editor_box .pattern_editor_container[j="json"] .pattern2 .hljs-string');
    var elt_len = elt.length;
    var result_elt;
    for (var i = 0; i < elt_len; i++) {
      if (String(elt[i].innerText).indexOf(query) > -1) {
        result_elt = elt[i];
        break;
      }
    }
    var pattern = utilities.qe('.pattern_editor .pattern_editor_box .pattern_editor_container[j="json"] .pattern');
    var pattern2 = utilities.qe('.pattern_editor .pattern_editor_box .pattern_editor_container[j="json"] .pattern2');
    var offsetTop = result_elt.offsetTop - pattern2.getBoundingClientRect().height / 2 - result_elt.getBoundingClientRect().height / 2;
    pattern2.scrollTo({
      top: offsetTop,
      left: 0,
      behavior: 'smooth'
    });
    pattern.scrollTo({
      top: offsetTop,
      left: 0,
      behavior: 'smooth'
    });
  }
  removePatternComponentInfo(temporary_id, event);
}
function savePatternWithEditor(mode, ls_key) {
  var check = core_fine_grained_password.checkPatternQualification(pattern_json);
  if (!check.result) {
    /*interaction.prompt.prompt_message(`Cannot save pattern due to error${(check.errors.length > 1) ? 's' : ''}.`)*/
    interaction.pattern_editor.displaySavePatternErrors(check.errors);
    return '';
  }
  var string = JSON.stringify(pattern_json);
  var id = '';
  if (mode === 'new') {
    id = core_fine_grained_password.generate([{
      type: 'string',
      string: 'pwdgen2_pattern_b_'
    }, {
      type: 'regex',
      regex: '/[a-zA-Z0-9]/g',
      quantity: 32,
      repeat: true
    }], 'production');
  }
  if (mode === 'edit') {
    id = ls_key;
  }
  LS.setItem("".concat(id), string);
  interaction.prompt.prompt_message('Saved pattern.');
  interaction.pattern_editor.closePatternEditor();
  if (mode === 'edit' || mode === 'new') {
    interaction.pattern_manager.openPatternManager();
  }
}
function displaySavePatternErrors(errors) {
  interaction.SASBC(2);
  var error_html = function error_html(error) {
    var elt = document.createElement('div');
    elt.classList.add('pattern_editor_save_pattern_errors_list_item');
    var title_elt = document.createElement('div');
    title_elt.classList.add('pattern_editor_save_pattern_errors_list_item_title');
    title_elt.innerText = utilities.encodeSignsToHtmlEntities(error.message);
    elt.innerHTML = title_elt.outerHTML;
    return elt.outerHTML;
  };
  var errors_len = errors.length;
  var errors_html = [];
  for (var e = 0; e < errors_len; e++) {
    errors_html.push(error_html(errors[e]));
  }
  var temporary_id = core_fine_grained_password.generate([{
    type: 'string',
    string: 'e-'
  }, {
    type: 'regex',
    regex: '/[a-z0-9A-Z]/g',
    quantity: 16,
    repeat: true
  }], 'production');
  var elt = document.createElement('div');
  elt.id = temporary_id;
  elt.classList.add('pattern_editor_save_pattern_errors');
  elt.innerHTML = "<div class=\"pattern_editor_save_pattern_errors_title\">Occurred Error".concat(errors.length > 1 ? 's' : '', "</div><div class=\"pattern_editor_save_pattern_errors_list_container\"><div class=\"pattern_editor_save_pattern_errors_list\">").concat(errors_html.join(''), "</div></div><div class=\"pattern_editor_save_pattern_errors_button_box\"><div class=\"pattern_editor_save_pattern_errors_go_to_documents\" onclick=\"interaction.pattern_editor.go_to_documents()\">Go to docs</div><div class=\"pattern_editor_save_pattern_errors_close\" onclick=\"interaction.pattern_editor.removeSavePatternErrors('").concat(temporary_id, "',event)\">Close</div></div>");
  var mask = document.createElement('div');
  mask.id = "".concat(temporary_id, "-mask");
  mask.classList.add('pattern_editor_save_pattern_errors_mask');
  mask.setAttribute("onclick", "interaction.pattern_editor.removeSavePatternErrors('".concat(temporary_id, "',event)"));
  document.body.appendChild(mask);
  document.body.appendChild(elt);
  setTimeout(function () {
    utilities.qe("#".concat(temporary_id)).setAttribute('o', '1');
    utilities.qe("#".concat(temporary_id, "-mask")).setAttribute('o', '1');
  }, 1);
}
function removeSavePatternErrors(temporary_id, event) {
  event.preventDefault();
  interaction.SASBC(3);
  utilities.qe("body .pattern_editor_save_pattern_errors#".concat(temporary_id)).addEventListener('transitionend', function () {
    utilities.qe("body .pattern_editor_save_pattern_errors#".concat(temporary_id)).remove();
  }, {
    once: true
  });
  utilities.qe("body .pattern_editor_save_pattern_errors_mask#".concat(temporary_id, "-mask")).addEventListener('transitionend', function () {
    utilities.qe("body .pattern_editor_save_pattern_errors_mask#".concat(temporary_id, "-mask")).remove();
  }, {
    once: true
  });
  utilities.qe("body .pattern_editor_save_pattern_errors#".concat(temporary_id)).setAttribute('o', '0');
  utilities.qe("body .pattern_editor_save_pattern_errors_mask#".concat(temporary_id, "-mask")).setAttribute('o', '0');
}
function switchEditor(editor) {
  if (editor === 'blocks') {
    interaction.pattern_editor.syncAndFormatPatternEditorJSONEditor();
    /* pending message */
    interaction.prompt.prompt_message('This editor is unavailable at this time.');
    return '';
  }
  pattern_editor_current_editor = editor;
  var check = core_fine_grained_password.checkPatternQualification(pattern_json);
  if (!check.result) {
    displaySavePatternErrors(check.errors);
    return '';
  }
  var all_editor_container = utilities.qe(".pattern_editor_box .pattern_editor_container");
  var editor_container = utilities.qe(".pattern_editor_box .pattern_editor_container[j=\"".concat(editor, "\"]"));
  var all_tab = utilities.qeAll(".pattern_editor .pattern_editor_picker .pattern_editor_picker_option");
  var tab = utilities.qe(".pattern_editor .pattern_editor_picker .pattern_editor_picker_option[j=\"".concat(editor, "\"]"));
  for (var i = 0; i < 2; i++) {
    all_tab[i].setAttribute('s', '0');
    all_editor_container.setAttribute('s', '0');
  }
  tab.setAttribute('s', '1');
  editor_container.setAttribute('s', '1');
}
function go_to_documents() {
  window.open('https://github.com/EricHsia7/pwdgen2/tree/main#customizable-patterns');
}
;// CONCATENATED MODULE: ./src/core/share.ts




function shareViaURL(type, from, data, format) {
  var url = new URL('https://erichsia7.github.io/pwdgen2');
  url.searchParams.append('share', '1');
  url.searchParams.append('type', type);
  url.searchParams.append('from', from);
  url.searchParams.append('data', btoa(utilities.enur(data)));
  url.searchParams.append('format', format);
  if (navigator.canShare) {
    navigator.share({
      title: "Share ".concat(type),
      url: url.toString()
    });
  } else {
    user_interfaces_interaction.copyText(url.toString());
    user_interfaces_interaction.prompt.prompt_message('Copied link for sharing.');
  }
}
function receiveSharedContentFromURL(url) {
  url = new URL(url);
  var parameters = url.searchParams;
  var share = parameters.get('share');
  if (share === '1') {
    var type = parameters.get('type');
    var from = parameters.get('from');
    var data = utilities.deur(atob(String(parameters.get('data'))));
    var format = parameters.get('format');
    var valid = false;
    var json = {};
    if (format === 'json') {
      try {
        json = JSON.parse(data);
        valid = true;
      } catch (e) {
        user_interfaces_interaction.prompt.prompt_message('Invalid shared data.');
      }
    }
    if (valid) {
      if (type === 'pattern') {
        json = user_interfaces_interaction.pattern_editor.addIdentityToPattern(json);
        var id = core_fine_grained_password.generate([{
          type: 'string',
          string: 'pwdgen2_pattern_b_'
        }, {
          type: 'regex',
          regex: '/[a-zA-Z0-9]/g',
          quantity: 32,
          repeat: true
        }], 'production');
        if (!LS.hasOwnProperty(id)) {
          LS.setItem(id, JSON.stringify(json));
          user_interfaces_interaction.prompt.prompt_message('Saved shared pattern.');
          user_interfaces_interaction.pattern_manager.openPatternManager();
          history.replaceState(null, document.title, 'https://erichsia7.github.io/pwdgen2/');
        }
      }
    }
  }
}
window.Xshare = {
  shareViaURL: shareViaURL,
  receiveSharedContentFromURL: receiveSharedContentFromURL
};
/* harmony default export */ const share = (window.Xshare);
;// CONCATENATED MODULE: ./src/user-interfaces/pattern-manager.ts






function printPatterns() {
  var list = core_fine_grained_password.getPatterns(true);
  var list_len = list.length;
  var html = [];
  for (var i = 0; i < list_len; i++) {
    var this_item = list[i];
    var id = core_fine_grained_password.generate([{
      type: 'string',
      string: 'pattern-list-item'
    }, {
      type: 'regex',
      regex: '/[a-z0-9]/g',
      quantity: 16,
      repeat: true
    }], 'production');
    var ls_key = this_item.LocalStorageKey;
    html.push("<div class=\"pattern-item\" id=\"".concat(id, "\" default=\"").concat(this_item.default_pattern ? true : false, "\"><div class=\"pattern-item-icon\"><span class=\"material-symbols-rounded\">").concat(this_item.pattern_icon, "</span></div><div class=\"pattern-item-title\">").concat(this_item.pattern_name, "</div><div class=\"pattern-item-action\" onclick=\"").concat(this_item.default_pattern ? '' : "interaction.pattern_manager.showPatternOptions('" + ls_key + "','" + id + "',event)", "\">").concat(icons.icon_more_options, "</div></div>"));
  }
  utilities.qe('.pattern_manager .contents-box .pattern-list').innerHTML = html.join('');
}
function openPatternManager(event) {
  user_interfaces_interaction.show(utilities.qe('.pattern_manager'), 'block');
  user_interfaces_interaction.options.closeOptions(event);
  user_interfaces_interaction.pattern_manager.printPatterns();
  if (!lazyCSS.loaded.googleFontsMaterialSymbols) {
    user_interfaces_interaction.loadFont('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200', 'Material Symbols Rounded', 'googleFontsMaterialSymbols', function () {
      utilities.qe('.add-password-page .password-generator-presets').setAttribute('font', '1');
      utilities.qe('.pattern_manager .pattern-list').setAttribute('font', '1');
    });
  }
}
function closePatternManager() {
  user_interfaces_interaction.show(utilities.qe('.pattern_manager'), 'none');
}
function showPatternOptions(ls_key, id, even) {
  var optionItemString = function optionItemString(title, list_n, border, name, group, icon, onclick) {
    return "<li onclick=\"".concat(onclick, "\" style=\"--options-list-n:").concat(list_n, ";\" y=\"").concat(name, "\" group=\"").concat(group, "\"  b=\"").concat(border, "\"><div class=\"l_options_title\">").concat(title, "</div><div class=\"l_options_icon\">").concat(icon, "</div></li>");
  };
  var button = utilities.qe(".pattern_manager .contents-box .pattern-list .pattern-item#".concat(id, " .pattern-item-action"));
  var button_rect = button.getBoundingClientRect();
  var button_left = button_rect.left;
  var button_top = button_rect.top;
  var button_width = button_rect.width;
  var button_height = button_rect.height;
  var options_width = Math.min(Math.max(100, window.innerWidth - 20), 230);
  var options_height = 50 * 3;
  var options_left = button_left + button_width - options_width;
  var options_top = button_top + button_height + 5;
  var optiona_transform_origin = 'top right';
  if (options_top + options_height > window.innerHeight) {
    options_top = button_top - options_height - 5;
    optiona_transform_origin = 'bottom right';
  }
  var temporary_id = core_fine_grained_password.generate([{
    type: 'string',
    string: 'pattern-list-item'
  }, {
    type: 'regex',
    regex: '/[a-z0-9]/g',
    quantity: 16,
    repeat: true
  }], 'production');
  var options_elt = document.createElement('div');
  options_elt.id = temporary_id;
  options_elt.classList.add('pattern_item_options');
  options_elt.style.setProperty('--js-pattern-item-options-top', "".concat(options_top, "px"));
  options_elt.style.setProperty('--js-pattern-item-options-left', "".concat(options_left, "px"));
  options_elt.style.setProperty('--js-options-list-count', 3);
  options_elt.style.setProperty('--js-options-origin', optiona_transform_origin);
  options_elt.innerHTML += optionItemString('Edit', 0, 0, 'editpattern', 0, icons.icon_edit, "interaction.pattern_manager.removePatternOptions('".concat(temporary_id, "',event);interaction.pattern_editor.openPatternEditor('edit','").concat(ls_key, "',event,'").concat(temporary_id, "')"));
  options_elt.innerHTML += optionItemString('Delete', 1, 1, 'deletepattern', 0, icons.icon_delete, "interaction.pattern_manager.removePatternOptions('".concat(temporary_id, "',event);interaction.prompt.prompt_asking('Confirm to proceed to delete the pattern permanently.','Confirm',function() {interaction.pattern_manager.deletePattern(`").concat(ls_key, "`)},'Cancel',function() {interaction.prompt.prompt_message(`Canceled delection.`);interaction.options.closeOptions(event)});"));
  options_elt.innerHTML += optionItemString('Share', 2, 1, 'sharepattern', 0, icons.icon_share, "interaction.pattern_manager.removePatternOptions('".concat(temporary_id, "',event);interaction.pattern_manager.sharePattern('").concat(ls_key, "',event)"));
  var mask_elt = document.createElement('div');
  mask_elt.classList.add('pattern_item_options_mask');
  mask_elt.id = "".concat(temporary_id, "_mask");
  mask_elt.setAttribute("on".concat(utilities.checkTouchFeatures() ? 'touchstart' : 'mousedown'), "interaction.pattern_manager.removePatternOptions('".concat(temporary_id, "',event)"));
  document.body.appendChild(mask_elt);
  document.body.appendChild(options_elt);
  user_interfaces_interaction.show(utilities.qe(".pattern_item_options#".concat(temporary_id)), 'inline-block');
  user_interfaces_interaction.show(utilities.qe(".pattern_item_options_mask#".concat(temporary_id, "_mask")), 'block');
  setTimeout(function () {
    utilities.qe(".pattern_item_options#".concat(temporary_id)).setAttribute('k', '1');
  }, 1);
}
function removePatternOptions(temporary_id, event) {
  utilities.stopProp(event);
  utilities.qe(".pattern_item_options#".concat(temporary_id)).setAttribute('k', '0');
  utilities.qe(".pattern_item_options#".concat(temporary_id)).addEventListener('transitionend', function () {
    utilities.qe(".pattern_item_options#".concat(temporary_id)).remove();
    utilities.qe(".pattern_item_options_mask#".concat(temporary_id, "_mask")).remove();
  }, {
    once: true
  });
}
function sharePattern(ls_key) {
  if (LS.hasOwnProperty(ls_key)) {
    var json = JSON.parse(String(LS.getItem(ls_key)));
    json = user_interfaces_interaction.pattern_editor.removeIdentityFromPattern(json);
    share.shareViaURL('pattern', 'user', JSON.stringify(json), 'json');
  }
}
function deletePattern(ls_key) {
  if (LS.hasOwnProperty(ls_key)) {
    LS.removeItem(ls_key);
    user_interfaces_interaction.prompt.prompt_message('Deleted pattern.', 1200);
    user_interfaces_interaction.pattern_manager.printPatterns();
  }
}
;// CONCATENATED MODULE: ./src/core/words-list.ts
// Import required functions



function getWordsList() {
  if (!words_list.loaded) {
    if (LS.hasOwnProperty('pwdgen2_words_list_cache')) {
      var text = String(LS.getItem('pwdgen2_words_list_cache'));
      var array = text.split(/\n/g).forEach(function (e) {
        if (words_list.c.hasOwnProperty(e.substring(0, 3))) {
          words_list.c[e.substring(0, 3)].push(e);
        } else {
          words_list.c[e.substring(0, 3)] = [e];
        }
      });
      words_list.loaded = true;
      return '';
    }
    var url = "https://erichsia7.github.io/pwdgen2/words_list/index.txt?".concat(new Date().getTime());
    var handleProgress = function handleProgress(progress) {
      words_list.progress = progress;
    };
    utilities.fetchWithProgress(url, handleProgress).then(function (text) {
      var array = text.split(/\n/g).forEach(function (e) {
        if (words_list.c.hasOwnProperty(e.substring(0, 3))) {
          words_list.c[e.substring(0, 3)].push(e);
        } else {
          words_list.c[e.substring(0, 3)] = [e];
        }
      });
      words_list.loaded = true;
      LS.setItem('pwdgen2_words_list_cache', text);
    })["catch"](function (error) {
      //console.error('Error fetching URL:', error);
    });
  }
}

// Expose functions to the global scope
window.words_list = {
  loaded: false,
  progress: 0,
  c: {},
  getWordsList: getWordsList
};
/* harmony default export */ const core_words_list = (window.words_list);
;// CONCATENATED MODULE: ./src/core/check-password.ts
// Import required functions


function checkCommonWordPatterns(string) {
  if (!core_words_list.loaded) {
    core_words_list.getWordsList();
    return 0;
  }
  string = string.toLowerCase();
  var len = string.length;
  var matched = [];
  for (var i = 0; i < len; i++) {
    // Narrow down the range by prefixes and pre-distributed index.
    if (core_words_list.c.hasOwnProperty(string.substring(i, i + 3))) {
      var arr = core_words_list.c[string.substring(i, i + 3)].slice();
      var arr_len = arr.length;
      // Check if the string includes a word in the range.
      for (var r = 0; r < arr_len; r++) {
        if (string.indexOf(arr[r].trim()) !== -1 && matched.indexOf(arr[r]) < 0) {
          matched.push(arr[r]);
        }
      }
    }
  }
  // Sort the matched list by length from long to short to avoid counting subsets in a series of a root word repeatedly.
  // For example, "suitable" includes "suit" and "able".
  matched.sort(function (a, b) {
    return b.length - a.length;
  });
  var matched_len = matched.length;
  for (var g = 0; g < matched_len; g++) {
    string = string.replaceAll(matched[g].trim(), '');
  }
  // Calculate the length proportion of the filtered string and the original string.
  // Return a number in the range from 0 to 1.
  return string.length / len;
}
function checkPassword(string, cache, id) {
  var getPoints = function getPoints(string) {
    // Use the stats to get a function
    // 1. Generate plenty of strong passwords using the generator.
    // 2. Use "moved character length/distance between the original string and sorting by the unicode version" to calculate the points.
    // 3. Create a chart to calculate the count.
    // 4. Use the count as the weight of the final points.
    // 5. Create a function (randomnessX) that loads up various relationships between original points and final points from 0 to 100.
    var randomnessX = function randomnessX(x) {
      return Math.min(100, Math.max(0, (8.31 - 1.89 * x + 0.0743 * Math.pow(x, 2) - 5.91 * Math.pow(10, -4) * Math.pow(x, 3)) / 35.89 * 100));
    };
    // Use the stats to get a formula (length).
    var length = -42.7 + 29.7 * Math.log(string.length);
    var arr = string.split('');
    var arr_len = arr.length;
    var randomness = 0;
    var n_arr = [];
    var json = {};
    var t = [];
    for (var w = 0; w < arr_len; w++) {
      // Create an array to log their content, index, and unicode.
      n_arr.push({
        c: arr[w],
        i: w,
        u: String(arr[w]).charCodeAt(0)
      });
      // Create an object to calculate the proportion of same/used characters in the password → analyze the ingredients of the password.
      json['u_' + String(arr[w]).charCodeAt(0)] = json.hasOwnProperty('u_' + String(arr[w]).charCodeAt(0)) ? json['u_' + String(arr[w]).charCodeAt(0)] + 1 : 1;
    }
    // Sort the array by unicode.
    n_arr.sort(function (a, b) {
      return a.u - b.u;
    });
    // Calculate the total moving steps/distance of characters.
    for (var w = 0; w < arr_len; w++) {
      randomness += Math.abs(w - n_arr[w].i);
    }
    // Convert total distance to points in the range from 0 to 100 and use the function to calculate the final points.
    randomness = randomnessX(randomness / n_arr.length / (string.length / 2) * 100);
    var repeat = 0;
    var repeat_len = 0;
    // Calculate the proportion of same/used characters and length.
    for (var w in json) {
      repeat += json[w];
      repeat_len += 1;
    }
    // Calculate the final points in the range from 0 to 100.
    repeat = (1 - repeat / repeat_len / string.length) * 100;
    // Calculate the proportion of types of characters.
    t.push(string.match(/[A-Z]*/gm).join('').length);
    t.push(string.match(/[a-z]*/gm).join('').length);
    t.push(string.match(/[0-9]*/gm).join('').length);
    t.push(string.length - t[0] - t[1] - t[2]);
    var t_avg = string.length / 4;
    var t_s = 0;
    for (var w = 0; w < 4; w++) {
      t_s += Math.pow(t[w] - t_avg, 2);
    }
    // Calculate the standard deviation to get the degrees of evening distribution/degrees of richness in type.
    var ty = (1 - Math.min(Math.max(Math.sqrt(t_s / 4) / t_avg, 0), 1)) * 100;
    var commonWords = checkCommonWordPatterns(string) * 100;

    // Combine the indicators with weights into single points.
    return [Math.min(Math.max(Math.floor((length * 3 + randomness * 1.7 + repeat * 2 + ty * 2 + commonWords * 2) / 10.7), 0), 100), Math.floor(length), Math.floor(randomness), Math.floor(repeat), Math.floor(ty), Math.floor(commonWords), t[0], t[1], t[2], t[3]];
  };
  // Give colors and phrases depending on the points/levels.
  var judgePoints = function judgePoints(points) {
    var phrase = '';
    var r,
      g,
      b = 0;
    if (points >= 85) {
      phrase = 'strong';
      r = 52;
      g = 199;
      b = 89;
    }
    if (points >= 60 && points < 85) {
      phrase = 'average';
      r = 242;
      g = 190;
      b = 0;
    }
    if (points >= 45 && points < 60) {
      phrase = 'fragile';
      r = 255;
      g = 149;
      b = 0;
    }
    if (points < 45) {
      phrase = 'unsafe';
      r = 255;
      g = 59;
      b = 48;
    }
    return [phrase, r, g, b];
  };
  var getReport = function getReport(length_points, randomness_points, repeat_points, complexity_points, uniqueness_points, n1, n2, n3, n4) {
    // Give suggestions depending on the points of indicators.
    var points_summary = 5;
    // Initialize a set to store used instructions.
    var used_instructions = new Set();
    // Length Instructions
    if (length_points <= 25 && !used_instructions.has('length_short')) {
      var Length_Instructions = 'The length of this password is too short. Suggest you make it long enough.';
      used_instructions.add('length_short');
    } else if (length_points >= 26 && length_points <= 50 && !used_instructions.has('length_not_long')) {
      var Length_Instructions = "The length of this password isn't long enough. Suggest you make it longer.";
      used_instructions.add('length_not_long');
    } else if (length_points >= 51 && length_points <= 75 && !used_instructions.has('length_average')) {
      var Length_Instructions = 'The length of this password is average. Recommend you make it longer.';
      used_instructions.add('length_average');
    } else if (length_points >= 76 && !used_instructions.has('length_long_enough')) {
      var Length_Instructions = 'The length of this password is long enough, but please keep awareness of the security of your accounts.';
      used_instructions.add('length_long_enough');
      points_summary -= 1;
    }

    // Randomness Instructions
    if (randomness_points <= 25 && !used_instructions.has('randomness_neat')) {
      var Randomness_Instructions = "The arrangement of characters in this password is too neat, so the password isn't random. Suggest you rearrange the characters.";
      used_instructions.add('randomness_neat');
    } else if (randomness_points >= 26 && randomness_points <= 50 && !used_instructions.has('randomness_not_messy')) {
      var Randomness_Instructions = "The arrangement of characters in this password isn't messy enough, so the password isn't random. Suggest you rearrange the characters.";
      used_instructions.add('randomness_not_messy');
    } else if (randomness_points >= 51 && randomness_points <= 75 && !used_instructions.has('randomness_average')) {
      var Randomness_Instructions = 'The arrangement of characters in this password is randomly distributed on average. Recommend you rearrange the characters.';
      used_instructions.add('randomness_average');
    } else if (randomness_points >= 76 && !used_instructions.has('randomness_random')) {
      var Randomness_Instructions = 'The arrangement of characters in this password is entirely random, but please keep awareness of the security of your accounts.';
      used_instructions.add('randomness_random');
      points_summary -= 1;
    }

    // Repeat Instructions
    if (repeat_points <= 25 && !used_instructions.has('repeat_entirely')) {
      var Repeat_Instructions = 'In this password, the characters are entirely repeated, which can pose a danger to your account. Suggest you regenerate a new one.';
      used_instructions.add('repeat_entirely');
    } else if (repeat_points >= 26 && repeat_points <= 50 && !used_instructions.has('repeat_repeated')) {
      var Repeat_Instructions = 'In this password, the characters are repeated, which might cause potential dangers to your account. Suggest you regenerate a new one.';
      used_instructions.add('repeat_repeated');
    } else if (repeat_points >= 51 && repeat_points <= 75 && !used_instructions.has('repeat_slightly')) {
      var Repeat_Instructions = 'In this password, the characters are slightly repeated, which is not a strict problem, but still suggest you regenerate a new one.';
      used_instructions.add('repeat_slightly');
    } else if (repeat_points >= 76 && !used_instructions.has('repeat_hardly')) {
      var Repeat_Instructions = 'In this password, the characters are hardly repeated, but please keep awareness of the security of your accounts.';
      used_instructions.add('repeat_hardly');
      points_summary -= 1;
    }

    // Complexity Instructions
    if (complexity_points <= 25 && !used_instructions.has('complexity_not_complex')) {
      var Complexity_Instructions = "This password consists of ".concat(n1, " uppercases, ").concat(n2, " lowercases, ").concat(n3, " digits, and ").concat(n4, " other types of characters. The types of characters in this password aren't complex and rich enough. Suggest you regenerate a new password that includes all the types of characters.");
      used_instructions.add('complexity_not_complex');
    } else if (complexity_points >= 26 && complexity_points <= 50 && !used_instructions.has('complexity_not_complex_enough')) {
      var Complexity_Instructions = "This password consists of ".concat(n1, " uppercases, ").concat(n2, " lowercases, ").concat(n3, " digits, and ").concat(n4, " types of other characters. The types of characters in this password aren't complex and rich enough. Suggest you regenerate a new password that includes all the types of characters.");
      used_instructions.add('complexity_not_complex_enough');
    } else if (complexity_points >= 51 && complexity_points <= 75 && !used_instructions.has('complexity_not_complex_enough_2')) {
      var Complexity_Instructions = "This password consists of ".concat(n1, " uppercases, ").concat(n2, " lowercases, ").concat(n3, " digits, and ").concat(n4, " other types of characters. The types of characters in this password aren't complex and rich enough. Recommend you regenerate a new password that includes all the types of characters.");
      used_instructions.add('complexity_not_complex_enough_2');
    } else if (complexity_points >= 76 && !used_instructions.has('complexity_complex')) {
      var Complexity_Instructions = "This password consists of ".concat(n1, " uppercases, ").concat(n2, " lowercases, ").concat(n3, " digits, and ").concat(n4, " other types of characters. The types of characters in this password are complex and rich. But please keep awareness of the security of your accounts.");
      used_instructions.add('complexity_complex');
      points_summary -= 1;
    }
    // Uniqueness Instructions
    if (uniqueness_points <= 25 && !used_instructions.has('uniqueness_not_unique')) {
      var Uniqueness_Instructions = "This password includes many common words. Suggest you remove the words from this password to make it more secure.";
      used_instructions.add('complexity_not_complex');
    } else if (uniqueness_points >= 26 && uniqueness_points <= 50 && !used_instructions.has('uniqueness_not_unique_enough')) {
      var Uniqueness_Instructions = "This password includes some common words. Suggest you remove the words from this password to make it more secure.";
      used_instructions.add('complexity_not_complex_enough');
    } else if (uniqueness_points >= 51 && uniqueness_points <= 99 && !used_instructions.has('uniqueness_not_unique_enough_2')) {
      var Uniqueness_Instructions = "This password includes common words. Suggest you remove the words from this password to make it more secure.";
      used_instructions.add('complexity_not_complex_enough_2');
    } else if (uniqueness_points >= 100 && !used_instructions.has('uniqueness_unique')) {
      var Uniqueness_Instructions = "This password doesn't include common words collected in our list. But please keep awareness of the security of your accounts.";
      used_instructions.add('complexity_complex');
      points_summary -= 1;
    }
    if (points_summary === 0) {
      points_summary = 'no';
    }
    var report = "According to the points, this password has ".concat(points_summary, " problem").concat(points_summary > 1 ? 's' : '', ".\nAll you have to do is follow the instructions:\n1. ").concat(Length_Instructions, "\n2. ").concat(Randomness_Instructions, "\n3. ").concat(Repeat_Instructions, "\n4. ").concat(Complexity_Instructions, "\n5. ").concat(Uniqueness_Instructions);
    return report;
  };
  // Use cache to avoid running the report repeatedly and cause performance problems.
  if (cache) {
    var LS_key = "pwdgen2_saved_b_".concat(id);
    var LS_cache_key = "pwdgen2_check_cache_b_".concat(id);
    var nowtime = new Date().getTime();
    if (LS.hasOwnProperty(LS_cache_key)) {
      var cached_result_points = parseInt(String(LS.getItem(LS_cache_key)).split(':')[1]);
      var cached_result_time_stamp = parseInt(String(LS.getItem(LS_cache_key)).split(':')[0]);
      var ju = judgePoints(cached_result_points);
      if (nowtime - cached_result_time_stamp < 43200000) {
        return {
          points: cached_result_points,
          phrase: ju[0],
          color: {
            r: ju[1],
            g: ju[2],
            b: ju[3]
          },
          details: null
        };
      } else {
        LS.removeItem(LS_cache_key);
      }
    }
  }
  var points = getPoints(string);
  var ju = judgePoints(points[0]);
  var ju_length = judgePoints(points[1]);
  var ju_randomness = judgePoints(points[2]);
  var ju_repeat = judgePoints(points[3]);
  var ju_complexity = judgePoints(points[4]);
  var ju_uniqueness = judgePoints(points[5]);
  if (cache) {
    LS.setItem(LS_cache_key, nowtime + ':' + points[0]);
  }
  return {
    points: points[0],
    phrase: ju[0],
    color: {
      r: ju[1],
      g: ju[2],
      b: ju[3]
    },
    details: {
      len: {
        points: points[1],
        color: {
          r: ju_length[1],
          g: ju_length[2],
          b: ju_length[3]
        }
      },
      randomness: {
        points: points[2],
        color: {
          r: ju_randomness[1],
          g: ju_randomness[2],
          b: ju_randomness[3]
        }
      },
      repeat: {
        points: points[3],
        color: {
          r: ju_repeat[1],
          g: ju_repeat[2],
          b: ju_repeat[3]
        }
      },
      complexity: {
        points: points[4],
        color: {
          r: ju_complexity[1],
          g: ju_complexity[2],
          b: ju_complexity[3]
        }
      },
      uniqueness: {
        points: points[5],
        color: {
          r: ju_uniqueness[1],
          g: ju_uniqueness[2],
          b: ju_uniqueness[3]
        }
      },
      report: getReport(points[1], points[2], points[3], points[4], points[5], points[6], points[7], points[8], points[9])
    }
  };
}
;// CONCATENATED MODULE: ./src/user-interfaces/password.ts





function openPassword(id, showCallback) {
  interaction.show(utilities.qe('.password-page'), 'block', showCallback);
  utilities.qe(".options li[y=\"editpassword\"]").setAttribute('onclick', "interaction.edit_password.openEditPassword('".concat(id, "',event)"));
  utilities.qe(".options li[y=\"deletepassword\"]").setAttribute('onclick', "interaction.password_page.deletePassword('".concat(id, "',event)"));
  interaction.SASBC(0);
  if (!password_page_icon_loaded) {
    password_page_icon_loaded = true;
    var copy_btn = utilities.qeAll('.password-page .details-item-copy');
    var copy_btn_len = copy_btn.length;
    for (var q = 0; q < copy_btn_len; q++) {
      copy_btn[q].innerHTML = icons.icon_copy;
    }
  }
  if (LS.hasOwnProperty("pwdgen2_saved_b_".concat(id))) {
    var json = JSON.parse(String(LS.getItem("pwdgen2_saved_b_".concat(id))));
    var note_plain_text = json.note === null ? '' : utilities.deur(atob(String(json.note)));
    var password = utilities.deur(utilities.decryptString(json.encrypted_password, json.aes_iv)) || '';
    utilities.qe('.password-page .details-item-value[k="username"] input').value = json.username || '';
    utilities.qe('.password-page .details-item-value[k="password"] input').value = password;
    utilities.qe('.password-page .details-item-value[k="website"] input').value = json.website || '';
    utilities.qe('.password-page .details-item-value[k="createdat"] input').value = utilities.timestr(new Date(json.time_stamp)) || '';
    utilities.qe('.password-page .details-note-content').innerHTML = interaction.generateHashTagHTML(note_plain_text);
    var check = checkPassword(password, false, id);
    var setCheckResultItem = function setCheckResultItem(type, i, r, g, b, points, phrase) {
      var q = ".password-page .details-check-result .details-check-result-".concat(type, "[i=\"").concat(i, "\"] .details-check-result-points");
      var qp = ".password-page .details-check-result .details-check-result-".concat(type, "[i=\"").concat(i, "\"] .details-check-result-phrase");
      utilities.qe(q).innerText = points;
      utilities.qe(q).style.setProperty('--js-check-color-r', r);
      utilities.qe(q).style.setProperty('--js-check-color-g', g);
      utilities.qe(q).style.setProperty('--js-check-color-b', b);
      utilities.qe(qp).innerText = phrase;
    };
    setCheckResultItem('summary', 'summary', check.color.r, check.color.g, check.color.b, check.points, "This password is ".concat(check.phrase, "."));
    setCheckResultItem('item', 'length', check.details.len.color.r, check.details.len.color.g, check.details.len.color.b, check.details.len.points, "Length");
    setCheckResultItem('item', 'randomness', check.details.randomness.color.r, check.details.randomness.color.g, check.details.randomness.color.b, check.details.randomness.points, "Randomness");
    setCheckResultItem('item', 'repeat', check.details.repeat.color.r, check.details.repeat.color.g, check.details.repeat.color.b, check.details.repeat.points, "Repeat");
    setCheckResultItem('item', 'complexity', check.details.complexity.color.r, check.details.complexity.color.g, check.details.complexity.color.b, check.details.complexity.points, "Complexity");
    setCheckResultItem('item', 'uniqueness', check.details.uniqueness.color.r, check.details.uniqueness.color.g, check.details.uniqueness.color.b, check.details.uniqueness.points, "Uniqueness");
    utilities.qe('.password-page .details-check-result .details-check-result-report').innerText = check.details.report;
  }
}
function closePassword() {
  utilities.qe('.password-page').scrollTop = 0;
  utilities.qe('.password-page .fixed-title-box').setAttribute('scroll', '0');
  interaction.show(utilities.qe('.password-page'), 'none');
  interaction.SASBC(3);
}
function openAddPassword(event) {
  interaction.show(utilities.qe('.add-password-page'), 'block');
  if (!lazyCSS.loaded.googleFontsMaterialSymbols) {
    interaction.loadFont('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,0,0', 'Material Symbols Rounded', 'googleFontsMaterialSymbols', function () {
      utilities.qe('.add-password-page .password-generator-presets').setAttribute('font', '1');
      utilities.qe('.pattern_manager .pattern-list').setAttribute('font', '1');
    });
  }
  interaction.SASBC(0);
  interaction.add_password.printPatternPresets();
  utilities.qe('.add-password-page .add-list .add-item-value[k="password"] input').value = core_fine_grained_password.generate(core_fine_grained_password.getPatterns(false)[0].pattern, 'production');
  utilities.qe('.add-password-page .add-list .add-item-value[k="username"] input').value = '';
  utilities.qe('.add-password-page .add-list .add-item-value[k="website"] input').value = '';
  interaction.options.closeOptions(event);
}
function closeAddPassword() {
  interaction.show(utilities.qe('.add-password-page'), 'none');
  interaction.SASBC(3);
}
function addPasswordWithForm() {
  var password = utilities.qe('.add-password-page .add-list .add-item-value[k="password"] input').value || '';
  var username = utilities.qe('.add-password-page .add-list .add-item-value[k="username"] input').value || '';
  var website = utilities.qe('.add-password-page .add-list .add-item-value[k="website"] input').value || '';
  var addedpassword = addPassword(password, username, website, '');
  interaction.prompt.prompt_message('Added password.', 1200);
  interaction.add_password.closeAddPassword();
  interaction.password_page.openPassword(addedpassword, function () {
    interaction.main_page.printSavedPasswordList();
  });
}
function printPatternPresets(place) {
  var html = [];
  var list = core_fine_grained_password.getPatterns(false);
  var list_len = list.length;
  for (var i = 0; i < list_len; i++) {
    var p = list[i];
    var h = "<li class=\"preset\" apply=\"".concat(i === 0 ? 1 : 0, "\" index=\"").concat(i, "\" onclick=\"interaction.add_password.applyPreset(").concat(i, ")\"><div class=\"preset_icon\"><span class=\"material-symbols-rounded\">").concat(p.pattern_icon, "</span></div><span class=\"preset_name\">").concat(p.pattern_name, "</span></li>");
    html.push(h);
  }
  utilities.qe('.add-password-page .password-generator-presets').innerHTML = html.join('');
}
function applyPreset(index) {
  var list = core_fine_grained_password.getPatterns(false);
  var preset = list[index];
  utilities.qe('.add-password-page .add-list .add-item-value[k="password"] input').value = core_fine_grained_password.generate(preset.pattern, 'production');
  var all_preset = utilities.qeAll('.add-password-page .password-generator-presets .preset');
  var all_preset_len = all_preset ? all_preset.length : 0;
  for (var o = 0; o < all_preset_len; o++) {
    all_preset[o].setAttribute('apply', '0');
  }
  var this_preset = utilities.qe(".add-password-page .password-generator-presets .preset[index=\"".concat(index, "\"]"));
  this_preset.setAttribute('apply', '1');
}
function openEditPassword(id, event) {
  interaction.show(utilities.qe('.edit-password-page'), 'block');
  closePassword();
  utilities.qe(".edit-password-page .fixed-title-box .btn.right-top-corner").setAttribute('onclick', "interaction.edit_password.modifyPasswordWithEditor('".concat(id, "')"));
  utilities.qe(".edit-password-page .fixed-title-box .btn.left-top-corner").setAttribute('onclick', "interaction.edit_password.closeEditPassword('".concat(id, "')"));
  interaction.options.closeOptions(event);
  interaction.SASBC(0);
  if (LS.hasOwnProperty("pwdgen2_saved_b_".concat(id))) {
    var json = JSON.parse(String(LS.getItem("pwdgen2_saved_b_".concat(id))));
    var note_plain_text = json.note === null ? '' : utilities.deur(atob(String(json.note)));
    var password = utilities.deur(utilities.decryptString(json.encrypted_password, json.aes_iv)) || '';
    utilities.qe('.edit-password-page .edit-item-value[k="username"] input').value = json.username || '';
    utilities.qe('.edit-password-page .edit-item-value[k="password"] input').value = password;
    utilities.qe('.edit-password-page .edit-item-value[k="website"] input').value = json.website || '';
    utilities.qe('.edit-password-page .edit-item-value[k="createdat"] input').value = utilities.timestr(new Date(json.time_stamp)) || '';
    utilities.qe('.edit-password-page .edit-note-content').innerHTML = note_plain_text;
  }
}
function closeEditPassword(id) {
  utilities.qe('.edit-password-page').scrollTop = 0;
  interaction.show(utilities.qe('.edit-password-page'), 'none');
  interaction.SASBC(3);
  interaction.password_page.openPassword(id);
}
function modifyPasswordWithEditor(id) {
  var password = utilities.qe('.edit-password-page .edit-list .edit-item-value[k="password"] input').value || '';
  var username = utilities.qe('.edit-password-page .edit-list .edit-item-value[k="username"] input').value || '';
  var website = utilities.qe('.edit-password-page .edit-list .edit-item-value[k="website"] input').value || '';
  //var time_stamp = new Date().toISOString()
  var note = utilities.qe('.edit-password-page .edit-note-content').textContent || '';
  modifyPassword(password, username, website, note, id);
  interaction.prompt.prompt_message('Saved changes.', 1200);
  interaction.edit_password.closeEditPassword();
  interaction.password_page.openPassword(id, function () {
    interaction.main_page.printSavedPasswordList();
  });
}
function deletePassword(id, event) {
  interaction.options.closeOptions(event);
  interaction.prompt.prompt_asking('Confirm to proceed to permanently delete the password.', 'Confirm', function () {
    interaction.password_page.confirmToDeletePassword(id, event);
  }, 'Cancel', function () {
    interaction.prompt.prompt_message('Cancelled deletion.', 1200);
  });
}
function confirmToDeletePassword(id) {
  var remove = removePassword(id);
  if (remove) {
    interaction.prompt.prompt_message('Deleted the password permanently.');
    interaction.password_page.closePassword();
    interaction.main_page.printSavedPasswordList();
  } else {
    interaction.prompt.prompt_message('Failed to delete the password.');
  }
}
;// CONCATENATED MODULE: ./src/user-interfaces/interaction.ts








var FontFaceObserver = __webpack_require__(8904);
var SASBCH = [0, 0, 0]; // Stand Alone Status Bar Color History

window.search_evt = 0;
window.lazyCSS = {
  loaded: {
    googleFontsNotoSans: false,
    googleFontsMaterialSymbols: false
  }
};
window.lazyPasswordListIcons = {
  unloaded: [],
  loaded: []
};
window.prompt_register = {};
function lazyLoadPasswordListIcon(identity, url) {
  var item_elt = utilities.qe(".password-list .password-item[pwd-id=\"".concat(identity, "\"]"));
  var icon_elt = item_elt.querySelector('.password-item-website-icon');
  if (item_elt.getAttribute('icon') === '0') {
    var index = window.lazyPasswordListIcons.unloaded.indexOf(identity);
    if (index > -1) {
      window.lazyPasswordListIcons.unloaded.splice(index, 1);
      window.lazyPasswordListIcons.loaded.push(identity);
      item_elt.setAttribute('icon', '1');
      icon_elt.style.setProperty('--js-website-icon', "url(".concat(url, ")"));
    }
  }
}
function lazyLoadPasswordListIcons_scrolling_handler(event) {
  var isElementInViewport = function isElementInViewport(container, element) {
    var containerRect = container.getBoundingClientRect();
    var elementRect = element.getBoundingClientRect();
    var containerTop = containerRect.top;
    var containerLeft = containerRect.left;
    var containerBottom = containerRect.bottom;
    var containerRight = containerRect.right;
    var elementTop = elementRect.top;
    var elementLeft = elementRect.left;
    var elementBottom = elementRect.bottom;
    var elementRight = elementRect.right;
    var isInViewport = elementTop >= containerTop && elementLeft >= containerLeft && elementBottom <= containerBottom && elementRight <= containerRight;
    return isInViewport;
  };
  var container = utilities.qe('.main-page .contents-box'); // Replace 'container' with your container's ID or reference
  var allPasswordElt = utilities.qeAll('.main-page .contents-box .password-list .password-item');
  var allPasswordElt_len = allPasswordElt.length;
  for (var o = 0; o < allPasswordElt_len; o++) {
    if (isElementInViewport(container, allPasswordElt[o])) {
      var this_id = allPasswordElt[o].getAttribute('pwd-id');
      if (!(window.lazyPasswordListIcons.unloaded.indexOf(this_id) > -1)) {
        window.lazyPasswordListIcons.unloaded.push(this_id);
      }
      interaction.main_page.lazyLoadPasswordListIcon(this_id, allPasswordElt[o].getAttribute('icon-url'));
    }
  }
}
function loadCSS(url, identity) {
  if (!window.lazyCSS.loaded[identity]) {
    var link = document.createElement('link');
    link.setAttribute('href', url);
    link.setAttribute('rel', 'stylesheet');
    document.head.appendChild(link);
    window.lazyCSS.loaded[identity] = true;
  }
}
function loadFont(url, fontName, identity, loadedCallback) {
  loadCSS(url, identity);
  if (typeof loadedCallback === 'function') {
    var font = new FontFaceObserver(fontName);
    font.load().then(function () {
      loadedCallback();
    });
  }
}
function show(element, display, callback) {
  var class_str = element.getAttribute('class');
  var style_str = element.getAttribute('style');
  element.setAttribute('class', class_str.replaceAll(/show-display-[a-z-]*[^\s]/gm, ''));
  element.setAttribute('style', String(style_str).replaceAll(/display[\s]*:{1,1}[\sa-z-]*;{1,1}[^\s]*/gm, ''));
  element.classList.add("show-display-".concat(display));
  if (typeof callback === 'function') {
    callback();
  }
}
function prompt_message(message, duration) {
  if (isNaN(duration)) {
    duration = 1200;
  }
  message = String(message);
  var all_prompt = utilities.qeAll('.prompt');
  if (!(all_prompt === null)) {
    var all_prompt_len = all_prompt.length;
    for (var e = 0; e < all_prompt_len; e++) {
      all_prompt[e].remove();
    }
  }
  var duration_base = 180;
  var translateY = -25;
  var prompt_id = core_fine_grained_password.generate([{
    type: 'string',
    string: 'p_'
  }, {
    type: 'regex',
    regex: '/[a-z0-9]/g',
    quantity: 16,
    repeat: true
  }], 'production');
  var prompt_element = document.createElement('div');
  prompt_element.id = prompt_id;
  prompt_element.classList.add('prompt');
  prompt_element.classList.add('prompt_animation_' + prompt_id);
  var prompt_center_element = document.createElement('div');
  prompt_center_element.classList.add('prompt_content');
  prompt_center_element.innerText = message;
  prompt_element.appendChild(prompt_center_element);
  var prompt_css = ".prompt_animation_".concat(prompt_id, "{animation-timing-function:cubic-bezier(.21,.75,.1,.96);animation-name:prompt").concat(prompt_id, ";animation-duration:").concat(duration + duration_base * 2, "ms;animation-fill-mode:forwards;animation-timing-function:ease-in-out}@keyframes prompt").concat(prompt_id, "{0%{opacity:0;transform:translateX(-50%) translateY(").concat(translateY, "px) scale(0.8);}").concat(Math.floor(duration_base / (duration + duration_base + 150) * 100), "%{opacity:1;transform:translateX(-50%) translateY(calc(").concat(translateY, "px)) scale(1);}").concat(Math.floor((duration_base + duration) / (duration + duration_base + 150) * 100), "%{opacity:1;transform:translateX(-50%) translateY(calc(").concat(translateY, "px)) scale(1);}100%{opacity:0;transform:translateX(-50%) translateY(").concat(translateY, "px) scale(1);}}");
  var prompt_css_element = document.createElement('style');
  prompt_css_element.innerHTML = prompt_css;
  prompt_element.appendChild(prompt_css_element);
  document.body.appendChild(prompt_element);
  document.getElementById(prompt_id).addEventListener('animationend', function () {
    if (!(document.getElementById(prompt_id) === null)) {
      document.getElementById(prompt_id).remove();
    }
  }, {
    once: true
  });
}
function prompt_asking(message, option1, option1_func, option2, option2_func) {
  var temporary_id = core_fine_grained_password.generate([{
    type: 'string',
    string: 'a_'
  }, {
    type: 'regex',
    regex: '/[a-z0-9]/g',
    quantity: 16,
    repeat: true
  }], 'production');
  var mask_elt = document.createElement('div');
  mask_elt.classList.add('prompt_asking_mask');
  mask_elt.id = "".concat(temporary_id, "_mask");
  var prompt_asking_elt = document.createElement('div');
  prompt_asking_elt.classList.add('prompt_asking');
  prompt_asking_elt.id = temporary_id;
  prompt_asking_elt.innerHTML = "<div class=\"prompt_asking_message\">".concat(message, "</div><div class=\"prompt_asking_options\"><div class=\"prompt_asking_option1\" onclick=\"prompt_register['").concat(temporary_id, "']['opt1']()\">").concat(option1, "</div><div class=\"prompt_asking_option2\" onclick=\"prompt_register['").concat(temporary_id, "']['opt2']()\">").concat(option2, "</div></div>");
  document.body.appendChild(mask_elt);
  document.body.appendChild(prompt_asking_elt);
  prompt_register[temporary_id] = {};
  prompt_register[temporary_id]['opt1'] = function () {
    option1_func();
    interaction.prompt.close_prompt_asking(temporary_id);
  };
  prompt_register[temporary_id]['opt2'] = function () {
    option2_func();
    interaction.prompt.close_prompt_asking(temporary_id);
  };
  setTimeout(function () {
    utilities.qe("body #".concat(temporary_id)).setAttribute('o', '1');
    utilities.qe("body #".concat(temporary_id, "_mask")).setAttribute('o', '1');
  }, 1);
  interaction.SASBC(2);
}
function close_prompt_asking(temporary_id) {
  utilities.qe("body #".concat(temporary_id)).addEventListener('transitionend', function () {
    utilities.qe("body #".concat(temporary_id)).remove();
  }, {
    once: true
  });
  utilities.qe("body #".concat(temporary_id, "_mask")).addEventListener('transitionend', function () {
    utilities.qe("body #".concat(temporary_id, "_mask")).remove();
    delete prompt_register[temporary_id];
  }, {
    once: true
  });
  utilities.qe("body #".concat(temporary_id)).setAttribute('o', '0');
  utilities.qe("body #".concat(temporary_id, "_mask")).setAttribute('o', '0');
  interaction.SASBC(3);
}
//Stand Alone Status Bar Color
function SASBC(a) {
  var c = '#ffffff';
  var d = '#050506';
  if (a === 1) {
    c = '#f9f9fb';
    d = '#0e0e11';
  }
  if (a === 2) {
    var a1 = interaction.SASBCH[interaction.SASBCH.length - 1] | 0;
    if (a1 === 0) {
      c = '#8c8c8c';
      d = '#030303';
    }
    if (a1 === 1) {
      c = '#89898a';
      d = '#080809';
    }
  }
  if (a === 3) {
    var a2 = interaction.SASBCH[interaction.SASBCH.length - 2] | 0;
    interaction.SASBCH.splice(SASBCH.length - 1, 1);
    interaction.SASBC(a2);
    return '';
  }
  utilities.qe('head meta[mode="light"]').setAttribute('content', c);
  utilities.qe('head meta[mode="dark"]').setAttribute('content', d);
  if (!(interaction.SASBCH[interaction.SASBCH.length - 1] === a)) {
    interaction.SASBCH.push(a);
  }
  if (interaction.SASBCH.length > 15) {
    interaction.SASBCH = interaction.SASBCH.slice(interaction.SASBCH.length - 11, interaction.SASBCH.length - 1);
  }
}
function generateHashTagHTML(plain_text) {
  var hashtags = utilities.gethashtags(plain_text, false);
  var hashtags_len = hashtags.length;
  for (var w = 0; w < hashtags_len; w++) {
    plain_text = plain_text.replaceAll(hashtags[w], "<span class=\"hashtag\">".concat(hashtags[w], "</span>"));
  }
  return plain_text;
}
function copyText(string) {
  var textArea = document.createElement('textarea');
  textArea.value = string;
  textArea.setAttribute('readonly', 'readonly');
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('Copy');
  textArea.remove();
}
function copyElement(selector) {
  if (utilities.qe(selector).tagName === 'INPUT' || utilities.qe(selector).tagName === 'TEXTAREA') {
    var text = utilities.qe(selector).value;
  } else {
    var text = utilities.qe(selector).textContent;
  }
  copyText(text);
}
function copyDetails(k) {
  interaction.copyElement(".password-page .details-item-value[k=\"".concat(k, "\"] input"));
  if (k === 'createdat') {
    k = 'create time';
  }
  interaction.prompt.prompt_message("Copied ".concat(k, "."));
}
function openSearch() {
  if (search_evt === 0) {
    utilities.qe('.search input#search').addEventListener('selectionchange', function (e) {
      interaction.search.updateSearch(utilities.qe('.search input#search').value, core_search.searchIndex);
    });
    utilities.qe('.search input#search').addEventListener('keyup', function (e) {
      interaction.search.updateSearch(utilities.qe('.search input#search').value, core_search.searchIndex);
    });
    utilities.qe('.search input#search').addEventListener('cut', function (e) {
      interaction.search.updateSearch(utilities.qe('.search input#search').value, core_search.searchIndex);
    });
    utilities.qe('.search input#search').addEventListener('paste', function (e) {
      interaction.search.updateSearch(utilities.qe('.search input#search').value, core_search.searchIndex);
    });
    utilities.qe('.search input#search').addEventListener('copy', function (e) {
      interaction.search.updateSearch(utilities.qe('.search input#search').value, core_search.searchIndex);
    });
    document.addEventListener('selectionchange', function (e) {
      if (search_status === 1) {
        interaction.search.updateSearch(utilities.qe('.search input#search').value, core_search.searchIndex);
      }
    });
    document.addEventListener('keyup', function (e) {
      if (search_status === 1) {
        interaction.search.updateSearch(utilities.qe('.search input#search').value, core_search.searchIndex);
      }
    });
    document.addEventListener('cut', function (e) {
      if (search_status === 1) {
        interaction.search.updateSearch(utilities.qe('.search input#search').value, core_search.searchIndex);
      }
    });
    document.addEventListener('paste', function (e) {
      if (search_status === 1) {
        interaction.search.updateSearch(utilities.qe('.search input#search').value, core_search.searchIndex);
      }
    });
    document.addEventListener('copy', function (e) {
      if (search_status === 1) {
        interaction.search.updateSearch(utilities.qe('.search input#search').value, core_search.searchIndex);
      }
    });
    search_evt = 1;
  }
  utilities.qe('.main-page .fixed-title-box-mask').setAttribute('status', '1');
  utilities.qe('.main-page .fixed-title-box').setAttribute('status', '1');
  utilities.qe('.main-page .search-output-box').setAttribute('status', '1');
  utilities.qe('.main-page .search-box').setAttribute('status', '1');
  utilities.qe('.main-page .search-box').setAttribute('sticky', 'true');
  core_search.searchIndex = core_search.createSearchIndex();
  interaction.search.updateSearch(utilities.qe('.search input#search').value, core_search.searchIndex);
  interaction.SASBC(1);
  search_status = 1;
}
function closeSearch() {
  utilities.qe('.main-page .fixed-title-box-mask').setAttribute('status', '0');
  utilities.qe('.main-page .fixed-title-box').setAttribute('status', '0');
  utilities.qe('.main-page .search-output-box').setAttribute('status', '0');
  utilities.qe('.main-page .search-box').setAttribute('status', '0');
  utilities.qe('.main-page .search-box').setAttribute('sticky', search_sticky);
  utilities.qe('.main-page .search input#search').value = '';
  if (!search_sticky) {
    interaction.SASBC(3);
  }
  search_status = 0;
}
function highlightKeywordWithLimitedContext(originalString, keyword, contextLength) {
  var regex = new RegExp(keyword, 'gi');
  var matches = [];
  var match;
  while ((match = regex.exec(originalString)) !== null) {
    matches.push(match);
  }
  contextLength -= keyword.length;
  contextLength = Math.floor(contextLength / 2);
  var contextStart = contextLength;
  var contextEnd = contextLength;
  var highlightedString = originalString;
  for (var i = matches.length - 1; i >= 0; i--) {
    var startIndex = matches[i].index;
    var endIndex = matches[i].index + keyword.length;
    var contextStartIndex = Math.max(0, startIndex - contextStart);
    var contextEndIndex = Math.min(originalString.length, endIndex + contextEnd);
    var prefix = contextStartIndex > 0 ? '...' : '';
    var postfix = contextEndIndex < originalString.length ? '...' : '';
    var context = originalString.substring(contextStartIndex, contextEndIndex);
    var highlightedContext = context.replace(regex, function (match) {
      return "<span class=\"search-bold\">".concat(match, "</span>");
    });
    highlightedString = prefix + highlightedContext + postfix;
  }
  return highlightedString;
}
function printSearch(search, element) {
  var html = [];
  var array = (search.suggestions.length >= 1 ? [{
    type: 3,
    title: 'Suggestions'
  }] : []).concat(search.suggestions).concat(search.result.length >= 1 ? [{
    type: 3,
    title: 'Results'
  }] : []).concat(search.result);
  var array_len = array.length;
  for (var i = 0; i < array_len; i++) {
    var t = array[i];
    if (t.type === 0) {
      var display_title = t.date;
      var display_preview = String(t.all).length > 0 ? highlightKeywordWithLimitedContext(t.all.replaceAll(/\n/g, ' '), search.query, 15) : 'note-free';
      var display_icon = icons.icon_password;
      var elt_class = 'search-item';
      var elt_action = "interaction.password_page.openPassword('".concat(t.id, "')");
    }
    if (t.type === 1) {
      var display_title = String(t.suggestion).substring(1);
      var display_preview = '';
      var display_icon = icons.icon_hashtag;
      var elt_class = 'search-suggestion';
      var elt_action = "interaction.search.setSearchQuery('".concat(t.suggestion, "')");
    }
    if (t.type === 2) {
      var display_title = t.suggestion;
      var display_preview = '';
      var display_icon = icons.icon_date;
      var elt_class = 'search-suggestion';
      var elt_action = "interaction.search.setSearchQuery('".concat(t.suggestion, "')");
    }
    if (t.type === 3) {
      var display_title = t.title;
      var display_preview = '';
      var display_icon = '';
      var elt_class = 'search-category';
      var elt_action = '';
    }
    if (t.type === 4) {
      var display_title = t.suggestion;
      var display_preview = '';
      var display_icon = icons.icon_text;
      var elt_class = 'search-suggestion';
      var elt_action = "interaction.search.setSearchQuery('".concat(t.suggestion, "')");
    }
    var t_html = "<div class=\"".concat(elt_class, "\" onclick=\"").concat(elt_action, "\"><div class=\"").concat(elt_class, "-icon\">").concat(display_icon, "</div><div class=\"").concat(elt_class, "-title\">").concat(display_title, "</div><div class=\"").concat(elt_class, "-preview\">").concat(display_preview, "</div></div>");
    html.push(t_html);
  }
  element.innerHTML = html.join('');
}
function updateSearch(query, index) {
  var search = core_search.search_passwords(String(query).toLowerCase(), index);
  interaction.search.printSearch(search, utilities.qe('.search-output'));
}
function setSearchQuery(q) {
  utilities.qe('.search input#search').value = q;
  updateSearch(utilities.qe('.search input#search').value, core_search.searchIndex);
}
function printSavedPasswordList() {
  var list = listSavedPassword();
  var list_len = list.length;
  var html = [];
  for (var k = 0; k < list_len; k++) {
    var tags = [];
    html.push("<div class=\"password-item\" onclick=\"interaction.password_page.openPassword('".concat(list[k].id, "')\" pwd-id=\"").concat(list[k].id, "\" icon=\"").concat(list[k].website_icon === false ? '-1' : '0', "\" icon-url=\"").concat(list[k].website_icon, "\"><div class=\"password-item-website-icon\" style=\"--js-website-icon:var(--p-e5e5ea)\"></div><div class=\"password-item-title\">").concat(utilities.timestr(new Date(list[k].time_stamp)), "</div><div class=\"password-item-tags\">").concat(tags, "</div><div class=\"password-open-icon\">").concat(icons.icon_arrow, "</div></div>"));
  }
  utilities.qe('.password-list').innerHTML = html.join('');
  interaction.main_page.lazyLoadPasswordListIcons_scrolling_handler();
}
function openOptions(r) {
  utilities.qe('.options_mask').style.setProperty('display', 'block');
  utilities.qe('.options').style.setProperty('display', 'inline-block');
  utilities.qe('.options').style.setProperty('--js-options-list-count', utilities.qeAll(".options li[group=\"".concat(r, "\"]")).length);
  var all_options = utilities.qeAll('.options li');
  var all_options_len = all_options.length;
  for (var f = 0; f < all_options_len; f++) {
    all_options[f].setAttribute('d', '0');
  }
  var all_options_in_group = utilities.qeAll(".options li[group=\"".concat(r, "\"]"));
  var all_options_in_group_len = all_options_in_group.length;
  for (var f = 0; f < all_options_in_group_len; f++) {
    all_options_in_group[f].setAttribute('d', '1');
  }
  setTimeout(function () {
    utilities.qe('.options').setAttribute('k', '1');
  }, 1);
  utilities.qe('#options_css').innerHTML = '.options li{display:none;}.options li[group="' + r + '"] {display:flex;}';
}
function closeOptions(event) {
  utilities.stopProp(event);
  utilities.qe('.options').setAttribute('k', '0');
  utilities.qe('.options').addEventListener('transitionend', function () {
    utilities.qe('.options').style.setProperty('display', 'none');
    utilities.qe('.options_mask').style.setProperty('display', 'none');
  }, {
    once: true
  });
}
function viewOnGithub() {
  window.open('https://github.com/EricHsia7/pwdgen2');
}
function refreshPage(event) {
  if (navigator.onLine) {
    var p = [{
      type: 'regex',
      regex: '/[a-zA-Z0-9]/g',
      quantity: 16,
      repeat: true
    }];

    // Get the current URL and parse parameters
    var url = new URL(window.location.href);
    var searchParams = new URLSearchParams(url.search);

    // Add parameter
    searchParams.set('v', core_fine_grained_password.generate(p, 'production'));

    // Update the URL with the modified parameters
    url.search = searchParams.toString();
    location.replace(url);
  } else {
    var offline_message = 'You’re offline, and updates are unavailable.';
    interaction.prompt.prompt_message(offline_message, 3000);
    interaction.options.closeOptions(event);
  }
}
function importData(event) {
  utilities.qe('#importdata').click();
  interaction.options.closeOptions(event);
}
function exportGeneratedFile(event) {
  var text = generateExportFile();
  var data = new Blob([text], {
    type: 'application/json'
  });
  var name = core_fine_grained_password.generate([{
    type: 'string',
    string: 'pwdgen2_export_'
  }, {
    type: 'regex',
    regex: '/[A-Z0-9a-z]/g',
    quantity: 16,
    repeat: true
  }], 'production');
  var fileObj = new File([data], name + '.json', {
    type: data.type
  });
  if (navigator.canShare && navigator.canShare({
    files: [fileObj]
  })) {
    navigator.share({
      files: [fileObj]
    }).then(function () {
      interaction.options.closeOptions(event);
    })["catch"](function (error) {});
  } else {
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.download = "".concat(name, ".json");
    a.href = window.URL.createObjectURL(data);
    a.click();
    a.remove();
    interaction.options.closeOptions(event);
  }
}
window.interaction = {
  prompt: {
    prompt_message: prompt_message,
    prompt_asking: prompt_asking,
    close_prompt_asking: close_prompt_asking
  },
  show: show,
  generateHashTagHTML: generateHashTagHTML,
  copyText: copyText,
  copyElement: copyElement,
  copyDetails: copyDetails,
  SASBC: SASBC,
  SASBCH: SASBCH,
  loadCSS: loadCSS,
  loadFont: loadFont,
  importData: importData,
  exportGeneratedFile: exportGeneratedFile,
  search: {
    openSearch: openSearch,
    closeSearch: closeSearch,
    updateSearch: updateSearch,
    setSearchQuery: setSearchQuery,
    printSearch: printSearch
  },
  add_password: {
    openAddPassword: openAddPassword,
    closeAddPassword: closeAddPassword,
    addPasswordWithForm: addPasswordWithForm,
    printPatternPresets: printPatternPresets,
    applyPreset: applyPreset
  },
  edit_password: {
    openEditPassword: openEditPassword,
    closeEditPassword: closeEditPassword,
    modifyPasswordWithEditor: modifyPasswordWithEditor
  },
  options: {
    openOptions: openOptions,
    closeOptions: closeOptions,
    refreshPage: refreshPage,
    viewOnGithub: viewOnGithub
  },
  pattern_editor: {
    openPatternEditor: openPatternEditor,
    closePatternEditor: closePatternEditor,
    generatePatternPreview: generatePatternPreview,
    displayPatternComponentInfo: displayPatternComponentInfo,
    addIdentityToPattern: addIdentityToPattern,
    removeIdentityFromPattern: removeIdentityFromPattern,
    syncPatternEditorJSONEditor: syncPatternEditorJSONEditor,
    syncAndFormatPatternEditorJSONEditor: syncAndFormatPatternEditorJSONEditor,
    initializePatternEditorJSONEditor: initializePatternEditorJSONEditor,
    removePatternComponentInfo: removePatternComponentInfo,
    showComponentInEditor: showComponentInEditor,
    savePatternWithEditor: savePatternWithEditor,
    displaySavePatternErrors: displaySavePatternErrors,
    removeSavePatternErrors: removeSavePatternErrors,
    switchEditor: switchEditor,
    go_to_documents: go_to_documents
  },
  pattern_manager: {
    openPatternManager: openPatternManager,
    closePatternManager: closePatternManager,
    printPatterns: printPatterns,
    showPatternOptions: showPatternOptions,
    removePatternOptions: removePatternOptions,
    sharePattern: sharePattern,
    deletePattern: deletePattern
  },
  password_page: {
    openPassword: openPassword,
    closePassword: closePassword,
    deletePassword: deletePassword,
    confirmToDeletePassword: confirmToDeletePassword
  },
  main_page: {
    printSavedPasswordList: printSavedPasswordList,
    lazyLoadPasswordListIcon: lazyLoadPasswordListIcon,
    lazyLoadPasswordListIcons_scrolling_handler: lazyLoadPasswordListIcons_scrolling_handler
  }
};
/* harmony default export */ const user_interfaces_interaction = (window.interaction);
;// CONCATENATED MODULE: ./src/core/storage.ts
// Import required modules and interfaces



var md5 = __webpack_require__(3503);

// Interface for an encrypted password entry

// Interface for a decrypted password entry

// Export Local Storage object to the global scope
var LS = window.localStorage;

// Function to search items by name in Local Storage
function searchItemsbyname(name) {
  var gh = [];
  for (var t in window.localStorage) {
    if (String(t).indexOf(name) > -1) {
      gh.push(t);
    }
  }
  return gh;
}

// Function to list all saved passwords with decryption
function listSavedPassword() {
  var list = searchItemsbyname('pwdgen2_saved_b');
  var list_len = list.length;
  var list_decrypted = [];
  for (var k = 0; k < list_len; k++) {
    // Decrypt the encrypted password
    var this_item = JSON.parse(String(LS.getItem(list[k])));
    if (this_item.hasOwnProperty('history')) {
      continue;
    }
    var url = '';
    var website_icon = false;
    if (utilities.isValidURL(this_item.website)) {
      url = this_item.website;
      if (!(this_item.website.indexOf('http://') > -1 || this_item.website.indexOf('https://') > -1)) {
        url = 'https://' + url;
      }
      var url_obj = new URL(url);
      url_obj.search = '';
      url_obj.protocol = 'http://';
      website_icon = "https://remote-ivory-bovid.faviconkit.com/".concat(url_obj.toString().replace('http://', ''), "/256");
    }
    // Add the decrypted entry to the list
    list_decrypted.push({
      website_icon: website_icon,
      website: this_item.website,
      password: utilities.deur(utilities.decryptString(this_item.encrypted_password, this_item.aes_iv)),
      username: this_item.username,
      note: this_item.note,
      time_stamp: this_item.time_stamp,
      id: this_item.id
    });
  }
  // Sort the list based on timestamp
  list_decrypted.sort(function (a, b) {
    return new Date(b.time_stamp).getTime() - new Date(a.time_stamp).getTime();
  });
  return list_decrypted;
}

// Function to upgrade data from an older version
function upgradeData() {
  // Define the ID pattern for generating new IDs
  var id_pattern = [{
    type: 'group',
    group: [{
      type: 'regex',
      regex: '/[A-Za-z0-9]/g',
      quantity: 32,
      repeat: true
    }],
    actions: ['shuffle']
  }];

  // Search for items from the Local Storage
  var list = searchItemsbyname('pwdgen2_saved_a');
  if (list.length <= 0) {
    return '';
  }
  var list_len = list.length;
  var list_encrypted = [];
  for (var k = 0; k < list_len; k++) {
    // Extract data from the old version (<=1.8) and upgrade to the new version (>=1.9)
    var this_item = String(LS.getItem(list[k])).split(':');
    var hash = list[k].split('_')[3];
    var pwtime = new Date();
    pwtime.setTime(this_item[2]);
    var id = core_fine_grained_password.generate(id_pattern, 'production');
    var note = LS.getItem("pwdgen2_saved_notes_cf_".concat(hash)) || '';
    list_encrypted.push({
      website: '',
      encrypted_password: this_item[0],
      aes_iv: parseInt(this_item[1]),
      note: note,
      time_stamp: pwtime,
      id: id
    });
    LS.setItem("pwdgen2_saved_b_".concat(id), JSON.stringify(list_encrypted[list_encrypted.length - 1]));
    LS.removeItem(list[k]);
  }
}

// Function to set a password entry
function setPassword(password, username, time, website, note, id) {
  // Encrypt the password and save the entry to Local Storage
  var encryption = utilities.encryptString(utilities.enur(password));
  var json = {
    website: website,
    username: username,
    encrypted_password: encryption[0],
    aes_iv: encryption[1],
    note: note === '' ? null : btoa(utilities.enur(note)),
    time_stamp: time,
    id: id
  };
  LS.setItem('pwdgen2_saved_b_' + id, JSON.stringify(json));
}

// Function to add a new password entry
function addPassword(password, username, website, note) {
  // Generate a new ID pattern for the entry
  var id_pattern = [{
    type: 'group',
    group: [{
      type: 'regex',
      regex: '/[A-Za-z0-9]/g',
      quantity: 32,
      repeat: true
    }],
    actions: ['shuffle']
  }];

  // Get the current timestamp
  var time = new Date().toISOString();
  // Generate a new ID
  var id = core_fine_grained_password.generate(id_pattern, 'production');

  // Set the password entry
  setPassword(password, username, time, website, note, id);
  return id;
}

// Function to modify an existing password entry
function modifyPassword(password, username, website, note, id) {
  // Get the Local Storage keys for the entry and its history
  var localStorage_key = "pwdgen2_saved_b_".concat(id);
  var localStorage_history_key = "pwdgen2_saved_b_history_".concat(id);

  // Check if the entry exists
  if (LS.hasOwnProperty(localStorage_key)) {
    var json = JSON.parse(String(LS.getItem(localStorage_key)));

    // Encrypt the password and create the modified JSON
    var encryption = utilities.encryptString(utilities.enur(password));
    var modified_json = {
      website: website,
      username: username,
      encrypted_password: encryption[0],
      aes_iv: encryption[1],
      note: note === '' ? null : btoa(utilities.enur(note)),
      time_stamp: json.time_stamp,
      id: id
    };

    // Check if the modified entry is the same as the existing one, if yes, return '' to quit function
    if (md5(JSON.stringify({
      website: json.website,
      username: json.username,
      password: utilities.deur(utilities.decryptString(json.encrypted_password, json.aes_iv)),
      note: json.note
    })) === md5(JSON.stringify({
      website: website,
      username: username,
      password: password,
      note: note
    }))) {
      return '';
    }

    // Create or update the history entry
    if (LS.hasOwnProperty(localStorage_history_key)) {
      var history = JSON.parse(String(LS.getItem(localStorage_history_key)));
    } else {
      var history = {
        id: id,
        history: []
      };
    }
    history['history'].push(json);
    LS.setItem(localStorage_history_key, JSON.stringify(history));

    // Update the password entry
    LS.setItem(localStorage_key, JSON.stringify(modified_json));
  }
}

// Function to remove a password entry
function removePassword(id) {
  // Check if the entry exists, and if yes, remove it from Local Storage
  if (LS.hasOwnProperty("pwdgen2_saved_b_".concat(id))) {
    LS.removeItem("pwdgen2_saved_b_".concat(id));
    if (LS.hasOwnProperty("pwdgen2_saved_b_history_".concat(id))) {
      LS.removeItem("pwdgen2_saved_b_history_".concat(id));
    }
    return true;
  }
  return false;
}

// Function to handle the import of data
function importdatahandler(event) {
  // Read the file and import the data to Local Storage
  var f = event.target.files[0];
  var reader = new FileReader();
  reader.onload = function (theFile) {
    return function (e) {
      var fileTextContent = e.target.result;
      var json = JSON.parse(fileTextContent);
      var data = json.data;
      var data_len = data.length;

      // Save each entry to Local Storage
      for (var i = 0; i < data_len; i++) {
        var this_item = data[i];
        localStorage.setItem(this_item.key, JSON.stringify(JSON.parse(this_item.content)));
      }

      // Upgrade the data to the new version
      upgradeData();

      // Display success message and update the user interface
      user_interfaces_interaction.prompt.prompt_message('Imported data successfully.');
      user_interfaces_interaction.main_page.printSavedPasswordList();
    };
  }(f);
  reader.readAsText(f);
}

// Function to generate an export file
function generateExportFile() {
  // Get all saved password entries and create a JSON object for export
  var list = searchItemsbyname('pwdgen2_saved_b_').concat(searchItemsbyname('pwdgen2_pattern_b_'));
  var list_len = list.length;
  var export_list = [];
  for (var k = 0; k < list_len; k++) {
    var this_item = String(LS.getItem(list[k]));
    export_list.push({
      key: list[k],
      content: this_item
    });
  }

  // Return the JSON object as a string
  return JSON.stringify({
    data: export_list,
    version: '2023-07-30',
    export_time_stamp: new Date().toISOString()
  }, null, 2);
}
;// CONCATENATED MODULE: ./src/core/fine-grained-password.ts
function fine_grained_password_typeof(o) { "@babel/helpers - typeof"; return fine_grained_password_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, fine_grained_password_typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
// Import required functions


var fine_grained_password_ = {};
fine_grained_password_.cloneDeep = __webpack_require__(8055);
var pwd_pattern_default = [{
  default_pattern: true,
  pattern_name: 'Strong',
  pattern_icon: 'key',
  id: '_strong',
  pattern: [{
    type: 'group',
    group: [{
      type: 'regex',
      regex: '/[A-Z]/g',
      quantity: 32,
      repeat: true
    }, {
      type: 'regex',
      regex: '/[a-z]/g',
      quantity: 32,
      repeat: true
    }, {
      type: 'regex',
      regex: '/[0-9]/g',
      quantity: 32,
      repeat: true
    }, {
      type: 'list',
      list: ['-', '!', '$', '%', '^', '&', '*', '(', ')', '_', '+', '|', '~', '=', '`', '{', '}', '\\', '[', ']', ':', ',', ';', "'", '<', '>', '?', ',', '.', '/'],
      quantity: 32,
      repeat: true
    }],
    actions: ['shuffle']
  }]
}, {
  default_pattern: true,
  pattern_name: 'Easy to read',
  pattern_icon: 'visibility',
  id: '_strong',
  pattern: [{
    type: 'group',
    group: [{
      type: 'regex',
      regex: '/[A-HKMNP-Z0-9a-hkmnp-z]/g',
      quantity: 8,
      repeat: true
    }],
    actions: ['shuffle']
  }, {
    type: 'string',
    string: '-'
  }, {
    type: 'group',
    group: [{
      type: 'regex',
      regex: '/[A-HKMNP-Z0-9a-hkmnp-z]/g',
      quantity: 8,
      repeat: true
    }],
    actions: ['shuffle']
  }, {
    type: 'string',
    string: '-'
  }, {
    type: 'group',
    group: [{
      type: 'regex',
      regex: '/[A-HKMNP-Z0-9a-hkmnp-z]/g',
      quantity: 8,
      repeat: true
    }],
    actions: ['shuffle']
  }]
}];

// Function to get all the patterns saved in the Local Storage
function listPatterns(returnLocalStorageKey) {
  var list = searchItemsbyname('pwdgen2_pattern_b_');
  var list_len = list.length;
  var result = [];
  for (var p = 0; p < list_len; p++) {
    if (LS.hasOwnProperty(list[p])) {
      result.push(Object.assign(JSON.parse(String(LS.getItem(list[p]))), returnLocalStorageKey ? {
        LocalStorageKey: list[p]
      } : {}));
    }
  }
  return result;
}
var pwd_pattern_custom = [];

// Function to get the default and saved patterns
var getPatterns = function getPatterns(returnLocalStorageKey) {
  fine_grained_password.pwd_pattern_custom = fine_grained_password.listPatterns(returnLocalStorageKey);
  return pwd_pattern_default.concat(fine_grained_password.pwd_pattern_custom);
};
var date_component_regex = /(YYYY|yyyy|MM|M|DD|D|hh|h|mm|m|ss|s)/gm;
var date_component_date_time_stamp_regex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2}|))$/gm;
var date_component_date_offseting_time_regex = /today\#(\-|\+){1,1}([0-9]{1,})/gm;

// Function to generate a string depending on the pattern
function generate(options, mode) {
  // Use lodash to clone the options (pattern) to avoid syncing with the original list declared above → make the declared pattern usable repeatedly
  var pattern = fine_grained_password_.cloneDeep(options);
  var original_pattern = fine_grained_password_.cloneDeep(options);

  // Production mode: only return the results
  // Editor mode: return the results, component objects, and error messages
  if (mode === 'production') {
    var d = '';
  }
  if (mode === 'editor') {
    var d = [];
  }
  var get_chars_from_regex = function get_chars_from_regex(regex) {
    // Generate a long string
    var input = String.fromCharCode.apply(String, _toConsumableArray(Array.from({
      length: Math.pow(2, 16)
    }, function (_, i) {
      return i;
    })));
    // Use the input regular expression to select matched characters
    var matches = String(input).match(regex);
    // Join the items in the array
    var chars = matches ? matches.join('') : '';
    // Return the joined string
    return chars;
  };
  var get_date_string_from_pattern = function get_date_string_from_pattern(date, pattern) {
    //convert the date to a date object
    var date_obj = new Date();
    if (date === 'today') {}
    if (date === 'yesterday') {
      date_obj.setDate(date_obj.getDate() - 1);
    }
    if (date === 'tomorrow') {
      date_obj.setDate(date_obj.getDate() + 1);
    }
    if (!(date.match(date_component_date_time_stamp_regex) === null)) {
      date_obj = new Date(date);
    }
    if (!(date.match(date_component_date_offseting_time_regex) === null)) {
      var match = date_component_date_offseting_time_regex.exec(date);
      var cofficient = 0;
      if (match[1] === '+') {
        cofficient = 1;
      }
      if (match[1] === '-') {
        cofficient = -1;
      }
      var offset = cofficient * parseInt(match[2]);
      date_obj.setDate(date_obj.getDate() + offset);
    }
    //get the corresponding values of the date object
    var year = String(date_obj.getFullYear());
    var month = String(date_obj.getMonth() + 1); //the month in javascript counts from 0 to 11
    var date = String(date_obj.getDate());
    var hours = String(date_obj.getHours());
    var minutes = String(date_obj.getMinutes());
    var seconds = String(date_obj.getSeconds());
    //replace the qualified part in the pattern with gotten values
    return pattern.replaceAll(date_component_regex, function (match) {
      if (match === 'YYYY') {
        return year;
      }
      if (match === 'MM') {
        return month.padStart(2, '0');
      }
      if (match === 'M') {
        return month;
      }
      if (match === 'DD') {
        return date.padStart(2, '0');
      }
      if (match === 'D') {
        return date;
      }
      if (match === 'hh') {
        return hours.padStart(2, '0');
      }
      if (match === 'h') {
        return hours;
      }
      if (match === 'mm') {
        return minutes.padStart(2, '0');
      }
      if (match === 'm') {
        return minutes;
      }
      if (match === 'ss') {
        return seconds.padStart(2, '0');
      }
      if (match === 's') {
        return seconds;
      }
    });
  };
  var pattern_len = pattern.length;
  for (var e = 0; e < pattern_len; e++) {
    var this_item = pattern[e];
    var this_content = this_item[this_item['type']];
    var result = '';
    if (this_item['type'] === 'regex') {
      // Check if the regular expression is full (has expression and flags)
      var this_content_matches = this_content.match(/^\/(.*)\/([a-z]*)$/i);
      var string = '';
      // Get the character source/sample
      var chars = get_chars_from_regex(new RegExp(this_content_matches[1], this_content_matches[2])).split('');
      for (var r = 0; r < this_item['quantity']; r++) {
        // Choose a character from the source
        var random_index = Math.round((chars.length - 1) * Math.random());

        // Put the character to the end of the result
        string += chars[random_index];

        // If the configuration tells that repeating is not allowed, strike/remove the character from the source to avoid using repeatedly
        if (!this_item.repeat) {
          chars.splice(random_index, 1);
        }
      }
      result = String(string);
    }
    if (this_item['type'] === 'string') {
      // Directly put the string to the end of the result
      result = String(this_content);
    }
    if (this_item['type'] === 'list') {
      for (var r = 0; r < this_item['quantity']; r++) {
        // Choose an item from the list
        var random_index = Math.round((this_content.length - 1) * Math.random());
        // Put the content of the item to the end of the result
        result += this_content[random_index];
        if (!this_item.repeat) {
          // If the configuration tells that repeating is not allowed, strike/remove the item from the list to avoid using repeatedly
          this_content.splice(random_index, 1);
        }
      }
    }
    if (this_item['type'] === 'date') {
      result = get_date_string_from_pattern(this_item['date'], this_item['date_pattern']);
    }
    if (this_item['type'] === 'group') {
      // Use recursive way to process the components in a group
      result = fine_grained_password.generate(this_content, 'production');
      // Carry out the actions
      if (this_item.hasOwnProperty('actions')) {
        var actions = this_item['actions'];
        var actions_len = actions.length;
        for (var j = 0; j < actions_len; j++) {
          if (actions[j] === 'shuffle') {
            result = utilities.shuffleSelf(result.split(''), result.length).join('');
            continue;
          }
        }
      }
    }
    if (mode === 'production') {
      d += result;
    }
    if (mode === 'editor') {
      d.push({
        result: result,
        component: original_pattern[e]
      });
    }
  }
  return d;
}
function checkPatternQualification(pattern) {
  var json = fine_grained_password_.cloneDeep(pattern);
  var result = 1;
  var errors = [];
  var omitobject = function omitobject(object) {
    var obj = fine_grained_password_.cloneDeep(object);
    if (fine_grained_password_typeof(object) === 'object' && !Array.isArray(object)) {
      for (var w in obj) {
        if (fine_grained_password_typeof(obj[w]) === 'object' && !Array.isArray(obj[w])) {
          obj[w] = '{...}';
        }
        if (fine_grained_password_typeof(obj[w]) === 'object' && Array.isArray(obj[w])) {
          obj[w] = '[...]';
        }
      }
      return JSON.stringify(obj);
    }
  };
  var check_hasOwnProperty = function check_hasOwnProperty(object, property) {
    if (fine_grained_password_typeof(object) === 'object') {
      if (object.hasOwnProperty(property)) {
        return 1;
      } else {
        errors.push({
          message: "The property \"".concat(property, "\" is not found in ").concat(omitobject(object), "."),
          type: 'lack'
        });
        return 0;
      }
    }
    errors.push({
      message: "Cannot check the property \"".concat(property, "\" due to a type error of ").concat(String(object), "."),
      type: 'internal'
    });
    return 0;
  };
  var check = function check(object) {
    var result = 1;
    result *= check_hasOwnProperty(object, 'type');
    var type = object['type'];
    if (type === 'string' || type === 'regex' || type === 'list' || type === 'group' || type === 'date') {
      result *= check_hasOwnProperty(object, object['type']);
    } else {
      errors.push({
        message: "The type \"".concat(type, "\" in ").concat(omitobject(object), " is not supported at this time."),
        type: 'type'
      });
      result *= 0;
    }
    if (type === 'string') {
      if (!(typeof object['string'] === 'string')) {
        errors.push({
          message: "Type of the property \"string\" in ".concat(omitobject(object), " is not a string."),
          type: 'type'
        });
        result *= 0;
      }
    }
    if (type === 'regex' || type === 'list') {
      result *= check_hasOwnProperty(object, 'quantity');
      result *= check_hasOwnProperty(object, 'repeat');
      if (!(typeof object['quantity'] === 'number')) {
        errors.push({
          message: "Type of the property \"quantity\" in ".concat(omitobject(object), " is not a number."),
          type: 'type'
        });
        result *= 0;
      }
      if (!(typeof object['repeat'] === 'boolean')) {
        errors.push({
          message: "Type of the property \"repeat\" in ".concat(omitobject(object), " is not boolean (true or false)."),
          type: 'type'
        });
        result *= 0;
      }
    }
    if (type === 'list') {
      if (fine_grained_password_typeof(object['list']) === 'object' && Array.isArray(object['list'])) {
        var list = object['list'];
        var list_len = list.length;
        for (var e = 0; e < list_len; e++) {
          if (!(typeof list[e] === 'string')) {
            errors.push({
              message: "Type of the item ".concat(e, " in the list of ").concat(omitobject(object), " is not a string."),
              type: 'type'
            });
            result *= 0;
          }
        }
      } else {
        errors.push({
          message: 'Cannot get item due to type error or property not existing.',
          type: 'internal'
        });
        result *= 0;
      }
    }
    if (type === 'group') {
      if (fine_grained_password_typeof(object['actions']) === 'object' && Array.isArray(object['actions'])) {
        var actions = object['actions'];
        var actions_len = actions.length;
        for (var e = 0; e < actions_len; e++) {
          if (!(typeof actions[e] === 'string')) {
            errors.push({
              message: "An item in actions must be a string.",
              type: 'type'
            });
            result *= 0;
          } else {
            if (!(actions[e] === 'shuffle')) {
              errors.push({
                message: "Cannot use ".concat(actions[e], " at this time due to an unsupported value."),
                type: 'invalid value'
              });
              result *= 0;
            }
          }
        }
      }
      if (fine_grained_password_typeof(object['group']) === 'object' && Array.isArray(object['group'])) {
        var group = object['group'];
        var group_len = group.length;
        for (var e = 0; e < group_len; e++) {
          result *= check(group[e]);
        }
      }
    }
    if (type === 'regex') {
      if (typeof object['regex'] === 'string') {
        if (!object['regex'].match(/^\/(.*)\/([a-z]*)$/i)) {
          errors.push({
            message: "The regex in ".concat(JSON.stringify(object), " is invalid on formats."),
            type: 'invalid value'
          });
          result *= 0;
        }
      } else {
        errors.push({
          message: "The type of the property \"regex\" in ".concat(omitobject(object), " is not a string."),
          type: 'type'
        });
        result *= 0;
      }
    }
    if (type === 'date') {
      result *= check_hasOwnProperty(object, 'date_pattern');
      if (typeof object['date'] === 'string') {
        if (!(object['date'] === 'today')) {
          if (!(object['date'] === 'yesterday')) {
            if (!(object['date'] === 'tomorrow')) {
              if (!(object['date'].match(date_component_date_time_stamp_regex) === null)) {
                errors.push({
                  message: "The date in ".concat(JSON.stringify(object), " is invalid on formats."),
                  type: 'invalid value'
                });
                result *= 0;
              }
            }
          }
        }
      } else {
        errors.push({
          message: "The type of the property \"date\" in ".concat(omitobject(object), " is not a string."),
          type: 'type'
        });
        result *= 0;
      }
      if (!(typeof object['date_pattern'] === 'string')) {
        errors.push({
          message: "The type of the property \"date_pattern\" in ".concat(omitobject(object), " is not a string."),
          type: 'type'
        });
        result *= 0;
      }
    }
    if (result === 1) {
      return true;
    } else {
      return false;
    }
  };
  if (fine_grained_password_typeof(json) === 'object') {
    result *= check_hasOwnProperty(json, 'pattern_name');
    result *= check_hasOwnProperty(json, 'pattern_icon');
    result *= check_hasOwnProperty(json, 'pattern');
    if (!(typeof json['pattern_name'] === 'string')) {
      errors.push({
        message: "Type of the property \"pattern_name\" in ".concat(omitobject(json), " is not a string."),
        type: 'type'
      });
      result *= 0;
    }
    if (!(typeof json['pattern_icon'] === 'string')) {
      errors.push({
        message: "Type of the property \"pattern_icon\" in ".concat(omitobject(json), " is not a string."),
        type: 'type'
      });
      result *= 0;
    }
    if (fine_grained_password_typeof(json['pattern']) === 'object' && Array.isArray(json['pattern'])) {
      var pattern = json['pattern'];
      var pattern_len = pattern.length;
      for (var i = 0; i < pattern_len; i++) {
        result *= check(pattern[i]);
      }
    } else {
      errors.push({
        message: "Type of the property \"pattern\" in ".concat(omitobject(json), " is not an array."),
        type: 'type'
      });
      result *= 0;
    }
  } else {
    errors.push({
      message: "Type of the thing you want to check is not an object.",
      type: 'internal'
    });
    result *= 0;
  }
  if (result === 1) {
    result = true;
  } else {
    result = false;
  }
  return {
    errors: errors,
    result: result
  };
}

// Expose functions to the global scope
window.fine_grained_password = {
  pwd_pattern_custom: pwd_pattern_custom,
  generate: generate,
  listPatterns: listPatterns,
  getPatterns: getPatterns,
  checkPatternQualification: checkPatternQualification
};
/* harmony default export */ const core_fine_grained_password = (window.fine_grained_password);
;// CONCATENATED MODULE: ./src/core/utilities.ts
function utilities_typeof(o) { "@babel/helpers - typeof"; return utilities_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, utilities_typeof(o); }
// Import required functions

var aesjs = __webpack_require__(3836);
function isValidURL(url) {
  var regex = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:\/.*)?$/;
  return regex.test(url);
}
function encryptString(string) {
  var initialization_vector_pattern = [{
    type: 'regex',
    regex: '/[1-9]/g',
    quantity: 1,
    repeat: false
  }, {
    type: 'group',
    group: [{
      type: 'regex',
      regex: '/[0-9]/g',
      quantity: 9,
      repeat: true
    }],
    actions: ['shuffle']
  }];
  var initialization_vector = parseInt(core_fine_grained_password.generate(initialization_vector_pattern, 'production'));
  var keyu = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  var textBytes = aesjs.utils.utf8.toBytes(string);
  var aesCtr = new aesjs.ModeOfOperation.ctr(keyu, new aesjs.Counter(initialization_vector));
  var encryptedBytes = aesCtr.encrypt(textBytes);
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return [encryptedHex, initialization_vector];
}
function decryptString(encrypted_string, initialization_vector) {
  var keye = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  var encryptedBytese = aesjs.utils.hex.toBytes(encrypted_string);
  var aesCtre = new aesjs.ModeOfOperation.ctr(keye, new aesjs.Counter(parseInt(initialization_vector)));
  var decryptedBytese = aesCtre.decrypt(encryptedBytese);
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytese);
  return decryptedText;
}
function enur(u) {
  return encodeURIComponent(u);
}
function deur(u) {
  return decodeURIComponent(u);
}
function gid(n) {
  var genidchars = '0123456789abcdefghijklmnopqrstuvwxyz';
  var genid = '';
  for (var i = 0; i < 16; i++) {
    var genrandomNumber = Math.floor(Math.random() * genidchars.length);
    genid += genidchars.substring(genrandomNumber, genrandomNumber + 1);
  }
  if (!(n === undefined)) {
    n = n.replaceAll('_', '-');
    return n + '-' + genid + '' + new Date().getTime();
  }
  return genid + '' + new Date().getTime();
}
function shuffleSelf(array, size) {
  var index = -1;
  var length = array.length;
  var lastIndex = length - 1;
  size = size === undefined ? length : size;
  while (++index < size) {
    var rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
    var value = array[rand];
    array[rand] = array[index];
    array[index] = value;
  }
  array.length = size;
  return array;
}
function che(y) {
  if (y < 10) {
    return '0' + y;
  } else {
    return y;
  }
}
function timestr(date) {
  return date.getFullYear() + '-' + che(date.getMonth() + 1) + '-' + che(date.getDate()) + ' ' + che(date.getHours()) + ':' + che(date.getMinutes()) + ':' + che(date.getSeconds());
}
function checkTouchFeatures() {
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    return true;
  } else {
    return false;
  }
}
function qe(selector) {
  var elt = document.querySelector(selector);
  if (elt === null) {
    elt = document.createElement('div');
  }
  return elt;
}
function qeAll(selector) {
  return document.querySelectorAll(selector);
}
function copyProperty(source, target, property) {
  target.style.setProperty(property, source.style.getPropertyValue(property));
}
function unicode_arr(str) {
  var str_len = str.length;
  var unicode_arr = [];
  for (var t = 0; t < str_len; t++) {
    var unicode = str.charCodeAt(t);
    if (!(unicode_arr.indexOf(unicode) > -1)) {
      unicode_arr.push(unicode);
    }
  }
  return unicode_arr;
}
function jaroWinklerDistance(str1, str2) {
  var len1 = str1.length;
  var len2 = str2.length;
  var matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1;
  var matches1 = new Array(len1).fill(false);
  var matches2 = new Array(len2).fill(false);
  var matches = 0;
  var transpositions = 0;
  for (var i = 0; i < len1; i++) {
    var start = Math.max(0, i - matchDistance);
    var end = Math.min(i + matchDistance + 1, len2);
    for (var j = start; j < end; j++) {
      if (!matches2[j] && str1[i] === str2[j]) {
        matches1[i] = true;
        matches2[j] = true;
        matches++;
        break;
      }
    }
  }
  if (matches === 0) {
    return 0;
  }
  var k = 0;
  for (var _i = 0; _i < len1; _i++) {
    if (matches1[_i]) {
      while (!matches2[k]) {
        k++;
      }
      if (str1[_i] !== str2[k]) {
        transpositions++;
      }
      k++;
    }
  }
  var similarity = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;
  var prefix = 0;
  while (str1[prefix] === str2[prefix] && prefix < 4) {
    prefix++;
  }
  var weight = 0.1;
  return similarity + prefix * weight * (1 - similarity);
}
function gethashtags(str, k) {
  var hashtag_regex = /\B#([a-z0-q9]{2,})(?![~!@#$%^&*()=+_`\-\|\\/'\[\]\{\}]|[?.,]*\w)/g;
  var hashtags = str.match(hashtag_regex);
  var hashtags_norepeat = [];
  if (hashtags === null) {
    return [];
  }
  var hashtags_len = hashtags.length;
  for (var w = 0; w < hashtags_len; w++) {
    if (!(hashtags_norepeat.indexOf(hashtags[w]) > -1)) {
      hashtags_norepeat.push(hashtags[w]);
    }
  }
  if (k) {
    for (var s = 0; s < hashtags_norepeat.length; s++) {
      var hashtagkey = String(hashtags_norepeat[s]).replaceAll('#', '').toLowerCase();
      allhashtag[hashtagkey] = hashtags_norepeat[s];
    }
  }
  return hashtags_norepeat;
}
function fetchWithProgress(url, progressCallback) {
  return new Promise(function (resolve, reject) {
    // Fetch the URL using the Fetch API
    fetch(url).then(function (response) {
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      var contentLength = Number(response.headers.get('Content-Length'));
      var reader = response.body.getReader();
      var receivedBytes = 0;
      var decoder = new TextDecoder();
      var textContent = '';
      function read() {
        reader.read().then(function (_ref) {
          var done = _ref.done,
            value = _ref.value;
          if (done) {
            resolve(textContent);
            return;
          }
          receivedBytes += value.length;
          var progress = receivedBytes / 85878 * 100;
          progressCallback(progress);
          var chunk = decoder.decode(value, {
            stream: true
          });
          textContent += chunk;
          read();
        })["catch"](function (error) {
          reject(error);
        });
      }
      read();
    })["catch"](function (error) {
      reject(error);
    });
  });
}
function encodeSignsToHtmlEntities(html) {
  return html.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
    return '&#' + i.charCodeAt(0) + ';';
  });
}
function isDarkMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  } else {
    return false;
  }
}
function hsvToRgb(h, s, v) {
  // Normalize values
  h /= 360;
  s /= 100;
  v /= 100;
  var r, g, b;
  if (s === 0) {
    // If saturation is 0, the color is a shade of gray
    r = g = b = v;
  } else {
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }
  }

  // Convert RGB values to the range of 0-255
  var rgb = {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
  return rgb;
}
function randomColorSet() {
  var randomIntInRange = function randomIntInRange(min, max) {
    return Math.max(Math.min(Math.round(min + (max - min) * Math.random()), max), min);
  };
  var h = randomIntInRange(0, 360);
  var f = function f(v, a) {
    var hsv_text = {
      h: h,
      s: 67,
      v: v
    };
    var hsv_bg = {
      h: h,
      s: 100,
      v: v
    };
    var rgb_text = hsvToRgb(hsv_text.h, hsv_text.s, hsv_text.v);
    var rgb_bg = hsvToRgb(hsv_bg.h, hsv_bg.s, hsv_bg.v);
    var text = {
      r: rgb_text.r,
      g: rgb_text.g,
      b: rgb_text.b,
      a: 1,
      str: "rgba(".concat(rgb_text.r, ",").concat(rgb_text.g, ",").concat(rgb_text.b, ",", 1, ")")
    };
    var bg = {
      r: rgb_bg.r,
      g: rgb_bg.g,
      b: rgb_bg.b,
      a: a,
      str: "rgba(".concat(rgb_bg.r, ",").concat(rgb_bg.g, ",").concat(rgb_bg.b, ",").concat(a, ")")
    };
    return {
      text: text,
      bg: bg
    };
  };
  return {
    light: f(75, 0.06),
    dark: f(100, 0.11)
  };
}
function blendColors(hexColor, rgbaColor) {
  var hexToRGBA = function hexToRGBA(hex, alpha) {
    var r = parseInt(hex.substring(1, 3), 16);
    var g = parseInt(hex.substring(3, 5), 16);
    var b = parseInt(hex.substring(5, 7), 16);
    return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(alpha, ")");
  };
  var rgba = rgbaColor.substring(5, rgbaColor.length - 1).split(',').map(function (f) {
    return parseFloat(String(f).trim());
  });
  var r = rgba[0];
  var g = rgba[1];
  var b = rgba[2];
  var alpha = rgba[3];
  var blendedR = Math.round((1 - alpha) * parseInt(hexColor.substring(1, 3), 16) + alpha * r);
  var blendedG = Math.round((1 - alpha) * parseInt(hexColor.substring(3, 5), 16) + alpha * g);
  var blendedB = Math.round((1 - alpha) * parseInt(hexColor.substring(5, 7), 16) + alpha * b);
  return "#".concat(blendedR.toString(16).padStart(2, '0')).concat(blendedG.toString(16).padStart(2, '0')).concat(blendedB.toString(16).padStart(2, '0'));
}
function stopProp(event) {
  var stop = false;
  if (utilities_typeof(event) === 'object') {
    if (event instanceof Event) {
      stop = true;
    }
  }
  if (stop) {
    event.stopPropagation();
  }
}

// Expose functions to the global scope
window.utilities = {
  encryptString: encryptString,
  decryptString: decryptString,
  enur: enur,
  deur: deur,
  gid: gid,
  shuffleSelf: shuffleSelf,
  che: che,
  timestr: timestr,
  checkTouchFeatures: checkTouchFeatures,
  qe: qe,
  qeAll: qeAll,
  copyProperty: copyProperty,
  unicode_arr: unicode_arr,
  jaroWinklerDistance: jaroWinklerDistance,
  gethashtags: gethashtags,
  fetchWithProgress: fetchWithProgress,
  hsvToRgb: hsvToRgb,
  randomColorSet: randomColorSet,
  isDarkMode: isDarkMode,
  blendColors: blendColors,
  encodeSignsToHtmlEntities: encodeSignsToHtmlEntities,
  isValidURL: isValidURL,
  stopProp: stopProp
};
/* harmony default export */ const utilities = (window.utilities);
;// CONCATENATED MODULE: ./src/core/search.ts
// Import required functions



// Function to create a search index from saved passwords
function createSearchIndex() {
  // Get the list of saved passwords
  var list = listSavedPassword();
  var list_len = list.length;

  // Initialize the search index object
  Xsearch.searchIndex = {
    all: [],
    hashtags: [],
    date: [],
    len: []
  };

  // Loop through each saved password to create search index
  for (var r = 0; r < list_len; r++) {
    // Initialize an array to store all searchable data for this entry
    var all = [];

    // Push password, website, note, and username to the all array
    all.push(list[r].password);
    all.push(list[r].website);
    all.push(list[r].note === null ? '' : utilities.deur(atob(list[r].note)));
    all.push(list[r].username);

    // Convert timestamp to a human-readable format and push to the all array
    var date = new Date(list[r].time_stamp);
    all.push(utilities.timestr(date));

    // Get hashtags from the note and push to the all array
    var hashtags = utilities.gethashtags(all[2], true);
    var hashtags_len = hashtags.length;
    all.push(hashtags.join(' '));

    // Push date-related tags to the all array
    all.push('year:' + date.getFullYear());
    all.push('month:' + (date.getMonth() + 1));
    all.push('date:' + date.getDate());

    // Push password length tag to the all array
    all.push('length:' + String(list[r].password).length);

    // Convert the all array to Unicode array and push to the search index
    var all_unicode = utilities.unicode_arr(String(all.join('')).toLowerCase());
    var hashtags_unicode = utilities.unicode_arr(hashtags.join(''));
    Xsearch.searchIndex.all.push({
      id: list[r].id,
      password: all[0],
      website: all[1],
      note: all[2],
      username: all[3],
      date: all[4],
      len: all[9],
      all_unicode: all_unicode,
      hashtags: hashtags,
      hashtags_unicode: hashtags_unicode,
      all: all.join(' '),
      type: 0
    });

    // Add hashtags, date tags, and length tags to their respective arrays in the search index
    for (var w = 0; w < hashtags_len; w++) {
      if (!(Xsearch.searchIndex.hashtags.indexOf(hashtags[w]) > -1)) {
        Xsearch.searchIndex.hashtags.push(hashtags[w]);
      }
    }
    for (var w = 6; w < 9; w++) {
      if (!(Xsearch.searchIndex.date.indexOf(all[w]) > -1)) {
        Xsearch.searchIndex.date.push(all[w]);
      }
    }
    if (!(Xsearch.searchIndex.len.indexOf(all[9]) > -1)) {
      Xsearch.searchIndex.len.push(all[9]);
    }
  }

  // Return the created search index
  return Xsearch.searchIndex;
}

// Function to search passwords based on a query in the search index
function search_passwords(query, index) {
  // Initialize variables to store suggestions and results
  var index_hashtags_len = index.hashtags.length;
  var index_date_len = index.date.length;
  var index_len_len = index.len.length;
  var suggestions_hashtags = [];
  var suggestions_date = [];
  var suggestions_len = [];
  var suggestions = [];

  // Search for matching hashtags in the search index
  for (var h = 0; h < index_hashtags_len; h++) {
    if (index.hashtags[h].indexOf(query) > -1) {
      suggestions_hashtags.push({
        type: 1,
        suggestion: index.hashtags[h],
        similarity: suggestions_hashtags.length < 10 ? utilities.jaroWinklerDistance(query, index.hashtags[h]) : 0
      });
    }
  }

  // Search for matching date tags in the search index
  for (var d = 0; d < index_date_len; d++) {
    if (index.date[d].indexOf(query) > -1) {
      suggestions_date.push({
        type: 2,
        suggestion: index.date[d],
        similarity: suggestions_date.length < 10 ? utilities.jaroWinklerDistance(query, index.date[d]) : 0
      });
    }
  }

  // Search for matching length tags in the search index
  for (var d = 0; d < index_len_len; d++) {
    if (index.len[d].indexOf(query) > -1) {
      suggestions_date.push({
        type: 4,
        suggestion: index.len[d],
        similarity: suggestions_len.length < 10 ? utilities.jaroWinklerDistance(query, index.len[d]) : 0
      });
    }
  }

  // Combine and sort suggestions
  if (suggestions_hashtags.length < 10 && suggestions_date.length < 10 && suggestions_len.length < 10) {
    suggestions = suggestions_hashtags.concat(suggestions_date).concat(suggestions_len).sort(function (a, b) {
      return b.similarity - a.similarity;
    });
  } else {
    suggestions = suggestions_hashtags.concat(suggestions_date).concat(suggestions_len).sort();
  }

  // Convert query to Unicode array for matching
  var query_unicode = utilities.unicode_arr(query);
  var query_unicode_len = query_unicode.length;
  var result = [];
  var index_len = index.all.length;

  // Loop through the search index to find matching results
  for (var q = 0; q < index_len; q++) {
    var this_index = index.all[q];
    var unicode_check = false;

    // Check if the query Unicode array matches any Unicode character in the search index
    for (var u = 0; u < query_unicode_len; u++) {
      if (this_index.all_unicode.indexOf(query_unicode[u]) > -1) {
        unicode_check = true;
        break;
      }
    }

    // If no Unicode character matches, continue to the next index entry
    if (unicode_check === false) {
      continue;
    } else {
      var text_check = false;

      // Check if the query matches any searchable text in the index entry
      if (String(this_index.all).toLowerCase().indexOf(query) > -1) {
        text_check = true;
      } else {
        if (String(this_index.note).toLowerCase().indexOf(query) > -1) {
          text_check = true;
        } else {
          if (String(this_index.website).toLowerCase().indexOf(query) > -1) {
            text_check = true;
          } else {
            if (String(this_index.username).toLowerCase().indexOf(query) > -1) {
              text_check = true;
            } else {
              if (String(this_index.password).indexOf(query) > -1) {
                text_check = true;
              } else {
                if (String(this_index.date).indexOf(query) > -1) {
                  text_check = true;
                }
              }
            }
          }
        }
      }

      // If text matches, add the index entry to the result array
      if (text_check) {
        result.push(this_index);
      }
    }
  }

  // Return the search result and suggestions
  return {
    result: result,
    suggestions: suggestions.slice(0, 5),
    query: query
  };
}

// Initialize an empty search index object
var searchIndex = {
  all: [],
  hashtags: [],
  date: [],
  len: []
};

// Expose functions and search index object to the global scope
window.Xsearch = {
  createSearchIndex: createSearchIndex,
  search_passwords: search_passwords,
  searchIndex: searchIndex
};
/* harmony default export */ const core_search = (window.Xsearch);
;// CONCATENATED MODULE: ./src/index.ts
function src_typeof(o) { "@babel/helpers - typeof"; return src_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, src_typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == src_typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(src_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }





















//for development

var ErrorStackParser = __webpack_require__(4263);
var StackTrace = __webpack_require__(8139);
window.onerror = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(message, source, lineno, colno, error) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          StackTrace.fromError(error).then(function (stackTrace) {
            var parsedStackTrace = stackTrace.map(function (frame) {
              return {
                functionName: frame.functionName,
                fileName: frame.fileName,
                lineNumber: frame.lineNumber,
                columnNumber: frame.columnNumber
              };
            });
            console.log('%c ----------', 'color: #888;');
            parsedStackTrace.forEach(function (e) {
              console.error("func: ".concat(e.functionName, "\npath: ").concat(e.fileName, "\nlocation: L").concat(e.lineNumber, " C").concat(e.columnNumber));
            });
          });
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();
window.password_page_icon_loaded = false;
window.allhashtag = {};
window.search_status = 0;
window.search_sticky = false;
window.container_scrollTop = 0;
window.pattern_editor_evt = 0;
window.pattern_editor_blocks_json = utilities.qe('.pattern_editor_blocks_json');
window.search_will_change_evt = [0, 1];
window.search_will_change_evt_list = ['touchstart', 'touchend', 'mouseenter', 'mouseleave'];
window.pwdgen2 = function () {
  //initialize
  utilities.qe('.search').addEventListener('click', function (e) {
    user_interfaces_interaction.search.openSearch();
  });
  utilities.qe('.search-box .search input#search').addEventListener('focus', function (e) {
    user_interfaces_interaction.search.openSearch();
  });
  utilities.qe('.main-page').addEventListener('scroll', function (e) {
    container_scrollTop = utilities.qe('.main-page').scrollTop;
    var scale = 1;
    if (container_scrollTop < 0) {
      scale = 1 + Math.abs(container_scrollTop) / 500;
      if (scale > 1.3) {
        scale = 1.3;
      }
    }
    utilities.qe('.main-page .title').style.setProperty('--scroll-scale', scale);
    if (container_scrollTop >= 50) {
      utilities.qe('.main-page .search-box').setAttribute('sticky', 'true');
      utilities.qe('.main-page .fixed-title-box').setAttribute('sticky', 'true');
      utilities.qe('.main-page .fixed-title-box-mask').setAttribute('sticky', 'true');
      if (!(search_status === 1)) {
        user_interfaces_interaction.SASBC(1);
      }
      search_sticky = true;
    } else {
      utilities.qe('.main-page .search-box').setAttribute('sticky', 'false');
      utilities.qe('.main-page .fixed-title-box').setAttribute('sticky', 'false');
      utilities.qe('.main-page .fixed-title-box-mask').setAttribute('sticky', 'false');
      if (!(search_status === 1)) {
        user_interfaces_interaction.SASBC(3);
      }
      search_sticky = false;
    }
    user_interfaces_interaction.main_page.lazyLoadPasswordListIcons_scrolling_handler();
  });
  utilities.qe('.password-page').addEventListener('scroll', function (e) {
    var scrollTop = utilities.qe('.password-page').scrollTop;
    if (scrollTop > 0) {
      utilities.qe('.password-page .fixed-title-box').setAttribute('scroll', '1');
      user_interfaces_interaction.SASBC(1);
    } else {
      utilities.qe('.password-page .fixed-title-box').setAttribute('scroll', '0');
      user_interfaces_interaction.SASBC(3);
    }
  });
  utilities.qe('.add-password-page').addEventListener('scroll', function (e) {
    var scrollTop = utilities.qe('.add-password-page').scrollTop;
    if (scrollTop > 0) {
      utilities.qe('.add-password-page .fixed-title-box').setAttribute('scroll', '1');
      user_interfaces_interaction.SASBC(1);
    } else {
      utilities.qe('.add-password-page .fixed-title-box').setAttribute('scroll', '0');
      user_interfaces_interaction.SASBC(3);
    }
  });
  utilities.qe('.edit-password-page').addEventListener('scroll', function (e) {
    var scrollTop = utilities.qe('.edit-password-page').scrollTop;
    if (scrollTop > 0) {
      utilities.qe('.edit-password-page .fixed-title-box').setAttribute('scroll', '1');
      user_interfaces_interaction.SASBC(1);
    } else {
      utilities.qe('.edit-password-page .fixed-title-box').setAttribute('scroll', '0');
      user_interfaces_interaction.SASBC(3);
    }
  });
  utilities.qe('.pattern_editor').addEventListener('scroll', function (e) {
    var scrollTop = utilities.qe('.pattern_editor').scrollTop;
    if (scrollTop > 0) {
      utilities.qe('.pattern_editor .fixed-title-box').setAttribute('scroll', '1');
      user_interfaces_interaction.SASBC(1);
    } else {
      utilities.qe('.pattern_editor .fixed-title-box').setAttribute('scroll', '0');
      user_interfaces_interaction.SASBC(3);
    }
  });
  if (!utilities.checkTouchFeatures()) {
    search_will_change_evt = [2, 3];
  }
  utilities.qe('#importdata').addEventListener('change', importdatahandler, false);
  core_words_list.getWordsList();
  user_interfaces_interaction.loadFont('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap', 'Noto Sans', 'googleFontsNotoSans');
  upgradeData();
  core_search.searchIndex = core_search.createSearchIndex();
  setTimeout(function () {
    user_interfaces_interaction.main_page.printSavedPasswordList();
    share.receiveSharedContentFromURL(location.href);
  }, 700);
};
/* harmony default export */ const src = (window.pwdgen2);
})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map