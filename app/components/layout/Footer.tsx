import { Github, Linkedin, Twitter } from "lucide-react"

export const Footer = () => {
  const year = new Date().getFullYear()
  return (
   <footer className="bg-slate-50 dark:bg-slate-950 pt-20 pb-10 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">I</span>
                </div>
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Inkwell
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 max-w-xs mb-8">
                Building the most beautiful, human-centric publishing platform on the web.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-white dark:bg-slate-900 rounded-lg text-slate-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm hover:shadow transition-all"><Twitter size={20} /></a>
                <a href="#" className="p-2 bg-white dark:bg-slate-900 rounded-lg text-slate-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm hover:shadow transition-all"><Linkedin size={20} /></a>
                <a href="#" className="p-2 bg-white dark:bg-slate-900 rounded-lg text-slate-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm hover:shadow transition-all"><Github size={20} /></a>
              </div>
            </div>
            
            <div>
              <h5 className="font-bold mb-6 text-slate-900 dark:text-slate-50">Product</h5>
              <ul className="space-y-4 text-slate-600 dark:text-slate-300">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Editor</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Communities</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold mb-6 text-slate-900 dark:text-slate-50">Resources</h5>
              <ul className="space-y-4 text-slate-600 dark:text-slate-300">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Guidebook</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Help Center</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Developer API</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold mb-6 text-slate-900 dark:text-slate-50">Company</h5>
              <ul className="space-y-4 text-slate-600 dark:text-slate-300">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Press</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold mb-6 text-slate-900 dark:text-slate-50">Legal</h5>
              <ul className="space-y-4 text-slate-600 dark:text-slate-300">
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms</a></li>
                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Cookies</a></li>
              </ul>
            </div>
          </div>            

          
          <div className="pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 dark:text-slate-400 text-sm">
            <p>© {year} Inkwell Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Status</a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Security</a>
              <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
  )
}
