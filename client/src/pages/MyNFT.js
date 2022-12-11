import React from 'react'
import { IpfsImage } from 'react-ipfs-image';
import NFT1 from '../assets/nft1.jpeg'
import NFT2 from '../assets/nft2.png'

export default function MyNFT() {
    return (
        <div>

            <div className="grid place-items-center py-5">
                <h1 className="text-5xl font-semibold text-white">My NFT</h1>
                <div className='bg-blue-500 h-1 w-36 my-2 rounded-lg'></div>
            </div>

            <div className="flex flex-wrap justify-around w-full px-16">

                <div className="m-8">
                    <div className="border-2 rounded-xl bg-gray-200 border-black ">
                        <img src="https://ipfs.io/ipfs/QmQxs1c2c2ohiwSrJEnXxVJKW2Dz8vT4C9Lhk3cFXn6E9A?filename=nft.jpeg" alt="nft" className="rounded-xl" />
                        <div className='grid place-items-center'>
                            <button className="bg-blue-500 hover:bg-blue-400 w-36 grid place-items-center my-2 text-black font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Re Sell</button>
                        </div>
                    </div>
                </div>

                <div className="m-8">
                    <div className="border-2 rounded-xl bg-gray-200 border-black ">
                        <img src={NFT1} alt="nft" className="rounded-xl" />
                        <div className='grid place-items-center'>
                            <button className="bg-blue-500 hover:bg-blue-400 w-36 grid place-items-center my-2 text-black font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Re Sell</button>
                        </div>
                    </div>
                </div>

                <div className="m-8">
                    <div className="border-2 rounded-xl bg-gray-200 border-black ">
                        <img src={NFT2} alt="nft" className="rounded-xl" />
                        <div className='grid place-items-center'>
                            <button className="bg-blue-500 hover:bg-blue-400 w-36 grid place-items-center my-2 text-black font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Re Sell</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
