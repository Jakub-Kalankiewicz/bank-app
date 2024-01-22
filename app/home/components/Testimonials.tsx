interface TestimonialProps {
  testimonial: string;
  customerName: string;
  customerTitle: string;
  imageUrl: string;
}

export default function Testimonials({
  testimonial,
  customerName,
  customerTitle,
  imageUrl,
}: TestimonialProps) {
  return (
    <div
      className="p-8 rounded-xl max-w-xs  duration-500 cursor-pointer group-hover:blur-sm text-white mix-blend-luminosity hover:!blur-none group-hover:scale-[0.85] hover:!scale-100"
      style={{
        background: "linear-gradient(to top, #0a0f0d, #1a2a2d)",
      }}
    >
      <img src={imageUrl} alt="picture" className="h-20 mx-auto rounded-xl" />
      <h4 className=" text-xl font-bold mt-4 font-lora">{customerName}</h4>
      <h5 className="text-md mt-2 font-lora text-gold-400 italic">
        {customerTitle}
      </h5>
      <p className="text-sm leading-7 my-3 font-light opacity-50 font-lora">
        {testimonial}
      </p>
      {/* <button className="bg-gold-200 py-2.5 px-8 rounded-full text-black mt-4 font-lora text-md">
        See more
      </button> */}
    </div>
  );
}
