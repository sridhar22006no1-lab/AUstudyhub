"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  FileText,
  GraduationCap,
  Layers,
  Search,
  Bookmark,
  Menu,
  X,
  ShieldCheck,
  Building2,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/search", label: "Smart Search", icon: Search },
    { href: "/question-papers", label: "Question Papers", icon: FileText },
    { href: "/notes", label: "Notes", icon: BookOpen },
    { href: "/syllabus", label: "Syllabus", icon: Layers },
    { href: "/departments", label: "Departments", icon: Building2 },
    { href: "/dashboard", label: "My Hub", icon: Bookmark },
  ];

  const isActive = (href: string) => {
    if (href === "/search" && pathname.startsWith("/search")) return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-colors">
      {/* Top Banner Notice: Non-affiliation & independence */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" /> Independent Resource Platform
        </span>
        <span className="hidden sm:inline text-slate-400">|</span>
        <span className="hidden sm:inline text-slate-300">
          Not officially affiliated with Anna University. All curriculum citations point to public university records.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex items-center justify-center shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  AU<span className="text-blue-600">StudyHub</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  TN
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Academic Discovery Portal
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                    active
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Search shortcut / Admin jump */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/search"
              prefetch={false}
              className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search subjects (e.g. CS3251)...</span>
            </Link>
            <Link
              href="/admin"
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 px-2.5 py-1.5 rounded-lg transition-all"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-lg ${
                  active
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-blue-600" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between px-3 text-xs text-slate-500">
            <span>R2017 • R2021 • R2023 • R2025</span>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-blue-600 font-semibold hover:underline"
            >
              Admin Portal →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
