"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect , useRef} from "react";
import Navbar from "../../../components/Navbar";
import NftdataContainer from "../../../components/NftDataContainer";
import Cookies from "js-cookie";
import axios from "axios";
import { useAddress } from "@thirdweb-dev/react";
import { ethers } from 'ethers';
import { abi } from "../../../components/abi/abi";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [nftdata, setnftdata] = useState(null);

  const address = useAddress();


  useEffect(() => {
    const getnft = async() => {
      setLoading(true);
      // const suiClient = new SuiClient({ url: getFullnodeUrl("devnet") });
      // const objects = await suiClient.getOwnedObjects({ owner:currentWallet?.accounts[0].address? (currentWallet?.accounts[0].address) : (accounts.current[0]?.userAddr)});
      // const widgets = [];
      
      // // iterate through all objects owned by address
      // for (let i = 0; i < objects.data.length; i++) {
      //   const currentObjectId = objects.data[i].data.objectId;
      
      //   // get object information
      //   const objectInfo = await suiClient.getObject({
      //     id: currentObjectId,
      //     options: { showContent: true },
      //   });
      
      //   const packageId = '0x874741711378f683a243efc56ac309dcbbdf36cebd7e165578a6fb5ef5b98620';
      
      //   if (objectInfo.data.content.type == `${packageId}::mystic::MysticTarotReading`) {
      //     // const widgetObjectId = objectInfo.data.content.fields.id.id;
      //     const widgetObjectId = objectInfo.data;
      //     console.log("widget spotted:", widgetObjectId);
      //     widgets.push(widgetObjectId);
      //   }
      // }
      // // setOwnedWidgets(widgets);
      
      // console.log("widgets:", widgets);
      // setnftdata(widgets);
      if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      // Create a JavaScript object from the Contract ABI, to interact
      // with the HelloWorld contract.
      const contract = new ethers.Contract(
        '0x48f8E4eEf880F1095c8b9d1c1aDa3A6f2eee1b99',
        abi ,
        provider.getSigner()
      )

      const tx = await contract.mintReading(address, "readingjson");
      const result = await tx.wait();
      const integerValue = parseInt(result.logs[1].data, 16);
      console.log("Result:", result, integerValue);
    }

      setLoading(false);
    }

    getnft();
  }, [])

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-20"
      style={{
        backgroundImage: "url(/profilebg.png)", // Path to your background image
        backgroundSize: "cover", // Adjust as needed
        backgroundPosition: "center", // Adjust as needed
      }}
    >
      <div className="z-10 lg:max-w-6xl w-full justify-between font-mono text-sm lg:flex md:flex">
        <p
          className="text-white text-2xl backdrop-blur-2xl dark:border-neutral-800 dark:from-inherit rounded-xl"
          style={{fontFamily: 'fantasy'}}
        >
          <Link href="/">
          Arcane Tarot
          </Link>
        </p>
        <div
        >
          <Navbar />
        </div>
      </div>

      <NftdataContainer metaDataArray={nftdata} MyReviews={false} />

      {!address && (
        <div
          style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative p-4 lg:w-1/3 w-full max-w-2xl max-h-full">
            <div className="relative rounded-3xl shadow bg-black text-white">
              <div className="flex items-center justify-end p-4 md:p-5 rounded-t dark:border-gray-600">
                {/* <button
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
                </button> */}
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
