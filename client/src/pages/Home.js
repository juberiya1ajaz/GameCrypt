import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroImg from '../assets/hero.svg'
import FeatImg from '../assets/feat.svg'
import { useGlobalContext } from '../context';
import { Link } from 'react-router-dom';

export default function Home() {

  // const regex = /^[A-Za-z0-9]+$/;
  // const { contract, walletAddress, gameData, setShowAlert, setErrorMessage, showAlert } = useGlobalContext();
  // const [playerName, setPlayerName] = useState('');
  // const navigate = useNavigate();

  // const handleClick = async () => {
  //   try {
  //     const playerExists = await contract.isPlayer(walletAddress);

  //     if (!playerExists) {
  //       await contract.registerPlayer(playerName, playerName, { gasLimit: 500000 });

  //       setShowAlert({
  //         status: true,
  //         type: 'info',
  //         message: `${playerName} is being summoned!`,
  //       });

  //       setTimeout(() => navigate('/createShowdown'), 8000);
  //     }
  //   } catch (error) {
  //     setErrorMessage(error);
  //   }
  // };

  return (
    <div className='md:mx-28 mx-4 text-black py-8'>

      <div className='md:grid md:grid-cols-2 items-center'>
        <div className='bg-red-400 p-14 border-2 border-r-8 border-t-8 rounded-xl border-white' >
          <h1 className='text-3xl font-bold md:text-6xl'>Who we are</h1>
          <p className='text-xl font-semibold py-4 tracking-wider'>A recent poll by NortonLifeLock of gamers shows that 47% of them have experienced a cyberattack to break into their gaming account or device. Threat actors trick gamers into clicking phishing links or downloading malware under the promise of a secret cheat code. If the scam works, gamers might lose their gaming profile, digital assets, or personal information. To solve this issue our team brainstormed and came up with the idea of gamification with the help of blockchain.</p>

          {/* <div className="flex flex-row items-center space-x-2 py-2">
            <label htmlFor="name" className="font-semibold text-xl text-white mb-3">Name</label>
            <input type="text" placeholder="Enter your player name" value={playerName} onChange={(e) => {
              if (e.target.value === '' || regex.test(e.target.value)) setPlayerName(e.target.value);
            }} className="bg-gray-700 text-white outline-none focus:outline-siteViolet px-4 py-2 mb-1 rounded-md max-w-full"
            />
          </div> */}

          {/* <button type="button" className="bg-secondary py-2 px-8 rounded-md text-xl md:text-2xl" onClick={handleClick}>Register</button> */}
        <Link to="/enterShowdown">
        <button className="bg-blue-500 hover:bg-blue-400 text-black font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
              Enter ShowDown
            </button>
        </Link>
        
        </div>
        <div className="grid place-items-center py-4 drop-shadow-3xl shadow-black">
          <img src={HeroImg} alt="img" width="350" height="350" />
        </div>
      </div>

      <div className='md:grid md:grid-cols-2 pt-12 items-center'>
        <div className="grid place-items-center py-4 drop-shadow-3xl shadow-black">
          <img src={FeatImg} alt="img" width="350" height="350" />
        </div>
        <div className='bg-yellow-300 p-14 border-2 border-r-8 border-t-8 rounded-xl border-white'>
          <h1 className='text-4xl'>What else do we have</h1>
          <p className='text-xl py-4 tracking-wider'>GameCrypt is a web app where you can:
          </p>
          <ul className="text-xl">
            <li className="list-disc">Collect and resell you NFTs.</li>
            <li className="list-disc">A blockchain based Pokémon game.</li>
            <li className="list-disc">Win the showdown to earn some NFTs.</li>
            <li className="list-disc">Connect your wallet and enter the showdown.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
