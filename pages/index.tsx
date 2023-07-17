import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main>
      Page
      <br />
      {session?.user ? <div>Session</div> : <div>No Session</div>}
      <div className="flex flex-col">
        <button onClick={() => signIn()}>Sign in</button>
        <button onClick={() => signOut()}>Sign out</button>
        <button onClick={() => console.log(session)}>Log Session</button>
      </div>
    </main>
  );
}
