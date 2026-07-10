import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, GraduationCap, LoaderPinwheelIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";


export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: false });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      return toast.error("Email and password are required.");
    }
    try {
      setLoading(true);
      await login(form.email, form.password);
      toast.success("Login successful");
      navigate("/admin");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen flex bg-slate-950">
        <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.18),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,.12),transparent_30%)]" />
          <div className="relative z-10 flex flex-col justify-center px-16 text-white">
            <div className="flex items-center gap-3 mb-8" data-aos='fade-down'>
              <GraduationCap size={52}/>
              <h1 className="text-5xl font-bold">SRAMS</h1>
            </div>
            <h2 className="text-3xl font-semibold mb-4" data-aos='fade-left'>Student Records & Academic Management System</h2>
            <p className="text-blue-100 leading-8" data-aos='fade-up'>
              Manage students, attendance, assessments, reports and academics from one modern platform.
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-slate-100 to-slate-200">
          <div className="w-full max-w-md rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-2xl p-8" data-aos='fade-right'>
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-4">
                <GraduationCap size={32}/>
              </div>
              <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
              <p className="text-slate-500 mt-2">Sign in to continue</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                  <Mail className="text-slate-400" size={20}/>
                  <input name="email" type="email" value={form.email} onChange={onChange}
                    placeholder="you@example.com"
                    className="ml-3 w-full bg-transparent outline-none"/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="flex items-center border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                  <Lock className="text-slate-400" size={20}/>
                  <input name="password" type={showPassword?"text":"password"} value={form.password}
                    onChange={onChange}
                    placeholder="••••••••"
                    className="ml-3 w-full bg-transparent outline-none"/>
                  <button type="button" onClick={()=>setShowPassword(!showPassword)}>
                    {showPassword?<EyeOff size={20}/>:<Eye size={20}/>}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="remember" checked={form.remember} onChange={onChange}/>
                  Remember me
                </label>
                <button type="button" className="text-blue-600 hover:underline">
                  Forgot password?
                </button>
              </div>

              <button disabled={loading}
                className="w-full flex items-center gap-2 bg-blue-600 justify-center hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl py-3 font-semibold transition">
                {loading ? (<><LoaderPinwheelIcon className="size-5 animate-spin" /> Signing In...</>) : "Sign In"}
              </button>
            </form>

            <p className="mt-8 text-center text-slate-600">
              Don't have an account?
              <button onClick={()=>navigate("/register")} className="ml-2 text-blue-600 font-semibold hover:underline">
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
