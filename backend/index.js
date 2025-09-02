const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});
app.get('/api/status',(req, res)=>{
    const status = [
        { id: 1, name: 'Service A', status: 'running' },
        { id: 2, name: 'Service B', status: 'stopped' },
        { id: 3, name: 'Service C', status: 'running' }
    ];

    // https://localhost:3000/api/status?search=Service
    if(req.query.search){
       const filteredStatus = status.filter(s => s.name.toLowerCase().includes(req.query.search.toLowerCase()));
       res.json(filteredStatus);
       return;
    }
    setTimeout(() => {
        res.json(status);
    }, 2000);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
