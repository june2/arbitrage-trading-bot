'use strict';

const axios = require("axios");
const crypto = require('crypto')

const apiKey = 'maqwxzyMBlAQGqbPg6mnKw0DzhhgGBvxOBCiblpcnUP';
const apiSecret = 'VUcTTvhUuwmHzTVV0P3Kqtco3wdWSALXspIKTd1darK';


describe('Bitfinex', () => {

  it('Account api', async () => {
    const apiPath = 'v2/auth/r/alerts'
    const nonce = Date.now() * 1000;
    const body = {}
    let signature = `/api/${apiPath}${nonce}${JSON.stringify(body)}`

    const sig = crypto.createHmac('sha384', apiSecret).update(signature)
    const shex = sig.digest('hex')

    const options = {      
      headers: {        
        'content-type': 'application/json',
        'bfx-nonce': nonce,
        'bfx-apikey': apiKey,
        'bfx-signature': shex
      },
      body: body,
      json: true
    }

    // console.log(nonce);
    // try {
    //   let res = await axios.post(`https://api.bitfinex.com/${apiPath}`, {}, options);
    //   console.log(res);      
    // } catch (err) {
    //   console.log(err);
    // }
  });

});