/* eslint-disable @next/next/link-passhref */
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";

export const navRoutes = [
    {
        href: "/",
        name: "Home"
    },
    {
        href: "/about",
        name: "About"
    },
    {
        href: "/statistics",
        name: "Statistics"
    },
    {
        href: "/statistics/map",
        name: "Map"
    },
    {
        href: "/contact-us",
        name: "Contact Us"
    }
]

const widths = [
    52.609,
    52.961,
    80.453,
    38.578,
    98.359,
];
const margins = [
    0,
    widths[1 - 1] + 32*1,
    widths[1 - 1] + widths[2 - 1] + 32*2,
    widths[1 - 1] + widths[2 - 1] + widths[3 - 1] + 32*3,
    widths[1 - 1] + widths[2 - 1] + widths[3 - 1] + widths[4 - 1] + 32*4,
    widths[1 - 1] + widths[2 - 1] + widths[3 - 1] + widths[4 - 1] + widths[5 - 1] + 32*4,
]

export default function Nav({
    slug
}: {
    slug: string;
}) {
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const router = useRouter();
    let home = router.asPath === "/"
    let calculatedPreLocation = false
    let preLocation = -1;
    console.log(`${router.asPath.trim()}`)
    if(!calculatedPreLocation) {
        console.log(slug)
        switch(slug) {
            case("/"):
                console.log("caught")
                preLocation = 0;
                calculatedPreLocation = true;
                break;
            case("/about"):
                preLocation = 1;
                calculatedPreLocation = true;
                break;
            case("/statistics"):
                preLocation = 2;
                console.log("?", slug)
                calculatedPreLocation = true;
                break;
            case("/statistics/map"):
                preLocation = 3;
                calculatedPreLocation = true;
                break;
            case("/contact-us"):
                preLocation = 4;
                calculatedPreLocation = true;
                break;
        }
    }
    const [location, setLocation] = useState<number>(preLocation);
    console.log("location", location)
    const [hovered, setHovered] = useState<boolean>(false);
    const [clicked, setClicked] = useState<boolean>(false);
    useEffect(() => {
        if(!hovered) {
            if(location !== preLocation) {
                setLocation(preLocation)
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hovered])

    useEffect(() => {
        console.log("setup event listener")
        document.getElementById("logo-button").addEventListener("click", () => {
            setClicked(true)
            setLocation(1);
            setTimeout(() => {
                router.replace("/");
                setClicked(true);
                setLocation(1);
            }, 0);
        })
    }, [router])
    
    return (
        <>
            <nav
                className={`flex p-4 text-white z-[100000] fixed w-screen items-center justify-center`}
            >
                <div id="container" className="flex items-center justify-center w-[484px]">
                    {
                        navRoutes.map(({ name, href }, index) => (
                                <div 
                                    id={`nav-${index}`}
                                    onClick={() => {
                                        setClicked(true)
                                        setLocation(index);
                                        setTimeout(() => {
                                            router.replace(href);
                                            setClicked(true);
                                            setLocation(index);
                                        }, 0);
                                    }} 
                                    onMouseEnter={() => {
                                        setHovered(true)
                                        setLocation(index);
                                        setClicked(false)
                                    }}
                                    onMouseOver={() => {
                                        setHovered(true)
                                        setLocation(index);
                                        setClicked(false)
                                    }}
                                    onMouseLeave={() => {
                                        if(!clicked) {
                                            setHovered(false)
                                        }
                                    }}
                                    style={{

                                    }}
                                    key={`nav-${index}`} 
                                    className="nav-div p-4 text-white rounded-lg text-xl cursor-pointer h-[60px]"
                                >{name}</div>
                        ))
                    }
                </div>
            </nav>
            <div className="fixed w-[452px] h-1 translate-y-3" style={{margin: "0 calc((100vw - 452px)/2)"}}>
                <div className="transition-all ease-squared duration-300 bg-[#06d9e5] h-full translate-x-[1px]"
                    id="bar"
                    style={{
                        width: `${widths[location] ?? 0}px`,
                        marginLeft: `${margins[location]}px`
                    }}
                ></div>
            </div>
        </>
    )
}