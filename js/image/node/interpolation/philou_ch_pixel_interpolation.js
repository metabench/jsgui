/**
 * Created by James on 09/08/2014.
 */


var BicubicInterpolation = (function(){
    return function(x, y, values){
        var i0, i1, i2, i3;

        i0 = TERP(x, values[0][0], values[1][0], values[2][0], values[3][0]);
        i1 = TERP(x, values[0][1], values[1][1], values[2][1], values[3][1]);
        i2 = TERP(x, values[0][2], values[1][2], values[2][2], values[3][2]);
        i3 = TERP(x, values[0][3], values[1][3], values[2][3], values[3][3]);
        return TERP(y, i0, i1, i2, i3);
    };
    /* Yay, hoisting! */
    function TERP(t, a, b, c, d){
        return 0.5 * (c - a + (2.0*a - 5.0*b + 4.0*c - d + (3.0*(b - c) + d - a)*t)*t)*t + b;
    }
})();

// compute vector index from matrix one
function ivect(ix, iy, w) {
    // byte array, r,g,b,a
    return((ix + w * iy) * 4);
}

function bilinear(srcImg, destImg, scale) {
    // c.f.: wikipedia english article on bilinear interpolation
    // taking the unit square, the inner loop looks like this
    // note: there's a function call inside the double loop to this one
    // maybe a performance killer, optimize this whole code as you need
    function inner(f00, f10, f01, f11, x, y) {
        var un_x = 1.0 - x; var un_y = 1.0 - y;
        return (f00 * un_x * un_y + f10 * x * un_y + f01 * un_x * y + f11 * x * y);
    }
    var i, j;
    var iyv, iy0, iy1, ixv, ix0, ix1;
    var idxD, idxS00, idxS10, idxS01, idxS11;
    var dx, dy;
    var r, g, b, a;
    for (i = 0; i < destImg.height; ++i) {
        iyv = i / scale;
        iy0 = Math.floor(iyv);
        // Math.ceil can go over bounds
        iy1 = ( Math.ceil(iyv) > (srcImg.height-1) ? (srcImg.height-1) : Math.ceil(iyv) );
        for (j = 0; j < destImg.width; ++j) {
            ixv = j / scale;
            ix0 = Math.floor(ixv);

            // Math.ceil can go over bounds
            ix1 = ( Math.ceil(ixv) > (srcImg.width-1) ? (srcImg.width-1) : Math.ceil(ixv) );
            idxD = ivect(j, i, destImg.width);

            // matrix to vector indices
            idxS00 = ivect(ix0, iy0, srcImg.width);
            idxS10 = ivect(ix1, iy0, srcImg.width);
            idxS01 = ivect(ix0, iy1, srcImg.width);
            idxS11 = ivect(ix1, iy1, srcImg.width);

            // overall coordinates to unit square
            dx = ixv - ix0; dy = iyv - iy0;

            // I let the r, g, b, a on purpose for debugging
            r = inner(srcImg.data[idxS00], srcImg.data[idxS10],
                srcImg.data[idxS01], srcImg.data[idxS11], dx, dy);
            destImg.data[idxD] = r;

            g = inner(srcImg.data[idxS00+1], srcImg.data[idxS10+1],
                srcImg.data[idxS01+1], srcImg.data[idxS11+1], dx, dy);
            destImg.data[idxD+1] = g;

            b = inner(srcImg.data[idxS00+2], srcImg.data[idxS10+2],
                srcImg.data[idxS01+2], srcImg.data[idxS11+2], dx, dy);
            destImg.data[idxD+2] = b;

            a = inner(srcImg.data[idxS00+3], srcImg.data[idxS10+3],
                srcImg.data[idxS01+3], srcImg.data[idxS11+3], dx, dy);
            destImg.data[idxD+3] = a;
        }
    }
}


function bicubic(srcImg, destImg, scale) {

    var i, j;
    var dx, dy;
    var repeatX, repeatY;
    var offset_row0, offset_row1, offset_row2, offset_row3;
    var offset_col0, offset_col1, offset_col2, offset_col3;
    var red_pixels, green_pixels, blue_pixels, alpha_pixels;
    for (i = 0; i < destImg.height; ++i) {
        iyv = i / scale;
        iy0 = Math.floor(iyv);

        // We have to special-case the pixels along the border and repeat their values if neccessary
        repeatY = 0;
        if(iy0 < 1) repeatY = -1;
        else if(iy0 > srcImg.height - 3) repeatY = iy0 - (srcImg.height - 3);

        for (j = 0; j < destImg.width; ++j) {
            ixv = j / scale;
            ix0 = Math.floor(ixv);

            // We have to special-case the pixels along the border and repeat their values if neccessary
            repeatX = 0;
            if(ix0 < 1) repeatX = -1;
            else if(ix0 > srcImg.width - 3) repeatX = ix0 - (srcImg.width - 3);

            offset_row1 = ((iy0)   * srcImg.width + ix0) * 4;
            offset_row0 = repeatY < 0 ? offset_row1 : ((iy0-1) * srcImg.width + ix0) * 4;
            offset_row2 = repeatY > 1 ? offset_row1 : ((iy0+1) * srcImg.width + ix0) * 4;
            offset_row3 = repeatY > 0 ? offset_row2 : ((iy0+2) * srcImg.width + ix0) * 4;

            offset_col1 = 0;
            offset_col0 = repeatX < 0 ? offset_col1 : -4;
            offset_col2 = repeatX > 1 ? offset_col1 : 4;
            offset_col3 = repeatX > 0 ? offset_col2 : 8;

            //Each offset is for the start of a row's red pixels
            red_pixels = [[srcImg.data[offset_row0+offset_col0], srcImg.data[offset_row1+offset_col0], srcImg.data[offset_row2+offset_col0], srcImg.data[offset_row3+offset_col0]],
                [srcImg.data[offset_row0+offset_col1], srcImg.data[offset_row1+offset_col1], srcImg.data[offset_row2+offset_col1], srcImg.data[offset_row3+offset_col1]],
                [srcImg.data[offset_row0+offset_col2], srcImg.data[offset_row1+offset_col2], srcImg.data[offset_row2+offset_col2], srcImg.data[offset_row3+offset_col2]],
                [srcImg.data[offset_row0+offset_col3], srcImg.data[offset_row1+offset_col3], srcImg.data[offset_row2+offset_col3], srcImg.data[offset_row3+offset_col3]]];
            offset_row0++;
            offset_row1++;
            offset_row2++;
            offset_row3++;
            //Each offset is for the start of a row's green pixels
            green_pixels = [[srcImg.data[offset_row0+offset_col0], srcImg.data[offset_row1+offset_col0], srcImg.data[offset_row2+offset_col0], srcImg.data[offset_row3+offset_col0]],
                [srcImg.data[offset_row0+offset_col1], srcImg.data[offset_row1+offset_col1], srcImg.data[offset_row2+offset_col1], srcImg.data[offset_row3+offset_col1]],
                [srcImg.data[offset_row0+offset_col2], srcImg.data[offset_row1+offset_col2], srcImg.data[offset_row2+offset_col2], srcImg.data[offset_row3+offset_col2]],
                [srcImg.data[offset_row0+offset_col3], srcImg.data[offset_row1+offset_col3], srcImg.data[offset_row2+offset_col3], srcImg.data[offset_row3+offset_col3]]];
            offset_row0++;
            offset_row1++;
            offset_row2++;
            offset_row3++;
            //Each offset is for the start of a row's blue pixels
            blue_pixels = [[srcImg.data[offset_row0+offset_col0], srcImg.data[offset_row1+offset_col0], srcImg.data[offset_row2+offset_col0], srcImg.data[offset_row3+offset_col0]],
                [srcImg.data[offset_row0+offset_col1], srcImg.data[offset_row1+offset_col1], srcImg.data[offset_row2+offset_col1], srcImg.data[offset_row3+offset_col1]],
                [srcImg.data[offset_row0+offset_col2], srcImg.data[offset_row1+offset_col2], srcImg.data[offset_row2+offset_col2], srcImg.data[offset_row3+offset_col2]],
                [srcImg.data[offset_row0+offset_col3], srcImg.data[offset_row1+offset_col3], srcImg.data[offset_row2+offset_col3], srcImg.data[offset_row3+offset_col3]]];
            offset_row0++;
            offset_row1++;
            offset_row2++;
            offset_row3++;
            //Each offset is for the start of a row's alpha pixels
            alpha_pixels =[[srcImg.data[offset_row0+offset_col0], srcImg.data[offset_row1+offset_col0], srcImg.data[offset_row2+offset_col0], srcImg.data[offset_row3+offset_col0]],
                [srcImg.data[offset_row0+offset_col1], srcImg.data[offset_row1+offset_col1], srcImg.data[offset_row2+offset_col1], srcImg.data[offset_row3+offset_col1]],
                [srcImg.data[offset_row0+offset_col2], srcImg.data[offset_row1+offset_col2], srcImg.data[offset_row2+offset_col2], srcImg.data[offset_row3+offset_col2]],
                [srcImg.data[offset_row0+offset_col3], srcImg.data[offset_row1+offset_col3], srcImg.data[offset_row2+offset_col3], srcImg.data[offset_row3+offset_col3]]];

            // overall coordinates to unit square
            dx = ixv - ix0; dy = iyv - iy0;

            idxD = ivect(j, i, destImg.width);

            destImg.data[idxD] = BicubicInterpolation(dx, dy, red_pixels);

            destImg.data[idxD+1] =  BicubicInterpolation(dx, dy, green_pixels);

            destImg.data[idxD+2] = BicubicInterpolation(dx, dy, blue_pixels);

            destImg.data[idxD+3] = BicubicInterpolation(dx, dy, alpha_pixels);
        }
    }
}

/*

var loadCan = document.getElementById("load-canvas");
var dispCan = document.getElementById("disp-canvas");
var dispCanBC = document.getElementById("disp-canvas-bicubic");

var loadCtx = loadCan.getContext("2d");
var dispCtx = dispCan.getContext("2d");
var dispCtxBC = dispCanBC.getContext("2d");

var scale = Math.PI * 5;

var image_var = new Image();
image_var.onload  = function () {
    loadCan.setAttribute("width", image_var.width);
    loadCan.setAttribute("height", image_var.height);
    loadCan.style.position = "fixed";
    loadCan.width  = image_var.width;
    loadCan.height = image_var.height;
    loadCtx.drawImage(image_var, 0, 0, image_var.width, image_var.height);

    // getImageData : Chrome & FF: Unable to get image data from canvas because the canvas
    // has been tainted by cross-origin data.
    // when served from localhost, dev laptop
    var srcImg = loadCtx.getImageData(0, 0, image_var.width, image_var.height);

    var newWidth = Math.ceil(image_var.width*scale);
    var newHeight = Math.ceil(image_var.height*scale);
    dispCan.width = newWidth;
    dispCan.height = newHeight;
    dispCan.setAttribute("width", newWidth);
    dispCan.setAttribute("height", newHeight);
    dispCanBC.width = newWidth;
    dispCanBC.height = newHeight;
    dispCanBC.setAttribute("width", newWidth);
    dispCanBC.setAttribute("height", newHeight);
    var destImg = dispCtx.createImageData(newWidth, newHeight);
    bilinear(srcImg, destImg, scale);
    var destImgBC = dispCtx.createImageData(newWidth, newHeight);
    bicubic(srcImg, destImgBC, scale);

    dispCtx.putImageData(destImg, 0, 0);

    dispCtxBC.putImageData(destImgBC, 0, 0);
}
image_var.src = "/img/social-icons/twitter_16.png";

*/
