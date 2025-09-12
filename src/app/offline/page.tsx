"use client";

export default function Offline() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="w-24 h-24 mx-auto mb-8 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M3 3l18 18M4.22 4.22a10.97 10.97 0 000 15.56m15.56-15.56a10.97 10.97 0 010 15.56M8.46 8.46a5 5 0 007.08 7.08m-7.08-7.08L17.54 17.54"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          网络连接已断开
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          您当前处于离线状态。请检查您的网络连接，然后重试。
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={handleReload}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            重新连接
          </button>
          
          <div className="text-sm text-gray-500">
            <p>当您重新连接到网络时，页面将自动更新。</p>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm max-w-md mx-auto">
          <h3 className="font-semibold text-gray-900 mb-2">
            离线功能
          </h3>
          <p className="text-sm text-gray-600">
            OpenResume 的某些功能可以在离线状态下使用。您可以继续编辑已加载的简历内容。
          </p>
        </div>
      </div>
    </div>
  );
}
