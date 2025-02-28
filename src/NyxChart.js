import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  cursor: ${props => (props.$isPanning ? 'grabbing' : 'grab')};
`;

const StyledCanvas = styled.canvas`
  background-color: #131722;
`;

class CandlestickChart {
  constructor(canvas, options = {}) {
    if (!canvas) {
      console.error('Canvas is undefined');
      return;
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    this.options = {
      padding: 40,
      backgroundColor: '#131722',
      candleUpColor: '#26a69a',
      candleDownColor: '#ef5350',
      gridColor: 'rgba(255, 255, 255, 0.1)',
      textColor: '#D9D9D9',
      priceTrackerColor: '#FFD700',
      ...options,
    };

    this.minPrice = 0;
    this.maxPrice = 100;
    this.minTime = 0;
    this.maxTime = 0;
    this.lastPrice = null;

    this.offsetX = 0;
    this.isPanning = false;
    this.scale = 1;
  }

  calculateScales(data) {
    if (!data || data.length === 0) return;

    this.minPrice = Math.min(...data.map(candle => candle.low));
    this.maxPrice = Math.max(...data.map(candle => candle.high));
    this.minTime = Math.min(...data.map(candle => candle.time));
    this.maxTime = Math.max(...data.map(candle => candle.time));
    this.lastPrice = data[data.length - 1].close;

    const priceRange = this.maxPrice - this.minPrice;
    this.minPrice -= priceRange * 0.05;
    this.maxPrice += priceRange * 0.05;
  }

  mapTimeToX(time) {
    return (
      this.options.padding +
      ((time - this.minTime) / (this.maxTime - this.minTime)) *
        (this.width - 2 * this.options.padding) *
        this.scale +
      this.offsetX
    );
  }

  mapPriceToY(price) {
    return (
      this.height -
      this.options.padding -
      ((price - this.minPrice) / (this.maxPrice - this.minPrice)) *
        (this.height - 2 * this.options.padding)
    );
  }

  drawGrid() {
    const { ctx, width, height, options } = this;
    ctx.strokeStyle = options.gridColor;
    ctx.lineWidth = 0.5;
    
    ctx.beginPath();

    // Vertical Grid (Time)
    const timeSteps = 6;
    for (let i = 0; i <= timeSteps; i++) {
      const x = options.padding + (i / timeSteps) * (width - 2 * options.padding);
      ctx.moveTo(x, options.padding);
      ctx.lineTo(x, height - options.padding);
    }

    // Horizontal Grid (Price)
    const priceSteps = 6;
    for (let i = 0; i <= priceSteps; i++) {
      const y = options.padding + (i / priceSteps) * (height - 2 * options.padding);
      ctx.moveTo(options.padding, y);
      ctx.lineTo(width - options.padding, y);
    }

    ctx.stroke();
  }

  drawIndicators(series) {
    if (!series || series.length === 0) return;
  
    series.forEach((indicator) => {
      if (!indicator.data || indicator.data.length === 0) return;
  
      this.ctx.strokeStyle = indicator.color || "#FFFFFF";
      this.ctx.lineWidth = indicator.lineWidth || 2;
  
      if (indicator.isDashed) {
        this.ctx.setLineDash([5, 5]); // Dashed Line for Predictions
      } else {
        this.ctx.setLineDash([]);
      }
  
      this.ctx.beginPath();
      indicator.data.forEach((point, index) => {
        const x = this.mapTimeToX(point.time);
        const y = this.mapPriceToY(point.value);
  
        // ✅ Debugging: Check if values are off the canvas
        console.log(`📈 ${indicator.label} - Mapped X: ${x}, Y: ${y}, Value: ${point.value}`);

  
        if (index === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      });
  
      this.ctx.stroke();
      this.ctx.setLineDash([]); // Reset dashed style
    });
  }
  
  

  render(data, additionalSeries) {
    if (!data || data.length === 0) return;

    this.calculateScales(data);
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.options.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.drawGrid();
    this.drawPriceLabels();
    this.drawTimeLabels(data);
    this.drawCandlesticks(data);
    this.drawPriceTracker();

    // ✅ Draw Technical Indicators & Predictions
    if (additionalSeries && additionalSeries.length > 0) {
      this.drawIndicators(additionalSeries);
    }
  }


  drawPriceLabels() {
    const { ctx, height, options } = this;
    ctx.fillStyle = options.textColor;
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';

    const priceSteps = 6;
    for (let i = 0; i <= priceSteps; i++) {
      const price = this.minPrice + (i / priceSteps) * (this.maxPrice - this.minPrice);
      const y = this.mapPriceToY(price);
      ctx.fillText(price.toFixed(2), options.padding - 5, y + 4);
    }
  }

  drawTimeLabels(data) {
    if (!data || data.length === 0) return;
    
    const { ctx, width, options } = this;
    ctx.fillStyle = options.textColor;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    const timeSteps = 6;
    for (let i = 0; i <= timeSteps; i++) {
      const index = Math.floor((i / timeSteps) * (data.length - 1));
      const time = new Date(data[index].time * 1000).toLocaleTimeString();
      const x = this.mapTimeToX(data[index].time);
      ctx.fillText(time, x, this.height - options.padding + 15);
    }
  }

  drawPriceTracker() {
    if (!this.lastPrice) return;

    const { ctx, options } = this;
    const y = this.mapPriceToY(this.lastPrice);

    // Line
    ctx.strokeStyle = options.priceTrackerColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]); 
    ctx.beginPath();
    ctx.moveTo(options.padding, y);
    ctx.lineTo(this.width - options.padding, y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Price Label
    ctx.fillStyle = options.priceTrackerColor;
    ctx.fillRect(this.width - options.padding + 5, y - 10, 50, 20);

    ctx.fillStyle = '#131722';
    ctx.fillText(this.lastPrice.toFixed(2), this.width - options.padding + 30, y + 5);
  }

  drawCandlesticks(data) {
    if (!data || data.length === 0) return;

    this.ctx.lineWidth = 1.5;

    data.forEach((candle) => {
      const x = this.mapTimeToX(candle.time);
      const openY = this.mapPriceToY(candle.open);
      const closeY = this.mapPriceToY(candle.close);
      const highY = this.mapPriceToY(candle.high);
      const lowY = this.mapPriceToY(candle.low);

      this.ctx.fillStyle =
        candle.close >= candle.open
          ? this.options.candleUpColor
          : this.options.candleDownColor;
      this.ctx.fillRect(x - 2, Math.min(openY, closeY), 4, Math.abs(closeY - openY));
      this.ctx.beginPath();
      this.ctx.moveTo(x, highY);
      this.ctx.lineTo(x, lowY);
      this.ctx.strokeStyle = this.ctx.fillStyle;
      this.ctx.stroke();
    });
  }

  render(data) {
    if (!data || data.length === 0) return;

    this.calculateScales(data);
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.options.backgroundColor;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.drawGrid();
    this.drawPriceLabels();
    this.drawTimeLabels(data);
    this.drawCandlesticks(data);
    this.drawPriceTracker();
  }
}


const NyxChart = ({ data, additionalSeries = [], width, height }) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return; // Only exit if canvas doesn't exist
  
    const canvas = canvasRef.current;
    canvas.width = width || canvas.clientWidth;
    canvas.height = height || canvas.clientHeight;
  
    if (!data || data.length === 0) {
      console.warn("⚠️ No candlestick data provided to CustomCandlestickChart!");
      return; // Keep the canvas clean but don't break the effect
    }
  
    const chart = new CandlestickChart(canvas);
    chartInstanceRef.current = chart;
    chart.render(data, additionalSeries);
  
    const handleMouseDown = () => setIsPanning(true);
    const handleMouseUp = () => setIsPanning(false);
    const handleMouseMove = (e) => {
      if (isPanning) {
        chart.offsetX += e.movementX / chart.scale;
        chart.render(data, additionalSeries);
      }
    };
  
    const handleWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const mouseX = e.offsetX;
      const newScale = chart.scale * zoomFactor;
      chart.offsetX = mouseX - ((mouseX - chart.offsetX) * (newScale / chart.scale));
      chart.scale = newScale;
      chart.render(data, additionalSeries);
    };
  
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('wheel', handleWheel);
  
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('wheel', handleWheel);
      chartInstanceRef.current = null;
    };
  }, [data, additionalSeries, width, height, isPanning]);
  

  return (
    <CanvasContainer 
      $isPanning={isPanning}
    >
      <StyledCanvas ref={canvasRef} />
    </CanvasContainer>
  );
};

export default NyxChart;
