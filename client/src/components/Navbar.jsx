import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  BoxIcon,
  GripIcon,
  ListIcon,
  MenuIcon,
  MessageCircleMore,
  XIcon,
} from "lucide-react";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleAuthNavigate = (path) => {
    if (!user) {
      openSignIn();
    } else {
      navigate(path);
      setMenuOpen(false);
      window.scrollTo(0, 0);
    }
  };

  return (
    <nav className="h-20">
      {/* Navbar */}
      <div className="fixed left-0 top-0 right-0 z-100 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white">
        {/* Logo */}
        <img
          src={assets.logo}
          alt="logo"
          className="h-10 cursor-pointer"
          onClick={() => {
            navigate("/");
            window.scrollTo(0, 0);
          }}
        />

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-4 md:gap-8 text-gray-800">
          <Link to="/">Home</Link>
          <Link to="/marketplace">Marketplace</Link>

          <button
            onClick={() => handleAuthNavigate("/messages")}
            className="hover:text-indigo-600"
          >
            Messages
          </button>

          <button
            onClick={() => handleAuthNavigate("/my-listings")}
            className="hover:text-indigo-600"
          >
            My Listings
          </button>
        </div>

        {/* Auth Buttons */}
        {!user ? (
          <div className="flex items-center gap-4">
            <button
              onClick={openSignIn}
              className="hidden sm:block px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
            >
              Login
            </button>
            <MenuIcon
              onClick={() => setMenuOpen(true)}
              className="sm:hidden cursor-pointer"
            />
          </div>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Marketplace"
                labelIcon={<GripIcon size={16} />}
                onClick={() => navigate("/marketplace")}
              />
              <UserButton.Action
                label="Messages"
                labelIcon={<MessageCircleMore size={16} />}
                onClick={() => navigate("/messages")}
              />
              <UserButton.Action
                label="My Listings"
                labelIcon={<ListIcon size={16} />}
                onClick={() => navigate("/my-listings")}
              />
              <UserButton.Action
                label="My Orders"
                labelIcon={<BoxIcon size={16} />}
                onClick={() => navigate("/my-orders")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden fixed inset-0 z-200 bg-white backdrop-blur shadow-xl transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full text-xl font-semibold gap-6">
          <Link
            to="/"
            onClick={() => {
              setMenuOpen(false);
              window.scrollTo(0, 0);
            }}
          >
            Home
          </Link>

          <Link
            to="/marketplace"
            onClick={() => {
              setMenuOpen(false);
              window.scrollTo(0, 0);
            }}
          >
            Marketplace
          </Link>

          <button onClick={() => handleAuthNavigate("/messages")}>
            Messages
          </button>

          <button onClick={() => handleAuthNavigate("/my-listings")}>
            My Listings
          </button>

          {!user && (
            <button
              onClick={openSignIn}
              className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
            >
              Login
            </button>
          )}

          <XIcon
            onClick={() => setMenuOpen(false)}
            className="absolute right-6 top-6 size-8 cursor-pointer text-gray-500 hover:text-gray-700"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
