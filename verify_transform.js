
const fs = require('fs');

try {
    const raw = fs.readFileSync('sample.json', 'utf8');
    const sample = JSON.parse(raw);
    const data = { data: [sample] };

    // Simulation of api.ts logic
    const mapped = data.data.map((p) => ({
        ...p,
        platform: p.platform || 'x',
        author_type: p.author_type || p.author_role || 'citizen',
        engagement: p.metrics || { likes: 0, comments: 0, shares: 0, views: 0 }
    }));

    console.log("Mapped Platform:", mapped[0].platform);
    console.log("Mapped Author Type:", mapped[0].author_type);
    console.log("Mapped Engagement:", JSON.stringify(mapped[0].engagement));

    const platform = 'x';
    const filtered = mapped.filter((p) => p.platform === platform);

    console.log("Filtered Count:", filtered.length);

    if (filtered.length === 1 && filtered[0].platform === 'x') {
        console.log("SUCCESS: Transformation works.");
    } else {
        console.log("FAILURE: Transformation failed.");
    }

} catch (e) {
    console.error(e);
}
