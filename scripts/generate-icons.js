const fs = require('fs');
const path = require('path');

// Since we can't easily convert SVG to PNG in Node without external dependencies,
// let's create a simple script that uses the SVG directly and creates data URLs

const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];

const svgContent = fs.readFileSync(path.join(__dirname, '../public/favicon.svg'), 'utf8');

// Create a base64 encoded version
const base64SVG = Buffer.from(svgContent).toString('base64');
const dataURL = `data:image/svg+xml;base64,${base64SVG}`;

// Create an HTML file that can be used to generate the icons
const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Icon Generator</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .icon-container { display: flex; flex-wrap: wrap; gap: 20px; }
        .icon-box { text-align: center; }
        canvas { border: 1px solid #ccc; }
    </style>
</head>
<body>
    <h1>Shelly Monitor Icon Generator</h1>
    <p>Right-click on each canvas and save as PNG with the specified filename.</p>
    <div class="icon-container" id="icons"></div>
    
    <script>
        const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];
        const container = document.getElementById('icons');
        
        sizes.forEach(size => {
            const box = document.createElement('div');
            box.className = 'icon-box';
            
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = function() {
                ctx.drawImage(img, 0, 0, size, size);
                
                // Create download link
                canvas.toBlob(blob => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = \`icon-\${size}x\${size}.png\`;
                    a.textContent = \`Download \${size}x\${size}\`;
                    box.appendChild(a);
                });
            };
            
            img.src = '${dataURL}';
            
            const label = document.createElement('p');
            label.textContent = \`\${size}x\${size}\`;
            
            box.appendChild(canvas);
            box.appendChild(label);
            container.appendChild(box);
        });
        
        // Also create favicon.ico suggestion
        const note = document.createElement('p');
        note.innerHTML = '<br><strong>For favicon.ico:</strong> Use an online converter to convert the 16x16 and 32x32 PNGs to ICO format.';
        document.body.appendChild(note);
    </script>
</body>
</html>
`;

// Save the HTML file
fs.writeFileSync(path.join(__dirname, '../public/generate-icons.html'), html);

// For now, let's copy the SVG as favicon.ico (modern browsers support SVG favicons)
fs.copyFileSync(
    path.join(__dirname, '../public/favicon.svg'),
    path.join(__dirname, '../public/favicon.ico')
);

// Update manifest.json with the correct icon path
const manifestPath = path.join(__dirname, '../public/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Update the icons to use SVG for now
manifest.icons = [
    {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable'
    },
    ...sizes.map(size => ({
        src: `/icons/icon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: 'image/png',
        purpose: 'any maskable'
    }))
];

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log('Icon generation setup complete!');
console.log('1. The favicon.svg has been copied as favicon.ico (works in modern browsers)');
console.log('2. Open public/generate-icons.html in a browser to generate PNG icons');
console.log('3. The manifest.json has been updated');
console.log('\nNote: For production, use a proper image processing library or online tools to generate high-quality PNG icons from the SVG.');