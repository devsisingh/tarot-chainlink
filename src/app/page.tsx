"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Cookies from "js-cookie";
import  jwtDecode  from "jwt-decode";
import { useAddress } from "@thirdweb-dev/react";

type OpenIdProvider = "Google";

  type SetupData = {
    provider: OpenIdProvider;
    maxEpoch: number;
    randomness: string;
    ephemeralPrivateKey: string;
  };

  type AccountData = {
    provider: OpenIdProvider;
    userAddr: string;
    zkProofs: any;
    ephemeralPrivateKey: string;
    userSalt: string;
    sub: string;
    aud: string;
    maxEpoch: number;
  };
  
export default function Home() {
  const [drawnCard, setDrawnCard] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [ques, setques] = useState(false);
  const [description, setDescription] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [cardimage, setcardimage] = useState("");
  const [position, setposition] = useState("");
  const [mintdone, setmintdone] = useState(false);

  const address = useAddress();

  return (
    <main
  className={`flex h-screen flex-col items-center justify-between ${lyrics && ques ? 'p-40' : 'p-60'}`}
  style={{
    backgroundImage: (lyrics && ques) 
    ? "url(/afterlogin.png)"
    : (address)
    ? "url(/afterlogin.png)"
    : "url(/beforelogin.png)",
    backgroundPosition: "center",
    position: "relative",
    zIndex: 0, 
  }}
>
  <div
    className="z-10 lg:max-w-7xl w-full justify-between font-mono text-sm lg:flex md:flex"
    style={{
      position: "absolute", // Makes the div overlay the background
      top: 30, // Adjust as needed
    }}
  >
    <p
      className="text-white text-2xl backdrop-blur-2xl dark:border-neutral-800 dark:from-inherit rounded-xl"
      style={{fontFamily: 'fantasy'}}
    >
      {/* Arcane Tarot */}
    </p>
    <div
    >
      <Navbar />
    </div>
      </div>

      <div className="lg:flex md:flex gap-10">
        <div>
          {!address &&  (
            <button
              onClick={() => {
                setques(true);
              }}
              className={`bg-white rounded-full py-3 px-10 text-black uppercase`} style={{fontFamily: 'fantasy', backgroundColor:'#E8C6AA', marginTop:'300px'}}
            >
              Start Now
            </button>
          )}

{address && !lyrics && (
  <div className="mt-20 flex flex-col items-center">
                  <input
                    type="text"
                    placeholder="Write your question here"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="py-3 px-4 rounded-full w-full focus:outline-none text-white mt-48 placeholder-white"
                    style={{ width: '100%', minWidth: '700px', backgroundColor:'#A89495'}} 
                  />
                  
                    <button
                    // onClick={()=>{handleDrawCardAndFetchreading();}}
                    className="bg-white rounded-full py-3 px-20 text-black mt-4 uppercase" style={{fontFamily: 'fantasy', backgroundColor:'#DACFE6'}}
                  >
                    Ask
                  </button>
            
                </div>
)}

          {address && lyrics && (
            
            <div
              className="px-10 py-10 rounded-2xl max-w-xl"
              style={{
                boxShadow: "inset -10px -10px 60px 0 rgba(255, 255, 255, 0.4)",
                backgroundColor: "rgba(255, 255, 255, 0.7)"
              }}
            >
              <div>
                  <div>
                    <div className="flex gap-4 pb-8">
                      <button
                        onClick={() => {
                          setques(true);
                          setDrawnCard(null);
                          setLyrics("");
                        }}
                        className="rounded-full py-2 px-8 text-black font-semibold"
                        style={{backgroundColor: "#E8C6AA"}}
                      >
                        Start Again
                      </button>

                          <button
                        // onClick={mintreading}
                        className="rounded-full py-2 px-6 text-black font-semibold"
                        style={{backgroundColor: "#E8C6AA"}}
                      >
                        Mint reading
                      </button>

                    </div>
                    <h2 className="font-bold mb-2 text-black">
                      Your Tarot Reading:
                    </h2>
                    <p className="text-black">{lyrics}</p>
                  </div>
              </div>
            </div>
          )}
        </div>

        {drawnCard && lyrics && (
          <div>
            <h2 className="mb-4 ml-20 text-white">{drawnCard}</h2>
            {position === "upright" ? (
              <img
                src={`${"https://nftstorage.link/ipfs"}/${
                  cardimage.split("ipfs://")[1].replace("jpg", "png")
                }`}
                width="350"
                height="350"
              />
            ) : (
              <img
                src={`${"https://nftstorage.link/ipfs"}/${
                  cardimage.split("ipfs://")[1].replace("jpg", "png")
                }`}
                width="350"
                height="350"
                style={{ transform: "rotate(180deg)" }}
              />
            )}
          </div>
        )}
      </div>

      {ques && (!address) && (
        <div
          style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative p-4 lg:w-1/3 w-full max-w-2xl max-h-full">
            <div className="relative rounded-3xl shadow bg-black text-white">
              <div className="flex items-center justify-end p-4 md:p-5 rounded-t dark:border-gray-600">
                <button
                  onClick={() => setques(false)}
                  type="button"
                  className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-2xl text-center font-bold" style={{color:'#FFB000'}}>
                Please connect your Wallet
                </p>
              </div>
              <div className="flex items-center p-4 rounded-b pb-20 pt-10 justify-center">
                  <Navbar />
              </div>
            </div>
          </div>
        </div>
      )}

      {mintdone && (
        <div
          style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative p-4 lg:w-1/3 w-full max-w-2xl max-h-full">
            <div className="relative rounded-3xl shadow bg-black text-white">
              <div className="flex items-center justify-end p-4 md:p-5 rounded-t dark:border-gray-600">
                <button
                  onClick={() => setmintdone(false)}
                  type="button"
                  className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {/* <Image src={emoji} alt="info" className="mx-auto"/> */}

              <div className="p-4 space-y-4">
                <p className="text-3xl text-center font-bold text-green-500">
                  Successfully Minted!!
                </p>
                <p className="text-sm text-center pt-4">
                  Go to your profile to view your minted NFTs
                </p>
              </div>
              <div className="flex items-center p-4 rounded-b pb-20">
                <Link href="/profile"
                  type="button"
                  className="w-1/2 mx-auto text-black font-bold focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-md px-5 py-2.5 text-center"
                  style={{backgroundColor:'#E8C6AA'}}
                >
                  My Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div
          style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative p-4 lg:w-1/5 w-full max-w-2xl max-h-full">
            <div className="relative rounded-lg shadow">
              <div className="flex justify-center gap-4">
                <img
                  className="w-50 h-50"
                  src="/loader.gif"
                  alt="Loading icon"
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
