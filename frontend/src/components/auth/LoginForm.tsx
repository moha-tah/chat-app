import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import Header from "../shared/Header";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { BACKEND_URL, EMAIL_REGEX } from "@/lib/constants";
import { toast } from "sonner";
import type { User } from "@/types/User";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        toast.error(errorData.message || "Erreur lors de la connexion.");
        return;
      }

      const data: User = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "/";
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue lors de la connexion.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
      <Header />
      <div className="flex items-center justify-center text-white">
        <Card className="my-12 w-full max-w-md bg-slate-800 border-slate-700">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-blue-500">
              Connexion
            </CardTitle>
            <CardDescription className="text-slate-400">
              Connectez-vous à votre compte
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 mb-5">
                <Label htmlFor="password" className="text-slate-300">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!email || !password || !EMAIL_REGEX.test(email)}
              >
                Se connecter
              </Button>
              <p className="text-center text-sm text-slate-400">
                Pas encore de compte ?{" "}
                <Link
                  to="/sign-up"
                  className="font-medium text-blue-500 hover:underline"
                >
                  S'inscrire
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
