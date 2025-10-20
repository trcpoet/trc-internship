import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import Skeleton from "../UI/Skeleton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

/** Custom arrows for react-slick */
function PrevArrow({className, style, onClick}) {
  return (
    <button
      aria-label="Previous"
      className={`${className} hc-arrow hc-arrow--left`}
      style={style}
      onClick={onClick}
      type="button"
    >
      ‹
    </button>
  );
}

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      aria-label="Next"
      className={`${className} hc-arrow hc-arrow--right`}
      style={style}
      onClick={onClick}
      type="button"
    >
      ›
    </button>
  );
}

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
        );
        setCollections(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch hot collections:", err);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  // react-slick settings
  const settings = useMemo(
    () => ({
      infinite: true,           // loop
      speed: 500,
      slidesToShow: 4,          // desktop
      slidesToScroll: 1,
      arrows: true,
      dots: false,
      // Place custom arrows
      prevArrow: <PrevArrow />,
      nextArrow: <NextArrow />,
      // Responsive breakpoints
      responsive: [
        {
          breakpoint: 992, // < 992px
          settings: { slidesToShow: 3, slidesToScroll: 1 }
        },
        {
          breakpoint: 768, // < 768px
          settings: { slidesToShow: 2, slidesToScroll: 1 }
        },
        {
          breakpoint: 576, // < 576px
          settings: { slidesToShow: 1, slidesToScroll: 1 }
        }
      ]
    }),
    []
  );

  // Hardening to make each card fill its slide exactly
  const slideWrapStyle = { padding: 0, minWidth: 0, display: "flex" };
  const cardStyle = { width: "100%", maxWidth: "100%", boxSizing: "border-box", margin: 0 };
  const mediaStyle = { width: "100%", display: "block" };

  return (
    <section id="section-collections" className="no-bottom">
      {/* Local CSS: arrow styling + sizing fixes for slick */}
      <style>{`
        /* Make slick track flex so children can stretch cleanly */
        .hot-collections .slick-track {
          display: flex !important;
          gap: 16px; /* horizontal spacing between slides */
        }
        /* Each slick slide should behave like a flex item and not shrink */
        .hot-collections .slick-slide {
          height: auto;            /* allow content height */
        }
        .hot-collections .slick-slide > div {
          height: 100%;
          display: flex;           /* so card can stretch */
          min-width: 0;
        }
        /* Card fills slide; include borders in width to prevent overflow */
        .hot-collections .nft_coll {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        .hot-collections .nft_wrap,
        .hot-collections .nft_wrap img {
          width: 100%;
          display: block;
        }

        /* Hide default slick arrows text and theme bg */
        .hc-arrow.slick-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
          width: 56px; height: 56px;
          border-radius: 50%;
          border: 1px solid #D9D9D9;
          background: #fff;
          color: #222;
          font-size: 32px;
          line-height: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }
        .hc-arrow:hover {
          background: #f4f4f4;             /* subtle hover feedback */
          transform: translateY(-50%) scale(1.05);
        }
        .hc-arrow--left  { left: -21px; }
        .hc-arrow--right { right: -21px; }
        .hc-arrow:before { content: none; } /* remove slick default icon */

        /* Container to ensure arrows line up vertically */
        .hot-collections {
          position: relative;
          padding: 0 16px; /* breathing room so arrows don't overlap on tiny viewports */
        }

        /* Adjust gap for small devices since we rely on flex gap, not slick's padding */
        @media (max-width: 991.98px) {
          .hot-collections .slick-track { gap: 14px; }
        }
        @media (max-width: 767.98px) {
          .hot-collections .slick-track { gap: 12px; }
          .hc-arrow--left  { left: -28px; }
          .hc-arrow--right { right: -28px; }
          .hc-arrow { width: 48px; height: 48px; font-size: 28px; }
        }
      `}</style>

      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="hot-collections">
          <Slider {...settings}>
            {loading
              ? new Array(4).fill(0).map((_, index) => (
                  <div key={index} style={slideWrapStyle}>
                    <div className="nft_coll" style={cardStyle}>
                      <Skeleton width="100%" height="200px" borderRadius="8px" />
                      <div className="nft_coll_pp" style={{ marginTop: "-25px" }}>
                        <Skeleton width="50px" height="50px" borderRadius="50%" />
                      </div>
                      <div className="nft_coll_info">
                        <Skeleton width="80%" height="1.2em" borderRadius="4px" />
                        <Skeleton width="60%" height="1em" borderRadius="4px" />
                      </div>
                    </div>
                  </div>
                ))
              : collections.map((collection) => (
                  <div key={collection.id} style={slideWrapStyle}>
                    <div className="nft_coll" style={cardStyle}>
                      <div className="nft_wrap" style={mediaStyle}>
                        <Link to={`/item-details/${collection.nftId || collection.id}`}>
                          <img
                            src={collection.nftImage || nftImage}
                            className="lazy img-fluid"
                            alt={collection.title}
                            style={mediaStyle}
                          />
                        </Link>
                      </div>
                      <div className="nft_coll_pp">
                        <Link to={`/author/${collection.authorId || collection.id}`}>
                          <img
                            className="lazy pp-coll"
                            src={collection.authorImage || AuthorImage}
                            alt={collection.title}
                            style={{ display: "block" }}
                          />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>
                      <div className="nft_coll_info">
                        <Link to="/explore">
                          <h4>{collection.title}</h4>
                        </Link>
                        <span>{collection.code}</span>
                      </div>
                    </div>
                  </div>
                ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default HotCollections;