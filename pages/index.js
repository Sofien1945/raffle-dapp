import Head from "next/head"
import { Navbar, RaffleEntrance } from "../components"
import { useMoralis } from "react-moralis"

const supportedChains = ["31337", "5"]

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    return (
        <div>
            <Head>
                <title>Dapp Raffle Game</title>
                <meta name="description" content="Decentralised Raffle Game" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            {isWeb3Enabled ? (
                <div className="p-5 border-b-2 h-screen flex justify-center items-center border-neutral-800 flex flex-row items-center justify-center bg-gradient-to-t from-gray-900 to-gray-500">
                    {supportedChains.includes(parseInt(chainId).toString()) ? (
                        <RaffleEntrance />
                    ) : (
                        <h1 className="text-white text-3xl font-bold font-Montserrat">{`!Sorry, Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</h1>
                    )}
                </div>
            ) : (
                <div className="p-5 border-b-2 h-screen flex justify-center items-center border-neutral-800 flex flex-row items-center justify-center bg-gradient-to-t from-gray-900 to-gray-500">
                    <h1 className="text-white text-3xl font-bold font-Montserrat">
                        !Please connect to a Wallet
                    </h1>
                </div>
            )}
        </div>
    )
}
