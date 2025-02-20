import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/auth/logIn";

export default function page() {

  return (
    <div className="w-full h-screen bg-[#ebf3ff] bg-opacity-50 flex items-center justify-center shadow-xl flex-col mintablet:px-4">
      <Link href="/" className="mb-8">
        <Image
          src="/assets/image/nurse_logo.png"
          alt="nurse_logo"
          width={145}
          height={48}
        />
      </Link>
      <div className="bg-white  max-w-[528px] w-full py-10 px-8 rounded-xl shadow-lg xl:px-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Welcome Back !
        </h2>
         <LoginForm/>
      </div>
    </div>
  );
}
