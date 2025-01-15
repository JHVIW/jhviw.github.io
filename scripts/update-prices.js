const fs = require('fs');
const path = require('path');

const params = new URLSearchParams({
    app_id: 730,
    currency: 'EUR',
    tradable: 0
});

const FILE_PATH = 'data/skinport-prices.json';

(async () => {
    try {
        // Zorg ervoor dat de data directory bestaat
        const dataDir = path.dirname(FILE_PATH);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Maak het bestand leeg (of creëer een leeg bestand als het nog niet bestaat)
        await fs.promises.writeFile(FILE_PATH, '[]', 'utf8');
        console.log('Bestaand bestand is leeggemaakt');

        // Haal nieuwe data op
        const response = await fetch(`https://api.skinport.com/v1/items?${params}`, {
            method: 'GET',
            headers: {
                'Accept-Encoding': 'br'
            }
        });

        const data = await response.json();
        
        // Filter de gewenste velden
        const filteredData = data.map(item => ({
            market_hash_name: item.market_hash_name,
            currency: item.currency,
            min_price: item.min_price,
            item_page: item.item_page
        }));

        // Schrijf de nieuwe data
        await fs.promises.writeFile(FILE_PATH, JSON.stringify(filteredData, null, 2), 'utf8');

        console.log('Nieuwe prijsdata is succesvol opgeslagen');
    } catch (error) {
        console.error('Er is een fout opgetreden:', error);
        process.exit(1);
    }
})();
