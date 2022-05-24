import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import Input from "./dialog-frames/input";
import Media from "./dialog-frames/media";


export default function Details({
    open,
    setOpen,
    coordinates,
    setData,
    slug,
    place
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    coordinates: {
        x: number;
        y: number;
    };
    setData: (any: any) => void;
    slug: null | string;
    place: null | string;
}) {
    const [ media, setMedia ] = useState(false);
    useEffect(() => {
        console.log(media, open)
    }, [media, open])
    if(media||open) {
        return (
            <div
            id="not-supported-container fixed"
            style={{ height: "calc(100% - 6rem)" }}
            className="w-full h-full absolute z-[9999999999999999999999]"
            >
                <div
                    className="details dialog w-[48rem] absolute p-5 flex flex-col justify-center items-center z-[999999999999999999999999]"
                    style={{
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "rgb(0 48 255 / 25%)",
                    boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
                    backdropFilter: "blur( 5px )",
                    WebkitBackdropFilter: "blur( 5px )",
                    borderRadius: "10px",
                    border: "1px solid rgba( 255, 255, 255, 0.18 )",
                    }}
                >
                    <div className="frame-container w-[80%]">
                        
                            {(!open ? (
                                <></>
                            ) : (
                                <Input {...{
                                    number: 1,
                                    setOpen: setOpen,
                                    setData: setData,
                                    coordinates: coordinates,
                                    setMedia: setMedia,
                                    place: place
                                }}/>
                            ))}
    
                            {
                                !media ? (
                                    <></>
                                ) : (
                                    <Media slug={slug} setOpen={setMedia}/>
                                )
                            }
                        
                    </div>
                </div>
            </div>
        );
    } else {
        return (<></>)
    }
}