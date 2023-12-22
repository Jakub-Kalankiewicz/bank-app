// const links = [
//   { name: "About us", href: "#" },
//   { name: "Our values", href: "#" },
//   { name: "Our offer", href: "#" },
//   { name: "Meet our leadership", href: "#" },
// ];
const stats = [
  { name: "Offices worldwide", value: "12" },
  { name: "Years in Business", value: "25" },
  { name: "Satisfied Clients", value: "50,000+" },
  { name: "Full-time employees", value: "300+" },
];

const Hero = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-32">
      <div className="mx-auto max-w-6xl lg:mx-0">
        <h2 className="text-4xl font-bold tracking-wide text-black sm:text-6xl up font-lora">
          You can trust us
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-500">
          Prosperity Nexus Bank stands at the forefront of the financial
          services industry, redefining the essence of banking in the modern
          era. As a beacon of innovative financial solutions, we are committed
          to merging the latest in cutting-edge technology with a tailored
          approach to customer service. Our institution prides itself on
          creating a seamless and secure banking experience that caters to the
          unique needs of each client. With a robust digital platform that
          ensures your banking is as mobile as you are, we offer an array of
          services ranging from personal savings and investment portfolios to
          business and corporate financial strategies.
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
        <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="flex flex-col-reverse">
              <dt className="text-base leading-7 text-gray-500">{stat.name}</dt>
              <dd className="text-2xl font-bold leading-9 tracking-tight text-black">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default Hero;
