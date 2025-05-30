import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8 text-center">贸语通译桥</h1>
      </div>
      
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            智能机器翻译服务
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            利用专业领域术语库优化的翻译功能
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            标准化模板库
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            合同和通信文件模板，具备AI辅助填充功能
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            即时知识问答系统
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            基于FAQ的法律和商业咨询
          </p>
        </div>
      </div>
      
      <div className="mt-10">
        <Link 
          href="/login" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          登录 / 注册
        </Link>
      </div>
    </main>
  );
}
