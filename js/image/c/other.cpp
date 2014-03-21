

// JPEG:

static void init_source (jpeg_decompress_struct  *cinfo) {}
static boolean fill_input_buffer (j_decompress_ptr cinfo)
{
    ERREXIT(cinfo, JERR_INPUT_EMPTY);
return TRUE;
}
static void skip_input_data (jpeg_decompress_struct  *cinfo, long num_bytes)
{
    struct jpeg_source_mgr* src = (struct jpeg_source_mgr*) cinfo->src;

    if (num_bytes > 0) {
        src->next_input_byte += (size_t) num_bytes;
        src->bytes_in_buffer -= (size_t) num_bytes;
    }
}
static void term_source (jpeg_decompress_struct  *cinfo) {}
static void jpeg_mem_src (jpeg_decompress_struct  *cinfo, void* buffer, long nbytes)
{
    struct jpeg_source_mgr* src;

    if (cinfo->src == NULL) {   /* first time for this JPEG object? */
        cinfo->src = (struct jpeg_source_mgr *)
            (*cinfo->mem->alloc_small) ((j_common_ptr) cinfo, JPOOL_PERMANENT,
            sizeof(struct jpeg_source_mgr));
    }

    src = (struct jpeg_source_mgr*) cinfo->src;
    src->init_source = init_source;
    src->fill_input_buffer = fill_input_buffer;
    src->skip_input_data = skip_input_data;

    src->resync_to_restart = jpeg_resync_to_restart; /* use default method */

    src->term_source = term_source;
    src->bytes_in_buffer = nbytes;
    src->next_input_byte = (JOCTET*)buffer;
}



static Handle<Value> _read_jpeg_to_rgb(const Arguments& args) {
  // Returns a new rgb buffer containing the JPEG.
  cout << endl << "read_jpeg_to_rgb" << endl;
  //struct jpeg_decompress_struct cinfo;
  /* We use our private extension JPEG error handler.
   * Note that this struct must live as long as the main JPEG parameter
   * struct, to avoid dangling-pointer problems.
   */
  //struct my_error_mgr jerr;
  /* More stuff */
  //FILE * infile;    /* source file */
  HandleScope scope;
  Local<Value> arg0(args[0]);

  unsigned char* jpeg_input_buffer = (unsigned char*)Buffer::Data(arg0);

  int input_length = (int)Buffer::Length(arg0);

  cout << "input_length " << input_length << endl;

  struct jpeg_decompress_struct cinfo;
  struct jpeg_error_mgr       jerr;
  int row_stride;
  JSAMPARRAY buffer;  /* Output row buffer */

//char* data = (char*)Buffer::Data(arg);

    //int length = (int)Buffer::Length(arg);

  cout << "pre jpeg_mem_src" << endl;

  //jpeg_mem_src(&cinfo, jpeg_input_buffer, input_length);

  // FILE* file = fmemopen((void *)cstr, sizeof(char) * (string.length + 1), "r");

  //FILE * source = fmemopen(jpeg_input_buffer, input_length, "rb");
  //if (source == NULL)
  //{
  //    fprintf(stderr, "Calling fmemopen() has failed.\n");
  //    exit(1);
  //}
  //jpeg_stdio_src(&cinfo, source);

  jpeg_mem_src(&cinfo, (void *) jpeg_input_buffer, input_length);
  cout << "post jpeg_mem_src" << endl;


  cout << "pre jpeg_read_header" << endl;
  (void) jpeg_read_header(&cinfo, TRUE);

  /* We can ignore the return value from jpeg_read_header since
   *   (a) suspension is not possible with the stdio data source, and
   *   (b) we passed TRUE to reject a tables-only JPEG file as an error.
   * See libjpeg.txt for more info.
   */

  /* Step 4: set parameters for decompression */

  /* In this example, we don't need to change any of the defaults set by
   * jpeg_read_header(), so we do nothing here.
   */

  /* Step 5: Start decompressor */
   cout << "pre jpeg_start_decompress" << endl;
  (void) jpeg_start_decompress(&cinfo);
  /* We can ignore the return value since suspension is not possible
   * with the stdio data source.
   */

  /* We may need to do some setup of our own at this point before reading
   * the data.  After jpeg_start_decompress() we have the correct scaled
   * output image dimensions available, as well as the output colormap
   * if we asked for color quantization.
   * In this example, we need to make an output work buffer of the right size.
   */ 
  /* JSAMPLEs per row in output buffer */
  row_stride = cinfo.output_width * cinfo.output_components;
  cout << "row_stride" << row_stride;
  /* Make a one-row-high sample array that will go away when done with image */
  buffer = (*cinfo.mem->alloc_sarray)
    ((j_common_ptr) &cinfo, JPOOL_IMAGE, row_stride, 1);

  /* Step 6: while (scan lines remain to be read) */
  /*           jpeg_read_scanlines(...); */

  /* Here we use the library's state variable cinfo.output_scanline as the
   * loop counter, so that we don't have to keep track ourselves.
   */


  while (cinfo.output_scanline < cinfo.output_height) {
    /* jpeg_read_scanlines expects an array of pointers to scanlines.
     * Here the array is only one element long, but you could ask for
     * more than one scanline at a time if that's more convenient.
     */
    (void) jpeg_read_scanlines(&cinfo, buffer, 1);
    /* Assume put_scanline_someplace wants a pointer and sample count. */
    //put_scanline_someplace(buffer[0], row_stride);
  }

  /* Step 7: Finish decompression */

  (void) jpeg_finish_decompress(&cinfo);
  /* We can ignore the return value since suspension is not possible
   * with the stdio data source.
   */

  /* Step 8: Release JPEG decompression object */

  /* This is an important step since it will release a good deal of memory. */
  jpeg_destroy_decompress(&cinfo);


  //return scope.Close(actualBuffer);

  return scope.Close(args[0]);
  
  //JSAMPARRAY buffer;    /* Output row buffer */
  //   /* physical row width in output buffer */
  //vector<char> buffer;
  //XInfo_t      xinfo  = getXInfo(":0");
  //struct jpeg_compress_struct cinfo;
  //struct jpeg_error_mgr       jerr;
   
  //cinfo.err = jpeg_std_error(&jerr);
  //jpeg_create_compress(&cinfo);
  //jpeg_stdio_dest(&cinfo, outfile);
   
  //cinfo.image_width      = xinfo.width;
  //cinfo.image_height     = xinfo.height;
  //cinfo.input_components = 3;
  //cinfo.in_color_space   = JCS_RGB;
}