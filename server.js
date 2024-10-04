const fsextra = require('fs-extra');
const fs = require('fs');
const express=require('express');
const EventEmitter = require('node:events');

const server=express();
const port=3000;

server.use(express.json());

const logEmitter =new EventEmitter();

logEmitter.on('log',(message)=>{
    console.log(`Log: ${message}`);
});

server.use((req,res,next)=>{
    logEmitter.emit('log',`${req.method} ${req.url}`);
    next();
});

server.get('/read-file',async (req,res)=>{
    try{
        const data =await fsextra.readFile('data.txt','utf8',);
        res.send(data);
    }catch(error){
        res.status(500).send('Fejl ved læsning af filen');
    }
});

server.post('/write-file',async (req,res)=>{
    try{
        const {content}=req.body;
        await fsextra.writeFile('data.txt',content);
        res.send('Fil skrevet succesfuldt');
    }catch(error){
        res.status(500).send('Fejl ved skrivning af filen')
    }
});

server.listen(port,()=>{
    logEmitter.emit('log',`Serveren er startet på port ${port}`);
    console.log(`Server lytter på http://localhost:${port}`);
})










