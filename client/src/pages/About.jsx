const About = () => {
  return (
    <div className="mx-auto pt-16">
      <div className="flex flex-col gap-6 p-6 w-full sm:w-[600px] ">
        <h1 className="text-xl font-bold text-zinc-100">
          About This Application
        </h1>
        <p className="text-base text-zinc-200">
          <span className="font-semibold">Welcome to Music Player!</span>
          <br /> We were inspired by the sophistication and popularity of music
          services like Spotify in building{" "}
          <span className="font-semibold">Music Player</span>. By taking some
          inspiration from already successful concepts, we strive to provide a
          similar experience but with a unique twist and different features.
        </p>
        <p className="text-base text-zinc-200">
          <span className="font-semibold">Want to Find Out More?</span> <br />{" "}
          We are committed to providing an engaging experience for music lovers,
          but also value our authenticity and unique contribution in creating
          this app. <br />
          <br />
          Thank you{" "}
          {/* <span className="font-semibold">Music Player</span> as your loyal
          music listening companion. <br />
          <br />
          With an honest and transparent approach, you can still explain that
          your app is inspired by services like Spotify, while highlighting
          features or unique features that might differentiate your app from
          Spotify. */}
        </p>
      </div>
    </div>
  );
};

export default About;
