#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "jpeg_decoder.h"

int main(int argc, char* argv[]) {
    size_t size;
    unsigned char *buf;
    FILE *f;

    if (argc < 2) {
        printf("Usage: %s <input.jpg> [<output.ppm>]\n", argv[0]);
        return 2;
    }
    f = fopen(argv[1], "rb");
    if (!f) {
        printf("Error opening the input file.\n");
        return 1;
    }
    fseek(f, 0, SEEK_END);
    size = ftell(f);
    buf = (unsigned char*)malloc(size);
    fseek(f, 0, SEEK_SET);
    
    size_t read = fread(buf, 1, size, f);
    fclose(f);

    Jpeg::Decoder decoder(buf, size);
    if (decoder.GetResult() != Jpeg::Decoder::OK)
    {
        printf("Error decoding the input file\n");
        return 1;
    }

    f = fopen((argc > 2) ? argv[2] : (decoder.IsColor() ? "jpeg_out.ppm" : "jpeg_out.pgm"), "wb");
    if (!f) {
        printf("Error opening the output file.\n");
        return 1;
    }
    fprintf(f, "P%d\n%d %d\n255\n", decoder.IsColor() ? 6 : 5, decoder.GetWidth(), decoder.GetHeight());
    fwrite(decoder.GetImage(), 1, decoder.GetImageSize(), f);
    fclose(f);
    return 0;
}

