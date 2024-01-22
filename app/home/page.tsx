"use client";

import { useRouter } from "next/navigation";
import Box from "../components/Box";
import Hero from "./components/Hero";
import Testimonials from "./components/Testimonials";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const customerTestimonials = [
  {
    testimonial:
      "As a first-time homebuyer, the mortgage process seemed daunting, but Prosperity Nexus Bank made it incredibly smooth and understandable. Their patient guidance and competitive rates were invaluable.",
    customerName: "James L.",
    customerTitle: "Retired Professional",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    testimonial:
      "As a first-time homebuyer, the mortgage process seemed daunting, but Prosperity Nexus Bank made it incredibly smooth and understandable. Their patient guidance and competitive rates were invaluable.",
    customerName: "Sofia P.",
    customerTitle: "International Trade Manager",
    imageUrl:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    testimonial:
      "As a first-time homebuyer, the mortgage process seemed daunting, but Prosperity Nexus Bank made it incredibly smooth and understandable. Their patient guidance and competitive rates were invaluable.",
    customerName: "Ethan T.",
    customerTitle: "New Homeowner",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

export default function Home() {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.status === "unauthenticated") {
      router.push("/");
    }
  }, [session?.status, router]);
  return (
    <>
      {session.data?.user.name && (
        <Box>
          <section>
            <Hero />
          </section>
          <section className="mx-auto max-w-7xl px-6 lg:px-8 mb-32 py-10">
            <h2 className="text-4xl font-bold tracking-wide text-black sm:text-6xl up font-lora">
              Testimonials
            </h2>
            <div className="flex max-w-5xl justify-center items-center mx-auto gap-12 group mt-10 text-center">
              {customerTestimonials.map((testimonial) => (
                <Testimonials
                  key={testimonial.customerName}
                  testimonial={testimonial.testimonial}
                  customerName={testimonial.customerName}
                  customerTitle={testimonial.customerTitle}
                  imageUrl={testimonial.imageUrl}
                />
              ))}
            </div>
          </section>
        </Box>
      )}
    </>
  );
}
