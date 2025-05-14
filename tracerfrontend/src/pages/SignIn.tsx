import { Button } from "@/components/ui/button";
import Loginform from "@/components/Loginform";

import { Link } from "react-router-dom";
import image from "../../public/lenicon.png";
const SignIn = () => {
  return (
    <div style={{ backgroundImage: "url('/blurry-gradient-haikei (4).svg')" }}>
      <div
        className="flex  h-screen 
"
      >
        <div className="flex-1 basis-0 flex flex-col   p-[60px] ">
          <div className=" flex">
            <Link className="flex-1 basis-0 flex  text-white " to="/homepage">
              <img src={image} className="w-[38px] " />
              Tracer
            </Link>
            <span className=" flex-grow -[1]  items-center flex gap-6 basis-0 ">
              <span className=" text-white relative inline-block after:block after:absolute after:top-7 after:left-1/2 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-90 after:ease-out hover:after:w-full hover:after:left-0">
                Are you a new user?
              </span>
              <Link
                to="/auth/signup"
                className="text-white border-4 rounded-md pl-[10px] pr-[10px] pt-[5px] pb-[5px]"
              >
                SignUp
              </Link>
            </span>
          </div>
          {/* this is for the signIn form   */}
          <div className=" text-white mt-[60px] text-center">
            <h2 className=" font-bold text-3xl">Welcome Back</h2>
            <span className=" text-gray-400 font-extralight">
              Sign in to your Tracer account
            </span>
          </div>
          {/* import the form component here */}
          <Loginform type="signin" />

          <div className=" flex justify-around items-center gap-[20px] mt-10 pr-[60px] pl-[60px]">
            <span className="font-extralight cursor-pointer font-stretch-200% text-gray-400">
              Forgot Password ?
            </span>
            <Button className="bg-gradient-to-r from-[#bc9237] to-[#a8392d] cursor-pointer ">
              Reset Password
            </Button>
          </div>
        </div>
        <div className="flex-0 basis-[44%] h-full">
          {/* this is the image place */}
          <img
            src="/loginiamge.svg"
            alt="homepage Image"
            className="min-h-full min-w-full object-cover  "
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
