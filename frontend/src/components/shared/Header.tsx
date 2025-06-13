import { useEffect, useState } from "react";
import { User as UserIcon, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { BACKEND_URL } from "@/lib/constants";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export default function Header() {
  // Start with minimal user info from localStorage to show name ASAP
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      console.log("Loaded user from localStorage:", JSON.parse(storedUser));
      return JSON.parse(storedUser);
    } else {
      console.log("No user found in localStorage");
      return null;
    }
  });

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail'); // Get the email
    if (userEmail) {
      console.log(`Fetching user data for: ${userEmail}`);
      fetch(`${BACKEND_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${userEmail}` // Send the email, not a token
        }
      })
          .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
          })
          .then((data: User) => {
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
          })
          .catch(error => console.error("Fetch error:", error));
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
                  {user.avatarUrl ? (
                      <img
                          src={`${BACKEND_URL}${user.avatarUrl}`}
                          alt="Photo de profil"
                          className="w-8 h-8 rounded-full object-cover"
                      />
                  ) : (
                      <UserIcon className="w-6 h-6" />
                  )}
                  <span className="text-sm mx-2">
                {user.firstName} {user.lastName}
              </span>
                  <Button
                      variant="ghost"
                      className="bg-blue-600 hover:bg-blue-700 hover:text-white text-white mx-2"
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
