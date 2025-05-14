import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";

import { useEffect, useState } from "react";
import SendWhatsapp from "./SendWhatsapp";
const Popup = ({
  isImageLoaded,
  fileObject,
}: {
  isImageLoaded: boolean;
  fileObject: File | undefined;
}) => {
  const [Open, setOpen] = useState<boolean>(true);
  const [preview, setPreview] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);
  const [sendwhatsapp, setsendWhatsapp] = useState<boolean>(false);
  const handleExtract = async () => {
    //we have the fileobject here , so we only have to sen the fileobject as form data to the backend to get the text
    if (!fileObject) {
      return;
    }
    const formdata = new FormData();
    formdata.append("filetobeused", fileObject);

    try {
      const result = await axios.post(
        "http://localhost:3000/api/v1/images/gettext",
        formdata
      );

      console.log("the result of the image upload is: ", result.data.data);
      setText(result.data.data);
      setDone(true);
    } catch (e) {
      console.log("error happended while receiving the text: ", e);
    }
  };
  useEffect(() => {
    if (!fileObject) {
      return;
    }
    const imageurl = URL.createObjectURL(fileObject);
    setPreview(imageurl);

    return () => {
      URL.revokeObjectURL(imageurl);
    };
  }, [fileObject]);
  return (
    <>
      {sendwhatsapp && (
        <SendWhatsapp
          tosend={sendwhatsapp}
          changeStatus={setsendWhatsapp}
          text={text}
        />
      )}
      {done === true ? (
        <>
          <AlertDialog open={done} onOpenChange={setDone}>
            {/* <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      // </AlertDialogTrigger> */}
            {/* --> not needed 😂   */}
            <AlertDialogContent>
              <AlertDialogTitle />
              <AlertDialogHeader>
                <AlertDialogDescription>
                  <Textarea
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                    }}
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="font-doto text-3xl ">
                <AlertDialogAction
                  className="cursor-pointer"
                  onClick={() => {
                    setDone(false);
                  }}
                >
                  cancel
                </AlertDialogAction>
                <AlertDialogCancel className="text-gray-800 cursor-pointer">
                  Save
                </AlertDialogCancel>
                <AlertDialogAction className=" bg-transparent hover:bg-transparent cursor-pointer">
                  <div
                    className="size-7"
                    onClick={() => {
                      setsendWhatsapp(true);
                    }}
                  >
                    <img className="w-full" src="/public/whatsapp.svg" />
                  </div>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <AlertDialog open={Open && isImageLoaded} onOpenChange={setOpen}>
          {/* <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      // </AlertDialogTrigger> */}
          {/* --> not needed 😂   */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                <div>
                  <img src={preview} />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="font-doto text-3xl">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleExtract}>
                Extract with tracer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default Popup;
