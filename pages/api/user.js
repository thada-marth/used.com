import axios from 'axios';
require('dotenv').config();

export default async function handler(req, res) {
  if(req.method === 'POST'){
    try{
      const body = req.body;
      const response = await axios.post(`${process.env.backend_path}/user`,body)
      res.status(200).json(response.data);
    }catch(err){
      res.status(500).json(err.response.data)
    }
  }
}