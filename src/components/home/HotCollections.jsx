import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from "../UI/Skeleton";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 4, spacing: 16 },
    breakpoints: {
      "(max-width: 575.98px)": { slides: { perView: 1, spacing: 12 } },
      "(min-width: 576px) and (max-width: 767.98px)": { slides: { perView: 2, spacing: 12 } },
      "(min-width: 768px) and (max-width: 991.98px)": { slides: { perView: 3, spacing: 14 } },
      "(min-width: 992px)": { slides: { perView: 4, spacing: 16 } },
    },
  });

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
        );
        setCollections(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch hot collections:", error);
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  // Recompute Keen layout after data mounts
  useEffect(() => {
    if (instanceRef.current) instanceRef.current.update();
  }, [collections, instanceRef]);

  const slideStyle = { padding: 0, minWidth: 0, display: "flex", flex: "0 0 auto" };
  const cardStyle = { width: "100%", maxWidth: "100%", boxSizing: "border-box", margin: 0 };
  const mediaStyle = { width: "100%", display: "block" };

  return (
    <section id="section-collections" className="no-bottom">
      {/* Local CSS: arrow styling + critical sizing fixes to stop the peeked slide */}
      <style>{`
        /* Arrow layout */
        .slider-wrap { position: relative; }
        .slider-arrows {
          position: absolute;
          top: 50%;
          left: 0; right: 0;
          transform: translateY(-50%);
          display: flex; justify-content: space-between; align-items: center;
          pointer-events: none; z-index: 5;
        }
        .slider-arrows button {
          pointer-events: auto;
          width: 56px; height: 56px;
          border-radius: 12px;
          border: 1px solid #D9D9D9;
          background: #fff;
          display: grid; place-items: center;
          font-size: 32px; line-height: 1;
          box-shadow: 0 8px 20px rgba(0,0,0,0.10);
        }
        .slider-arrows .arrow-left  { position: relative; left: -42px; }
        .slider-arrows .arrow-right { position: relative; right: -42px; }

        /* Critical: stop width overflow that causes the 'stuck' right slide */
        .keen-slider { overflow: hidden; }
        .keen-slider__slide {
          flex: 0 0 auto;        /* no shrink */
          display: flex;         /* let child stretch full width */
          min-width: 0;
          padding: 0 !important; /* no inner padding that affects width */
        }
        /* Make card fill slide and include its border in width */
        .keen-slider__slide .nft_coll {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;    /* <-- key fix */
          margin-left: 0 !important; /* ensure no horizontal margins */
          margin-right: 0 !important;
        }
        /* Media fills card width exactly */
        .nft_wrap, .nft_wrap img {
          width: 100%;
          display: block;
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

        {/* Keep the slider out of Bootstrap columns so it can use full container width */}
        <div className="slider-wrap">
          <div className="slider-arrows">
            <button
              className="arrow-left"
              aria-label="Previous"
              onClick={() => instanceRef.current && instanceRef.current.prev()}
            >
              ‹
            </button>
            <button
              className="arrow-right"
              aria-label="Next"
              onClick={() => instanceRef.current && instanceRef.current.next()}
            >
              ›
            </button>
          </div>

          <div ref={sliderRef} className="keen-slider" style={{ overflow:'hidden'}}>
            {loading
              ? new Array(4).fill(0).map((_, index) => (
                  <div className="keen-slider__slide" style={slideStyle} key={index}>
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
                  <div className="keen-slider__slide" style={slideStyle} key={collection.id}>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
