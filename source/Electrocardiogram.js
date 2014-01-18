define(function(require, exports, module) {

    /**
     * 
     */
    function Electrocardiogram(width, height) {
        var dom = document || window.document;

        this.$width = width;
        this.$height = height;
        this.$gridColor = 'green';
        this.$strokeColor = 'green';
        this.$graphics = dom.createElement('CANVAS').getContext('2d');
        this.$graphics.canvas.width = this.$width;
        this.$graphics.canvas.height = this.$height;
        this.$graphics.canvas.style.backgroundColor = 'transparent';

        document.body.appendChild(this.$graphics.canvas);

        this.drawGrid();
    };

    /**
     * The cell size is 1mm (=3.543307px)
     */
    Electrocardiogram.CELL_SIZE = 6;

    Electrocardiogram.BLOCK_SIZE = Electrocardiogram.CELL_SIZE * 5;

    (function() {

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
            this.clear();
            this.drawGrid();

            var p0 = data[0];
            var lw = this.$graphics.lineWidth;
            var ss = this.$graphics.strokeStyle;

            this.$graphics.strokeStyle = this.$strokeColor;

            for (var i = 1; i < data.length; i++) {
                var p1 = data[i];

                this.$graphics.beginPath();
                this.$graphics.lineWidth = 0.5;
                this.drawLine((i - 1) * Electrocardiogram.CELL_SIZE, p0.pqrst, i * Electrocardiogram.CELL_SIZE, p1.pqrst);
                this.$graphics.closePath();
                this.$graphics.stroke();
                p0 = p1;
            }

            this.$graphics.lineWidth = lw;
            this.$graphics.strokeStyle = ss;
        };

        /**
         * Draw the grid
         */
        this.drawGrid = function() {
            var x = 0;
            var y = 0;
            var w = this.getWidth();
            var h = this.getHeight();
            var lw = this.$graphics.lineWidth;
            var ss = this.$graphics.strokeStyle;

            this.$graphics.strokeStyle = this.$gridColor;

            for (var y = 0; y < h; y += Electrocardiogram.CELL_SIZE) {
                this.$graphics.beginPath();
                this.$graphics.lineWidth = (y % Electrocardiogram.BLOCK_SIZE) ? 0.1 : 0.2;
                this.drawLine(0, y, w, y);
                this.$graphics.closePath();
                this.$graphics.stroke();
            }

            for (var x = 0; x < w; x += Electrocardiogram.CELL_SIZE) {
                this.$graphics.beginPath();
                this.$graphics.lineWidth = (x % Electrocardiogram.BLOCK_SIZE) ? 0.1 : 0.2;
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
