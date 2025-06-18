'use client';

import { useLogin, usePrivy,WalletWithMetadata } from "@privy-io/react-auth";
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

export default function LoginButton() {
  const { login } = useLogin({});
  const { user, logout, exportWallet } = usePrivy();
  const  address = user?.linkedAccounts
  .filter((account): account is WalletWithMetadata => account.type === 'wallet')
  .map(wallet => wallet.address)[1] || '';

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
    } catch (err) {
      console.error('复制失败:', err);
    }
  }

  const items: MenuProps['items'] = [
    {
      label: (
        <a onClick={copyAddress} rel="noopener noreferrer" className="justify-between">
          Copy Address
          <CopyOutlined />
        </a>
      ),
      key: '0',
    },
    {
      label: (
        <a href={`https://testnet.monadexplorer.com/address/${address}`} target="_blank" rel="noopener noreferrer">
          View on Explorer
        </a>
      ),
      key: '1',
    },
    {
      label: (
        <a onClick={exportWallet} rel="noopener noreferrer" className="justify-between">
          Export your Wallet
        </a>
      ),
      key: '2',
    },
    {
      label: (
        <div onClick={logout} rel="noopener noreferrer">
          Disconnect
        </div>
      ),
      key: '3',
    }
  ];

  return (<>
    {
      user ?
        <Dropdown menu={{ items }} trigger={['click']} className="bg-violet-600 hover:bg-violet-700 w-36 h-10 text-white rounded-lg mr-4 font-bold ">
          <a onClick={(e) => e.preventDefault()} className="flex items-center justify-center">
            <Space >
              {address.substring(0, 6)}...{address.substring(address.length - 4)}
            </Space>
          </a>
        </Dropdown>
        : <button onClick={login} className="bg-violet-600 hover:bg-violet-700 w-36 h-10 text-white rounded-lg mr-4 font-bold">
          Connect Wallet
        </button>
    }
  </>);
}