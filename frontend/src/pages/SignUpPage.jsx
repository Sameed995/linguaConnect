import React from 'react';
import {useState} from 'react';
import {MessageCircleMore} from "lucide-react";
import { Link } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import {axiosInstance} from '../lib/axios.js';
import { useQueryClient } from '@tanstack/react-query';

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {mutate, isPending, error} = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post('/auth/signup',signupData); 
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    }
  });

  const handleSignup = (e) => {
    e.preventDefault();
    mutate();
    // console.log(signupData);
  }
  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="light">
       <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-2xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
       
       {/* SignUp Form */}
        <div className="w-full lg:w-1/1 p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
            <MessageCircleMore className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Learn New Languages
            </span>
          </div>
          <div className="w-full">
            <form onSubmit={handleSignup} className="w-full flex flex-col gap-4">
              <div className ="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create Account</h2>
                  <p className="text-sm opacity-70">
                    Join this platform and start learning new languages with native speakers around the world.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="input input-bordered w-full"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="input input-bordered w-full"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="input input-bordered w-full"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      required
                    />
                    <p className="text-xs opacity-70 mt-1">
                      Password must be at least 6 characters long and contain a mix of uppercase, lowercase, numbers, and special characters.
                    </p>
                  </div>
                  <div className="form-control">
                    <label className="cursor-pointer label justify-start gap-2">
                      <input type="checkbox" className="checkbox checkbox-sm" required />
                      <span className="text-xs leading-tight">
                        I agree to the {""}
                        <span className="text-primary hover:underline">Terms and Conditions</span> and {""}
                        <span className="text-primary hover:underline">Privacy Policy</span>
                      </span>
                    </label>
                  </div>
                </div>
                <button className="btn btn-primary w-full" type="submit">{isPending ? "Signing Up..." : "Sign Up"}
                </button>
                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Log in
                    </Link>
                  </p>
                </div>
              </div>  
            </form> 

          </div>
        </div>
        </div>
      
    </div>
  )
}

export default SignUpPage;