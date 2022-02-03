const fs = require('fs').promises;
const path = require('path');

// read Values from local.settings.json
// into environment variables
const localSettingsToEnvironment = async () => {

    const fileName = "../local.settings.json";

    try {
        const environmentFilePath = path.join(__dirname, fileName);
        const data = await fs.readFile(environmentFilePath, 'utf8');

        if(!data) throw Error("environment file not found");

        const jsonData = JSON.parse(data);
        for(let setting in jsonData.Values){
            process.env[setting] = jsonData.Values[setting];
        }

    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    localSettingsToEnvironment
}