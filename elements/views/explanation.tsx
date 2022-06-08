import Image from "next/image";
import { useEffect, useState } from "react";

export default function Explanation() {
  const [show, setShow] = useState(true);
  const [display, setDisplay] = useState("flex");
  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        setDisplay("none");
      }, 500);
    }
  }, [show]);
  return (
    <div
      style={{ display: display }}
      className={`w-full transition-all duration-500 opacity-[${
        show ? 1 : 0
      }] h-[172px] absolute bg-[#00ffc38d] bottom-0 flex justify-between`}
    >
      <div className="h-full pt-[60px] w-auto flex items-center pl-2">
        <Image
          src="/fire.png"
          alt="error"
          height={394 * 0.25}
          width={320 * 0.25}
        ></Image>
      </div>
      <div className="" style={{ width: "calc(100vw - 80px - 56px)" }}>
        <h2 className="text-center text-6xl">Firetag</h2>
        <p className="py-2 px-4 font-poppins text-[1.05rem] text-justify">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi,
          dolore? Facere dolorem similique, quos perferendis maxime quidem
          aliquid fugiat inventore rem fugit provident? Commodi nobis, sint odio
          exercitationem, incidunt tenetur hic impedit qui, laboriosam esse
          voluptatem mollitia explicabo. Quae fugiat repellat amet omnis, ipsa
          eius excepturi veritatis molestiae quod possimus eveniet dolorem sit
          mollitia totam quo! Aliquid error in totam?
        </p>
      </div>
      <div
        onClick={() => setShow(false)}
        className="w-10 h-10 bg-blue-400 rounded-full p-2 flex justify-center items-center text-[1.40rem] cursor-pointer font-extrabold hover:saturate-[1.25] active:saturate-[0.75] transition-all mt-2 mr-2"
      >
        ✕
      </div>
    </div>
  );
}
