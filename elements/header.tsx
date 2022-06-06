import Image from "next/image";
import Link from "next/link";
import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Hamburger from "./hamburger";
import Nav from "./nav";

export default function Header({ transparent }: { transparent: boolean}) {
  const router = useRouter();
  const [dimensions, setDimensions] = useState({
    y: 0,
    x: 0,
  });

  useEffect(function () {
    setDimensions({
      y: window.innerHeight,
      x: window.innerWidth,
    });
    window.addEventListener("resize", () => {
      setDimensions({
        y: window.innerHeight,
        x: window.innerWidth,
      });
    });
    if(transparent) {
      document.addEventListener("scroll", (e) => {
        const scroll = window.scrollY;
        if (scroll !== 0) {
          document.querySelector("header").classList.add("moreBackdropFilter");
        } else if (scroll === 0) {
          document.querySelector("header").classList.remove("moreBackdropFilter")
        }
      });
    } else {
      document.querySelector("header").classList.add("backdropFilter");
      document.addEventListener("scroll", (e) => {
        const scroll = window.scrollY;
        if (scroll !== 0) {
          document.querySelector("header").style.backgroundColor = "#00366600";
        } else if (scroll === 0) {
          document.querySelector("header").style.backgroundColor =
            "rgb(22 28 36 / var(--tw-bg-opacity))";
        }
      });
    }
  }, []);
  return (
    <>
      <header
        style={{ zIndex: 99999 }}
        className={`h-24 transition-all z-[99999] w-full ${transparent ? 'bg-transparent' : 'bg-[#161c24]'} border-b-[3px] ${router.asPath === "/" ? "border-[#00a4ac94]" : "border-[#00a3ac]"} fixed flex items-center justify-between`}
      >
        <button
          id="logo-button"
          className={`z-[100001] w-[140px] h-[80px] ${
            dimensions.x < 730 ? "image-container" : ""
          }`}
        >
          <Image
            style={JSON.parse(
              JSON.stringify({
                WebkitUserDrag: "none",
              })
            )}
            src="/logo.png"
            alt="logo"
            width="140"
            height="80"
            className={`w-[288px] h-full flex items-center ml-2 cursor-pointer`}
          />
        </button>
        {dimensions.x < 750 ? (
          <>
            <button
              className="bg-[#00a3ac] cursor-pointer mr-4 hover:bg-[#035f7b cursor-pointer rounded-[8px] transition-all text-white font-bold text-base"
              onClick={() => router.replace("/login")}
            >
              <div
                className={`w-full cursor-pointer h-full pt-2 pb-2 pr-5 pl-5 rounded-[8px]`}
                data-animation="ripple"
              >
                Login
              </div>
            </button>
            <Hamburger />
          </>
        ) : (
          <>
            <Nav slug={router.asPath.toLocaleLowerCase()}></Nav>
            <button
              className="bg-[#00a3ac] z-[100001] mr-4 hover:bg-[#035f7b cursor-pointer rounded-[8px] transition-all text-white font-bold text-base"
              onClick={() => router.replace("/login")}
            >
              <div
                className={`w-full h-full pt-2 pb-2 pr-5 pl-5 rounded-[8px]`}
                data-animation="ripple"
              >
                Login
              </div>
            </button>
          </>
        )}
      </header>
    </>
  );
}
