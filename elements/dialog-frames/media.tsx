/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useRef, useState, useEffect, Dispatch, SetStateAction } from "react";
import { Camera } from "react-camera-pro";
import reduceImageFileSize from "../../utils/reduceImage";
import * as filestack from 'filestack-js';
import { useLoading } from "../../hooks/useLoading";

export default function Media({
    setOpen,
    slug,
    setShowSuccess
}: {
    setOpen: Dispatch<SetStateAction<boolean>>;
    slug: null | string;
    setShowSuccess: Dispatch<SetStateAction<boolean>>;
}) {
    const [, setLoading] = useLoading()
    let count = 0
    if(filestack && !count) {
        var client = filestack.init('AnnD5xSC2Q8iyEQ6MQ6nwz');
        if(client) {
            count += 1
        }
    }
    const [image, setImage] = useState(null);
    const [images, setImages] = useState([]);
    const postImages = async () => {
        setOpen(false);
        setLoading(true)
        async function uploadImage(img: string) {
            img = await reduceImageFileSize(img)
            if(client) {
                const res = await client.upload(img);
                return res
            }
            else {
                console.log("no client");
                return client
            }
        }
        const temp = images;
        const promises: Promise<any>[] = []
        temp.forEach((img) => {
            const res = uploadImage(img);
            promises.push(res)
        })
        Promise.all(promises).then((res) => {
            console.log(res.map(i => i.url), slug)
            setImages(res.map(i => i.url));
            axios.post(`${location.origin}/api/addMedia`, {
                images: JSON.stringify(res.map(i => i.url)),
                slug: slug
            }).then(() => {
                setLoading(false);
                setShowSuccess(true)
            })
        })
    }
    useEffect(() => {
        if(image?.trim() && images.length < 3) {
            setImages([image, ...images])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image])
    const camera = useRef(null);
    return (
      <div className="w-full flex items-center flex-col h-96 justify-center relative float-right" style={{height: "35rem"}}>
        <div id="cam-container" className="rounded-lg overflow-hidden w-full" style={{height: "35rem"}}>
            <Camera ref={camera} errorMessages={{}} 
            aspectRatio={16 / 13}
            />
        </div>
        <button 
        className="bg-[#00a3ac] p-4 pt-2 pb-2 mb-5 mt-5 hover:bg-[#035f7b] rounded-[8px] transition-all text-white font-bold text-base"
        onClick={() => setImage(camera.current.takePhoto())}
        style={{
            marginBottom: "1.25rem",
            marginTop: "1.25rem"
        }}
        >Take photo</button>
        {Boolean(images.length) && <div id="gallery" className="flex overflow-hidden mb-5 items-center justify-center min-h-[10rem] h-20 w-full" style={{height: "7.5rem", gap: "0.75rem", marginBottom: "1.25rem",}}>
            {
                images.map((img, i) => (
                    <img
                        style={{
                            borderRadius: "0.5rem",
                            height: "99%", 
                            maxWidth: "none",
                            position: "relative",
                            // right: `${50 * (i + 1)}px`
                        }}
                    key={i} src={img} alt='Taken photo'/>
                ))
            }
        </div>}
        <div className="flex items-center justify-between w-full">
            <button onClick={() => setOpen(false)} className="bg-[#00a3ac] w-1/2 p-4 pt-2 pb-2 hover:bg-[#035f7b] rounded-[8px] transition-all text-white font-bold text-base" style={{width: "48%"}}>
                Skip
            </button>
            <button
            className="bg-[#00a3ac] w-1/2 p-4 pt-2 pb-2 hover:bg-[#035f7b] rounded-[8px] transition-all text-white font-bold text-base"
            style={{
                cursor: `${!Boolean(images.length) ? "not-allowed" : ""}`
            }}
            disabled={!Boolean(images.length)}
            onClick={postImages}
            >
                Post
            </button>
        </div>
      </div>
    );
  }
  