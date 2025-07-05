const fs = require('fs');
const path = require('path');

// Create a simple PNG for each size
// This creates a purple square with a white circle (simplified icon)
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Simple PNG creation without external dependencies
// Creates a purple square with white circle
function createSimplePNG(size) {
    // PNG signature
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    
    // IHDR chunk
    const width = Buffer.alloc(4);
    width.writeUInt32BE(size);
    const height = Buffer.alloc(4);
    height.writeUInt32BE(size);
    const bitDepth = Buffer.from([8]); // 8 bits per channel
    const colorType = Buffer.from([6]); // RGBA
    const compression = Buffer.from([0]);
    const filter = Buffer.from([0]);
    const interlace = Buffer.from([0]);
    
    const ihdrData = Buffer.concat([width, height, bitDepth, colorType, compression, filter, interlace]);
    const ihdr = createChunk('IHDR', ihdrData);
    
    // Create image data (IDAT)
    // Simple purple background with white circle
    const imageData = [];
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.3;
    
    for (let y = 0; y < size; y++) {
        imageData.push(0); // filter type none
        for (let x = 0; x < size; x++) {
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < radius) {
                // White circle
                imageData.push(255, 255, 255, 255);
            } else {
                // Purple background (#5865F2)
                imageData.push(88, 101, 242, 255);
            }
        }
    }
    
    // Compress using zlib (simple uncompressed for now)
    const zlib = require('zlib');
    const compressed = zlib.deflateSync(Buffer.from(imageData));
    const idat = createChunk('IDAT', compressed);
    
    // IEND chunk
    const iend = createChunk('IEND', Buffer.alloc(0));
    
    // Combine all chunks
    return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const typeBuffer = Buffer.from(type);
    const crc = calculateCRC(Buffer.concat([typeBuffer, data]));
    const crcBuffer = Buffer.alloc(4);
    crcBuffer.writeUInt32BE(crc);
    return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function calculateCRC(data) {
    const crcTable = [];
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    
    let crc = 0 ^ (-1);
    for (let i = 0; i < data.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
}

// Create icons
sizes.forEach(size => {
    const png = createSimplePNG(size);
    const filename = path.join(__dirname, '../public/icons', `icon-${size}x${size}.png`);
    fs.writeFileSync(filename, png);
    console.log(`Created ${filename}`);
});

console.log('\nAll PNG icons created successfully!');
console.log('These are simple placeholder icons. For production, replace with properly designed icons.');