import { Link } from "react-router-dom";
import { MainNav } from "./MainNav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              SubsManager
            </span>
          </Link>
          <MainNav />
        </div>
      </div>
    </header>
  );
}