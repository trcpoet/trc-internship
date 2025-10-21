import React, { useEffect, useRef, useState } from "react";
import CountdownTimer from "../UI/CountdownTimer";
// The <Link> component was causing a router context error.
// We are replacing it with a standard <a> tag as a workaround.
// import { Link } from "react-router-dom"; 
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AuthorImage = "https://placehold.co/60x60/DDD/31343C?text=A";
const nftImage = "https://placehold.co/400x400/DDD/31343C?text=NFT";


// Self-contained Skeleton component to remove dependency
const Skeleton = ({ width, height, borderRadius }) => (
  <div
    style={{
      width,
      height,
      borderRadius,
      backgroundColor: "#e0e0e0",
      animation: "pulse 1.5s infinite ease-in-out"
    }}
  ></div>
);

const PrevArrow = ({ onClick }) => (
  <button className="hc-arrow hc-arrow--left" onClick={onClick}>
    ‹
  </button>
);

const NextArrow = ({ onClick }) => (
  <button className="hc-arrow hc-arrow--right" onClick={onClick}>
    ›
  </button>
);

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // const scrollRef = useRef(null); 


  useEffect(() => {
    async function fetchNewItems() {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setItems([]);
        console.error("Failed to fetch new items:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchNewItems();
  }, []);

  const settings = {
    infinite: true,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } }
    ]
  };


  // Placeholder images for fallbacks
  const AuthorImage = "https://placehold.co/60x60/DDD/31343C?text=A";
  const nftImage = "https://placehold.co/400x400/DDD/31343C?text=NFT";

  return (
    <section id="section-items" className="no-bottom">
      <style>{`
        @keyframes pulse {
          0% { background-color: #eee; }
          50% { background-color: #ddd; }
          100% { background-color: #eee; }
        }
        .hc-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #fff;
          border: 1px solid #D9D9D9;
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
          font-size: 28px;
          color: #333;
          display: flex;
          align-items: center;
          transition: all 0.25s ease;
          justify-content: center;
          cursor: pointer;
        }
        .hc-arrow--left { left: -22px; }
        .hc-arrow--right { right: -22px; }

        .new-items-slider .slick-slide > div {
        padding: 0 10px;}

      `}</style>

      <div className="container new-items-slider">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h2>New Items</h2>
            <div className="small-border bg-color-2"></div>
          </div>
        </div>

        <Slider {...settings}>
          {loading
            ? new Array(4).fill(0).map((_, index) => (
                <div key={index} className="nft__item">
                  <Skeleton width="100%" height="200px" borderRadius="12px" />
                  <div style={{ marginTop: "-20px" }}>
                    <Skeleton width="50px" height="50px" borderRadius="50%" />
                  </div>
                  <Skeleton width="80%" height="20px" borderRadius="6px" />
                  <Skeleton width="60%" height="16px" borderRadius="4px" />
                </div>
              ))
            : items.map((item) => (
                <div key={item.id}>
                  <div className="nft__item">
                    <div className="author_list_pp">
                      <a href={`/author/${item.authorId}`}>
                        <img
                          src={item.authorImage || AuthorImage}
                          alt="author"
                        />
                        <i className="fa fa-check"></i>
                      </a>
                    </div>

                    <div className="de_countdown">
                      {item.deadline && <CountdownTimer deadline={item.deadline}/>}
                    </div>

                    <div className="nft__item_wrap">
                      <a href={`/item-details/${item.nftId}`}>
                        <img
                          src={item.nftImage || nftImage}
                          className="nft__item_preview"
                          alt={item.title}
                        />
                      </a>
                    </div>
                    <div className="nft__item_info">
                      <a href={`/item-details/${item.nftId}`}>
                        <h4>{item.title}</h4>
                      </a>
                      <div className="nft__item_price">{item.price} ETH</div>
                      <div className="nft__item_like">
                        <i className="fa fa-heart"></i>
                        <span>{item.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </Slider>
      </div>
    </section>
  );
};

export default NewItems;