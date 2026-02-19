
const fs = require('fs');

async function check() {
    try {
        const res = await fetch('https://anxipunk.icu/api/social');
        const data = await res.json();

        if (data.data && data.data.length > 0) {
            fs.writeFileSync('sample.json', JSON.stringify(data.data[0], null, 2));
            console.log("Written to sample.json");
        } else {
            console.log("NO_DATA");
        }
    } catch (e) {
        console.error("ERROR", e);
    }
}
check();
