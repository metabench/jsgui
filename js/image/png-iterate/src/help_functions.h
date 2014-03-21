#include <v8.h>
#include <node.h>
#include <node_buffer.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>
#include <stdio.h>

using namespace node;
using namespace v8;

char *get(v8::Local<v8::Value> value, const char *fallback = "") {
    if (value->IsString()) {
        v8::String::AsciiValue string(value);
        char *str = (char *) malloc(string.length() + 1);
        strcpy(str, *string);
        return str;
    }
    char *str = (char *) malloc(strlen(fallback) + 1);
    strcpy(str, fallback);
    return str;
}

v8::Local<v8::Object> buf(unsigned char ** data, int length) {

	// Some data we want to provide to Node.js userland code.
	// This can be binary of course.
	//const char *data = "Hello world!";
	//int length = strlen(*data);
	//printf("buf(**data)%d", length);
	// This is Buffer that actually makes heap-allocated raw binary available
	// to userland code.
	node::Buffer *slowBuffer = node::Buffer::New(length);

	// Buffer:Data gives us a yummy void* pointer to play with to our hearts
	// content.
	memcpy(node::Buffer::Data(slowBuffer), *data, length);
    /*char *ptr = node::Buffer::Data(slowBuffer);
    ptr = (char *) *data;*/
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

	// This Buffer can now be provided to the calling JS code as easy as this:
	return actualBuffer;
}