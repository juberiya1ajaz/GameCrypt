import React from 'react'
import { IpfsImage } from 'react-ipfs-image';

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
                    </div>
                </div>

            </div>
        </div>
    )
}
