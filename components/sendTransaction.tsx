import { useSendTransaction, usePrivy, useWallets } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import gameABI from "../config/BlackJack.json";
import { encodeFunctionData, createPublicClient, http, formatEther } from 'viem';
import { monadTestnet } from 'viem/chains'
import Cards from './cards'
import PlayersBoard from './playersBoard'
import { Pagination } from 'antd';
import GameGuide from './gameGuide';

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

type GameContractResult = [
  GameStruct,
  number,  // dealerValue
  number   // userValue
];

type GameData = {
  dealerCards: Array<number>,
  userCards: Array<number>,
  dealerCount: number,
  userCount: number,
  isGameStart: boolean,
  stakes: number,
  winCounts: number;
  gameCounts: number;
  winStakes: number;
  totalStakes: number;
  dealerValue: number;
  userValue: number;
}

const oneEther: number = 1000000000000000000
export default function SendTransactionPage() {
  // 获取发送交易方法和状态
  const { sendTransaction } = useSendTransaction();
  // 检查用户是否已登录
  const { authenticated, user, ready } = usePrivy();
  const [txHash, setTxHash] = useState<string | null>(null);
  const userAddress = user?.linkedAccounts[1]?.address || '';
  const gameAddress = '0xec2A2F1AD0c78097d71E8a28357523485C74e071';
  const [amount, setAmount] = useState('0.1');
  const uiOptions = { showWalletUIs: false };
  const [playersData, setPlayersData] = useState<Array<GameStruct>>([])
  const [playerAddress, setPlayerAddress] = useState<Array<string>>(["0x1234567890123456789012345678901234567890"])
  const { wallets } = useWallets();
  const [balance, setBalance] = useState<string | null>(null);
  const [pool, setPool] = useState<string | null>(null);
  const [gameData, setGameData] = useState<GameData>({
    dealerCards: [-1, -1],
    userCards: [-1, -1],
    dealerCount: 1,
    userCount: 2,
    isGameStart: false,
    stakes: 0, // bigint 转 number
    winCounts: 0, // 这些字段需要从其他地方获取
    gameCounts: 0, // bigint 转 number
    winStakes: 0,
    totalStakes: 0,
    dealerValue: 0,
    userValue: 0
  })

  const publicClient = createPublicClient({
    chain: monadTestnet,
    transport: http()
  })

  function transformGameData(rawData: GameContractResult): GameData {
    const [gameStruct, dealerValue, userValue] = rawData;

    return {
      dealerCards: gameStruct.dealerCards.slice(0, gameStruct.dealerCount),
      userCards: gameStruct.userCards.slice(0, gameStruct.userCount),
      dealerCount: gameStruct.dealerCards.length,
      userCount: gameStruct.userCards.length,
      isGameStart: gameStruct.isGameStart,
      stakes: Number(gameStruct.stakes), // bigint 转 number
      winCounts: gameStruct.winCounts, // 这些字段需要从其他地方获取
      gameCounts: Number(gameStruct.gameCounts), // bigint 转 number
      winStakes: gameStruct.winStakes,
      totalStakes: gameStruct.totalStakes,
      dealerValue,
      userValue
    };
  }

  const getCards = async () => {
    try {
      const rawGameData = await publicClient.readContract({
        address: gameAddress,
        abi: gameABI.abi,
        functionName: "getGame",
        args: [userAddress]
      }) as GameContractResult;
      const transformedData = transformGameData(rawGameData);
      setGameData(transformedData as GameData)
    } catch (err) {
      console.error('获取当局游戏信息失败:', err)
    }
  }

  useEffect(() => {
    if (authenticated) {
      getCards();
    }
  }, [authenticated]);

  const getPlayerAddress = async () => {
    try {
      const playerAddress = await publicClient.readContract({
        address: gameAddress,
        abi: gameABI.abi,
        functionName: "getPlayersIndex",
        args: []
      }) as Array<string>;
      setPlayerAddress(playerAddress)
    } catch (err) {
      console.error('获取所有玩家信息失败:', err)
    }
  }

  const getPlayersData = async () => {
    try {
      const playData = await publicClient.readContract({
        address: gameAddress,
        abi: gameABI.abi,
        functionName: "getPlayers",
        args: []
      }) as Array<GameStruct>;
      setPlayersData(playData)
    } catch (err) {
      console.error('获取所有玩家信息失败:', err)
    }
  }

  useEffect(() => {
    getPlayersData()
    getPlayerAddress()
  }, [gameData.isGameStart, authenticated])

  // let _gameData: GameStruct

  // const unwatch = publicClient.watchContractEvent({
  //   address: gameAddress, // 合约地址
  //   abi: gameABI.abi,
  //   eventName: 'GameState',
  //   onLogs: logs => {
  //     if (logs[0]?.args?.user == userAddress)
  //       _gameData = {
  //         dealerCards: logs[0]?.args?.game.dealerCards.slice(0, logs[0]?.args?.game.dealerCount),
  //         userCards: logs[0]?.args?.game.userCards.slice(0, logs[0]?.args?.game.userCount),
  //         dealerCount: logs[0]?.args?.game.dealerCards.length,
  //         userCount: logs[0]?.args?.game.userCards.length,
  //         isGameStart: logs[0]?.args?.game.isGameStart,
  //         stakes: Number(logs[0]?.args?.game.stakes), // bigint 转 number
  //         winCounts: logs[0]?.args?.game.winCounts, // 这些字段需要从其他地方获取
  //         gameCounts: Number(logs[0]?.args?.game.gameCounts), // bigint 转 number
  //         winStakes: logs[0]?.args?.game.winStakes,
  //         totalStakes: logs[0]?.args?.game.totalStakes,
  //       };
  //     setGameData(_gameData as GameData)
  //   }
  // })

  const [currentPage, setCurrentPage] = useState(1);

  const handleSend = async (key: string) => {
    if ((!authenticated) && ready) {
      return alert('请先登录');
    }

    setTxHash("loading...")

    const functionData = encodeFunctionData({
      abi: gameABI.abi,
      functionName: key,
      args: []
    })

    const txRequest = {
      to: gameAddress,
      value: key === "initGame" ? BigInt(Number(amount) * oneEther) : 0, // 0 BigInt 表示不发送ETH
      data: functionData,
    }

    try {
      // 发送交易
      const { hash } = await sendTransaction(txRequest, { uiOptions });

      // 等待交易确认
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: hash,
        confirmations: 1, // Monad测试网只需1个确认
        timeout: 15_000   // 15秒超时
      });
      // 检查交易状态
      if (receipt.status === "success") {
        // 3. 交易成功确认
        await getCards(); // 刷新状态
        setTxHash(hash);
        // 确认成功后输出
        console.log('交易已确认，哈希:', hash);
      } else {
        // 交易在链上失败
        setTxHash("交易失败");
        throw new Error(`交易失败: 状态码 ${receipt.status}`);
      }

    } catch (err) {
      console.error('发送交易失败:', err);
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user || wallets.length === 0) return;

      try {
        // 获取主钱包地址
        const address = userAddress;

        // 查询余额（返回 bigint 类型的 wei）
        const balanceWei = await publicClient.getBalance({ address });

        // 转换为 ETH
        const balanceEth = formatEther(balanceWei);
        setBalance(parseFloat(balanceEth).toFixed(2));
      } catch (error) {
        console.error('获取余额失败:', error);
        setBalance('0.00');
      }
    };

    fetchBalance();

    const fetchPool = async () => {
      if (!user || wallets.length === 0) return;

      try {
        // 获取主钱包地址
        const address = gameAddress;

        // 查询余额（返回 bigint 类型的 wei）
        const balanceWei = await publicClient.getBalance({ address });
        console.log('游戏合约余额:', balanceWei)
        // 转换为 ETH
        const balanceEth = formatEther(balanceWei);
        setPool(parseFloat(balanceEth).toFixed(2));
      } catch (error) {
        console.error('获取余额失败:', error);
        setPool('0.00');
      }
    };

    fetchPool();
  }, [user, wallets, publicClient, txHash]);

  return (
    <div className="w-full mx-auto flex items-center justify-center gap-2">
      <div className='flex flex-col items-center w-1/5 min-w-[300px] text-center gap-2 h-full'>
        < GameGuide />
      </div>
      <div className="flex flex-col items-center justify-center h-[710px] bg-gradient-to-br from-indigo-900 to-purple-800 p-4 rounded-2xl text-white min-w-[800px]">
        <label className="block mb-2 text-pink-400 font-bold text-2xl">庄家分数：{gameData?.dealerValue}</label>
        <Cards cards={gameData?.dealerCards} />
        <Cards cards={gameData?.userCards} />
        <label className="block mb-2 text-lime-300 font-bold text-2xl">玩家分数：{gameData?.userValue}</label>
        <div className="flex items-center justify-center gap-4">
          <label className="block mb-4 text-2xl text-green-400 font-bold">{gameData?.isGameStart ? '游戏进行中……' :
            ((gameData.dealerCount > 6) || (gameData.userCount > 6))
              || ((gameData.userValue > gameData.dealerValue) && (gameData.userValue < 22))
              || ((gameData.dealerValue > 21) && (gameData.userValue < 22)) ? "玩家获胜！" :
              (gameData.dealerValue == gameData.userValue) ? "平局！" : "庄家获胜！"
          }</label>
          {gameData?.isGameStart ? <label className="block mb-4 text-2xl ">筹码: {gameData?.stakes ? Number(gameData.stakes) / oneEther : 0} (MON)</label>
            : <div className="mb-4 flex items-center justify-center">
              <label className="block text-center text-2xl">筹码 (MON)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="p-1 rounded text-black w-20 ml-3 text-base"
                step={"0.01"}
                min={"0.01"}
              />
            </div>}
        </div>
        <div className='flex gap-4 justify-between text-xl'>
          <button
            onClick={() => handleSend("initGame")}
            className=" bg-blue-500 text-amber-100 py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 "
            disabled={(gameData?.isGameStart) || (txHash == "loading...")}
          >
            新游戏
          </button>
          <button
            onClick={() => handleSend("hit")}
            className=" bg-blue-500 text-amber-100 py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={(!gameData?.isGameStart) ||(txHash == "loading...")}
          >
            要牌
          </button>
          <button
            onClick={() => handleSend("isEndGame")}
            className=" bg-blue-500 text-amber-100 py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={(!gameData?.isGameStart) || (txHash == "loading...")}
          >
            结束
          </button>
        </div>
        {txHash && (
          <div className="mt-4 p-2 bg-green-100 rounded">
            <a
              href={`https://testnet.monadexplorer.com/address/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline break-all"
            >
              {txHash.slice(0, 2) === "0x" ? `查看交易:${txHash.slice(0, 12)}...${txHash.slice(-10)}` : txHash}
            </a>
          </div>
        )}
      </div>
      <div className='flex flex-col items-center w-1/5 min-w-[300px] text-center gap-2 h-full'>
        <div className="text-lg text-white border-red-600 border-2 font-bold rounded-xl bg-fuchsia-800 w-full h-auto p-3">
          玩家余额：{balance} MON</div>
        <div className="text-lg text-white border-red-600 border-2 font-bold rounded-xl bg-fuchsia-800 w-full h-auto p-3">
          庄家资金：{pool} MON</div>
        <div className="text-lg text-white border-red-600 border-2 rounded-xl bg-fuchsia-800 w-full h-[580px] p-3  gap-2 flex flex-col items-center">
          <div className='gap-2 justify-end flex w-full'>
            <div className='mr-10'>🏆</div>
            <div className='mr-5'>玩家</div>
            <div>胜场</div>
            <div>赢得(MON)</div>
          </div>
          <div className="flex justify-between w-full border-4 rounded-lg p-2 text-m h-12 border-emerald-300 text-emerald-200" >
            <div>当前玩家</div>
            <div>{userAddress.substring(0, 6)}...{userAddress.substring(userAddress.length - 4)}</div>
            <div>{gameData?.winCounts}</div>
            <div>{Number(gameData?.winStakes) / 1000000000000000000}</div>
          </div>
          <PlayersBoard playersData={playersData} playerAddress={playerAddress} page={currentPage} />
          <Pagination
            onChange={(page: number) => {
              setCurrentPage(page);
            }}
            pageSize={10}
            simple={{ readOnly: true }}
            defaultCurrent={1}
            total={playerAddress.length}
            className='bg-gray-300 rounded-xl font-bold w-auto h-10 p-3 text-lg items-center justify-center' />
        </div>
      </div>
    </div>
  );
}