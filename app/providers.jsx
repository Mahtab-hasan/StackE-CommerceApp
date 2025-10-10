
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }) {
  return (
    <AppContextProvider>
      <Toaster />
      {children}
    </AppContextProvider>
  )
}
