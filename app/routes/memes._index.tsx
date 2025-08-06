import { useState } from "react";
import { MainLayout } from "~/components/layout/MainLayout";
import MemeList from "~/components/meme/MemeList";
import MemeUpload from "~/components/meme/MemeUpload";
import RandomMemeStream from "~/components/meme/RandomMemeStream";
import { Image, Upload, Shuffle, Sparkles } from "lucide-react";

export default function MemesIndex() {
  const [activeTab, setActiveTab] = useState<"list" | "upload" | "stream">(
    "list"
  );

  const tabs = [
    {
      id: "list",
      label: "Khám phá Memes",
      icon: Image,
      description: "Duyệt qua bộ sưu tập memes thú vị",
    },
    {
      id: "upload",
      label: "Tạo Meme",
      icon: Upload,
      description: "Chia sẻ meme của bạn với cộng đồng",
    },
    {
      id: "stream",
      label: "Meme Ngẫu Nhiên",
      icon: Shuffle,
      description: "Nhận meme bất ngờ mỗi 5 phút",
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Meme Hub
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Nơi chia sẻ và khám phá những meme thú vị nhất. Tham gia cộng đồng
            sáng tạo và giải trí!
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 inline-flex">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group relative px-6 py-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 min-w-[200px] ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <IconComponent
                    className={`w-5 h-5 transition-transform duration-300 ${
                      activeTab === tab.id
                        ? "scale-110"
                        : "group-hover:scale-105"
                    }`}
                  />
                  <div className="text-left">
                    <div className="font-semibold">{tab.label}</div>
                    <div
                      className={`text-xs mt-1 ${
                        activeTab === tab.id
                          ? "text-blue-100"
                          : "text-gray-500 dark:text-gray-500"
                      }`}
                    >
                      {tab.description}
                    </div>
                  </div>

                  {/* Active indicator */}
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-500 ease-in-out">
          <div
            className={`transform transition-all duration-500 ${
              activeTab === "list"
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 absolute pointer-events-none"
            }`}
          >
            {activeTab === "list" && <MemeList />}
          </div>

          <div
            className={`transform transition-all duration-500 ${
              activeTab === "upload"
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 absolute pointer-events-none"
            }`}
          >
            {activeTab === "upload" && <MemeUpload />}
          </div>

          <div
            className={`transform transition-all duration-500 ${
              activeTab === "stream"
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 absolute pointer-events-none"
            }`}
          >
            {activeTab === "stream" && <RandomMemeStream />}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400">
            <Sparkles className="w-4 h-4" />
            <span>Được tạo với ❤️ bởi cộng đồng</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
