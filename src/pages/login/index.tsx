import { useState } from "react";
import { fetchLogin } from "../function/repository";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";





function Button({value, onClick}: any) {
    return (
      <button 
      onClick={onClick}
        className="mt-6 transition transition-all block py-3 px-4 w-full text-white font-bold rounded cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-400 hover:from-indigo-700 hover:to-purple-500 focus:bg-indigo-900 transform hover:-translate-y-1 hover:shadow-lg">
        {value}
    </button>
    )
}

function Input({type, id, name, label, placeholder, autofocus, onChange}: any) {

  return (
    <label className="text-gray-500 block mt-3">{label}
      <input
        autoFocus={autofocus}
        type={type} 
        id={id} 
        name={name} 
        placeholder={placeholder}
        onChange={(e) => onChange(e)}
        className="rounded px-4 py-3 w-full mt-1 bg-white text-gray-900 border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-100"/>
    </label>
  )
}

export default function LoginPage() {
  const [valueUname, setValueUname] = useState("");
  const [valuePass, setValuePass] = useState(""); 
  const router = useRouter();

  console.log(valueUname, valuePass, "<<<< value")


  async function login(e: any) {
    console.log("login")
    e.preventDefault();
    

    // fetchLogin(username, password)
    try {     
      const {data} =  await axios.get('/api/login', {
        params : {
          username: valueUname,
          password: valuePass
        }
      })
      // console.log(data, "<<<< data")
      if (data.length === 0) {
        alert("Username or password is wrong")
        return;
      }

      // set cookie to save the token
      const oneDay = 24 * 60 * 60 * 1000;
      const fiveSeconds = 5 * 1000;
      const fiveMinute = 5 * 60 * 1000;
      const dateNow = new Date().toLocaleString("id-ID", {timeZone: "Asia/Jakarta"})
      
      // console.log(dateNow, "<<<< dateNow")
      // console.log(expired, "<<<< expired")

      // cookies.set('token', data[0].username, {expires: Date.now() + oneDay})

      setCookie(null, 'token', data[0].username, {
        maxAge: fiveMinute,
        path: '/',
      })
      // localStorage.setItem("token", data[0].username)

      router.push('/')
    } catch (error) {
      
    }
}


    return (
        <div className="bg-gray-200 flex justify-center items-center h-screen w-screen">
        <div className=" border-t-8 rounded-sm border-indigo-600 bg-white p-12 shadow-2xl w-96">
          <h1 className="font-bold text-center block text-2xl">Log In</h1>
          <form>
          <Input type="username" id="username" name="username" 
          onChange={(e: any) => setValueUname(e.target.value)}
           label="Username" placeholder="your usernames" autofocus={true}/>
          <Input type="password" id="password" name="password" label="Password" placeholder="••••••••••"
            onChange={(e: any) => setValuePass(e.target.value)}
          />
          <Button value="Submit" onClick={login} />
          </form>
        </div>
      </div>
    );
}


