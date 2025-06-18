
interface PlayersBoardProps {
    playersData: Array<GameStruct>;
    playerAddress: Array<string>;
    page: number;
}

type GameStruct = {
    dealerCards: number[],
    userCards: number[],
    dealerCount: number,
    userCount: number,
    isGameStart: boolean,
    stakes: number,
    winCounts: number;
    gameCounts: number;
    winStakes: number;
    totalStakes: number;
};


const PlayersBoard: React.FC<PlayersBoardProps> = ({ playersData, playerAddress, page }) => {


    const safeAddress = playerAddress.map(address => address.substring(0, 6) + "..." + address.substring(address.length - 4))
    let totalData = [];
    for (let i = 0; i < playersData.length; i++) {
        totalData.push({
            address: safeAddress[i],
            winCounts: Number(playersData[i]?.winCounts || 0),
            winStakes: Number(playersData[i]?.winStakes || 0),
        })
    }
    totalData.sort((a, b) => b.winCounts - a.winCounts)
    const totalDataPerPage = totalData.slice((page - 1) * 10, page * 10)
    return (
        <div className="flex w-full flex-col gap-1 h-[440px] ">
            {
                totalDataPerPage.map((player, index) => (
                    <div key={index} className="flex justify-around w-full border-2 border-gray-400 rounded-lg p-2 text-sm h-9" >
                        <div>{(page - 1) * 10 + index + 1}</div>
                        <div>{player.address}</div>
                        <div>{player.winCounts}</div>
                        <div>{(player.winStakes / 1000000000000000000).toFixed(1)}</div>
                    </div>
                )
                )
            }
        </div>
    )
}

export default PlayersBoard;