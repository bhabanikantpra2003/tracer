import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router";

const userSchema = z.object({
  name: z.string(),
  email: z.string().email().min(4).max(40),
  password: z.string().min(3),
});

type proptype = {
  type: string;
};
const Loginform = ({ type }: proptype) => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof userSchema>) {
    try {
      let url;
      if (type == "signin") {
        url = "http://localhost:3000/api/v1/users/signin";
      } else {
        url = "http://localhost:3000/api/v1/users/signup";
      }
      const response = await axios.post(url, values);
      localStorage.setItem("jwtToken", response.data.token);
      //console.log("the response after onsubmit ", response);
      navigate("/");
    } catch (e) {
      console.log("error happend on the onsubmit frontend side ", e);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="justify-center  mt-[10px]">
              <FormControl>
                <Input
                  className="w-[300px] text-white"
                  placeholder="name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="justify-center  mt-[10px]">
              <FormControl>
                <Input
                  className="w-[300px] text-white"
                  placeholder="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="justify-center  mt-[10px] mb-[35px]">
              <FormControl>
                <Input
                  className="w-[300px] text-white"
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="bg-gradient-to-r from-[#2b2ec5] to-[#d17c72] w-[90px] h-[40px] ml-[202px] cursor-pointer  "
          type="submit"
        >
          {type == "signup" ? "Signup" : "Login In"}
        </Button>
      </form>
    </Form>
  );
};

export default Loginform;
