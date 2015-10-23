#include <v8.h>
#include <node.h>
#include <node_buffer.h>
#include <stdlib.h>
#include <errno.h>
#include <cmath>
//#include <stdbool.h>
#include <stdio.h>
#include <list>
#include <iostream>
#include <nan.h>

//#include <jpeglib.h>
//#include <jerror.h>
//#import "fmemopen.h"

// Could include the libturbo jpeg here?
//  That may be better than assuming it's on the system, would be easier to install.

// It may be easier to use a JPEG library that does not have SIMD extensions.

//#include "jpeg_decoder.h"
//#include <jpeglib.h>

using namespace node;
using namespace v8;
using namespace std;

 /*

int fib(int n)
{
  if(n < 2)
  {
      return 1;
  }
  else
  {
      return fib(n-1) + fib(n-2);
  }

}
*/


 /*

static Handle<Value> fib_number(const Arguments& args)
{

    HandleScope scope;


    int n = args[0]->Int32Value();

    int result = fib(n);

    return scope.Close(Integer::New(result));

}
*/


// This buffer copying code could be useful in functions that need a new buffer,
//  like convolutions.
// Code from http://www.samcday.com.au/blog/2011/03/03/creating-a-proper-buffer-in-a-node-c-addon/

NAN_METHOD(node_copy_rgba_pixel_buffer_to_rgba_pixel_buffer_region) {
// get_occurrances_info_from_time_series_ita
    NanScope();

    // Read char data from args 0
    //Local<Array> arr;
    Local<Object> obj;
    char* data;
    unsigned int dats_data_structure_length;

    obj = args[1].As<Object>();

    if (obj->HasIndexedPropertiesInExternalArrayData()) {
        dats_data_structure_length = obj->GetIndexedPropertiesExternalArrayDataLength();
        //pattern = static_cast<double*>(obj->GetIndexedPropertiesExternalArrayData());

        data = static_cast<char*>(obj->GetIndexedPropertiesExternalArrayData());


    }

    // And can we copy to a result buffer?







}

/*

static Handle<Value> buffer_copy(const Arguments& args)
{

    HandleScope scope;
    Local<Value> arg(args[0]);

    char* data = (char*)Buffer::Data(arg);

    int length = (int)Buffer::Length(arg);

    //cout << "buffer_copy" << endl;
    //cout << length << endl;

    // also want width and height arguments
    node::Buffer *slowBuffer = node::Buffer::New(length);

    // Buffer:Data gives us a yummy void* pointer to play with to our hearts
    // content.
    memcpy(node::Buffer::Data(slowBuffer), data, length);

    // Now we need to create the JS version of the Buffer I was telling you about.
    // To do that we need to actually pull it from the execution context.
    // First step is to get a handle to the global object.
    v8::Local<v8::Object> globalObj = v8::Context::GetCurrent()->Global();

    // Now we need to grab the Buffer constructor function.
    v8::Local<v8::Function> bufferConstructor = v8::Local<v8::Function>::Cast(globalObj->Get(v8::String::New("Buffer")));

    // Great. We can use this constructor function to allocate new Buffers.
    // Let's do that now. First we need to provide the correct arguments.
    // First argument is the JS object Handle for the SlowBuffer.
    // Second arg is the length of the SlowBuffer.
    // Third arg is the offset in the SlowBuffer we want the .. "Fast"Buffer to start at.
    v8::Handle<v8::Value> constructorArgs[3] = { slowBuffer->handle_, v8::Integer::New(length), v8::Integer::New(0) };

    // Now we have our constructor, and our constructor args. Let's create the
    // damn Buffer already!
    v8::Local<v8::Object> actualBuffer = bufferConstructor->NewInstance(3, constructorArgs);


    //int n = args[0]->Int32Value();

    //int result = fib(n);
    return scope.Close(actualBuffer);
    //return scope.Close(data);

    //return scope.Close(Integer::New(10));
}
*/

// Sometimes operating on the same buffer makes most sense for performance reasons.
//  maybe call them 'self' functions.

// Some may obviously make a copy / generally would do.
//  It's probably possible to make a more optimized self convolution, I won't do that right now.

// Function to filter all scanlines...
//  Though filtering or unfiltering a single scanline may be a better first target.

// Can maybe do this in a more functional way than JS and still have it fast.

/*

var paeth_predictor = function(left, above, above_left) {
    var p = left + above - above_left,
        p_left = Math.abs(p - left),
        p_above = Math.abs(p - above),
        p_above_left = Math.abs(p - above_left);

    if (p_left <= p_above && p_left <= p_above_left) {
        return left;
    }
    else if (p_above <= p_above_left) {
        return above;
    }
    return above_left;
};
        */

unsigned char paeth_predictor(unsigned char left, unsigned char above, unsigned char above_left) {
  int p, p_left, p_above, p_above_left;
  p = left + above - above_left;
  p_left = abs(p - left);
  p_above = abs(p - above);
  p_above_left = abs(p - above_left);

  if (p_left <= p_above && p_left <= p_above_left) {
      return left;
  }
  else if (p_above <= p_above_left) {
      return above;
  }
  return above_left;

}

// copy_unfiltered_scanline_buffer_cm6bpp8_to_rgba_buffer
//  this would read through the image, and copy it to that target rgba buffer.

//


// Current run-time error:
//Error: dlopen(/Users/james/Dropbox/metabench/metabench/ws/js/image/build/Release/binding.node, 1): Symbol not found: _jpeg_resync_to_restart


// Pixel Buffers (RGBA, RGB)

// copy_rgba_pixel_buffer_to_rgba_pixel_buffer_region


// copy_unfiltered_scanlines_buffer_to_rgba_buffer_cpp
//  2 buffers as parameters. returns the result buffer (the 2nd param)

static Handle<Value> copy_rgba_pixel_buffer_to_rgba_pixel_buffer_region(const Arguments& args)
{
  // (source_buffer, source_buffer_line_length, dest_buffer, dest_buffer_line_length, destX, destY);



  //cout << endl << "copy_unfiltered_scanlines_buffer_32_bpp_to_rgba_buffer_cpp" << endl;
  HandleScope scope;
  Local<Value> arg0(args[0]);
  unsigned char*  source_buffer = (unsigned char*)Buffer::Data(arg0);

  int source_buffer_scanline_length = args[1]->Int32Value();

  Local<Value> arg2(args[2]);
  unsigned char*  dest_buffer = (unsigned char*)Buffer::Data(arg2);

  int dest_buffer_scanline_length = args[3]->Int32Value();

  int destX = args[4]->Int32Value();
  int destY = args[5]->Int32Value();

  int y; //, b, x;

  int source_buffer_length = (int)Buffer::Length(arg0);
  int source_h = source_buffer_length / source_buffer_scanline_length;
  int source_w = (source_buffer_length / source_h) / 4;

  //int source_buffer_line_start_pos, source_buffer_line_end_pos, dest_buffer_subline_start_pos;
  int source_buffer_line_start_pos, dest_buffer_subline_start_pos;

  //cout << "source_w " << source_w << endl;

  //cout << "destX " << source_h << endl;
  //cout << "destY " << source_h << endl;

  //cout << "source_h " << source_h << endl;

  //int dest_buffer_line_pos;

  for (y = 0; y < source_h; y++) {


    source_buffer_line_start_pos = (y * source_buffer_scanline_length);
    //source_buffer_line_end_pos = source_buffer_line_start_pos + source_buffer_scanline_length;

    dest_buffer_subline_start_pos = ((y + destY) * dest_buffer_scanline_length) + destX * 4;
    //var dest_buffer_subline_end_pos = dest_buffer_subline_start_pos + source_buffer_line_length;
    //cout << "source_buffer_line_start_pos " << source_buffer_line_start_pos << endl;
    //cout << "source_buffer_line_end_pos " << source_buffer_line_end_pos << endl;
    //cout << "dest_buffer_subline_start_pos " << dest_buffer_subline_start_pos << endl;

    // buf.copy(targetBuffer, [targetStart], [sourceStart], [sourceEnd])
    /*
    source_buffer.copy(dest_buffer, dest_buffer_subline_start_pos + dest_buffer_start_offset, source_buffer_line_start_pos, source_buffer_line_end_pos);
    */

    // Needs to work out the x positions differently...

    // Go through x...

    //memcpy(dest, source, length);

    memcpy(dest_buffer + dest_buffer_subline_start_pos, source_buffer + source_buffer_line_start_pos, source_buffer_scanline_length);
    /*
    for (x = 0; x < source_w; x++) {
      dest_buffer[dest_buffer_subline_start_pos + (x * 4)] = source_buffer[source_buffer_line_start_pos + (x * 4)];
      dest_buffer[dest_buffer_subline_start_pos + (x * 4) + 1] = source_buffer[source_buffer_line_start_pos + (x * 4) + 1];
      dest_buffer[dest_buffer_subline_start_pos + (x * 4) + 2] = source_buffer[source_buffer_line_start_pos + (x * 4) + 2];
      dest_buffer[dest_buffer_subline_start_pos + (x * 4) + 3] = source_buffer[source_buffer_line_start_pos + (x * 4) + 3];
    }
    */
    /*

    for (b = 0; b < source_buffer_scanline_length; b++) {
      //

      //cout << "val " << val << endl;
      //rgba_buffer[dest_buffer_start_pos + x] = val;

      //val = unfiltered_scanlines_buffer[unfiltered_scanlines_buffer_start_pos + x + 1];
      //rgba_buffer[dest_buffer_start_pos + x] = val;
      //rgba_buffer[dest_buffer_start_pos + x] = unfiltered_scanlines_buffer[unfiltered_scanlines_buffer_start_pos + x + 1];
      dest_buffer[dest_buffer_subline_start_pos + b] = source_buffer[source_buffer_line_start_pos + b];
    }
    */
  }

  //return scope.Close(rgba_buffer);
  return scope.Close(args[2]);
}

// just copying rgba unfiltered scanline buffer

static Handle<Value> copy_unfiltered_scanlines_buffer_32_bpp_to_rgba_buffer_cpp(const Arguments& args)
{
  //cout << endl << "copy_unfiltered_scanlines_buffer_32_bpp_to_rgba_buffer_cpp" << endl;
  HandleScope scope;
  Local<Value> arg0(args[0]);
  unsigned char*  unfiltered_scanlines_buffer = (unsigned char*)Buffer::Data(arg0);

  Local<Value> arg1(args[1]);
  unsigned char*  rgba_buffer = (unsigned char*)Buffer::Data(arg1);

  int bytes_per_pixel = 4;
  // Then the loop is relatively simple - for each row.
  //  Take the height as a param? Also calculate
  int unfiltered_scanlines_buffer_length = (int)Buffer::Length(arg0);

  // could take in the height and width as parameters?



  int scanline_length = args[2]->Int32Value();
  int height = unfiltered_scanlines_buffer_length / scanline_length;
  int width = (scanline_length - 1) / 4;

  int dest_buffer_line_length = scanline_length - 1;


  //cout << "height " << height << endl;
  //cout << "width " << width << endl;

  //cout << "dest_buffer_line_length " << dest_buffer_line_length << endl;

  //dest_buffer_start_pos = dest_buffer_line_length * c;
  //unfiltered_scanlines_buffer_start_pos = unfiltered_scanlines_buffer_line_length * c;
  //unfiltered_scanlines_buffer_end_pos = unfiltered_scanlines_buffer_start_pos + unfiltered_scanlines_buffer_line_length;

  //unsigned char val;
  int y; // ,x
  int dest_buffer_start_pos, unfiltered_scanlines_buffer_start_pos;

  for (y = 0; y < height; y++) {
    dest_buffer_start_pos = dest_buffer_line_length * y;
    //cout << "dest_buffer_start_pos " << dest_buffer_start_pos << endl;
    unfiltered_scanlines_buffer_start_pos = (scanline_length * y);
    //cout << "unfiltered_scanlines_buffer_start_pos " << unfiltered_scanlines_buffer_start_pos << endl;


    memcpy(rgba_buffer + dest_buffer_start_pos, unfiltered_scanlines_buffer + unfiltered_scanlines_buffer_start_pos + 1, dest_buffer_line_length);
    /*
    for (x = 0; x < width * 4; x++) {
      //
      //cout << "val " << val << endl;
      //rgba_buffer[dest_buffer_start_pos + x] = val;

      //val = unfiltered_scanlines_buffer[unfiltered_scanlines_buffer_start_pos + x + 1];
      //rgba_buffer[dest_buffer_start_pos + x] = val;
      rgba_buffer[dest_buffer_start_pos + x] = unfiltered_scanlines_buffer[unfiltered_scanlines_buffer_start_pos + x + 1];


    }
    */

  }

  //return scope.Close(rgba_buffer);
  return scope.Close(args[1]);
}



static Handle<Value> reverse_filter_all_scanlines(const Arguments& args)
{

  HandleScope scope;
  Local<Value> arg0(args[0]);
  unsigned char*  scanlines_buffer = (unsigned char*)Buffer::Data(arg0);

  Local<Value> arg1(args[1]);
  unsigned char*  unfiltered_scanlines_buffer = (unsigned char*)Buffer::Data(arg1);

  int scanline_length = args[2]->Int32Value();
  int bytes_per_pixel = args[3]->Int32Value();

  //cout << "scanline_length " << scanline_length << endl;

  // have quite a loop here as well.
  //  again, it will be very much faster than JavaScript.
  int scanlines_buffer_length = (int)Buffer::Length(arg0);
  // can work out the height.
  int height = scanlines_buffer_length / scanline_length;
  int y, b, byte_pos, byte_left_pos, byte_above_pos, byte_above_left_pos;

  unsigned char scanline_filter_byte;
  int scanline_start;
  unsigned char unfiltered_byte_left, unfiltered_byte_above,
    unfiltered_byte_above_left, unfiltered_byte, filtered_byte;

  //bool has_left, has_above;

  for(y = 0; y < height; y++) {
    scanline_start = y * scanline_length;
    scanline_filter_byte = scanlines_buffer[scanline_start];
    //cout << "scanline_filter_byte " << (int)scanline_filter_byte << endl;
    if (scanline_filter_byte == 0) {
        //var scanline_end = scanline_start + scanline_length;
        // Looks like buffer has had its syntax changed.

        //scanlines_buffer.copy(unfiltered_scanlines_buffer, scanline_start, scanline_start, scanline_end);
        // Will have a loop here and ask Biber how to copy.

      // memcpy(unfiltered_scanlines_buffer, scanlines_buffer, length);
      memcpy(unfiltered_scanlines_buffer + scanline_start, scanlines_buffer + scanline_start, scanline_length);
      //throw;

      //cout << endl << endl << "------------" << endl << endl;
      //for (b = 1; b < scanline_length; b++) {
      //  byte_pos = scanline_start + b;
      //  unfiltered_scanlines_buffer[byte_pos] = scanlines_buffer[byte_pos];

      //}

    }
    if (scanline_filter_byte == 1) {
      /*
      for (b = 1; b < scanline_length; b++) {
          // get the byte above.
          unfiltered_byte_left = 0;
          byte_pos = scanline_start + b;
          if (b >= bytes_per_pixel) {
              // Are we not trying to ensure the existance of these unfiltered values?
              //  but maybe we have the previous ones...

              byte_left_pos = byte_pos - bytes_per_pixel;
              unfiltered_byte_left = unfiltered_scanlines_buffer.readUInt8(byte_left_pos);
          }
          //console.log('unfiltered_byte_left ' + unfiltered_byte_left);
          filtered_byte = scanlines_buffer.readUInt8(byte_pos);
          unfiltered_byte = unfiltered_byte_left + filtered_byte;
          if (unfiltered_byte > 255) unfiltered_byte = unfiltered_byte - 256;
          unfiltered_scanlines_buffer.writeUInt8(unfiltered_byte, byte_pos);
      }
      */
      for (b = 1; b < scanline_length; b++) {
        unfiltered_byte_left = 0;
        byte_pos = scanline_start + b;
        if (b >= bytes_per_pixel) {
          byte_left_pos = byte_pos - bytes_per_pixel;
          unfiltered_byte_left = unfiltered_scanlines_buffer[byte_left_pos];
        }
        filtered_byte = scanlines_buffer[byte_pos];
        unfiltered_byte = unfiltered_byte_left + filtered_byte;
        if (unfiltered_byte > 255) unfiltered_byte = unfiltered_byte - 256;
        unfiltered_scanlines_buffer[byte_pos] = unfiltered_byte;
      }


    }
    if (scanline_filter_byte == 2) {
      /*
      for (b = 1; b < scanline_length; b++) {
          // get the byte above.
          unfiltered_byte_above = 0;
          byte_pos = scanline_start + b;
          if (y > 0) {
              byte_above_pos = byte_pos - scanline_length;
              unfiltered_byte_above = unfiltered_scanlines_buffer.readUInt8(byte_above_pos);
          }
          filtered_byte = scanlines_buffer.readUInt8(byte_pos);
          unfiltered_byte = unfiltered_byte_above + filtered_byte;
          if (unfiltered_byte > 255) unfiltered_byte = unfiltered_byte - 256;
          unfiltered_scanlines_buffer.writeUInt8(unfiltered_byte, byte_pos);
      }
      */
      for (b = 1; b < scanline_length; b++) {
        unfiltered_byte_left = 0;
        byte_pos = scanline_start + b;
        if (y > 0) {
          byte_above_pos = byte_pos - scanline_length;
          unfiltered_byte_above = unfiltered_scanlines_buffer[byte_above_pos];
        }
        filtered_byte = scanlines_buffer[byte_pos];
        unfiltered_byte = unfiltered_byte_above + filtered_byte;
        if (unfiltered_byte > 255) unfiltered_byte = unfiltered_byte - 256;
        unfiltered_scanlines_buffer[byte_pos] = unfiltered_byte;
      }

    }
    if (scanline_filter_byte == 3) {
      for (b = 1; b < scanline_length; b++) {
        unfiltered_byte_above = 0;
        unfiltered_byte_left = 0;
        byte_pos = scanline_start + b;
        if (y > 0) {
            byte_above_pos = byte_pos - scanline_length;
            unfiltered_byte_above = unfiltered_scanlines_buffer[byte_above_pos];
        }
        if (b >= bytes_per_pixel) {
            byte_left_pos = byte_pos - bytes_per_pixel;
            unfiltered_byte_left = unfiltered_scanlines_buffer[byte_left_pos];
        }
        filtered_byte = scanlines_buffer[byte_pos];
		//
        //unfiltered_byte = filtered_byte + floor((unfiltered_byte_above + unfiltered_byte_left) / 2);
        //if (unfiltered_byte > 255) unfiltered_byte = unfiltered_byte - 256;
		int ub = (int)filtered_byte + ((int)unfiltered_byte_above + unfiltered_byte_left) / 2;
		if (ub > 255) ub -= 256;
		unfiltered_byte = (unsigned char) ub;
		//
        unfiltered_scanlines_buffer[byte_pos] = unfiltered_byte;
      }
    }
    if (scanline_filter_byte == 4) {
      for (b = 1; b < scanline_length; b++) {
        unfiltered_byte_above = 0;
        unfiltered_byte_left = 0;
        unfiltered_byte_above_left = 0;
        byte_pos = scanline_start + b;
        if (y > 0) {
            byte_above_pos = byte_pos - scanline_length;
            unfiltered_byte_above = unfiltered_scanlines_buffer[byte_above_pos];
        }
        if (b >= bytes_per_pixel) {
            byte_left_pos = byte_pos - bytes_per_pixel;
            unfiltered_byte_left = unfiltered_scanlines_buffer[byte_left_pos];
        }
        if (y > 0 && b >= bytes_per_pixel) {
            byte_above_left_pos = byte_pos - bytes_per_pixel - scanline_length;
            unfiltered_byte_above_left = unfiltered_scanlines_buffer[byte_above_left_pos];
        }
        filtered_byte = scanlines_buffer[byte_pos];
        unfiltered_byte = filtered_byte + paeth_predictor(unfiltered_byte_left, unfiltered_byte_above, unfiltered_byte_above_left);
        if (unfiltered_byte > 255) unfiltered_byte = unfiltered_byte - 256;
        unfiltered_scanlines_buffer[byte_pos] = unfiltered_byte;
      }
    }
  }


  return scope.Close(args[0]);
}



// filter_all_scanlines

static void filter_all_scanlines(unsigned char* scanlines_buffer, unsigned char* unfiltered_scanlines_buffer) {
    int scanline_length = args[2]->Int32Value();
        int bytes_per_pixel = args[3]->Int32Value();

        //cout << "filter_all_scanlines scanline_length " << scanline_length << endl;
        //int h = args[2]->Int32Value();
        // also want width and height arguments

        int scanlines_buffer_length = (int)Buffer::Length(arg0);
        // can work out the height.
        int height = scanlines_buffer_length / scanline_length;
        int y, b, byte_pos;

        unsigned char scanline_filter_byte;
        int scanline_start;
        unsigned char unfiltered_byte_value_left, unfiltered_byte_value_above,
          unfiltered_byte_value_above_left, unfiltered_byte, filtered_byte;

        bool has_left, has_above;

        //cout << "height " << height << endl;
        //cout << "bytes_per_pixel " << bytes_per_pixel << endl;



        // loop over the unfiltered_scanlines_buffer...

        // This code, with buffers, seems a bit easier / neater in C.


        for(y = 0; y < height; y++) {
          //cout << "y " << y << endl;

          scanline_start = y * scanline_length;
          // and can do the filtering extremely quickly in comparison to JavaScript.
          scanline_filter_byte = scanlines_buffer[scanline_start];
          //cout << "scanline_filter_byte " << (int)scanline_filter_byte << endl;

          // If the filter is 0, then copy over the unfiltered scanline?


          if (scanline_filter_byte == 1) {
            for (b = 1; b < scanline_length; b++) {
              byte_pos = scanline_start + b;
              unfiltered_byte_value_left = 0;

              if (b >= bytes_per_pixel) {
                unfiltered_byte_value_left = unfiltered_scanlines_buffer[byte_pos - bytes_per_pixel];
                unfiltered_byte = unfiltered_scanlines_buffer[byte_pos];
                filtered_byte = unfiltered_byte - unfiltered_byte_value_left;
                if (filtered_byte < 0) filtered_byte = filtered_byte + 256;
                //console.log('filtered_byte ' + filtered_byte);
                scanlines_buffer[byte_pos] = filtered_byte;
              }
            }
          }

          if (scanline_filter_byte == 2) {
            for (b = 1; b < scanline_length; b++) {
              byte_pos = scanline_start + b;
              unfiltered_byte_value_above = 0;
              if (y > 0) {
                unfiltered_byte_value_above = unfiltered_scanlines_buffer[byte_pos - scanline_length];
              }
              unfiltered_byte = unfiltered_scanlines_buffer[byte_pos];
              filtered_byte = unfiltered_byte - unfiltered_byte_value_above;
              if (filtered_byte < 0) filtered_byte = filtered_byte + 256;
              scanlines_buffer[byte_pos] = filtered_byte;
            }
          }

          if (scanline_filter_byte == 3) {
            for (b = 1; b < scanline_length; b++) {
              byte_pos = scanline_start + b;
              unfiltered_byte_value_above = 0;
              if (y > 0) {
                  //byte_above_pos = byte_pos - scanline_length;
                  unfiltered_byte_value_above = unfiltered_scanlines_buffer[byte_pos - scanline_length];
              }
              unfiltered_byte_value_left = 0;
              if (b >= bytes_per_pixel) {
                  //byte_left_pos = byte_pos - bytes_per_pixel;
                  unfiltered_byte_value_left = unfiltered_scanlines_buffer[byte_pos - bytes_per_pixel];
              }

              unfiltered_byte = unfiltered_scanlines_buffer[byte_pos];
    		  //
              //filtered_byte = unfiltered_byte - floor(0.0 + (unfiltered_byte_value_left + unfiltered_byte_value_above) / 2);
              //if (filtered_byte < 0) filtered_byte = filtered_byte + 256;
    		  int fb = (int)unfiltered_byte - ((int)unfiltered_byte_value_left + unfiltered_byte_value_above) / 2;
    		  if (fb < 0) fb += 256;
    		  filtered_byte = (unsigned char) fb;
    		  //
              scanlines_buffer[byte_pos] = filtered_byte;
            }
          }

          if (scanline_filter_byte == 4) {
            for (b = 1; b < scanline_length; b++) {
              byte_pos = scanline_start + b;
              //console.log('byte_pos ' + byte_pos);
              unfiltered_byte_value_above = 0;
              has_left = b >= bytes_per_pixel;
              has_above = y > 0;
              if (has_above) {
                  //var byte_above_pos = byte_pos - scanline_length;
                  unfiltered_byte_value_above = unfiltered_scanlines_buffer[byte_pos - scanline_length];
              }
              unfiltered_byte_value_left = 0;
              if (has_left) {
                  //var byte_left_pos = byte_pos - bytes_per_pixel;
                  unfiltered_byte_value_left = unfiltered_scanlines_buffer[byte_pos - bytes_per_pixel];
              }
              unfiltered_byte_value_above_left = 0;
              if (has_left && has_above) {
                  //var byte_above_left_pos = byte_pos - scanline_length - bytes_per_pixel;
                  unfiltered_byte_value_above_left = unfiltered_scanlines_buffer[byte_pos - scanline_length - bytes_per_pixel];
              }

              unfiltered_byte = unfiltered_scanlines_buffer[byte_pos];
              filtered_byte = unfiltered_byte - paeth_predictor(unfiltered_byte_value_left, unfiltered_byte_value_above, unfiltered_byte_value_above_left);
              if (filtered_byte < 0) filtered_byte = filtered_byte + 256;
              scanlines_buffer[byte_pos] = filtered_byte;

            }
          }
        }
}

static Handle<Value> filter_all_scanlines(const Arguments& args)
{

    HandleScope scope;
    Local<Value> arg0(args[0]);
    unsigned char*  scanlines_buffer = (unsigned char*)Buffer::Data(arg0);

    Local<Value> arg1(args[1]);
    unsigned char*  unfiltered_scanlines_buffer = (unsigned char*)Buffer::Data(arg1);





    // Return value should not matter though, it's working by reference.
    return scope.Close(args[0]);
}



//copy_rgba_pixel_buffer_to_rgba_pixel_buffer_region
extern "C"
{
    static void init(Handle<Object> target)
    {
         NODE_SET_METHOD(target, "buffer_copy", buffer_copy);
         NODE_SET_METHOD(target, "filter_all_scanlines", filter_all_scanlines);
         NODE_SET_METHOD(target, "reverse_filter_all_scanlines", reverse_filter_all_scanlines);
         NODE_SET_METHOD(target, "copy_unfiltered_scanlines_buffer_32_bpp_to_rgba_buffer_cpp", copy_unfiltered_scanlines_buffer_32_bpp_to_rgba_buffer_cpp);
         NODE_SET_METHOD(target, "copy_rgba_pixel_buffer_to_rgba_pixel_buffer_region", copy_rgba_pixel_buffer_to_rgba_pixel_buffer_region);
    }
}


NODE_MODULE(binding_png, init);
