export default function MemeSimple() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Meme Simple Test</h1>
      <p>Nếu trang này hiển thị được, nghĩa là routing hoạt động bình thường.</p>
      <div className="mt-4">
        <a href="/memes" className="text-blue-500 hover:underline">
          Đi đến Meme Hub
        </a>
      </div>
    </div>
  );
}