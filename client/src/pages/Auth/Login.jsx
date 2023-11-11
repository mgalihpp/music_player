import { useRef, useState } from "react";
import { host } from "./../../utils";
import { useAuth } from "../../Context/AuthContext";

const Login = () => {
  const [auth, setAuth] = useState("login");
  const { setUser, setUserId } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const userRef = useRef();
  const pwdRef = useRef();

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      const formdata = new FormData();
      formdata.append("username", username);
      formdata.append("password", password);
      const res = await fetch(`${host}auth/${auth}`, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Methods": "POST",
        },
        body: formdata,
      });
      if (res.ok) {
        const data = await res.json();
        const { user_id } = data;
        // Save user ID to local storage
        localStorage.setItem("user_id", user_id);

        // Set the state
        setUserId(user_id);
        setUser(true);
        // Return a success response
        return { success: true, data };
      }
      if (!res.ok) {
        return "erorr";
      }
    } catch (error) {
      console.error(error);
    } finally {
      userRef.current.value = "";
      pwdRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-row justify-center items-center h-screen w-screen mx-auto">
      <div className="flex flex-row items-center w-[800px] h-[500px] bg-zinc-900 rounded-md ">
        <div className="w-[50%] flex flex-col items-center justify-evenly border-r h-full border-zinc-700">
          <img src="/vite.svg" alt="logo" width={150} height={150} />
          <div className="flex items-center justify-center flex-col gap-1">
            <h1 className="text-4xl font-semibold bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              Music Player
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mx-auto space-y-2">
          <form
            onSubmit={handleAuth}
            className="flex w-[50%] flex-col items-center justify-center gap-6 p-4"
          >
            <h1 className="text-4xl font-bold">
              {auth === "login" ? "Login" : "Register"}
            </h1>
            <input
              className="p-2 w-64 rounded-md"
              placeholder="user@email.email"
              type="text"
              name="username"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
              ref={userRef}
              autoComplete="off"
              required
            />
            <input
              className="p-2 w-64 rounded-md"
              placeholder="Enter Password"
              type="password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              ref={pwdRef}
              required
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-500/90 w-28 py-1.5 font-bold rounded-md text-black"
            >
              {auth === "login" ? "Login" : "Register"}
            </button>
          </form>
          <div className="flex items-end justify-end">
            <span className="text-xs">
              {auth === "login" ? "Doesn't have account ? " : "Have Account ? "}
              <button
                onClick={() =>
                  setAuth((prevAuth) =>
                    prevAuth === "login" ? "register" : "login"
                  )
                }
                className="text-zinc-300 hover:text-zinc-200"
              >
                {auth === "login" ? "Register" : "Login"}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;