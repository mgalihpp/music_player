import { Link } from "react-router-dom";

const Register = () => {
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
          <form className="flex w-[50%] flex-col items-center justify-center gap-6 p-4">
            <h1 className="text-4xl font-bold">Register</h1>
            <input
              className="p-2 w-64 rounded-md"
              placeholder="user@email.email"
              type="email"
              name="email"
              id="email"
              autoComplete="off"
              required
            />
            <input
              className="p-2 w-64 rounded-md"
              placeholder="Enter Password"
              type="password"
              name="password"
              id="password"
              required
            />
            <button className="bg-green-500 hover:bg-green-500/90 w-28 py-1.5 font-bold rounded-md text-black">
              Register
            </button>
          </form>
          <div className="flex items-end justify-end">
            <span className="text-xs">
              Have account ?{" "}
              <Link to="/login" className="text-zinc-300 hover:text-zinc-200">
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
