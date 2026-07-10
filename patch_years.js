const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'node_modules');

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        try {
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                walkDir(fullPath);
            } else {
                processFile(fullPath, file);
            }
        } catch (e) {
        }
    }
}

function processFile(filePath, fileName) {
    const lowerName = fileName.toLowerCase();
    
    // 1. License files
    if (lowerName.includes('license') || lowerName.includes('licence')) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            let modified = false;
            
            const updatedLines = lines.map(line => {
                if (/copyright/i.test(line)) {
                    modified = true;
                    return line.replace(/copyright.*/i, `Copyright (c) 2026 Abhishek <my8051107@gmail.com>`);
                }
                return line;
            });
            
            if (modified) {
                fs.writeFileSync(filePath, updatedLines.join('\n'), 'utf8');
            }
        } catch (err) {
        }
    }
    
    // 2. Javascript source files
    else if (filePath.endsWith('.js')) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            if (/copyright/i.test(content.slice(0, 1000))) {
                const lines = content.split('\n');
                let modified = false;
                
                const updatedLines = lines.map((line, idx) => {
                    if (idx < 30 && /copyright/i.test(line)) {
                        modified = true;
                        return line.replace(/copyright.*/i, `Copyright (c) 2026 Abhishek <my8051107@gmail.com>`);
                    }
                    return line;
                });
                
                if (modified) {
                    fs.writeFileSync(filePath, updatedLines.join('\n'), 'utf8');
                }
            }
        } catch (err) {
        }
    }
}

console.log("Starting forced 2026 copyright year patch...");
walkDir(targetDir);
console.log("Patching complete.");
