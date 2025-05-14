import { useEffect, useState } from "react";
import { Progress } from "./ui/progress";

const Loading = () => {
  const [progress, setProgess] = useState<number>(8);
  useEffect(() => {
    setTimeout(() => {
      setProgess(70);
    }, 2);
  });
  return (
    <div className="flex h-screen justify-center items-center text-3xl">
      <Progress
        className="font-doto text-gray-800 w-[50%] h-[100px]"
        value={progress}
      />
    </div>
  );
};

export default Loading;
