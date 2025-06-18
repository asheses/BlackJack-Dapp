import React from 'react';
import Image from 'next/image';

// 定义组件props类型
interface CardsProps {
  cards: number[]|undefined;
}

const Cards: React.FC<CardsProps> = ({ cards = [] }) => {
  // 确保数组至少有2个元素
  const displayCards = [...cards];
  while (displayCards.length < 2) {
    displayCards.push(-1);
  }

  return (
      <div className="flex flex-wrap justify-center gap-6 m-4">
        {displayCards.map((card, index) => (
          <div 
            key={index} 
            className="relative w-32 h-48 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105"
          >
            {card === -1 ? (
              // 显示背景图片
              <div className="relative w-full h-full">
                <Image
                  src="/Cards/background.jpg"
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  className="rounded-2xl"
                />
              </div>
            ) : card%4 === 0? (
              <div className="relative w-full h-full">
                <Image
                  src={`/Cards/cardSpades${Math.floor(card/4)+1}.png`}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  className="rounded-2xl"
                />
              </div>
            ): card%4 === 1? (
              <div className="relative w-full h-full">
                <Image
                  src={`/Cards/cardHearts${Math.floor(card/4)+1}.png`}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  className="rounded-2xl"
                />
              </div>
            ): card%4 === 2? (
              <div className="relative w-full h-full">
                <Image
                  src={`/Cards/cardDiamonds${Math.floor(card/4)+1}.png`}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  className="rounded-2xl"
                />
              </div>
            ):(
              <div className="relative w-full h-full">
                <Image
                  src={`/Cards/cardClubs${Math.floor(card/4)+1}.png`}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  className="rounded-2xl"
                />
              </div>
            )}
          </div>
        ))}
      </div>
  );
};

export default Cards;