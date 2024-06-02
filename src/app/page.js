"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Cookies from "js-cookie";
import  jwtDecode  from "jwt-decode";
import { useAddress } from "@thirdweb-dev/react";
import { ethers } from 'ethers';
import { abi } from "../../components/abi/abi";
  
export default function Home() {
  const [drawnCard, setDrawnCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ques, setques] = useState(false);
  const [description, setDescription] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [cardimage, setcardimage] = useState("");
  const [position, setposition] = useState("");
  const [mintdone, setmintdone] = useState(false);

  const address = useAddress();


  const handleDrawCardAndFetchreading = async () => {
    setLoading(true);

    const MAJOR_ARCANA_URI = "bafybeihrnhjv4ceqvltg3mygifiukety4suhzbd7q2givhbepucvl2xn2e/";
    const MAJOR_ARCANA_NAME = [
      "0 The Fool",
      "I The Magician",
      "II The High Priestess",
      "III The Empress",
      "IV The Emperor",
      "V The Hierophant",
      "VI The Lovers",
      "VII The Chariot",
      "VIII Strength",
      "IX The Hermit",
      "X The Wheel of Fortune",
      "XI Justice",
      "XII The Hanged Man",
      "XIII Death",
      "XIV Temperance",
      "XV The Devil",
      "XVI The Tower",
      "XVII The Star",
      "XVIII The Moon",
      "XIX The Sun",
      "XX Judgement",
      "XXI The World"
  ];

    try {

      // Generate random card index
      const randomCardIndex = Math.floor(Math.random() * MAJOR_ARCANA_NAME.length);

      // Generate random position (0 for upright, 1 for reverse)
      const randomPosition = Math.random() < 0.5 ? "upright" : "reverse";

      // Construct the object with card details
      const randomCard = {
          card: MAJOR_ARCANA_NAME[randomCardIndex],
          card_uri: `${MAJOR_ARCANA_URI}${randomCardIndex}`,
          position: randomPosition
      };
      
      console.log("Drawn Card Transaction:", randomCard);

      const card = randomCard.card;
      const position = randomCard.position;

      setcardimage(randomCard.card_uri);
      setDrawnCard(randomCard.card);
      setposition(randomCard.position);


      const requestBody = {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "user",
            content: `You are a Major Arcana Tarot reader. Client asks this question “${description}” and draws the “${card}” card in “${position}” position. Interpret to the client in no more than 100 words.`,
          },
        ],
      };
      
      let apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const baseURL = "https://apikeyplus.com/v1/chat/completions";
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
      headers.append(
        "Authorization",
        `Bearer ${apiKey}`
      );
      const readingResponse = await fetch(baseURL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      if (!readingResponse.ok) {
        throw new Error("Failed to fetch rap lyrics");
      }

      const readingData = await readingResponse.json();
      setLyrics(readingData.choices[0].message.content);
      console.log(readingData);
      console.log("Data to send in mint:", card, position);

    } catch (error) {
      console.error("Error handling draw card and fetching rap lyrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const mintreading = async () => {
    setLoading(true);

    try {

      if (typeof window !== "undefined" && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
  
        // Create a JavaScript object from the Contract ABI, to interact
        // with the HelloWorld contract.
        const contract = new ethers.Contract(
          '0x48f8E4eEf880F1095c8b9d1c1aDa3A6f2eee1b99',
          abi ,
          provider.getSigner()
        )

        const getCurrentTokenId = await contract.getCurrentTokenId();

        console.log("currentToken", getCurrentTokenId.toNumber());

        const currentToken = getCurrentTokenId.toNumber();

      const jsontxt = {
        "title": "Asset Metadata",
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "description": "ArcaneTarot#" + parseInt(currentToken)
            },
            "description": {
                "type": "string",
                "description": "READING"
            },
            "image": {
                "type": "string",
                "description": "CARD_URI"
            }
        }
      }

      console.log("currentToken", currentToken, jsontxt);
  
        const tx = await contract.mintReading(address, jsontxt);
        const result = await tx.wait();
        const integerValue = parseInt(result.logs[1].data, 16);
        console.log("Result:", result, integerValue);
        setLoading(false);
        setmintdone(true);
      }

    } catch (error) {
      console.error("Error handling draw card and fetching reading:", error);
      setLoading(false); // Set loading state to false in case of error
    }
  };

  return (
    <main
  className={`flex h-screen flex-col items-center justify-between ${lyrics && ques ? 'p-40' : 'p-60'}`}
  style={{
    backgroundImage: (lyrics && ques) 
    ? "url(/profilebg.png)"
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
              className={`rounded-full py-2 ml-3 uppercase`} style={{fontFamily: 'fantasy', color:'#BBBB9B', marginTop:'300px'}}
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
                    onClick={handleDrawCardAndFetchreading}
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
                        onClick={mintreading}
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
                src={`https://nftstorage.link/ipfs/${
                  cardimage
                }.png`}
                width="350"
                height="350"
              />
            ) : (
              <img
                src={`https://nftstorage.link/ipfs/${
                  cardimage
                }.png`}
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
