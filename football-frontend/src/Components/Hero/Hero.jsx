import footballImage from "../../assets/Images/football-hero-image.jpg";

export default function Hero() {
  return (
    <section className="text-white body-font">
      <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
        <img
          className="lg:w-2/6 md:w-3/6 w-5/6 mb-10 object-cover object-center rounded"
          alt="hero"
          src={footballImage}
        />
        <div className="text-center lg:w-2/3 w-full">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
            Elite Football Academy
          </h1>
          <p className="mb-8 leading-relaxed text-xl text-white">
            At Elite Football Academy, we shape players into professionals with
            world-class training, discipline, and passion.
          </p>
          <div className="flex justify-center"></div>
        </div>
      </div>
    </section>
  );
}
