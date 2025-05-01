import { Bell, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/sidebar";
import { useState } from "react";

export function TopNav() {
  const { toggleSidebar } = useSidebar();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background px-4 shadow-sm md:px-6 lg:px-8">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <Menu className="h-4 w-4" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      {/* <div className="relative hidden md:flex w-full max-w-sm items-center">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg pl-8 md:w-[300px] lg:w-[400px]"
        />
      </div> */}
      <div className="ml-auto flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            3
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-0"
            >
              <User className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setProfileModalOpen(true)}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                localStorage.removeItem("token");
                // Clear user data from local storage
                window.location.href = "/login"; // Redirect to login page
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
