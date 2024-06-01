"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect , useRef} from "react";
import Navbar from "../../../components/Navbar";
import NftdataContainer from "../../../components/NftDataContainer";
import Cookies from "js-cookie";
import axios from "axios";
import {useWallet} from '@suiet/wallet-kit';
import { ConnectButton, useCurrentWallet, useSignAndExecuteTransactionBlock, useSuiClientQuery, useCurrentAccount} from '@mysten/dapp-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [nftdata, setnftdata] = useState(null);

  const { currentWallet, connectionStatus } = useCurrentWallet()

  // const {status, connected, connecting , account , network, name} = useWallet();
  // console.log("sui wallet", account);
  // const wallet = account?.address;

  const accountDataKey = "zklogin-demo.accounts";
  const accounts = useRef(loadAccounts()); // useRef() instead of useState() because of setInterval()
// console.log("ahsdhjashd", !(accounts.current.length>0))
  const NETWORK = 'devnet';
  const MAX_EPOCH = 2; 
  const suiClient = new SuiClient({
    url: getFullnodeUrl(NETWORK),
});

function loadAccounts() {
  if(typeof window !== 'undefined'){
  const dataRaw = sessionStorage.getItem(accountDataKey);
  if (!dataRaw) {
    return [];
  }
  
  const data = JSON.parse(dataRaw);
  return data;
}
}

  // const wallet = currentWallet?.accounts[0].address? (currentWallet?.accounts[0].address) : (accounts.current[0]?.userAddr);

  // console.log("wallet", wallet)
  // console.log("wallet", accounts)
  // useEffect(() => {
  //   const vpnnft = async () => {
  //     setLoading(true);
  //     try {
  //       const wallet = Cookies.get("tarot_wallet");

  //       const graphqlbody = {
  //         query: `
  //           query MyQuery { current_token_datas_v2(where: 
  //             {collection_id: {_eq: \"${envcollectionid}\"}, 
  //             current_token_ownerships: 
  //             {owner_address: {_eq: \"${wallet}\"}}}) 
  //             { token_name 
  //               token_uri
  //               description
  //               last_transaction_version
  //              } }
  //           `,
  //         operationName: "MyQuery",
  //       };

  //       const response = await axios.post(`${graphqlaptos}`, graphqlbody, {
  //         headers: {
  //           Accept: "application/json, text/plain, */*",
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       console.log("vpn nft", response.data.data.current_token_datas_v2);
  //       setnftdata(response.data.data.current_token_datas_v2);
  //     } catch (error) {
  //       console.error("Error fetching nft data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   vpnnft();
  // }, []);


  useEffect(() => {
    const getnft = async() => {
      setLoading(true);
      const suiClient = new SuiClient({ url: getFullnodeUrl("devnet") });
      const objects = await suiClient.getOwnedObjects({ owner:currentWallet?.accounts[0].address? (currentWallet?.accounts[0].address) : (accounts.current[0]?.userAddr)});
      const widgets = [];
      
      // iterate through all objects owned by address
      for (let i = 0; i < objects.data.length; i++) {
        const currentObjectId = objects.data[i].data.objectId;
      
        // get object information
        const objectInfo = await suiClient.getObject({
          id: currentObjectId,
          options: { showContent: true },
        });
      
        const packageId = '0x874741711378f683a243efc56ac309dcbbdf36cebd7e165578a6fb5ef5b98620';
      
        if (objectInfo.data.content.type == `${packageId}::mystic::MysticTarotReading`) {
          // const widgetObjectId = objectInfo.data.content.fields.id.id;
          const widgetObjectId = objectInfo.data;
          console.log("widget spotted:", widgetObjectId);
          widgets.push(widgetObjectId);
        }
      }
      // setOwnedWidgets(widgets);
      
      console.log("widgets:", widgets);
      setnftdata(widgets);
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
          Mystic Tarot
          </Link>
        </p>
        <div
        >
          <Navbar />
        </div>
      </div>

      <NftdataContainer metaDataArray={nftdata} MyReviews={false} />

      {!currentWallet && (accounts.length==0) && (
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
                Please connect your Sui Wallet
                </p>
              </div>
              <div className="flex items-center p-4 rounded-b pb-20 pt-10 justify-center">
                <div
                  className="mx-auto border pl-8 pr-10 py-2 rounded-full"
                >
                  <Navbar />
                </div>
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
