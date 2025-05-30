import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '贸语通译桥',
  description: 'AI驱动的在线服务平台，帮助中小企业克服跨境贸易中的语言障碍、专业知识不足和合规风险等问题',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
