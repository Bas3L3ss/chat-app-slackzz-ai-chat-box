import MainContent from "@/components/main-content";
import { ColorPrefrencesProvider } from "@/providers/color-preferences";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { WebSocketProvider } from "@/providers/web-socket";
import { FC, ReactNode } from "react";

const MainLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WebSocketProvider>
        <ColorPrefrencesProvider>
          <MainContent>
            <QueryProvider>{children}</QueryProvider>
          </MainContent>
        </ColorPrefrencesProvider>
      </WebSocketProvider>
    </ThemeProvider>
  );
};
export default MainLayout;
