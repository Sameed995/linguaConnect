import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resendOtp, verifyOtp } from "../lib/api";

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [infoMessage, setInfoMessage] = useState(location.state?.message || "");

  const verifyMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/", { replace: true });
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendOtp,
    onSuccess: (response) => {
      setInfoMessage(response.message);
    },
  });

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await verifyMutation.mutateAsync({ email, otp });
    } catch (error) {
      return error;
    }
  };

  const handleResend = async () => {
    try {
      await resendMutation.mutateAsync({ email });
    } catch (error) {
      return error;
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-3xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        <div className="w-full p-4 sm:p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Verify Email
            </span>
          </div>

          {infoMessage && (
            <div className="alert alert-info mb-4">
              <span>{infoMessage}</span>
            </div>
          )}

          {verifyMutation.error && (
            <div className="alert alert-error mb-4">
              <span>{verifyMutation.error.response?.data?.message || "Verification failed"}</span>
            </div>
          )}

          {resendMutation.error && (
            <div className="alert alert-error mb-4">
              <span>{resendMutation.error.response?.data?.message || "Unable to resend code"}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="w-full">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Enter the verification code</h2>
                <p className="text-sm opacity-70">
                  We sent a six-digit code to your email address.
                </p>
              </div>

              <div className="space-y-3">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    placeholder="john@gmail.com"
                    className="input input-bordered w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Verification code</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="123456"
                    className="input input-bordered w-full tracking-[0.4em] text-center"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button className="btn btn-primary w-full" type="submit" disabled={verifyMutation.isPending}>
                {verifyMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </button>

              <button
                type="button"
                className="btn btn-ghost w-full"
                onClick={handleResend}
                disabled={resendMutation.isPending || !email}
              >
                {resendMutation.isPending ? "Sending new code..." : "Resend code"}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm">
                  Already verified?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;