import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import NotSupported from "../elements/modal";
import axios from "axios";
import generateSlug from "../utils/generateSlug";
import Details from "../elements/details";
import useMergeState from "../hooks/useMergeState";
import Head from "next/head";
import { useLoading } from "../hooks/useLoading";

const libraries: any = ["places"];

// satellite on default

const containerStyle = (x: number) => ({
  width: "100vw",
  height: "calc(100vh - 6rem)",
  top: x < 750 ? "32px" : "0px",
  OverflowY: "visible !important",
  OverflowX: "hidden !important",
});

export default function Home() {
  const [loading, setLoading] = useLoading();
  const [map, setMap] = useState<google.maps.Map | null>();
  const [open, setOpen] = useState<boolean>(false);
  const [
    autocomplete,
    setAutocomplete,
  ] = useState<google.maps.places.Autocomplete | null>(null);
  const [getDetails, setGetDetails] = useState<boolean>(false);
  const [slug, setSlug] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(2);
  const [data, setData] = useMergeState<
    | null
    | {
        name: string;
        date: string;
        city: any;
        slug: string;
        phoneNumber: string;
        description: string;
        time: string;
        dateAndTime: string;
        email: string;
        location: string;
      }
    | {
        date: string;
        city: any;
        slug: string;
        time: string;
        dateAndTime: string;
        location: string;
      }
  >(null);
  const [dimensions, setDimensions] = useState({
    y: 0,
    x: 0,
  });

  useEffect(() => {
    if (!getDetails && data?.hasOwnProperty("name")) {
      console.log(getDetails, data, "sending request");
      axios
        .post(`${location.origin}/api/postIncident`, data)
        .then((i) => console.log(i));
    }
  }, [getDetails, data]);

  // const [value, setValue] = useState<any>("");
  const [[latitude, longitude], setCoords]: [
    [null | number, null | number],
    React.Dispatch<React.SetStateAction<[number, number] | [null, null]>>
  ] = useState<[number, number] | [null, null]>([null, null]);
  const [center, setCenter]: [
    [null | number, null | number],
    React.Dispatch<React.SetStateAction<[number, number]>>
  ] = useState<[number, number] | [null, null]>([0, 0]);
  const onClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (i) => {
          setCoords([i.coords.latitude, i.coords.longitude]);
        },
        () => {
          setOpen(true);
        }
      );
    }
  };

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (longitude && latitude) {
      transitionZoom();
      const slug = generateSlug();
      setData({
        date: new Date().toLocaleDateString(),
        city: autocomplete?.getPlace()?.name,
        slug: slug,
        time: new Date().toLocaleTimeString(),
        dateAndTime: `${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
        location: JSON.stringify([latitude, longitude]),
      });
      setSlug(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [longitude, latitude]);
  const transitionZoom = () => {
    const interval = 0.25;
    setTimeout(() => {
      for (let i = zoom; i <= 22 + interval; i += interval) {
        setTimeout(() => {
          setZoom(i);
          if (Math.floor(i) === 22) {
            setGetDetails(true);
          }
        }, i * 700);
      }
    }, 0);
    // setGetDetails(true)
  };
  useEffect(() => {
    if(zoom <= 0) {
      setZoom(0)
    }
  }, [zoom])

  if (typeof window !== undefined) {
    return (
      <>
        <main className="w-screen h-screen flex flex-col overflow-hidden">
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            />
          </Head>
          <NotSupported open={open} setOpen={setOpen} />
          <Details
            open={getDetails}
            //  open={true}
            setOpen={setGetDetails}
            setData={setData}
            coordinates={{ x: latitude, y: longitude }}
            slug={slug}
            place={autocomplete?.getPlace()?.name ?? null}
          />
          <LoadScript
            libraries={libraries}
            googleMapsApiKey="AIzaSyBqLfqHgU-hMDHhorIB_t7xPleMpT9scqo"
          >
            <GoogleMap
              mapContainerStyle={containerStyle(dimensions.x)}
              onLoad={(firstMap) => setMap(firstMap)}
              center={{
                lat: latitude ?? map?.getCenter()?.lat() ?? 0,
                lng: longitude ?? map?.getCenter()?.lng() ?? 0,
              }}
              zoom={zoom}
              mapTypeId="satellite"
              mapContainerClassName="mapContainer"
              // extraMapTypes={["satellite"]}
            >
              {/* Child components, such as markers, info windows, etc. */}
              <div
                id="search"
                className={`w-screen h-8 z-[9999999999]`}
                style={{ zIndex: 9999999999 }}
              >
                <Autocomplete
                  onLoad={(i) => setAutocomplete(i)}
                  onPlaceChanged={() => {
                    if (autocomplete) {
                      console.log(autocomplete.getPlace());
                      const coordinates: [number, number] = [
                        autocomplete.getPlace().geometry?.location.lat(),
                        autocomplete.getPlace().geometry?.location.lng(),
                      ];
                      setCoords(coordinates);
                    }
                  }}
                >
                  <>
                    <input
                      type="text"
                      placeholder="Search"
                      className="placeholder:text-white transition-all bg-[#00a4ac94] focus:bg-[#00a4ac]"
                      style={{
                        boxSizing: `border-box`,
                        border: `1px solid transparent`,
                        width: `50vw`,
                        height: `50px`,
                        padding: `0 6px 0px 12px`,
                        borderRadius: `0px 0px 10px 10px`,
                        fontSize: `20px`,
                        outline: `none`,
                        textOverflow: `ellipses`,
                        position: "absolute",
                        left: "50%",
                        marginLeft: "-25vw",
                        transform:
                          dimensions.x < 750 ? `translateY(-32px)` : "",
                        zIndex: "9999",
                        color: "whitesmoke",
                        backdropFilter: "blur(15px)",
                      }}
                    />
                  </>
                </Autocomplete>
              </div>
              {longitude && latitude && (
                <Marker position={{ lat: latitude, lng: longitude }} />
              )}
              <button
                onClick={onClick}
                className="bg-[#00a3ac] absolute pl-2 pr-2 pt-3 pb-3 bottom-6 hover:bg-[#035f7b] rounded-[8px] transition-all text-white font-bold text-base"
                style={{
                  left: "calc(50vw - 5.125rem)",
                  bottom: dimensions.x < 750 ? "45px" : "",
                }}
              >
                Share my Location
              </button>
            </GoogleMap>
          </LoadScript>
        </main>
      </>
    );
  } else return <></>;
}

Home.title = `Firetag - Report an Incident`;
