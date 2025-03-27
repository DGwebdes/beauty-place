import React, { useRef, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { gsap } from "gsap";

const Hero = () => {
    const boxRef = useRef();

    useEffect(() => {
        gsap.fromTo(
            boxRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 2 },
        );
    }, []);

    return (
        <section
            id="hero"
            className="h-screen flex justify-center items-center gap-10 border-t-1"
            ref={boxRef}
        >
            <div className="w-full p-2 place-items-center">
                <div className="w-[250px] md:w-[350px] xl:w-[450px]">
                    <img src="../../hero.png" alt="hero-image" />
                </div>
                <div className="flex flex-col gap-5 relative items-center">
                    <h1 className="font-[Boldonse] text-6xl sm:text-7xl md:text-9xl absolute bottom-36 sm:bottom-42 md:bottom-46 lg:bottom-40 xl:bottom-32">
                        Hello <span className="text-amber-500">Sunshine</span>
                    </h1>
                    <p className="text-lg md:text-3xl mt-5 w-[80%] lg:w-full">
                        Hey there! Welcome to [Studio Name], your cozy little
                        escape for all things beauty.
                    </p>
                    <ScrollLink
                        to="work"
                        smooth={true}
                        duration={500}
                        offset={-30}
                        className="p-1 border-2 rounded-xl md:text-2xl bg-violet-400 hover:bg-blue-50 transition duration-500 hover:cursor-pointer w-[50%] text-center"
                    >
                        Discover
                    </ScrollLink>
                    {/* <button className="p-1 border-2 rounded-xl md:text-2xl bg-violet-400 hover:bg-blue-50 transition duration-500 hover:cursor-pointer w-[50%]"></button> */}
                </div>
            </div>
        </section>
    );
};

export default Hero;
