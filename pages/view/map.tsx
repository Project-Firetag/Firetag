import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useRouter } from "next/router";
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
    unformattedData: ([string, string])[]
}) {
    const data = unformattedData.map(i => [JSON.parse(i[0]), i[1]]).filter(i => Boolean(i[0][0] && i[0][1]));
    console.log(unformattedData)
    console.log(data)
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
                >
                    {
                        data.map((i, index) => (
                            <Mark key={`mark-${index}`} location={{
                                lat: i[0][0],
                                lng: i[0][1]
                            }} slug={i[1]} />
                        ))
                    }
                </GoogleMap> 
            </LoadScript>
        </main>
    )
}

function Mark({
    location,
    slug
}: {
    location: {
        lat: number,
        lng: number
    };
    slug: string;
}) {
    const router = useRouter()
    return (
        <Marker
            onLoad={()=>{}}
            position={location}
            onClick={() => router.push(`/view/${slug}`)}
        />
    )
}