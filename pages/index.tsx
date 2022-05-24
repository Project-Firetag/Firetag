import React, { Component, useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  useLoadScript
} from "@react-google-maps/api";
import NotSupported from "../elements/modal";
import axios from "axios";
import generateSlug from "../utils/generateSlug";
import Details from "../elements/details";
import useMergeState from "../hooks/useMergeState";

const libraries: any = ["places"]

// satellite on default

const containerStyle = (x: number) => ({
  width: "100vw",
  height: "calc(100vh - 6rem)",
  top: x < 750 ? "32px" : "0px",
  overflow: "visible !important",
});

const getStraightLine = (finish: [number, number], start: [number, number] = [0, 0]): [(x: number) => number, [number, number]] => {
  const [[x1, y1], [x2, y2]] = [start, finish];
  const gradient = (y2-y1)/(x2-x1);
  // y-y1=mx-mx1
  console.log(`${gradient}x-${(gradient*(x1) + y1)}`, gradient);
  const y = (x: number) => gradient*(x-x1) + y1;
  const midpoint: [number, number] = [(x2-x1)/2, (y2-y1)/2];
  const normal = (x: number) => (-1/gradient)*(x-midpoint[0]) + midpoint[1];
  const thirdPoint: [number, number] = [midpoint[0] - 15, normal(midpoint[0] - 4)];
  const [x3, y3] = thirdPoint;
  const c = (a: number, b: number) => y1 - a*(x1)^2 - b*(x1);
  const b = (a: number, c: number) => (y2 - a*(x2)^2 - c)/x2;
  const a = (b: number, c:number) => (y3 - b*x3 - c)/x3^2;
/*
  [x1, y1]
  [x2, y2]
  [x3, y3]
  g(x) = ax^2 + bx + c
  y1 = a(x1)^2 + b(x1) + c
  c = y1 - a(x1)^2 - b(x1)
  y2 = a(x2)^2 + b(x2) + c
  b = (y2 - a(x2)^2 - c)/x2
  y3 = ax3^2 + bx3 + c
  a = (y3 - bx3 - c)/x3^2 
*/

  return [y, thirdPoint]
}

export default function Home() {
  const [ open, setOpen ] = useState<boolean>(false);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [ getDetails, setGetDetails ] = useState<boolean>(false);
  const [slug, setSlug] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(2)
  const [ data, setData ] = useMergeState<null | {
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
  } | { 
    date: string; 
    city: any; 
    slug: string; 
    time: string; 
    dateAndTime: 
    string; 
    location: string; 
  }>(null);
  const [ dimensions, setDimensions ] = useState({
    y: 0,
    x: 0
  });

  useEffect(() => {
    if(!getDetails && data?.hasOwnProperty("name")) {
      console.log(getDetails, data, "sending request")
      axios.post("http://localhost:3000/api/postIncident", data).then(i => console.log(i));
    }
  }, [getDetails, data])

  // const [value, setValue] = useState<any>("");
  const [[latitude, longitude], setCoords]: [
    [null | number, null | number],
    React.Dispatch<React.SetStateAction<[number, number] | [null, null]>>
  ] = useState<[number, number] | [null, null]>([null, null]);
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

  const [center, setCenter]: [
    [null | number, null | number],
    React.Dispatch<React.SetStateAction<[number, number] | [null, null]>>
  ] = useState<[number, number]>([0, 0]);
  
  useEffect(() => {
    setDimensions({
      y: window.innerHeight,
      x: window.innerWidth
    });
    window.addEventListener("resize", () => {
        setDimensions({
            y: window.innerHeight,
            x: window.innerWidth
        });
    })
  }, [])

  useEffect(() => {
    if (longitude && latitude) {
      transitionZoom()
      axios
        .get(
          `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=4f6fc656674d7a9052acc9f5d254b392`
        )
        .then((i) => {
          const slug = generateSlug()
          setData({
            date: new Date().toLocaleDateString(),
            city: i.data[0].name,
            slug: slug,
            time: new Date().toLocaleTimeString(),
            dateAndTime: `${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
            location: JSON.stringify([latitude, longitude]),
          });
          setSlug(slug);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [longitude, latitude]);
  const transitionZoom = () => {
    const interval = 0.05;
    console.log(getStraightLine([latitude, longitude])[0](5))
    setTimeout(() => {
      // for(let i = zoom; i <= 22+interval; i+=interval) {
      //   setTimeout(() => {
      //     setZoom(i);
      //     if(Math.floor(i) === 22) {
      //       setGetDetails(true)
      //     }
      //   }, i*700)
      // }
      for(let i = 0; i <= latitude; i+=10) {
        setTimeout(() => {
          console.log([getStraightLine([latitude, longitude])[0](i), i]);
        }, i*200)
      }
    }, 250)
    // setGetDetails(true)
  }
  console.log({lat: getStraightLine([40.7485452, -73.98576349999999])[0](20), lng: getStraightLine([40.7485452, -73.98576349999999])[0](20)[1]})
  if (typeof window !== undefined) {
    return (
      <main className="w-screen h-screen flex flex-col overflow-y-hidden">
        <NotSupported open={open} setOpen={setOpen} />
        <Details 
         open={getDetails}
        //  open={true}
         setOpen={setGetDetails} 
         setData={setData} 
         coordinates={{x: latitude, y: longitude}} 
         slug={slug}
        />
        <LoadScript
          libraries={libraries}
          googleMapsApiKey="AIzaSyBqLfqHgU-hMDHhorIB_t7xPleMpT9scqo"
        >
          <GoogleMap
            mapContainerStyle={containerStyle(dimensions.x)}
            center={{
              lat: center[0],
              lng: center[1],
            }}
            zoom={zoom + 3}
            mapTypeId='satellite'
            mapContainerClassName="mapContainer"
            // extraMapTypes={["satellite"]}
          >
            {/* Child components, such as markers, info windows, etc. */}
            <div id="search" className={`w-screen h-8 z-[9999999999] 
            `}>
              <Autocomplete
                onLoad={(i) => setAutocomplete(i)}
                onPlaceChanged={() => {
                  if(autocomplete) {
                    console.log(autocomplete.getPlace());
                    const coordinates: [number, number] = [
                      autocomplete.getPlace().geometry?.location.lat(),
                      autocomplete.getPlace().geometry?.location.lng()
                    ]
                    setCoords(coordinates)
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="Search"
                  style={{
                    boxSizing: `border-box`,
                    border: `1px solid transparent`,
                    width: `50vw`,
                    height: `32px`,
                    padding: `0 12px`,
                    borderRadius: `3px`,
                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                    fontSize: `14px`,
                    outline: `none`,
                    textOverflow: `ellipses`,
                    position: "absolute",
                    left: "50%",
                    marginLeft: "-25vw",
                    transform: dimensions.x < 750 ? `translateY(-32px)` : "",
                    zIndex: "9999"
                  }}
                />
              </Autocomplete>
            </div>
            {longitude && latitude && (
              <Marker position={{ lat: latitude, lng: longitude }} />
            )}
            <Marker position={{ lat: 0, lng: 0 }} />
            <Marker position={{lat: 10, lng: getStraightLine([40.7485452, -73.98576349999999])[0](10)}}/>
            <Marker position={{lat: 20, lng: getStraightLine([40.7485452, -73.98576349999999])[0](20)}}/>
            <Marker position={{lat: 30, lng: getStraightLine([40.7485452, -73.98576349999999])[0](30)}}/>
            <Marker position={{ lat: 40.7485452, lng: -73.98576349999999 }} />
            <Marker position={{ lat: getStraightLine([40.7485452, -73.98576349999999])[1][0], lng: getStraightLine([40.7485452, -73.98576349999999])[1][1] }} />
            <button
              onClick={onClick}
              className="bg-[#00a3ac] absolute pl-2 pr-2 pt-3 pb-3 bottom-6 hover:bg-[#035f7b] rounded-[8px] transition-all text-white font-bold text-base" style={{left: "calc(50vw - 5.125rem)", bottom: dimensions.x < 750 ? "45px" : ""}}
            >
              Share my Location
            </button>
          </GoogleMap>
        </LoadScript>
      </main>
    );
  } else return <></>;
}
