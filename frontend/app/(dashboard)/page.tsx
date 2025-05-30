'use client';

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">欢迎使用贸语通译桥</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-medium mb-3">智能机器翻译服务</h2>
          <p className="text-gray-600 mb-4">
            利用专业领域术语库优化的翻译功能，满足贸易专业文档的翻译需求。
          </p>
          <a href="/translate" className="text-blue-600 hover:text-blue-800">
            开始使用 &rarr;
          </a>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-medium mb-3">标准化模板库</h2>
          <p className="text-gray-600 mb-4">
            合同和通信文件模板，具备AI辅助填充功能，便捷生成专业文档。
          </p>
          <a href="/templates" className="text-blue-600 hover:text-blue-800">
            浏览模板 &rarr;
          </a>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-medium mb-3">即时知识问答系统</h2>
          <p className="text-gray-600 mb-4">
            基于FAQ的法律和商业咨询，解答贸易常见问题。
          </p>
          <a href="/qa" className="text-blue-600 hover:text-blue-800">
            提问解答 &rarr;
          </a>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">开始使用提示</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>使用翻译功能转换您的贸易文档</li>
          <li>浏览模板库查找适合您业务的标准文档</li>
          <li>在问答系统中搜索贸易相关问题的解答</li>
        </ul>
      </div>
    </div>
  );
}
