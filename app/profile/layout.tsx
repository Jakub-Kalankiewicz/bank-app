import NavBar from "../components/NavBar";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar height="15%" />
      {children}
    </>
  );
}
