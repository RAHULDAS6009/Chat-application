import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../config";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const navigate = useNavigate();
  async function onClick() {
    try {
      await axios.post(`${API}/user`, { name, email, password, pic });
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col w-96 gap-5 py-5 px-5 rounded-2xl border border-slate-500 ">
        <label>Name:</label>
        <input
          className="outline-none border border-slate-500"
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <label>Email:</label>
        <input
          type="text"
          className="outline-none border border-slate-500"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <label>Password:</label>
        <input
          type="text"
          className="outline-none border border-slate-500"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        {/* sent the url later photo */}
        <label>pic(url of Photo):</label>
        <input
          type="text"
          className="outline-none border border-slate-500"
          onChange={(e) => {
            setPic(e.target.value);
          }}
        />

        <button
          onClick={onClick}
          className="bg-green-500 hover:bg-green-400 rounded-2xl py-2 px-4 text-white"
        >
          Register
        </button>

        <Link className="text-xl text-green-500 cursor-pointer hover:text-blue-400 hover:underline" to={"/login"}>Login</Link>
      </div>
    </div>
  );
};

export default Register;
