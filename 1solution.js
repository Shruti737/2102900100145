const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const TIMEOUT = 500;
let numbersStorage = [];
const fetchNumbers = async (type) => {
    let url;
    switch (type) {
        case 'p':
            url = 'http://200.244.56.144/test/primes';
            break;
        case 'f':
            url = 'http://200.244.56.144/test/fibo';
            break;
        case 'e':
            url = 'http://200.244.56.144/test/even';
            break;
        case 'r':
            url = 'http://200.244.56.144/test/rand';
            break;
        default:
            return [];
    }
    try {
        const response = await axios.get(url, { timeout: TIMEOUT });
        return response.data;
    } catch (error) {
        console.error('Error fetching numbers:', error);
        return [];
    }
};
const validateID = (req, res, next) => {
    const { numbersId } = req.params;
    if (!['p', 'f', 'e', 'r'].includes(numbersId)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    next();
};
app.get('/numbers/:numbersId', validateID, async (req, res) => {
    const { numbersId } = req.params;
    const startTime = Date.now();
    const previousState = [...numbersStorage];
    const fetchedNumbers = await fetchNumbers(numbersId);
    const uniqueNumbers = fetchedNumbers.filter(num => !numbersStorage.includes(num));
    numbersStorage = [...numbersStorage, ...uniqueNumbers].slice(-WINDOW_SIZE);
    const sum = numbersStorage.reduce((acc, num) => acc + num, 0);
    const average = numbersStorage.length ? (sum / numbersStorage.length).toFixed(2) : 0.00;

    const elapsedTime = Date.now() - startTime;
    if (elapsedTime > TIMEOUT) {
        return res.status(504).json({ error: 'Request timed out' });
    }

    res.json({
        windowPrevState: previousState,
        windowCurrState: numbersStorage,
        numbers: numbersStorage,
        avg: average
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
