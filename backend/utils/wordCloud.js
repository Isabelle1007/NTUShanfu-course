const { exec } = require('child_process');
const path = require('path');

exports.createWordCloudImg = async (cid, fileContent) => {
    return new Promise((resolve, reject) => {
        const outputFileName = `wordcloud_${cid}.png`;
        const outputFilePath = path.join(__dirname, outputFileName);
        const pythonExecutable = 'python3';

        const pythonScriptPath = path.join(__dirname, 'createWordCloud.py');

        exec(`${pythonExecutable} "${pythonScriptPath}" "${fileContent}" "${outputFilePath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`\nError: ${error}`);
                reject({ 
                    "message": `Error in word cloud creation: ${error}`,
                    "code": "001"
                });
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                reject({ 
                    "message": `Error in word cloud creation: ${stderr}`,
                    "code": "002"
                });
                return;
            }
            const imagePath = stdout.trim();
            console.log(`\nWord cloud image saved at: ${imagePath}`);
            resolve({
                "message": "Success",
                "code": "000",
                "data": {
                    "image_name": outputFileName,
                    "location": imagePath
                }
            });
        });
    });
};
