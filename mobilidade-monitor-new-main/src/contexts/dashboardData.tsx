import {
  createContext,
} from "react";
import { FullyContextData, UserGroupContextData, UserTypeContextData } from "../@types/context";

export const FullyContext = createContext<FullyContextData | undefined>(undefined);

export const UserGroupContext = createContext<UserGroupContextData | undefined>(undefined)

export const UserTypeContext = createContext<UserTypeContextData | undefined>(undefined)
