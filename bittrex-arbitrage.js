
const bittrex = require('../node.bittrex.api');
const APIKEY = 'KEY';
const APISECRET = 'SECRET';

bittrex.options({ 
  'apikey' : "", 
  'apisecret' : "", 
  'stream' : false, 
  'verbose' : false, 
  'cleartext' : false 
});

var kucoinPrice = 0;
var bittrexPrice = 0;
bittrexComplete = false;
kucoinComplete = false;


var USDTPairs = [

'BTC',
'BCC',
'NEO',
'ETH'
 ]

var BTCPairs = [
'NEO'
 ]


//get USDT pairings
USDTPairs.forEach((pairing, index) => {
  getArbitrage(pairing, index, "USDT");
});

//get BTC pairings
BTCPairs.forEach((pairing, index) => {
  getArbitrage(pairing, index, "BTC");
});



function getArbitrage(pairing, index, base){
	//kucoin uses BCH and bittrex uses BCC
	if (pairing == 'BCC')
	{
		pairingToUse = 'BCH'
	}
	else
		pairingToUse = pairing;

	//although this says bittrex, I am callking kucoin's api but just using bittrex wrapper to call it for ease and because I am lazy
	bittrex.sendCustomRequest( 'https://api.kucoin.com/v1/open/tick?symbol='+pairingToUse+'-'+base, function( kucoinData ) {  	
  	bittrex.getmarketsummary( { market : base+'-'+pairing}, function( data, err ) {

  		//display the kucoin price
  		console.log(pairing + "-" + base);
		  console.log('------------------------------')
  		console.log("kucoin: " + kucoinData.data.lastDealPrice );  		
  		kucoinPrice = kucoinData.data.lastDealPrice
  		kucoinComplete =true;

  		//display the bittrex price
  		console.log( "bittrex price " + data.result[0].Last);
  		bittrexPrice = data.result[0].Last;
  		bittrexComplete = true;
		
  		//this assumes your funds are on bittrex and you'll move it to kucoin to capture the arbitrage
  		//if your funds on kucoin, you'd flip the sign below
  		if (bittrexPrice < kucoinPrice)
  		{
  		  console.log ("Kucoin is " + (kucoinPrice - bittrexPrice) + " more than Bittrex") ;
  		  console.log("Kucoin is " + ((kucoinPrice - bittrexPrice) / bittrexPrice)*100 + "% more than Bittrex");
  		 }
  		 else{
  		  console.log('no arbitrage possible for ' + pairing);
  		 }	 
  		console.log('------------------------------') 
	 });
}, true);
}
