"use client";
import {
  ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { FcGoogle } from "react-icons/fc";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Courses",
      link: "/courses",
    },
    {
      name: "About",
      link: "/about",
    },
  ];
  return (
    <div className="relative  w-full">
      <ResizableNavbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-1">
            <NavbarButton variant="invisible">
              <ThemeToggle />
            </NavbarButton>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <NavbarButton
                  variant="primary"
                  className="bg-gray-100 dark:bg-white dark:text-black flex items-center justify-center"
                >
                  <FcGoogle className="mr-2" size={20} />
                  Sign in
                </NavbarButton>
              </SignInButton>
            </SignedOut>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-4">
              <ThemeToggle className="border-none" />
              <SignedIn>
                <UserButton />
              </SignedIn>
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <SignedOut>
                <SignInButton>
                  <NavbarButton
                    variant="primary"
                    className="bg-gray-100 dark:bg-white dark:text-black flex items-center justify-center"
                  >
                    <FcGoogle className="mr-2" size={20} />
                    Sign in
                  </NavbarButton>
                </SignInButton>
              </SignedOut>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </ResizableNavbar>
    </div>
  );
}
