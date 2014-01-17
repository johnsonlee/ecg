define(function(require, exports, module) {

    /**
     * 
     */
    function Electrocardiogram(options) {
        var opt = options || {};
        var dom = document || window.document;

        this.$width = opt.size.width;
        this.$height = opt.size.height;
        this.$padding = opt.padding || 5;
        this.$gridColor = opt.grid.color || 'pink';
        this.$graphics = dom.createElement('CANVAS').getContext('2d');
        this.$graphics.canvas.width = this.$width;
        this.$graphics.canvas.height = this.$height;
        this.$graphics.canvas.style.backgroundColor = 'transparent';

        // move the canvas by 0.5px to fix blurring
        this.$graphics.translate(0.5, 0.5);

        document.body.appendChild(this.$graphics.canvas);
    };

    /**
     * The cell size is 1mm (=3.543307px)
     */
    Electrocardiogram.CELL_SIZE = 3.543307;

    Electrocardiogram.BLOCK_SIZE = Electrocardiogram.CELL_SIZE * 5;

    (function() {

        this.draw = function() {
        };

        this.drawLine = function(x1, y1, x2, y2) {
            this.$graphics.moveTo(x1, y1);
            this.$graphics.lineTo(x2, y2);
        };

        this.drawGrid = function() {
            var n = 0;
            var x0 = this.$padding;
            var y0 = this.$padding;
            var x1 = this.$width - this.$padding;
            var y1 = this.$height - this.$padding;
            var ls = this.$graphics.strokeStyle;

            this.$graphics.strokeStyle = this.$gridColor;
            this.$graphics.beginPath();

            for (var y = y0; y < y1; y += Electrocardiogram.CELL_SIZE) {
                this.$graphics.lineWidth = (n++ % 5) ? 0.5 : 1;
                this.drawLine(x0, y, x1, y);
            }

            this.$graphics.closePath();
            this.$graphics.stroke();
            this.$graphics.strokeStyle = ls;
        };

    }).call(Electrocardiogram.prototype);

    module.exports = Electrocardiogram;

});
