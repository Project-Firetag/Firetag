import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import getCoords from "../../utils/getCoords";

const libraries: any = ["places"];

const constData: ([[number, number], string])[] = [
    [
        [
            30.9010,
            75.8573
        ],
        "slugg"
    ],
    [
        [
            29.9010,
            76.8573
        ],
        "sslgg"
    ]
];

export async function getServerSideProps() {
    const res = await getCoords();
    const data = res.data;
    console.log("data", data)
    return {
        props: {
            unformattedData: data
        }
    }
}

export default function Map({
    unformattedData
}: {
    unformattedData: ([string, string, string, string])[]
}) {
    const [ boxData, setBoxData ]: [{
        name: string;
        dateAndTime: string;
    } | null, Dispatch<SetStateAction<{
        name: string;
        dateAndTime: string;
    } | null>>] = useState<{
        name: string;
        dateAndTime: string;
    } | null>(null)
    useEffect(() => {
        console.log(boxData)
    }, [boxData])
    const data = unformattedData.map(i => [i[0], i[1], i[2], JSON.parse(i[3])]).filter(i => Boolean(i[0][0] && i[0][1]));
    useEffect(() => {

    }, [])
    return (
        <main>
            <LoadScript
                libraries={libraries}
                googleMapsApiKey="AIzaSyBqLfqHgU-hMDHhorIB_t7xPleMpT9scqo"
            >
                <GoogleMap
                    mapContainerStyle={{
                        width: "100vw",
                        height: "calc(100vh - 94px)"
                    }}
                    center={{
                        lat: 23.1958,
                        lng: 78.0882,
                    }}
                    zoom={5}
                    mapTypeId='satellite'
                    
                >
                    {
                        boxData && <div id="info-box" className="h-32 w-56 rounded-tr-lg flex flex-col items-start justify-center bg-[#380fe2a1] absolute bottom-0">
                            <p className="pl-2 text-white mb-5">Date: {boxData.dateAndTime.split(", ")[1]}</p>
                            <p className="pl-2 text-white mb-5">Time: {boxData.dateAndTime.split(", ")[0]}</p>
                            <p className="pl-2 text-white">Name: {boxData.name}</p>
                        </div>
                    }
                    {
                        data.map((i, index) => (
                            <Mark 
                                key={`mark-${index}`} 
                                location={{
                                    lat: i.at(-1)[0],
                                    lng: i.at(-1)[1]
                                }} 
                                slug={i[1]}
                                dateAndTime={i[0]}
                                name={i[2]}
                                setBoxData={setBoxData}
                            />
                        ))
                    }
                </GoogleMap> 
            </LoadScript>
        </main>
    )
}

function Mark({
    location,
    slug,
    name,
    setBoxData,
    dateAndTime
}: {
    location: {
        lat: number,
        lng: number
    };
    slug: string;
    dateAndTime: string;
    name: string;
    setBoxData: Dispatch<SetStateAction<{
        name: string;
        dateAndTime: string;
    }>>;
}) {
    const router = useRouter()
    return (
        <Marker
            onLoad={()=>{}}
            onMouseOver={() => {
                setBoxData({
                    name: name,
                    dateAndTime: dateAndTime
                })
            }}
            onMouseOut={() => {
                setBoxData(null)
            }}
            position={location}
            onClick={() => router.push(`/portal/${slug}`)}
        />
    )
}

Map.title = `Firetag - Map`