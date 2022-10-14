import { ConnectButton } from "web3uikit"

const Navbar = () => {
    return (
        <nav className="p-5 border-b-2 border-neutral-800 flex flex-row items-center justify-between bg-gradient-to-b from-gray-900 to-gray-500">
            <h1 className="py-4 px-4 font-bold text-3xl text-white font-Montserrat">
                Welcome to Raffle Dapp
            </h1>
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} className="font-normal" />
            </div>
        </nav>
    )
}

export default Navbar
