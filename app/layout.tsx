import "./style.css";
export const metadata = { title: "Daybook | BOB-NEW", description: "Independent sample finance workspace using fictional data." };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
