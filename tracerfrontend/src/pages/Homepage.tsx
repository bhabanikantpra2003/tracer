/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link, useNavigate } from "react-router-dom";
import image from "../../public/lenicon.png";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import Popup from "@/components/Popup";
import Loading from "@/components/Loading";

const Homepage = () => {
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [loading, setloading] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const handleFileUpload = async (e: any) => {
    //here what will we do , first we will get the file from e.target.files[0]
    setloading(true);
    const token = localStorage.getItem("jwtToken");
    console.log("handleuplaod called");
    const currentFileObject = e.target.files[0];
    setFile(currentFileObject);
    console.log("currentFileObject is ", { currentFileObject });
    //then make a request to the backend to handle the task by sending this file along with the request
    const formdata = new FormData();
    formdata.append("file", currentFileObject);
    const response = await axios.post(
      "http://localhost:3000/api/v1/images/uploadFile",
      formdata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("response is ", response);
    setloading(false);
    setImageLoading(true);
    //in the backend , upload the file first to the appwrite storage and then to the db
    //and for the mean time we will show some kind on loader
  };
  type usertype = {
    name: string;
  };
  const navigate = useNavigate();
  const [user, setUser] = useState<usertype>();
  const token = localStorage.getItem("jwtToken");
  useEffect(() => {
    const fetch_user = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userdetails = response.data.data.user;
        setUser(userdetails);
      } catch {
        navigate("/auth/signup");
      }
    };
    fetch_user();
  }, [navigate, token]);
  return (
    <>
      {loading === true ? (
        <Loading />
      ) : (
        <>
          <Popup isImageLoaded={imageLoading} fileObject={file} />

          <div className="flex flex-col min-w-screen min-h-screen items-center bg-[linear-gradient(to_top,_#09203f_0%,_#537895_100%)] ">
            {/* <div>this is for header section</div> */}
            <div className="flex items-center justify-between gap-6  mt-[19px] min-w-full pl-[80px] pr-[80px] pt-[12 px]">
              <Link
                className=" flex  text-black font-doto  font-bold text-4xl gap-[2px ]justify-center items-center cursor-pointer "
                to="/homepage"
              >
                <img src={image} className="w-[45px] " />
                Tracer
              </Link>

              <Link
                to="/history"
                className="text-gray-400 hover:text-gray-800 transition-colors duration-[550ms] cursor-pointer font-doto font-semibold text-4xl mr-[118px]"
              >
                HISTORY
              </Link>

              <div className="font-semibold font-doto text-4xl text-gray-300">
                {user?.name}
              </div>
            </div>
            {/* <div>this is for the main section</div> */}
            <div className="flex  flex-col items-center mt-[160px]   ">
              <h1 className="font-doto text-6xl font-medium w-[70%] text-center text-gray-400  ">
                <img
                  src="/binocularimagecopy.svg"
                  className="w-[380px]   absolute top-40 left-3"
                />
                Just extract it with Tracer
              </h1>
              <span className="font-mono text-4xl text-gray-500 ">
                the tool loved by students
              </span>
            </div>
            {/* <div>here there will be the input form</div> */}

            <div className="relative group cursor-pointer mt-[90px] ">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-violet-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative px-7 py-6 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6 ">
                <div className="space-y-2">
                  <Input
                    className="cursor-pointer text-white"
                    type="file"
                    name="fileupload"
                    onChange={(e) => handleFileUpload(e)}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Homepage;
