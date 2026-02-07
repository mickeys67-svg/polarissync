import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the frontend build directory
const publicPath = path.join(__dirname, 'public');
console.log(`Serving static files from: ${publicPath}`);
app.use(express.static(publicPath));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    console.log(`Serving index.html from: ${indexPath}`);
    res.sendFile(indexPath);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
