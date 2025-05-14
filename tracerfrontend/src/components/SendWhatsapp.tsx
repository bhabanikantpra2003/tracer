//
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";

type Props = {
  tosend: boolean;
  changeStatus: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
};
const SendWhatsapp = ({ tosend, changeStatus, text }: Props) => {
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const handlesendtext = async () => {
    try {
      const result = await axios.post(
        "http://localhost:3000/api/v1/images/sendtext",
        {
          messagetext: text,
          to: phoneNumber,
        }
      );

      console.log(result);
      changeStatus(false);
    } catch (e) {
      console.log("error occured at the frontend side, ", e);
    }
  };
  return (
    <Dialog open={tosend} onOpenChange={changeStatus}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-doto text-green-800 text-3xl">
            Share TO Your Friend
          </DialogTitle>
          {/* <DialogDescription>
                Make changes to your profile here. Click save when you're done.
            </DialogDescription> */}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="name"
              className="text-right font-doto text-[17px] text-green-800"
            >
              Phone-no
            </Label>
            <Input
              type="number"
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-transparent hover:bg-transparent cursor-pointer"
            onClick={handlesendtext}
          >
            <img className="w-6" src="/public/sendicon.svg" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendWhatsapp;
