import React, { useEffect, useState } from "react";
// The <Link> component was causing a router context error.
// We are replacing it with a standard <a> tag as a workaround.
// import { Link } from "react-router-dom"; 
import axios from 'axios';

// Self-contained Skeleton component to remove dependency
const Skeleton = ({ width, height, borderRadius, className = '' }) => (
  <div
    className={`skeleton-box ${className}`}
    style={{ width, height, borderRadius }}
  ></div>
);

// Skeleton Loader for a single item
const SkeletonLoader = () => (
  <div className="nft__item" style={{ flex: '0 0 280px', width: '280px' }}>
    <div className="author_list_pp">
      <Skeleton width="50px" height="50px" borderRadius="50%" />
    </div>
    <div className="nft__item_wrap" style={{ marginTop: '-25px' }}>
      <Skeleton height="180px" borderRadius="8px" />
    </div>
    <div className="nft__item_info">
      <Skeleton height="20px" width="80%" />
      <div style={{height: '10px'}} />
      <Skeleton height="16px" width="50%" />
    </div>
  </div>
);

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Placeholder images for fallbacks
  const AuthorImage = "https://placehold.co/60x60/DDD/31343C?text=A";
  const nftImage = "https://placehold.co/400x400/DDD/31343C?text=NFT";

  return (
    <section id="section-items" className="no-bottom">
      <style>{`
        /* Skeleton Animation */
        @keyframes skeleton-loading {
          0% { background-color: #e0e0e0; }
          50% { background-color: #f0f0f0; }
          100% { background-color: #e0e0e0; }
        }
        .skeleton-box {
          animation: skeleton-loading 1.5s infinite ease-in-out;
          background-color: #e0e0e0;
        }

        /* Horizontal Scroller */
        .horizontal-scroll-container {
          overflow-x: auto;
          padding-bottom: 20px;
          scrollbar-width: none; /* For Firefox */
        }
        .horizontal-scroll-container::-webkit-scrollbar {
          display: none; /* For Chrome, Safari, and Opera */
        }
        .horizontal-scroll-content {
          display: flex;
          gap: 20px; 
        }
      `}</style>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
        </div>

        <div className="horizontal-scroll-container">
          <div className="horizontal-scroll-content">
            {loading 
              ? (
                new Array(4).fill(0).map((_, index) => (
                  <SkeletonLoader key={index} />
                ))
              ) : (
                items.map((item) => (
                  <div key={item.id} style={{ flex: '0 0 280px', width: '280px' }}>
                    <div className="nft__item">
                      <div className="author_list_pp">
                        <a href={`/author/${item.authorId}`}>
                          <img className="lazy" src={item.authorImage || AuthorImage} alt="" />
                          <i className="fa fa-check"></i>
                        </a>
                      </div>
                      <div className="de_countdown">{item.deadline}</div>
                      <div className="nft__item_wrap">
                        <div className="nft__item_extra">
                          <div className="nft__item_buttons">
                            <button>Buy Now</button>
                            <div className="nft__item_share">
                              <h4>Share</h4>
                              <a href="#"><i className="fa fa-facebook fa-lg"></i></a>
                              <a href="#"><i className="fa fa-twitter fa-lg"></i></a>
                              <a href="#"><i className="fa fa-envelope fa-lg"></i></a>
                            </div>
                          </div>
                        </div>
                        <a href={`/item-details/${item.nftId}`}>
                          <img src={item.nftImage || nftImage} className="lazy nft__item_preview" alt="" />
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
                ))
              )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewItems;

