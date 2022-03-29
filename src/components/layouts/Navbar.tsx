import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  disableBodyScroll,
  clearAllBodyScrollLocks,
  enableBodyScroll,
} from "body-scroll-lock";
import { FaTimes } from "react-icons/fa";
import { RiBarChartHorizontalLine } from "react-icons/ri";
import SiteLogo from "../SiteLogo";
import { navigationItems } from "../../globals";
import cls from "classnames";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const mobileNavELement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileNavELement.current) return;
    if (open) {
      disableBodyScroll(mobileNavELement.current);
    } else {
      enableBodyScroll(mobileNavELement.current);
    }
    return () => {
      clearAllBodyScrollLocks();
    };
  }, [open]);

  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  return (
    <div className="flex w-full flex-col lg:flex-row lg:items-center lg:justify-between py-5">
      <div className="flex flex-row items-center justify-between">
        <SiteLogo text="Cooked Rice" />
        <button
          title="Menu"
          onClick={openMenu}
          arial-label="Menu"
          className="lg:hidden cursor-pointer border rounded-full p-2 hover:bg-red-50 transition-colors
            duration-150"
        >
          <RiBarChartHorizontalLine className="h-6 w-6" />
        </button>
      </div>
      <nav
        ref={mobileNavELement}
        className={cls(
          "fixed lg:relative w-full h-full inset-0 bg-white lg:bg-transparent transition-all duration-200",
          "overflow-hidden text-gray-800 capitalize z-50 lg:z-auto flex flex-col",
          "items-center border-x-8 border-red-700 lg:border-none",
          { "flex": open, "hidden lg:flex": !open }
        )}
      >
        <button
          onClick={closeMenu}
          title="close"
          className="block ml-auto m-8 lg:hidden cursor-pointer border rounded-full p-2
            hover:bg-red-50 transition-colors duration-150"
        >
          <FaTimes className="h-5 w-5 text-red-600" />
        </button>
        <ul className="flex flex-col lg:flex-row lg:justify-end lg:items-center">
          {navigationItems.map((nav) => (
            <li key={nav.id}>
              <a
                href={nav.href}
                className="block text-left p-1 mb-8 lg:mb-0 hover:underline transition-colors ease-linear text-2xl
                  lg:text-lg font-semibold lg:ml-3"
                onClick={closeMenu}
              >
                {nav.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
