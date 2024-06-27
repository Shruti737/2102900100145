const axios = require('axios');

const url = 'http://20.244.56.144/test/auth';


const data = {
    companyName: 'ABESIT',
    clientID: 'cd638b3f-a193-4146-9370-d8ffcde8ec10',
    clientSecret: 'NyBHjUCeVqQePHXz',
    ownerName: 'Shruti Kushwaha',
    ownerEmail: 'shruti2021cs106@abesit.edu.in',
    rollNo: '2102900100145'
};

axios.post(url, data)
    .then(response => {
        console.log('Response:', response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
