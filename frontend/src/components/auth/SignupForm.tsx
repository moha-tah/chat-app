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
import { useState, useEffect } from "react";
import { Eye, EyeOff, X, Check } from "lucide-react";
import {
  EMAIL_REGEX,
  PASSWORD_CRITERIA,
  SPECIAL_CHARS_REGEX,
} from "@/lib/constants";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    special: false,
    number: false,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePassword = (currentPassword: string) => {
    const criteria = {
      length: currentPassword.length >= PASSWORD_CRITERIA.length,
      uppercase:
        (currentPassword.match(/[A-Z]/g) || []).length >=
        PASSWORD_CRITERIA.uppercase,
      special:
        (currentPassword.match(SPECIAL_CHARS_REGEX) || []).length >=
        PASSWORD_CRITERIA.special,
      number:
        (currentPassword.match(/[0-9]/g) || []).length >=
        PASSWORD_CRITERIA.number,
    };
    setPasswordCriteria(criteria);
    const strength = Object.values(criteria).filter(Boolean).length;
    setPasswordStrength(strength);
  };

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
        return "Très faible";
      case 1:
        return "Faible";
      case 2:
        return "Moyen";
      case 3:
        return "Fort";
      case 4:
        return "Très fort";
      default:
        return "";
    }
  };

  const getStrengthBarClass = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-slate-700";
    }
  };

  const getStrengthBarWidth = () => {
    switch (passwordStrength) {
      case 0:
        return "10%";
      case 1:
        return "25%";
      case 2:
        return "50%";
      case 3:
        return "75%";
      case 4:
        return "100%";
      default:
        return "0%";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">
      <Header />
      <div className="flex items-center justify-center text-white">
        <Card className="my-12 w-full max-w-md bg-slate-800 border-slate-700">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-blue-500">
              Inscription
            </CardTitle>
            <CardDescription className="text-slate-400">
              Créez un nouveau compte
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
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
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
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-sm text-slate-300">
                      Sécurité du mot de passe :{" "}
                      <span
                        className={`font-bold ${
                          passwordStrength == 0
                            ? "text-red-500"
                            : passwordStrength == 1
                            ? "text-orange-500"
                            : passwordStrength == 2
                            ? "text-yellow-500"
                            : passwordStrength == 3
                            ? "text-blue-500"
                            : "text-green-500"
                        }`}
                      >
                        {getStrengthLabel()}
                      </span>
                    </Label>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getStrengthBarClass()} transition-all duration-300 ease-in-out`}
                      style={{ width: getStrengthBarWidth() }}
                    ></div>
                  </div>
                  <ul className="space-y-1 text-sm">
                    <li
                      className={`flex items-center ${
                        passwordCriteria.length
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {passwordCriteria.length ? (
                        <Check size={16} className="mr-2" />
                      ) : (
                        <X size={16} className="mr-2" />
                      )}
                      13 caractères minimum
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordCriteria.uppercase
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {passwordCriteria.uppercase ? (
                        <Check size={16} className="mr-2" />
                      ) : (
                        <X size={16} className="mr-2" />
                      )}
                      2 majuscules minimum
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordCriteria.special
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {passwordCriteria.special ? (
                        <Check size={16} className="mr-2" />
                      ) : (
                        <X size={16} className="mr-2" />
                      )}
                      2 caractères spéciaux minimum
                    </li>
                    <li
                      className={`flex items-center ${
                        passwordCriteria.number
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {passwordCriteria.number ? (
                        <Check size={16} className="mr-2" />
                      ) : (
                        <X size={16} className="mr-2" />
                      )}
                      3 chiffres minimum
                    </li>
                  </ul>
                </div>
              )}
              <div className="space-y-2 mb-5">
                <Label htmlFor="confirmPassword" className="text-slate-300">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
              {/* Password Confirmation Error Message */}
              {password !== "" &&
                confirmPassword !== "" &&
                password !== confirmPassword && (
                  <p className="text-sm text-red-500 -mt-3 mb-5">
                    Les mots de passe ne correspondent pas.
                  </p>
                )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={
                  Object.values(passwordCriteria).some(
                    (criteria) => !criteria
                  ) ||
                  password !== confirmPassword ||
                  !email ||
                  !EMAIL_REGEX.test(email)
                }
              >
                S'inscrire
              </Button>
              <p className="text-center text-sm text-slate-400">
                Déjà un compte ?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-500 hover:underline"
                >
                  Se connecter
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
