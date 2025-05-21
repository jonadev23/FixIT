import React from "react";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";

const RenderStars = ({ rating }) => {
  if (!rating) return <div>No Star to Display</div>;

  // Convert rating to number to ensure proper comparison
  const numRating = Number(rating);

  if (numRating === 1) {
    return (
      <div className="flex">
        <span className="text-yellow-400">
          <FaStar />
        </span>
        <span className="text-yellow-400">
          <FaRegStar />
        </span>
        <span className="text-yellow-400">
          <FaRegStar />
        </span>
        <span className="text-yellow-400">
          <FaRegStar />
        </span>
        <span className="text-yellow-400">
          <FaRegStar />
        </span>
      </div>
    );
  } else if (numRating === 2) {
    return (
      <div className="flex">
        <span className="text-yellow-400">
          <FaStar />
        </span>
        <span className="text-yellow-400">
          <FaStar />
        </span>
        <span className="text-yellow-400">
          <FaRegStar />
        </span>
        <span className="text-yellow-400">
          <FaRegStar />
        </span>
        <span className="text-yellow-400">
          <FaRegStar />
        </span>
      </div>
    );
  }
  // Add more conditions for other ratings...
  else if (numRating === 3) {
    return (
      <div className="flex">
        <span className="text-yellow-400">
          <FaStar />
        </span>
        <span className="text-yellow-400">
          <FaStar />
        </span>
        <span className="text-yellow-400">
          <FaStar />
        </span>
        <span className="text-yellow-400">
          <FaRegStar />
        </span>
        <span className="text-yellow-400">
          <FaRegStar />
        </span>
      </div>
    );
  } else if (numRating === 4) {
    return (
      <div className="flex">
        <span className="text-yellow-400">
          <FaStar />
        </span>
        <span className="text-yellow-400">
          <FaStar />
        </span>
        <span className="text-yellow-400">
          <FaStar />
        </span>
        <span className="text-yellow-400">
          <FaStar />
        </span>
        <span className="text-yellow-400">
          <FaRegStar />
        </span>
      </div>
    );
  } else if (numRating === 5) {
    return (
      <div className="flex">
        <span className="text-yellow-400">
          <FaStar />
        </span>
        <span className="text-yellow-400">
          <FaStar />
          <span className="text-yellow-400">
            <FaStar />
          </span>
          <span className="text-yellow-400">
            <FaStar />
          </span>
          <span className="text-yellow-400">
            <FaStar />
          </span>
        </span>
      </div>
    );
  }
  // Default case
  return <div>{rating}</div>;
};

export default RenderStars;
