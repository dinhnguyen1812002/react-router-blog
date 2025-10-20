// export const Footer = () => {
//   return (
//     <footer className="bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-gray-700">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">BlogPlatform</h3>
//             <p className="text-gray-600 dark:text-gray-400">
//               Nền tảng chia sẻ kiến thức và giải trí với blog và memes chất lượng cao.
//             </p>
//           </div>

import { Facebook, Instagram, Linkedin, Mail, MapPinCheck, Phone } from "lucide-react";
import { Link } from "react-router";

//           <div>
//             <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">Liên kết</h4>
//             <ul className="space-y-2">
//               <li><a href="/blog-frontend/public" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Trang chủ</a></li>
//               <li><a href="/posts" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Bài viết</a></li>
//               <li><a href="/memes" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Memes</a></li>
//             </ul>
//           </div>

//           <div>
//             <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">Liên hệ</h4>
//             <p className="text-gray-600 dark:text-gray-400">
//               Email: contact@blogplatform.com<br />
//               Phone: +84 123 456 789
//             </p>
//           </div>
//         </div>

//         <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
//           <p className="text-gray-600 dark:text-gray-400">
//             © 2024 BlogPlatform. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Công ty</h3>
            <p className="text-muted-foreground text-sm leading-relaxed ">
              Chúng tôi cam kết mang đến những sản phẩm và dịch vụ chất lượng cao nhất cho khách hàng.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>    
                <Link to="/news" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tin tức
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Thông tin liên hệ</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPinCheck className="w-4 h-4" />
                
                 123 Đường ABC, Quận 1, TP.HCM</p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                (028) 1234 5678
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                info@company.com
              </p>
            </div>
            <div className="flex space-x-4 pt-2">
              <Link to="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="w-4 h-4" />
              
              </Link>
              <Link to="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="w-4 h-4" />
               
              </Link>
              <Link to="#" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-4 h-4" />
                
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p className="text-gray-900 dark:text-white">&copy; {new Date().getFullYear()} Công ty của bạn. Tất cả quyền được bảo lưu.</p>
          <p className="mt-2 md:mt-0">Được thiết kế với ❤️ tại Việt Nam</p>
        </div>
      </div>
    </footer> 
  )
}
