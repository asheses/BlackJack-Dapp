// app/layout.js
import { useEffect } from 'react';
import { fixLocalPaths } from '@/utils/path-fixer';

export default function RootLayout({ children }) {
  useEffect(() => {
    // 在所有页面加载后执行路径修复
    fixLocalPaths();
    
    // 添加额外逻辑确保链接工作
    const handleAnchorClick = (e) => {
      const isFileProtocol = window.location.protocol === 'file:';
      const target = e.target.closest('a');
      
      if (target && isFileProtocol) {
        e.preventDefault();
        const href = target.getAttribute('href');
        window.location.href = href.endsWith('/') ? 
          `${href}index.html` : 
          href;
      }
    };
    
    document.body.addEventListener('click', handleAnchorClick);
    return () => document.body.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}