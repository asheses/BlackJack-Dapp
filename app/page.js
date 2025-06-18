// app/page.js
'use client';
import { useEffect } from 'react';
import { initHistoryHandler } from '@/utils/history-handler';

export default function Home() {
  useEffect(() => {
    initHistoryHandler();
  }, []);

  return (
    <div>
      <h1>完全功能的静态网页</h1>
      <nav>
        <a href="/about">关于</a> | 
        <a href="/contact">联系我们</a>
      </nav>
      {/* 页面内容 */}
    </div>
  )
}