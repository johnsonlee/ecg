define(function(require, exports, module) {

    /**
     * Electrocardiogram
     * 
     * @param holder
     *           HTML element
     * @param option
     *           The option to create an electrocardiogram
     */
    function Electrocardiogram(holder, option) {
        holder = holder || document.body;
        option = option || {};

        this.$holder = holder;
        this.$gridColor = 'green';
        this.$strokeColor = 'green';
        this.$dom = holder.ownerDocument;
        this.$cellSize = option.cellSize || Electrocardiogram.CELL_SIZE;
        this.$canvas = this.$dom.createElement('CANVAS');
        this.$graphics = this.$canvas.getContext('2d');
        this.$canvas.width = option.width || holder.offsetWidth;
        this.$canvas.height = option.height || holder.offsetHeight;
        this.$holder.appendChild(this.$canvas);
        this.drawGrid();
    };

    /**
     * The stroke width of cell
     */
    Electrocardiogram.CELL_WIDTH = 0.1;

    /**
     * The cell size
     */
    Electrocardiogram.CELL_SIZE = 6;

    /**
     * The stroke width of block
     */
    Electrocardiogram.BLOCK_WIDTH = 0.2;

    /**
     * The block size, each block includes 5*5 cells
     */
    Electrocardiogram.BLOCK_SIZE = Electrocardiogram.CELL_SIZE * 5;

    /**
     * The stroke width of curve
     */
    Electrocardiogram.CURVE_WIDTH = 1;

    /**
     * The frequency to update the curve
     */
    Electrocardiogram.FREQUENCY = 250;

    (function() {

        /**
         * Returns the cell size
         * 
         * @return the cell size
         */
        this.getCellSize = function() {
            return this.$cellSize;
        };

        /**
         * Returns the block size
         * 
         * @return the block size
         */
        this.getBlockSize = function() {
            return 5 * this.$cellSize;
        };

        /**
         * Returns the width of this diagram
         * 
         * @return the width of this diagram
         */
        this.getWidth = function() {
            return this.$graphics.canvas.width;
        };

        /**
         * Returns the height of this diagram
         * 
         * @return the height of this diagram
         */
        this.getHeight = function() {
            return this.$graphics.canvas.height;
        };

        this.clear = function() {
            this.$graphics.clearRect(0, 0, this.getWidth(), this.getHeight());
        };

        /**
         * Draw curve with specified data
         */
        this.drawCurve = function(data) {
            var i = 0;
            var p0 = null;
            var p1 = null;
            var cs = this.getCellSize();
            var lw = this.$graphics.lineWidth;
            var ss = this.$graphics.strokeStyle;
            var height = this.getHeight();

            this.clear();
            this.drawGrid();
            this.$graphics.strokeStyle = this.$strokeColor;
            this.$graphics.translate(0, height);

            while (i < data.length) {
                if ((p0 = data[i++]))
                    break;
            }

            while (i < data.length) {
                p1 = data[i];

                this.$graphics.beginPath();
                this.$graphics.lineWidth = Electrocardiogram.CURVE_WIDTH;
                this.drawLine((i - 1) * cs, -p0.pqrst, i * cs, -p1.pqrst);
                this.$graphics.closePath();
                this.$graphics.stroke();

                p0 = p1;
                i++;
            }

            this.$graphics.lineWidth = lw;
            this.$graphics.strokeStyle = ss;
            this.$graphics.translate(0, -height);
        };

        /**
         * Draw the grid
         */
        this.drawGrid = function() {
            var x = 0;
            var y = 0;
            var w = this.getWidth() - 1;
            var h = this.getHeight() - 1;
            var bs = this.getBlockSize();
            var cs = this.getCellSize();
            var lw = this.$graphics.lineWidth;
            var ss = this.$graphics.strokeStyle;

            this.$graphics.strokeStyle = this.$gridColor;

            for (var y = h; y >= 0; y -= cs) {
                this.$graphics.beginPath();
                this.$graphics.lineWidth = ((h - y) % bs)
                        ? Electrocardiogram.CELL_WIDTH 
                        : Electrocardiogram.BLOCK_WIDTH;
                this.drawLine(0, y, w, y);
                this.$graphics.closePath();
                this.$graphics.stroke();
            }

            for (var x = 0; x <= w; x += cs) {
                this.$graphics.beginPath();
                this.$graphics.lineWidth = (x % bs)
                        ? Electrocardiogram.CELL_WIDTH
                        : Electrocardiogram.BLOCK_WIDTH;
                this.drawLine(x, 0, x, h);
                this.$graphics.closePath();
                this.$graphics.stroke();
            }

            this.$graphics.lineWidth = lw;
            this.$graphics.strokeStyle = ss;
        };

        /**
         * Draw a line from point (x1, y1) to point (x2, y2)
         */
        this.drawLine = function(x1, y1, x2, y2) {
            this.$graphics.moveTo(x1, y1);
            this.$graphics.lineTo(x2, y2);
        };

    }).call(Electrocardiogram.prototype);

    module.exports = Electrocardiogram;

});
