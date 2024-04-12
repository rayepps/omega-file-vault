import { useEffect } from "react";
import { useAppState } from "./app";

export default function HydrateAppState() {
  const app = useAppState();
  useEffect(() => {
    app.hydrate();
  }, []);
  return null;
}
