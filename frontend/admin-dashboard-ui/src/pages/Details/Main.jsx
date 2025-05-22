import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import RenderStars from "./RenderStars";
import { FaPhoneAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Main = () => {
  const id = useParams().id;
  const [part, setPart] = useState({});
  const [shopPart, setShopPart] = useState({});
  const [userStars, setUserStars] = useState(0);
  const { user } = useAuth();

  // getting single car-part from db
  useEffect(() => {
    axios
      .get(`https://starlit-wisp-63c85a.netlify.app/api/car-part/${parseInt(id)}`)
      .then((response) => {
        setPart(response.data);
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching car parts:", error);
      });
    // getting a particular shop-part
    axios
      .get(`https://starlit-wisp-63c85a.netlify.app/api/shop-part/${parseInt(id)}`)
      .then((response) => {
        setShopPart(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching car parts:", error);
      });

    console.log(user);
  }, []);

  const formatPrice = (price) => {
    return Number(price).toLocaleString("en-US"); // Formats with commas
  };

  const shopStars = [
    {
      id: shopPart.RepairShop?.ID,
      name: shopPart.RepairShop?.name,
      stars: shopPart.RepairShop?.rating,
    },
  ];

  useEffect(() => {
    // setting the stars to the shopStars state
    setUserStars(shopStars[0]?.stars || 0);
  }, [shopStars]);

  return (
    <div className="md:px-[11%] py-[7%]">
      <section className="md:flex gap-2 justify-around">
        <span className=" w-1/2">
          <div className="flex justify-center rounded-4xl items-center">
            <img
              src={part.image}
              className="object-center w-[15rem] object-cover"
              alt={part.name}
            />
          </div>
          <div className="flex gap-4 py-4 justify-center rounded-4xl items-center">
            <img
              src={part.image}
              className="object-center w-[8rem] object-cover"
              alt={part.name}
            />
            <img
              src={part.image}
              className="object-center w-[8rem] object-cover"
              alt={part.name}
            />
            <img
              src={part.image}
              className="object-center w-[8rem] object-cover"
              alt={part.name}
            />
          </div>
        </span>
        <span className="w-1/2">
          <div className="flex justify-between">
            <p className="card-title text-xl font-semisemibold">{part.name}</p>
            <p className="text-gray-700 text-xl ">
              UGX&nbsp;
              <span className="font-semibold">{formatPrice(part.price)}</span>
            </p>
          </div>
          <div className=" pt-4 flex  flex-col justify-between w-100  text-base">
            <span className="flex  gap-16">
              <div className="w-[4rem] ">Condition</div>
              <div className="font-semibold w-100 ">{part.condition}</div>
            </span>
            <span className="flex gap-16">
              <div className="w-[4rem]">Price&nbsp;&#40;UGX&#41;</div>
              <div className="font-semibold text-md">
                {formatPrice(part.price)}
              </div>
            </span>
          </div>
          <div className=" pt-6 flex flex-col justify-between w-100  text-base">
            <span className="flex gap-16">
              <div className="w-[4rem]">Seller</div>
              <div className="flex font-semibold">
                {shopPart.RepairShop?.name}&nbsp;
                <div className="flex items-center">
                  <div>
                    {/* Use the component to render stars based on userStars */}
                    <RenderStars rating={userStars} />
                  </div>
                </div>
              </div>
            </span>
            <span className="flex gap-16">
              <div className="w-[4rem]">Location</div>
              <div className="font-semibold">
                {shopPart.RepairShop?.location}
              </div>
            </span>
          </div>

          <div className="text-center">
            <p className="py-6">
              To buy this part please contact our certified seller
            </p>
            <p className=" text-center mb-4">Contact me</p>
            <div className="flex justify-center">
              <span className="w-auto flex gap-2 font-semibold justify-between px-2 text-center shadow-md border py-1 rounded-3xl">
                <div className="text-white rounded-full p-1 bg-black">
                  <FaPhoneAlt />
                </div>
                {user ? (
                  shopPart.RepairShop?.dealer_contact
                ) : (
                  <Link to="/login">Sign Up to see Contact</Link>
                )}
              </span>
            </div>
          </div>
        </span>
      </section>
    </div>
  );
};

export default Main;
