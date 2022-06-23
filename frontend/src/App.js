/**
 * Not much accurate app
 * but useful to understand the connection to the chain from frontend
 */

 import { useState, useEffect } from 'react';
 import getBlockchain from './ethereum.js';

 const SIDE = {
   BIDEN: 0,
   TRUMP: 1,
 };
 
 function App() {
   const [predictionMarket, setPredictionMarket] = useState(undefined);
   const [myBets, setMyBets] = useState(undefined);
   const [betPrediction, setBetPrediction] = useState(undefined);
   const [userAddress, setUserAddress] = useState(undefined);
 
   useEffect(() => {
     const init = async () => {
       const { signerAddress, predictionMarket } = await getBlockchain();
       setUserAddress(signerAddress);
 
       const bets = await Promise.all([
         predictionMarket.bets(SIDE.BIDEN),
         predictionMarket.bets(SIDE.TRUMP),
       ]);
 
       console.log(bets);
 
       const _betPredictions = {
         labels: ['Trump', 'Biden'],
         datasets: [
           {
             data: [bets[1].toString(), bets[0].toString()],
             backgroundColor: ['#FF6384', '#36A2EB'],
             hoverBackgroundColor: ['#FF6384', '#36A2EB'],
           },
         ],
       };
 
       const mybets = await Promise.all([
         predictionMarket.betsPerGambler(signerAddress, SIDE.BIDEN),
         predictionMarket.betsPerGambler(signerAddress, SIDE.TRUMP),
       ]);
 
       setPredictionMarket(predictionMarket);
       setMyBets(mybets);
       setBetPrediction(_betPredictions);
     };
     init();
   }, []);
 
   if (
     typeof predictionMarket === 'undefined' ||
     typeof myBets === 'undefined' ||
     typeof betPrediction === 'undefined'
   ) {
     return 'Loading...';
   }
 
   const placeBet = async (side, event) => {
     event.preventDefault();
     console.log(userAddress);
     await predictionMarket.placeBet(side, event.target.elements[0].value);
     event.target.elements[0].value = '';
   };
 
   const withdrawGain = async () => {
     await predictionMarket.withdrawGain();
   };
 
   return (
     <div className="container">
       <div className="row">
         <div className="col-sm-12">
           <h1 className="text-center">Prediction Market</h1>
           <div className="jumbotron">
             <h1 className="display-4 text-center">Prediction</h1>
             <p>Current Odds</p>
             {/* <div>
               <Pie data={betPrediction} />
             </div> */}
           </div>
         </div>
       </div>
 
       <div className="row">
         <div className="col-sm-6">
           <div className="card">
             {/* <img src="./img/trump.png" /> */}
             <div className="card-body">
               <h5 className="card-title">Trump</h5>
               <form
                 className="form-inline"
                 onSubmit={(event) => placeBet(SIDE.TRUMP, event)}
               >
                 <input
                   type="text"
                   className="form-control mb-2 mr-sm-2"
                   placeholder="Bet amount (ether)"
                 />
                 <button type="submit" className="btn btn-primary mb-2">
                   Submit
                 </button>
               </form>
             </div>
           </div>
         </div>
       </div>
 
       <div className="col-sm-6">
         <div className="card">
           {/* <img src="./img/biden.png" /> */}
           <div className="card-body">
             <h5 className="card-title">Biden</h5>
             <form
               className="form-inline"
               onSubmit={(event) => placeBet(SIDE.BIDEN, event)}
             >
               <input
                 type="text"
                 className="form-control mb-2 mr-sm-2"
                 placeholder="Bet amount (ether)"
               />
               <button type="submit" className="btn btn-primary mb-2">
                 Submit
               </button>
             </form>
           </div>
         </div>
       </div>
 
       <div className="row">
         <h2>Your bets</h2>
         <ul>
           <li>Biden: {Number(myBets[0])} ESD </li>
           <li>Trump: {Number(myBets[1])} ESD </li>
         </ul>
       </div>
 
       <div className="row">
         <h2>Claim your gains, if any, after the election</h2>
         <button
           type="submit"
           className="btn btn-primary mb-2"
           onClick={(event) => withdrawGain()}
         >
           Submit
         </button>
       </div>
     </div>
   );
 }
 
 export default App;
 