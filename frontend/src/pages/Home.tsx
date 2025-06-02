import { Button } from "@/components/ui/button";
import Header from "../components/shared/Header";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-800 text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center py-12 sm:py-16">
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
          Discutez avec vos{" "}
          <span className="bg-clip-text text-blue-600">amis</span> !
        </h2>
        <p className="max-w-2xl text-lg sm:text-xl text-slate-300 mb-10">
          Rejoignez notre plateforme de messagerie instantanée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg"
          >
            <Link to={localStorage.getItem("user") ? "/chats" : "/login"}>
              Commencer
            </Link>
          </Button>
        </div>
      </main>

      <section className="py-8 sm:py-12 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-6 tracking-tight">
            Projet réalisé par Mohamed Tahiri et Ismat Abou Khafche.
          </h3>
          <p className="text-white text-lg sm:text-xl max-w-2xl mx-auto">
            Backend en Java (SpringBoot), Frontend en React (Vite), base de
            données en PostgreSQL.
          </p>
        </div>
      </section>

      <footer className="py-8 text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} - ChatApp</p>
      </footer>
    </div>
  );
}

export default Home;
