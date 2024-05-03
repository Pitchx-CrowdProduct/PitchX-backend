
const axios = require('axios');
const fsPromises = require('fs').promises;
const { tmpdir } = require('os');
const join = require('path').join;
const pdfParse = require('pdf-parse');
async function extractTextFromPdf(url) {
    const tempPath = join(tmpdir(), `${Date.now()}.pdf`);
    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'arraybuffer'
        });
        await fsPromises.writeFile(tempPath, response.data);
        const pdfBuffer = await fsPromises.readFile(tempPath);
        const data = await pdfParse(pdfBuffer);
        if (!data.text.trim()) {
            console.log('No text found in PDF, setting return value to null.');
            data.text = "this is image based pdf so we cant get content from this so just return null for the josn objects";
        } else {
            console.log('Text extracted from PDF:', data.text.slice(0,10));
        }
        
        return data.text;
    } catch (error) {
        console.error('Error handling PDF:', error);
        throw error;
    } finally {
        await fsPromises.unlink(tempPath).catch(err => console.error('Failed to delete temp file:', err));
    }
}

module.exports = extractTextFromPdf;