const { Jimp } = require('jimp');

async function extractColors() {
  try {
    const image = await Jimp.read('d:/MernCraft/client/src/assets/loog.jpeg');
    
    // We will collect colors in a simple histogram
    const colors = {};
    
    for (let x = 0; x < image.bitmap.width; x++) {
      for (let y = 0; y < image.bitmap.height; y++) {
        const hex = image.getPixelColor(x, y).toString(16).padStart(8, '0');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        // Let's quantize to ignore slight variations
        const qR = Math.round(r / 10) * 10;
        const qG = Math.round(g / 10) * 10;
        const qB = Math.round(b / 10) * 10;
        
        const qHex = `#${qR.toString(16).padStart(2, '0')}${qG.toString(16).padStart(2, '0')}${qB.toString(16).padStart(2, '0')}`;
        
        // Skip white/near-white backgrounds
        if (qR > 230 && qG > 230 && qB > 230) continue;
        
        // Classify as green if green is dominant
        const isGreen = qG > qR && qG > qB + 20;
        const isBlue = qB > qR && qB > qG;
        
        const type = isGreen ? 'green' : (isBlue ? 'blue' : 'other');
        
        if (!colors[type]) colors[type] = {};
        colors[type][qHex] = (colors[type][qHex] || 0) + 1;
      }
    }
    
    console.log("Top Greens:");
    Object.entries(colors['green'] || {}).sort((a,b) => b[1] - a[1]).slice(0, 3).forEach(c => console.log(c[0], c[1]));
    
    console.log("Top Blues:");
    Object.entries(colors['blue'] || {}).sort((a,b) => b[1] - a[1]).slice(0, 3).forEach(c => console.log(c[0], c[1]));
    
    console.log("Top Other:");
    Object.entries(colors['other'] || {}).sort((a,b) => b[1] - a[1]).slice(0, 3).forEach(c => console.log(c[0], c[1]));
    
  } catch(err) {
    console.error("Error reading image:", err);
  }
}

extractColors();
