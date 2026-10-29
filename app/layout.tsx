import "./style.css";

export const metadata = {
  title: "BOB-NEW | Independent Demo",
  description: "Independent local finance-interface prototype using fictional sample data. Not an official bank application and not connected to banking or payment services.",
  icons: { icon: "/assets/daybook-mark.svg" },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
