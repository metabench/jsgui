/**
 * Created by James on 09/08/2014.
 */

    //Benchmark.prototype.setup = function() {

//var canvas = document.getElementById('canvas');
//var context = canvas.getContext('2d');
//var imageData = context.getImageData(0, 0, 100, 100);

/*

module.exports = {
    'decode': decode,
    'size': size
};
*/

// Not sure exactly what this does / how to use this to resize an image.
//  Maybe I should do my image transformation mapping.
//  Interesting to have it working for parralellograms too.

// Would be good to work out the precise mappings.
//  'Precision Sampling' method?


// From http://jsperf.com/pixel-interpolation/2


(function() {
    var red, green, blue;

    function clamp(lo, value, hi) {
        return value < lo ? lo : value > hi ? hi : value;
    }

    function nearest(pixels, x, y, offset, width) {
        return pixels[offset + Math.round(y) * width * 4 + Math.round(x) * 4];
    }

    function nearest_unrolled(pixels, x, y, width) {
        var yw4x4 = ((y + 0.5) ^ 0) * width * 4 + ((x + 0.5) ^ 0) * 4;
        return [
            pixels[yw4x4],
            pixels[yw4x4 + 1],
            pixels[yw4x4 + 2]
        ]
    }

    function bilinear(pixels, x, y, offset, width) {
        var percentX = 1.0 - (x - Math.floor(x));
        var percentY = y - Math.floor(y);

        var top = pixels[offset + Math.ceil(y) * width * 4 + Math.floor(x) * 4] * percentX + pixels[offset + Math.ceil(y) * width * 4 + Math.ceil(x) * 4] * (1.0 - percentX);
        var bottom = pixels[offset + Math.floor(y) * width * 4 + Math.floor(x) * 4] * percentX + pixels[offset + Math.floor(y) * width * 4 + Math.ceil(x) * 4] * (1.0 - percentX);

        return top * percentY + bottom * (1.0 - percentY);
    }

    function bilinear_optimized(pixels, x, y, offset, width) {
        var percentX = x - (x ^ 0);
        var percentX1 = 1.0 - percentX;
        var percentY = y - (y ^ 0);
        var fx4 = (x ^ 0) * 4;
        var cx4 = fx4 + 4;
        var fy4 = (y ^ 0) * 4;
        var cy4wo = (fy4 + 4) * width + offset;
        var fy4wo = fy4 * width + offset;

        var top = pixels[cy4wo + fx4] * percentX1 + pixels[cy4wo + cx4] * percentX;
        var bottom = pixels[fy4wo + fx4] * percentX1 + pixels[fy4wo + cx4] * percentX;

        return top * percentY + bottom * (1.0 - percentY);
    }

    function bilinear_unrolled(pixels, x, y, width) {
        var percentX = x - (x ^ 0);
        var percentX1 = 1.0 - percentX;
        var percentY = y - (y ^ 0);
        var percentY1 = 1.0 - percentY;
        var fx4 = (x ^ 0) * 4;
        var cx4 = fx4 + 4;
        var fy4 = (y ^ 0) * 4;
        var cy4wr = (fy4 + 4) * width;
        var fy4wr = fy4 * width;
        var cy4wg = cy4wr + 1;
        var fy4wg = fy4wr + 1;
        var cy4wb = cy4wr + 2;
        var fy4wb = fy4wr + 2;
        var top, bottom, r, g, b;

        top = pixels[cy4wr + fx4] * percentX1 + pixels[cy4wr + cx4] * percentX;
        bottom = pixels[fy4wr + fx4] * percentX1 + pixels[fy4wr + cx4] * percentX;
        r = top * percentY + bottom * percentY1;

        top = pixels[cy4wg + fx4] * percentX1 + pixels[cy4wg + cx4] * percentX;
        bottom = pixels[fy4wg + fx4] * percentX1 + pixels[fy4wg + cx4] * percentX;
        g = top * percentY + bottom * percentY1;

        top = pixels[cy4wb + fx4] * percentX1 + pixels[cy4wb + cx4] * percentX;
        bottom = pixels[fy4wb + fx4] * percentX1 + pixels[fy4wb + cx4] * percentX;
        b = top * percentY + bottom * percentY1;

        return [r, g, b];
    }

    function bicubic_value(x, a, b, c, d) {
        return clamp(0, 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * x) * x) * x + b, 255);
    }

    function bicubic(pixels, x, y, offset, width) {
        var v = [0, 0, 0, 0];
        var fx = Math.floor(x);
        var fy = Math.floor(y);
        var percentX = x - fx;
        var percentY = y - fy;

        for (var i = -1; i < 3; i++) {
            var yw4o = (fy + i) * width * 4 + offset;
            v[i + 1] = (bicubic_value(percentX, pixels[(fy + i) * width * 4 + (fx - 1) * 4 + offset], pixels[(fy + i) * width * 4 + fx * 4 + offset], pixels[(fy + i) * width * 4 + (fx + 1) * 4 + offset], pixels[(fy + i) * width * 4 + (fx + 2) * 4 + offset]));
        }

        return Math.floor(bicubic_value(percentY, v[0], v[1], v[2], v[3]));
    }

    function bicubic_optimized(pixels, x, y, offset, width) {
        var a, b, c, d, v0, v1, v2, v3;
        var fx = x ^ 0;
        var fy = y ^ 0;
        var percentX = x - fx;
        var percentY = y - fy;

        var fx14 = fx * 4;
        var fx04 = fx14 - 4;
        var fx24 = fx14 + 4;
        var fx34 = fx14 + 8;
        var w4 = width * 4;
        var yw14o = fy * w4 + offset;
        var yw04o = yw14o - w4;
        var yw24o = yw14o + w4;
        var yw34o = yw14o + w4 + w4;

        a = pixels[yw04o + fx04];
        b = pixels[yw04o + fx14];
        c = pixels[yw04o + fx24];
        d = pixels[yw04o + fx34];
        v0 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
        v0 = v0 > 255 ? 255 : v0 < 0 ? 0 : v0;

        a = pixels[yw14o + fx04];
        b = pixels[yw14o + fx14];
        c = pixels[yw14o + fx24];
        d = pixels[yw14o + fx34];
        v1 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
        v1 = v1 > 255 ? 255 : v1 < 0 ? 0 : v1;

        a = pixels[yw24o + fx04];
        b = pixels[yw24o + fx14];
        c = pixels[yw24o + fx24];
        d = pixels[yw24o + fx34];
        v2 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
        v2 = v2 > 255 ? 255 : v2 < 0 ? 0 : v2;

        a = pixels[yw34o + fx04];
        b = pixels[yw34o + fx14];
        c = pixels[yw34o + fx24];
        d = pixels[yw34o + fx34];
        v3 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
        v3 = v3 > 255 ? 255 : v3 < 0 ? 0 : v3;

        a = v0;
        b = v1;
        c = v2;
        d = v3;
        a = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentY) * percentY) * percentY + b;
        return a > 255 ? 255 : a < 0 ? 0 : a ^ 0;
    }

    function bicubic_unrolled(pixels, x, y, width) {
        var a, b, c, d, v0, v1, v2, v3, r, g, b;
        var fx = x ^ 0;
        var fy = y ^ 0;
        var percentX = x - fx;
        var percentY = y - fy;

        var fx14 = fx * 4;
        var fx04 = fx14 - 4;
        var fx24 = fx14 + 4;
        var fx34 = fx14 + 8;
        var w4 = width * 4;
        var yw14r = fy * w4;
        var yw04r = yw14r - w4;
        var yw24r = yw14r + w4;
        var yw34r = yw14r + w4 + w4;
        var yw14g = yw14r + 1;
        var yw04g = yw04r + 1;
        var yw24g = yw24r + 1;
        var yw34g = yw34r + 1;
        var yw14b = yw14r + 2;
        var yw04b = yw04r + 2;
        var yw24b = yw24r + 2;
        var yw34b = yw34r + 2;

        // Red
        a = pixels[yw04r + fx04];
        b = pixels[yw04r + fx14];
        c = pixels[yw04r + fx24];
        d = pixels[yw04r + fx34];
        v0 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
        v0 = v0 > 255 ? 255 : v0 < 0 ? 0 : v0;

        a = pixels[yw14r + fx04];
        b = pixels[yw14r + fx14];
        c = pixels[yw14r + fx24];
        d = pixels[yw14r + fx34];
        v1 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
        v1 = v1 > 255 ? 255 : v1 < 0 ? 0 : v1;

        a = pixels[yw24r + fx04];
        b = pixels[yw24r + fx14];
        c = pixels[yw24r + fx24];
        d = pixels[yw24r + fx34];
        v2 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
        v2 = v2 > 255 ? 255 : v2 < 0 ? 0 : v2;

        a = pixels[yw34r + fx04];
        b = pixels[yw34r + fx14];
        c = pixels[yw34r + fx24];
        d = pixels[yw34r + fx34];
        v3 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
        v3 = v3 > 255 ? 255 : v3 < 0 ? 0 : v3;

        a = v0;
        b = v1;
        c = v2;
        d = v3;
        r = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentY) * percentY) * percentY + b;
        r = r > 255 ? 255 : r < 0 ? 0 : r ^ 0;

        // Green
        a = pixels[yw04g + fx04];
        b = pixels[yw04g + fx14];
        c = pixels[yw04g + fx24];
        d = pixels[yw04g + fx34];
        v0 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
        v0 = v0 > 255 ? 255 : v0 < 0 ? 0 : v0;

        a = pixels[yw14g + fx04];
        b = pixels[yw14g + fx14];
        c = pixels[yw14g + fx24];
        d = pixels[yw14g + fx34];
        v1 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
        v1 = v1 > 255 ? 255 : v1 < 0 ? 0 : v1;

        a = pixels[yw24g + fx04];
        b = pixels[yw24g + fx14];
        c = pixels[yw24g + fx24];
        d = pixels[yw24g + fx34];
        v2 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
        v2 = v2 > 255 ? 255 : v2 < 0 ? 0 : v2;

        a = pixels[yw34g + fx04];
        b = pixels[yw34g + fx14];
        c = pixels[yw34g + fx24];
        d = pixels[yw34g + fx34];
        v3 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
        v3 = v3 > 255 ? 255 : v3 < 0 ? 0 : v3;

        a = v0;
        b = v1;
        c = v2;
        d = v3;
        g = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentY) * percentY) * percentY + b;
        g = g > 255 ? 255 : g < 0 ? 0 : g ^ 0;

        // Blue
        a = pixels[yw04b + fx04];
        b = pixels[yw04b + fx14];
        c = pixels[yw04b + fx24];
        d = pixels[yw04b + fx34];
        v0 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
        v0 = v0 > 255 ? 255 : v0 < 0 ? 0 : v0;

        a = pixels[yw14b + fx04];
        b = pixels[yw14b + fx14];
        c = pixels[yw14b + fx24];
        d = pixels[yw14b + fx34];
        v1 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
        v1 = v1 > 255 ? 255 : v1 < 0 ? 0 : v1;

        a = pixels[yw24b + fx04];
        b = pixels[yw24b + fx14];
        c = pixels[yw24b + fx24];
        d = pixels[yw24b + fx34];
        v2 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
        v2 = v2 > 255 ? 255 : v2 < 0 ? 0 : v2;

        a = pixels[yw34b + fx04];
        b = pixels[yw34b + fx14];
        c = pixels[yw34b + fx24];
        d = pixels[yw34b + fx34];
        v3 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
        v3 = v3 > 255 ? 255 : v3 < 0 ? 0 : v3;

        a = v0;
        b = v1;
        c = v2;
        d = v3;
        b = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentY) * percentY) * percentY + b;
        b = b > 255 ? 255 : b < 0 ? 0 : b ^ 0;

        return [r, g, b];
    };
})();



