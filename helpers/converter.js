const fetch = require('node-fetch');

const convertToUSD = async (currency) => {
        
        const symbols = `USD,${currency}`
        const url = `http://data.fixer.io/api/latest?access_key=${process.env.FIXER_API_KEY}&symbols=${symbols}`;

        const options = {
            method: 'GET'            
        };

        try {

            const response = await fetch(url, options);
            const result = await response.json();
            const usd = result.rates.USD;

            let data = [];

            for(var i in result.rates)
                data.push(result.rates [i]);

            const requestedCurrency = data[1]

            //find the value in eur of 1 usd
            eurToUsd = 1/usd;

            //now we find the value of the currency requested in dolars
            usdToRequestedCurrency = requestedCurrency * eurToUsd;
            
            return usdToRequestedCurrency;
        } catch (error) {
            console.error(error);
        }

}

module.exports = {
    convertToUSD
}