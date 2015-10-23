/**
 * Created by James on 15/01/2015.
 */

var jsgui = require('../core/jsgui-lang-enh');

// Needs to be able to deal with metadata.
//  Have metadata as an internal object.
//  Will have the means to link to different versions.

// Images may work within a linked system
//  Images could link to other images which are different versions of the same image

// There could be an Image_Group maybe
//  Want to hold representation of if an image is a root image, or a transformed version of a root one.


// One Image holding different size versions?
//

// img.version_url([250, 250]);
//  would provide the URL to the version that can display at that size.
// img.versions()
//  get the versions of the image

// Perhaps don't use this abstraction for the moment.
//  May be useful when functionality gets wrapped here. Want Typed Arrays to be used a lot more, rather than buffers.

// Should not necessarily need the current (Oct 2015) node specific functionality.
//  It may be worth working on newer image processing functionality that would work within modern browsers too, using Uint8Array.

// Some image processing would be node-specific using C++, but I would prefer to have things written in a fairly generic way, then with the possibility
// of calling c++ optimized code.

// Will use Uint8Arrays and parts of them as the storage for images.

// Maybe don't have much that is 'core' for images.
//  A lot will be procedural, especially to start with.


// Could define an image through a URL.
// Could define it through its data.

// or those are fields of some kind?

// .url
// .data
// ._data

// We may be given the image's size.

// Maybe we want to have more modules written that specifically deal with the Unit8Array data.

var Img = jsgui.Data_Object.extend({
  'init': function(spec) {

  }
})
