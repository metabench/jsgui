#include <v8.h>
#include <node.h>
#include <stdlib.h>
#include <stdio.h>
#include <errno.h>
#include <list>
#include <iostream>
#include <string.h>
#include "help_functions.h"

using namespace node;
using namespace v8;
using namespace std;


struct nq_req
{
    unsigned char* data;
    int length;
    int width;
    int height;
    Persistent<Function> callback;
};


void Worker(uv_work_t* req)
{
    nq_req* request = (nq_req*)req->data;
    int rows = request->height;
    int cols = request->width;

    unsigned char value;

    unsigned int i,row;
    for (row = 0; row < rows; ++row ) {
        unsigned int offset;
        offset = row*cols*4;

        for(i=0; i<cols; i++) {
            value = request->data[offset+i*4];
        }
    }

}

void After(uv_work_t* req)
{
    HandleScope scope;

    nq_req* request = (nq_req*)req->data;
    delete req;

    Handle<Value> argv[1];


    v8::Local<v8::Object> result = buf(&request->data, request->length);
    argv[0] = result;
    TryCatch try_catch;

    request->callback->Call(Context::GetCurrent()->Global(), 1, argv);

    if (try_catch.HasCaught())
    {
        FatalException(try_catch);
    }

    request->callback.Dispose();

    delete request;
}


static Handle<Value> read(const Arguments& args)
{

    HandleScope scope;


    Local<Value> arg(args[0]);
    Local<Value> width(args[1]);
    Local<Value> height(args[2]);
    int length = (int)Buffer::Length(arg);
    unsigned char* data;
    //data = new unsigned char[length];

    //memcpy(data, node::Buffer::Data(arg), length);
    data = (unsigned char*)node::Buffer::Data(arg);

    if ( args[3]->IsFunction() )
    {
        Local<Function> callback = Local<Function>::Cast(args[3]);

        nq_req* request = new nq_req;
        request->callback = Persistent<Function>::New(callback);

        //request->filename = filename;
        request->data = data;
        request->length = length;
        request->width = width->Int32Value();
        request->height = height->Int32Value();
        uv_work_t* req = new uv_work_t();
        req->data = request;

        uv_queue_work(uv_default_loop(), req, Worker, (uv_after_work_cb)After);
    }
    else
    {
        return ThrowException(Exception::TypeError(String::New("Callback missing")));
    }


    return Undefined();
}

extern "C"
{
    static void init(Handle<Object> target)
    {
         NODE_SET_METHOD(target, "read", read);
    }
}
NODE_MODULE(png_iterate, init);