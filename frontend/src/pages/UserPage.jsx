import { Navigate, useParams } from "react-router";
import { BadgeCheck, CalendarDays, Globe2, Mail, MapPin, MessageSquareText, ShieldCheck, Users } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";

const formatDate = (value) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-2xl bg-base-200/70 border border-base-300 p-4">
    <div className="rounded-xl bg-base-100 p-2 text-primary">
      <Icon className="size-5" />
    </div>
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-[0.2em] opacity-60">{label}</p>
      <p className="mt-1 font-medium break-words">{value || "Not set"}</p>
    </div>
  </div>
);

const UserPage = () => {
  const { id } = useParams();
  const { authUser, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (id && id !== authUser._id) {
    return <Navigate to={`/user/${authUser._id}`} replace />;
  }

  const friendCount = authUser.friends?.length || 0;
  const joinedDate = formatDate(authUser.createdAt);
  const updatedDate = formatDate(authUser.updatedAt);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-base-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-base-300 bg-base-200 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_35%)]" />
          <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:p-10">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="avatar mb-5">
                <div className="w-32 rounded-3xl ring-4 ring-base-100 shadow-lg">
                  <img src={authUser.profilePic} alt={authUser.fullName} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                  <h1 className="text-3xl font-bold sm:text-4xl">{authUser.fullName}</h1>
                  {authUser.isEmailVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                      <BadgeCheck className="size-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold text-warning">
                      <ShieldCheck className="size-4" />
                      Unverified
                    </span>
                  )}
                </div>

                <p className="max-w-xl text-sm leading-6 opacity-80">
                  {authUser.bio || "No bio added yet. Share a little about your language goals and interests."}
                </p>
              </div>

              <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:max-w-md">
                <div className="rounded-2xl bg-base-100/80 border border-base-300 p-4 text-left">
                  <p className="text-xs uppercase tracking-[0.2em] opacity-60">Friends</p>
                  <p className="mt-1 text-2xl font-bold">{friendCount}</p>
                </div>
                <div className="rounded-2xl bg-base-100/80 border border-base-300 p-4 text-left">
                  <p className="text-xs uppercase tracking-[0.2em] opacity-60">Onboarded</p>
                  <p className="mt-1 text-2xl font-bold">{authUser.isOnboarded ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <DetailRow icon={Mail} label="Email" value={authUser.email} />
              <DetailRow icon={MapPin} label="Location" value={authUser.location} />
              <DetailRow icon={Globe2} label="Native language" value={authUser.nativeLanguage} />
              <DetailRow icon={MessageSquareText} label="Learning" value={authUser.learningLanguage} />
              <DetailRow icon={CalendarDays} label="Joined" value={joinedDate} />
              <DetailRow icon={Users} label="Connections" value={`${friendCount} friends`} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-base-300 bg-base-200 p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Account details</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-base-100 px-4 py-3">
                <span className="opacity-70">Profile ID</span>
                <span className="font-mono text-xs break-all text-right">{authUser._id}</span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-base-100 px-4 py-3">
                <span className="opacity-70">Email verified</span>
                <span className="font-semibold">{authUser.isEmailVerified ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-base-100 px-4 py-3">
                <span className="opacity-70">Profile last updated</span>
                <span className="font-semibold">{updatedDate}</span>
              </div>
            </div>
          </div>

          {/* <div className="rounded-[2rem] border border-base-300 bg-base-200 p-6 shadow-lg">
            <h2 className="text-lg font-semibold">Profile summary</h2>
            <p className="mt-4 leading-7 opacity-80">
              This page shows the signed-in user&apos;s profile data pulled directly from the auth session.
              It includes identity details, language preferences, onboarding status, verification state,
              and timeline information so the current account can be reviewed in one place.
            </p>
          </div> */}
        </section>
      </div>
    </div>
  );
};

export default UserPage;