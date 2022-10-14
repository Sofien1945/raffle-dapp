import { contractAddress, abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useState, useEffect } from "react"
import { useNotification } from "web3uikit"
import { Bell } from "@web3uikit/icons"
import { ethers } from "ethers"
import { Moralis } from "moralis-v1"

const RaffleEntrance = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress =
        chainId in contractAddress ? contractAddress[chainId][0] : null

    //Hooks declaration
    const [entranceFee, setEntranceFee] = useState("0")
    const dispatch = useNotification()
    const [numberOfPlayers, setNumberOfPlayers] = useState(0)
    const [bal, setBal] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    //Internal Functions
    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            updateUIValues()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Notification",
            position: "topR",
            icon: <Bell />,
        })
    }

    //Front-Back interraction function
    const {
        runContractFunction: enterRaffle,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const updateUIValues = async () => {
        const entranceFeeFromContract = (await getEntranceFee()).toString()
        const playersNumberFromContract = (
            await getNumberOfPlayers()
        ).toString()
        const recentWinnerFromCall = await getRecentWinner()
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const balance = (
                await provider.getBalance(raffleAddress)
            ).toString()
            setBal(balance)
        } else {
            setBal("0")
        }

        setEntranceFee(entranceFeeFromContract)
        setNumberOfPlayers(playersNumberFromContract)
        setRecentWinner(recentWinnerFromCall)
    }
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    return (
        <div className="flex flex-col">
            <div className="rounded-md m-3 text-white flex flex-row h-[150px] p-5 pt-8 bg-gray-100 justify-between items-center shadow-lg shadow-gray-200">
                <div className="flex items-center justify-center h-[70px] mr-5 bg-gray-300 p-5 rounded-lg shadow-2xl shadow-indigo-500 left-5 top-5 text-black font-semibold">
                    {raffleAddress ? (
                        <h1>
                            Raffle Entrance Fee:{" "}
                            {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                        </h1>
                    ) : (
                        <h1>No Raffle Address Detected</h1>
                    )}
                </div>
                <button
                    className="h-[50px] px-5 font-semibold bg-gradient-to-b from-cyan-300 to-blue-500 rounded-md hover:shadow-2xl hover:shadow-indigo-500 cursor-pointer hover:bg-gradient-to-r hover:from-gray-900 hover:to-gray-500"
                    onClick={async () => {
                        await enterRaffle({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        })
                    }}
                    disabled={isLoading || isFetching}
                >
                    {isLoading || isFetching ? (
                        <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                    ) : (
                        "Enter Raffle"
                    )}
                </button>
            </div>
            <div className="flex flex-row rounded-md m-3 h-[150px] p-5 pt-8 bg-gray-100 justify-between shadow-lg shadow-gray-200">
                <div className="flex items-center justify-center h-[70px] mr-5 bg-gray-300 p-5 rounded-lg shadow-2xl shadow-indigo-500 left-5 top-5 text-black font-semibold">
                    {raffleAddress ? (
                        <p>
                            Current Number of Players: {numberOfPlayers} Players{" "}
                        </p>
                    ) : (
                        <h1>No Raffle Address Detected</h1>
                    )}
                </div>
                <div className="flex items-center justify-center h-[70px] mr-5 bg-gray-300 p-5 rounded-lg shadow-2xl shadow-indigo-500 left-5 top-5 text-black font-semibold">
                    {raffleAddress ? (
                        <p>
                            Balance: {ethers.utils.formatUnits(bal, "ether")}{" "}
                            ETH
                        </p>
                    ) : (
                        <h1>No Raffle Address Detected</h1>
                    )}
                </div>
            </div>
            <div className="flex flex-row rounded-md m-3 h-[200px] p-5 pt-8  bg-gray-100 shadow-lg shadow-gray-200">
                <div className="flex items-center justify-center h-[70px] mr-5 bg-gray-300 p-5 rounded-lg shadow-2xl shadow-indigo-500 left-5 top-5 text-black font-semibold">
                    {recentWinner ==
                    "0x0000000000000000000000000000000000000000" ? (
                        <p>No Winner so far</p>
                    ) : (
                        <p>Last Winne Address: {recentWinner}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RaffleEntrance
