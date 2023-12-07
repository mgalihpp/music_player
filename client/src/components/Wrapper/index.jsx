import { Suspense, lazy } from "react";
import LoadingBar from "react-top-loading-bar";
import Loading from "../Loading";

const Login = lazy(() => import("../../pages/Auth/Login"));
const Main = lazy(() => import("../../pages/Home/Main"));
const UploadFile = lazy(() => import("./../../pages/UploadFile"));
const SingleMusicCard = lazy(() => import("../../components/SingleMusicCard"));
const SearchMusic = lazy(() => import("../../pages/SearchMusic"));
const CreatePlaylist = lazy(() => import("../Playlist/CreatePlaylist"));
const Playlist = lazy(() => import("../../pages/Playlist"));
const Category = lazy(() => import("../../pages/Category"));
const AudioPlayerComponent = lazy(() => import("../AudioPlayerComponents"));
const Navbar = lazy(() => import("./../Navbar/Navbar"));
const Footer = lazy(() => import("../../components/Footer"));
const Profile = lazy(() => import("../../pages/Profile"));
const About = lazy(() => import("../../pages/About"));

export const LoginWrapper = () => {
  return (
    <Suspense
      fallback={<LoadingBar color="#00a827" shadow={true} progress={100} />}
    >
      <Login />
    </Suspense>
  );
};

export const MainWrapper = () => {
  return (
    <Suspense
      fallback={<LoadingBar color="#00a827" shadow={true} progress={100} />}
    >
      <Main />
    </Suspense>
  );
};

export const UploadFileWrapper = () => {
  return (
    <Suspense
      fallback={<LoadingBar color="#00a827" shadow={true} progress={100} />}
    >
      <UploadFile />
    </Suspense>
  );
};

export const SingleMusicCardWrapper = () => {
  return (
    <Suspense
      fallback={<LoadingBar color="#00a827" shadow={true} progress={100} />}
    >
      <SingleMusicCard />
    </Suspense>
  );
};
export const SearchMusicWrapper = () => {
  return (
    <Suspense
      fallback={<LoadingBar color="#00a827" shadow={true} progress={100} />}
    >
      <SearchMusic />
    </Suspense>
  );
};
export const CreatePlaylistWrapper = () => {
  return (
    <Suspense
      fallback={<LoadingBar color="#00a827" shadow={true} progress={100} />}
    >
      <CreatePlaylist />
    </Suspense>
  );
};
export const PlaylistWrapper = () => {
  return (
    <Suspense
      fallback={<LoadingBar color="#00a827" shadow={true} progress={100} />}
    >
      <Playlist />
    </Suspense>
  );
};

export const CategoryWrapper = () => {
  return (
    <Suspense
      fallback={<LoadingBar color="#00a827" shadow={true} progress={100} />}
    >
      <Category />
    </Suspense>
  );
};
export const AudioPlayerComponentWrapper = () => {
  return (
    <Suspense
      fallback={<LoadingBar color="#00a827" shadow={true} progress={100} />}
    >
      <AudioPlayerComponent />
    </Suspense>
  );
};
export const NavbarWrapper = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Navbar />
    </Suspense>
  );
};

// export const TopNavbarWrapper = ({ position }) => {
//   return (
//     <Suspense fallback={<Loading />}>
//       <TopNavbar position={position} />
//     </Suspense>
//   );
// };

export const FooterWrapper = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Footer />
    </Suspense>
  );
};

export const ProfileWrapper = () => {
  return (
    <Suspense
      fallback={<LoadingBar color="#00a827" shadow={true} progress={100} />}
    >
      <Profile />
    </Suspense>
  );
};

export const AboutWrapper = () => {
  return (
    <Suspense
      fallback={<LoadingBar color="#00a827" shadow={true} progress={100} />}
    >
      <About />
    </Suspense>
  );
};
