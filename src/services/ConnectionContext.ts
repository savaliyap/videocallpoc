import { createContext, useContext } from "react";
import { ConnectionService } from "./ConnectionService";

export const ConnectionServiceContext = createContext<ConnectionService>(null);

export const useConnectionService = () => useContext(ConnectionServiceContext);