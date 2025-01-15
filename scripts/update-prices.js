const fs = require('fs');
const path = require('path');

// Parameters voor Skinport API
const skinportParams = new URLSearchParams({
    app_id: 730,
    currency: 'USD',  // Veranderd naar USD
    tradable: 0
});

// Bestandspaden
const SKINPORT_FILE_PATH = 'data/skinport-prices.json';
const CSFLOAT_FILE_PATH = 'data/csfloat-prices.json';

(async () => {
    try {
        // Zorg ervoor dat de data directory bestaat
        const dataDir = path.dirname(SKINPORT_FILE_PATH);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Skinport data ophalen
        const skinportResponse = await fetch(`https://api.skinport.com/v1/items?${skinportParams}`, {
            method: 'GET',
            headers: {
                'Accept-Encoding': 'br'
            }
        });
        const skinportData = await skinportResponse.json();
        
        // CSFloat data ophalen
        const csfloatResponse = await fetch('https://csfloat.com/api/v1/listings/price-list');
        const csfloatData = await csfloatResponse.json();

        // Skinport data filteren en opslaan
        const filteredSkinportData = skinportData.map(item => ({
            market_hash_name: item.market_hash_name,
            currency: 'USD',
            min_price: item.min_price,
            item_page: item.item_page
        }));

        // CSFloat data transformeren en opslaan
        const filteredCsfloatData = csfloatData.map(item => ({
            market_hash_name: item.market_hash_name,
            currency: 'USD',
            min_price: item.min_price / 100, // Delen door 100 zoals aangegeven
            qty: item.qty
        }));

        // Schrijf beide bestanden
        await fs.promises.writeFile(SKINPORT_FILE_PATH, JSON.stringify(filteredSkinportData, null, 2), 'utf8');
        await fs.promises.writeFile(CSFLOAT_FILE_PATH, JSON.stringify(filteredCsfloatData, null, 2), 'utf8');

        console.log('Prijsdata van beide platforms is succesvol opgeslagen');
    } catch (error) {
        console.error('Er is een fout opgetreden:', error);
        process.exit(1);
    }
})();
