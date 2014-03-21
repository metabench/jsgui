        // Can be a row or a column
        var Dimension = function(size, index) {
                this.size = size | 0; // width or height
                this.index = index | 0; // virtual index of this row/column inside the TwoDimensional.data array
            }
        

        Array.prototype.move = function (old_index, new_index) {
            if (new_index >= this.length) {
                var k = new_index - this.length;
                while ((k--) + 1) {
                    this.push(undefined);
                }
            }
            this.splice(new_index, 0, this.splice(old_index, 1)[0]);
            return this; // for testing purposes
        };


        var TwoDimensional = function(width, height) {
                this.rows = Array();
                this.columns = Array();
                this.data = [[,],[,]];

                this.rowCount = 1;
                this.colCount = 1;

                
                this.rows[0] = new Dimension(height);
                
                this.data[0][0] = false;

                this.columns[0] = new Dimension(width);
                for(i=0;i<width;i++){
                    this.data[i] = [];
                    /*for(j=0;j<height;j++){
                        this.data[i][j] = false;
                    }*/
                }
                
            };

            TwoDimensional.prototype.insertRow = function(y, height) {
                if(y >= this.rowCount) throw "Row count is " + this.rowCount + ", attempted insert at " + y;

                // Copy the cells with the given y to a new row after the last used row. The y of the new row equals _nbrRows.
           
                var physY = this.rows[y].index;

                for(x = 0; x < this.colCount; x++) {
                        //this.data[x][this.rowCount] = (this.data[x][physY]) ? true : false;
                        this.data[x][this.rowCount] = (this.data[x][physY]) ? true : false;
                        
                }

                if(y < this.rowCount - 1){
                    for(i = this.rowCount; i > y + 1; i--){
                        this.rows[i] = this.rows[i - 1];

                       /* for(j = 0; j < this.colCount; j++){
                            this.setItem(j,i, this.item(j, i - 1))
                        }*/
                    }
                }
                
                var oldH = this.rows[y].size;
                var newH = oldH - height;
                this.rows[y + 1] = new Dimension(height, this.rowCount);
                this.rows[y].size = newH;
                this.rowCount++;
            };

            TwoDimensional.prototype.insertColumn = function(x, width) {

                if(x >= this.colCount) throw "Column count is " + this.colCount + ", attempted insert at " + x;


                var physColCount = this.data.length;
                var physRowCount = this.data[0].length;
                var physX = this.columns[x].index;
                        this.data[this.colCount] = [];
                    for(y = 0; y < physRowCount;y++){
                        this.data[this.colCount][y] = (this.data[physX][y]) ? true : false;
                    }
               
             
                // Make room in the _columns array by shifting all items that come after the one indexed by x one position to the right.
                // If x is at the end of the array, there is no need to shift anything.
                if (x < (this.colCount - 1)) {
                    for(i = this.colCount; i > x; i--){
                        this.columns[i] = this.columns[i - 1];

                       }
                }

                // Set the widths of the old and new columns.
                var oldW = this.columns[x].size;
                var newW = oldW - width;
               
                this.columns[x + 1] = new Dimension(width, this.colCount);
                this.columns[x].size = newW;

                // The logical width of the array has increased by 1.
                this.colCount++;
            };

            TwoDimensional.prototype.setItem = function(x, y, value) {
                this.data[this.columns[x].index][this.rows[y].index] = value;
            };

            TwoDimensional.prototype.item = function(x, y) {
                //console.log('TwoDimensional.prototype.item x: ' + x + ', y: ' + y);
                //console.log('this.columns.length ' + this.columns.length);
                //console.log('this.rows.length ' + this.rows.length);
                 return this.data[this.columns[x].index][this.rows[y].index];
            };

            TwoDimensional.prototype.rowHeight = function(y){
                return this.rows[y].size;
            };

            TwoDimensional.prototype.colWidth = function(x){
                return this.columns[x].size;
            };
        
module.exports = TwoDimensional;
