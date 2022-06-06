import Link from "next/link";
import { useState } from "react"
import { navRoutes } from "./nav";

export default function Hamburger() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
    }
    return (
        <>
            <div onClick={handleOpen} className="w-[3.5rem] h-[2.75rem] cursor-pointer flex flex-col items-center justify-between mr-2">
                {
                    
                    <>
                        <span className={`h-[0.35rem] rounded-lg bg-[#cecdcdfa] transition-all w-full`} style={{transformOrigin: "0% 0%", transform: open ? "rotate(45deg) translate(0.5325rem, -0.5325rem)" : ""}}></span>
                        <span className={`h-[0.35rem] rounded-lg bg-[#cecdcdfa] transition-all w-${!open ? "full" : "[0rem]"}`}></span>
                        <span className={`h-[0.35rem] rounded-lg bg-[#cecdcdfa] transition-all w-full`} style={{transformOrigin: "0% 100%", transform: open ? "rotate(-45deg) translate(0.5325rem, 0.5325rem)" : ""}}></span>
                    </>
                }
            </div>
            <div className="w-full bg-[#161c24] transition-all duration-200 flex flex-col justify-center items-center" style={{
                height: "calc(100vh - 96px)",
                top: "96px",
                position: "absolute",
                right: open ? "0%" : "100%"
            }}>
                {
                    navRoutes.map(({name, href}, index) => (
                        <Link passHref href={href} key={`nav-${index}`} >
                            <div
                                style={{
                                    textDecorationSkipInk : "none",
                                }}
                                className="nav-div p-4 text-white rounded-lg text-xl cursor-pointer h-[60px] underline decoration-[#00a3ac] decoration-[4px] underline-offset-1"
                            >{name}</div>
                        </Link>
                    ))
                }
            </div>
        </>
    )
}