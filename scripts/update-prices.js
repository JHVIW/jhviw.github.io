const fs = require('fs');
const params = new URLSearchParams({
    app_id: 730,
    currency: 'EUR',
    tradable: 0
});

(async () => {
    try {
        const response = await fetch(`https://api.skinport.com/v1/items?${params}`, {
            method: 'GET',
            headers: {
                'Accept-Encoding': 'br'
            }
        });

        const data = await response.json();
        
        // Filter alleen de gewenste velden
        const filteredData = data.map(item => ({
            market_hash_name: item.market_hash_name,
            currency: item.currency,
            min_price: item.min_price,
            item_page: item.item_page
        }));

        // Write to data directory
        await fs.promises.writeFile('data/skinport-prices.json', JSON.stringify(filteredData, null, 2), 'utf8');

        console.log('Price data has been updated successfully');
    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    }
})();
