import React from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = ({ title }: { title: string }) => {
  return (
    <header className="mb-3 w-full border-b border-gray-700 bg-gray-800">
      <div className="mx-auto flex items-center justify-between py-4 pr-4 pl-4 sm:pr-6 lg:pr-8">
        <div className="gap-2d flex items-center">
          <SidebarTrigger />
          <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
