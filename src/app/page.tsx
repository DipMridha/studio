
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/chat');
  return null; // redirect() is a server-side function that doesn't render anything
}
