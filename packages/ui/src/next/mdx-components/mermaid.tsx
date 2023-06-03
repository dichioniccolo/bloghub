import { useEffect } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
});

type MermaidProps = {
  readonly chart: string;
};

export const Mermaid = ({ chart }: MermaidProps): JSX.Element => {
  useEffect(() => mermaid.contentLoaded(), []);

  return <div className="mermaid">{chart}</div>;
};
