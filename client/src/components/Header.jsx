
import { Button } from "@shadcn/ui";
import { SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <header className={`py-4 px-6 flex justify-between items-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {/* Logo Section */}
      <div className="text-lg font-bold">My Project</div>

      {/* Navigation Links */}
      <nav className="space-x-4">
        <a href="#" className="hover:text-gray-500">Home</a>
        <a href="#" className="hover:text-gray-500">About</a>
        <a href="#" className="hover:text-gray-500">Services</a>
        <a href="#" className="hover:text-gray-500">Contact</a>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <Button variant="default" className="py-2 px-4 rounded">
          Login
        </Button>

        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode} 
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
          {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
