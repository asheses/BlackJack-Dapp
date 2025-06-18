export default function GameGuide() {

    return (
        <div className="text-lg text-white border-red-600 border-2 rounded-xl bg-fuchsia-800 w-full h-full py-4 px-8">
            <div className="mt-2 mb-4 text-3xl bg-gradient-to-r from-lime-200 to-emerald-400 bg-clip-text text-transparent font-bold">♠ GameGuide</div>
            <p className="mt-2 mb-4 text-1xl bg-gradient-to-r from-lime-200 to-emerald-400 bg-clip-text text-transparent font-bold my-3">
                使用钱包登录，向临时钱包转账一定金额开始游戏。</p>
            <p className="mt-2 mb-4 text-1xl bg-gradient-to-r from-lime-200 to-emerald-400 bg-clip-text text-transparent font-bold my-3">
                选择筹码大小，最小下注金额为0.01，最大下注金额庄家资金的1/10，点击新游戏即可开始游戏。</p>
            <p className="mt-2 mb-4 text-1xl bg-gradient-to-r from-lime-200 to-emerald-400 bg-clip-text text-transparent font-bold my-3">
                点击要牌，摸一张牌，点击结束，计算结果。</p>
            <p className="mt-2 mb-4 text-1xl bg-gradient-to-r from-lime-200 to-emerald-400 bg-clip-text text-transparent font-bold my-3">
                2-10按面值，J/Q/K为10点，A可作1或11点，当点数大于庄家且未爆牌时，玩家获胜！</p>
        </div >
    );
}