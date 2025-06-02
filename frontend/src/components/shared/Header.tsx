import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 shadow-md bg-slate-800/50 backdrop-blur-md sticky top-0 z-50 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-blue-600">
          <Link to="/">ChatApp</Link>
        </h1>
        <nav>
          {user ? (
            <div className="flex items-center">
              <User className="w-6 h-6" />
              <span className="text-sm mx-2">
                {user.firstName} {user.lastName}
              </span>
              <Button
                variant="ghost"
                className="bg-blue-600 hover:bg-blue-700 text-white mx-2"
              >
                <Link to="/chats">Mes chats</Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="mx-2"
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" className="mr-2 ">
                <Link to="/login">Connexion</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/sign-up">Inscription</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
