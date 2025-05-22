"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PersonStanding, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const AccessibilityMenuWidget = () => {
  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleAccesibilityMenuToggleKeyDown = (keyboardEvent: KeyboardEvent) => {
      const isMac: boolean = /Mac/i.test(navigator.userAgent) || navigator.platform.toUpperCase().includes("MAC");
      const ctrlKey: boolean = isMac ? keyboardEvent.metaKey : keyboardEvent.ctrlKey;

      if (ctrlKey && keyboardEvent.key.toLowerCase() === "a") {
        keyboardEvent.preventDefault();
        setIsAccessibilityMenuOpen((prev) => !prev);
      }
    };
  
    window.addEventListener("keydown", handleAccesibilityMenuToggleKeyDown);
    return () => window.removeEventListener("keydown", handleAccesibilityMenuToggleKeyDown);
  }, []);  

  return (
    <Sheet open={isAccessibilityMenuOpen} onOpenChange={setIsAccessibilityMenuOpen}>
      <SheetTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-10 z-50"
        >
          <button
            className="bg-blue-500 text-white p-4 rounded-full shadow-xl focus:outline-none"
            aria-label="Open Accessibility Menu"
          >
            <PersonStanding className="h-7 w-7 pointer-events-none" />
          </button>
        </motion.div>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 sm:w-96 p-0 [&>button]:hidden border-l-0">
        <div className="flex items-center justify-between mb-4 bg-blue-500 p-4">
          <div className="flex flex-row items-center gap-1">
            <Button 
              size="icon" 
              className="rounded-full bg-white hover:bg-white text-blue-500" 
              onClick={() => setIsAccessibilityMenuOpen(false)}
            >
              <X className="h-6 w-6 font-bold" />
            </Button>
            <div className="flex flex-col">
              <h2 className="text-md font-semibold ml-1 text-white">Accessibility Menu</h2>
              <h2 className="text-md font-semibold ml-1 text-white">(Ctrl + A)</h2>
            </div>
          </div>
          <Button className="rounded-full bg-white hover:bg-white py-2">
            <span className="pr-1 text-blue-500">EN</span>
            <ChevronDown className="h-6 w-5 text-blue-500 mt-[1px]" />
          </Button>
        </div>
        <Separator />
        <ScrollArea className="mt-4 h-[calc(100vh-10rem)] pr-2">
          <div className="space-y-4">
            <Button variant="secondary" className="w-full">
              Increase Font Size
            </Button>
            <Button variant="secondary" className="w-full">
              High Contrast Mode
            </Button>
            <Button variant="secondary" className="w-full">
              Screen Reader Help
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default AccessibilityMenuWidget;