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






var Img = jsgui.Data_Object.extend({

})