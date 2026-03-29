import { Shuffle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createRandomMemeStream, type Meme } from "~/api/memes";

export default function RandomMemeStream() {
	const [currentMeme, setCurrentMeme] = useState<Meme | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [connectionStatus, setConnectionStatus] = useState<
		"disconnected" | "connecting" | "connected"
	>("disconnected");
	const eventSourceRef = useRef<EventSource | null>(null);

	const connectToStream = () => {
		if (eventSourceRef.current) {
			eventSourceRef.current.close();
		}

		setConnectionStatus("connecting");
		setError(null);

		try {
			const eventSource = createRandomMemeStream(
				(meme: Meme) => {
					setCurrentMeme(meme);
					setIsConnected(true);
					setConnectionStatus("connected");
				},
				(error: Error) => {
					setError(error.message);
					setIsConnected(false);
					setConnectionStatus("disconnected");
				},
			);

			eventSourceRef.current = eventSource;

			// Handle connection open
			eventSource.onopen = () => {
				setIsConnected(true);
				setConnectionStatus("connected");
				setError(null);
			};
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to connect to stream",
			);
			setConnectionStatus("disconnected");
		}
	};

	const disconnectFromStream = () => {
		if (eventSourceRef.current) {
			eventSourceRef.current.close();
			eventSourceRef.current = null;
		}
		setIsConnected(false);
		setConnectionStatus("disconnected");
		setError(null);
	};

	useEffect(() => {
		return () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close();
			}
		};
	}, []);

	const getStatusColor = () => {
		switch (connectionStatus) {
			case "connected":
				return "text-green-600";
			case "connecting":
				return "text-yellow-600";
			case "disconnected":
				return "text-red-600";
			default:
				return "text-gray-600";
		}
	};

	const getStatusText = () => {
		switch (connectionStatus) {
			case "connected":
				return "Đã kết nối";
			case "connecting":
				return "Đang kết nối...";
			case "disconnected":
				return "Chưa kết nối";
			default:
				return "Không xác định";
		}
	};
	const url = "http://localhost:8888/";
	return (
		<div className="max-w-4xl mx-auto">
			{/* Header */}
			<div className="text-center mb-8">
				<h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
					Meme Ngẫu Nhiên
				</h2>
				<p className="text-gray-600 dark:text-gray-400">
					Nhận meme bất ngờ mỗi 5 phút qua công nghệ real-time
				</p>
			</div>

			{/* Connection Status Card */}
			<div className="bg-white dark:bg-black rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
				<div className="flex justify-between items-center mb-6">
					<div className="flex items-center gap-3">
						<div
							className={`w-4 h-4 rounded-full ${
								connectionStatus === "connected"
									? "bg-green-500 animate-pulse"
									: connectionStatus === "connecting"
										? "bg-yellow-500 animate-pulse"
										: "bg-red-500"
							}`}
						></div>
						<div>
							<h3 className="font-semibold text-gray-900 dark:text-gray-100">
								Trạng thái kết nối
							</h3>
							<span className={`text-sm font-medium ${getStatusColor()}`}>
								{getStatusText()}
							</span>
						</div>
					</div>

					<div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
						<Shuffle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
						<span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
							Live Stream
						</span>
					</div>
				</div>

				<div className="mb-6">
					<p className="text-gray-600 dark:text-gray-400 mb-4">
						Kết nối để nhận meme ngẫu nhiên mỗi 5 phút thông qua Server-Sent
						Events.
					</p>

					<div className="flex gap-3">
						<button
							onClick={connectToStream}
							disabled={connectionStatus === "connecting"}
							className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
						>
							{connectionStatus === "connecting" ? (
								<>
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									Đang kết nối...
								</>
							) : (
								<>
									<span>🔗</span>
									Kết nối Stream
								</>
							)}
						</button>

						<button
							onClick={disconnectFromStream}
							disabled={connectionStatus === "disconnected"}
							className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
						>
							<span>🔌</span>
							Ngắt kết nối
						</button>
					</div>
				</div>

				{/* Status Messages */}
				{error && (
					<div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
						<div className="flex items-center gap-2">
							<span className="text-red-500">⚠️</span>
							<p className="text-red-700 dark:text-red-300 font-medium">
								Lỗi kết nối
							</p>
						</div>
						<p className="text-red-600 dark:text-red-400 text-sm mt-1">
							{error}
						</p>
					</div>
				)}

				{connectionStatus === "connected" && !currentMeme && (
					<div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
						<div className="flex items-center gap-2">
							<span className="text-blue-500">✅</span>
							<p className="text-blue-700 dark:text-blue-300 font-medium">
								Kết nối thành công!
							</p>
						</div>
						<p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
							Đang chờ meme đầu tiên... (có thể mất tới 5 phút)
						</p>
					</div>
				)}
			</div>

			{/* Current Meme Display */}
			{currentMeme && (
				<div className="bg-white dark:bg-black rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
					<div className="relative">
						<img
							src={url + currentMeme.memeUrl}
							alt={currentMeme.name}
							className="w-full h-96 object-cover"
						/>
						<div className="absolute top-4 left-4">
							<div className="flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
								<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
								<span className="text-white text-sm font-medium">Live</span>
							</div>
						</div>
						<div className="absolute top-4 right-4 flex gap-2">
							<button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
								<span>❤️</span>
							</button>
							<button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
								<span>📤</span>
							</button>
						</div>
					</div>

					<div className="p-6">
						<h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
							{currentMeme.name}
						</h3>

						{currentMeme.description && (
							<p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
								{currentMeme.description}
							</p>
						)}

						<div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
							<div className="flex gap-6">
								{currentMeme.likes !== undefined && (
									<div className="flex items-center gap-2">
										<span className="text-xl">👍</span>
										<span className="font-semibold text-gray-900 dark:text-gray-100">
											{currentMeme.likes}
										</span>
										<span className="text-gray-500 dark:text-gray-400 text-sm">
											lượt thích
										</span>
									</div>
								)}

								{currentMeme.views !== undefined && (
									<div className="flex items-center gap-2">
										<span className="text-xl">👁️</span>
										<span className="font-semibold text-gray-900 dark:text-gray-100">
											{currentMeme.views}
										</span>
										<span className="text-gray-500 dark:text-gray-400 text-sm">
											lượt xem
										</span>
									</div>
								)}
							</div>

							{currentMeme.createdAt && (
								<div className="text-right">
									<div className="text-sm text-gray-500 dark:text-gray-400">
										{new Date(currentMeme.createdAt).toLocaleString("vi-VN")}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Info Card */}
			<div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
				<div className="flex items-center gap-3 mb-4">
					<div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
						<Shuffle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
					</div>
					<h4 className="font-semibold text-gray-900 dark:text-gray-100">
						Thông tin Stream
					</h4>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="flex items-center gap-3">
						<span className="text-2xl">⏰</span>
						<div>
							<div className="font-medium text-gray-900 dark:text-gray-100">
								Tần suất
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								Mỗi 5 phút
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<span className="text-2xl">🔄</span>
						<div>
							<div className="font-medium text-gray-900 dark:text-gray-100">
								Công nghệ
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								Server-Sent Events
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<span className="text-2xl">🔗</span>
						<div>
							<div className="font-medium text-gray-900 dark:text-gray-100">
								Kết nối
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								Tự động duy trì
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<span className="text-2xl">📱</span>
						<div>
							<div className="font-medium text-gray-900 dark:text-gray-100">
								Tương thích
							</div>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								Mọi thiết bị
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
