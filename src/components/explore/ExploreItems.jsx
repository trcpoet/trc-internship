import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import axios from "axios";
import Skeleton from "../UI/Skeleton";
import CountdownTimer from "../UI/CountdownTimer";

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [lastLoadedIndex, setLastLoadedIndex] = useState(-1);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(""); // "price_low_to_high", etc

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const url = `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore${filter ? `?filter=${filter}` : ""}`;
        const { data } = await axios.get(url);
        setItems(Array.isArray(data) ? data : []);
        setVisibleCount(8);
        setLastLoadedIndex(-1);
        window.scrollTo(0, 0);
      } catch (e) {
        console.error("Error fetching:", e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [filter]);

  const handleLoadMore = () => {
    setLastLoadedIndex(visibleCount);
    setVisibleCount((prev) => prev + 4);
  };

  const displayedItems = items.slice(0, visibleCount);

  return (
    <>
      <div className="filter-wrapper">
        <select
          id="filter-items"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}

      {!loading &&
        displayedItems.map((item, index) => {
          const deadlineValue = item.deadline ?? item.expiryDate ?? item.expiry_date ?? null;
          return (
            <div
              key={item.id || index}
              className={`d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 ${index >= lastLoadedIndex ? "fade-in" : ""}`}
              style={{ display: "block", backgroundSize: "cover" }}
            >
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link to={`/author/${item.authorId}`}>
                    <img className="lazy" src={item.authorImage || AuthorImage} alt={item.author} />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>

                {deadlineValue && (
                  <div className="de_countdown">
                    <CountdownTimer deadline={deadlineValue} />
                  </div>
                )}

                <div className="nft__item_wrap">
                  <Link to={`/item-details/${item.nftId}`}>
                    <img
                      src={item.nftImage || nftImage}
                      className="lazy nft__item_preview"
                      alt={item.title}
                    />
                  </Link>
                </div>

                <div className="nft__item_info">
                  <Link to={`/item-details/${item.nftId}`}>
                    <h4>{item.title}</h4>
                  </Link>
                  <div className="nft__item_price">{item.price} ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{item.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      {!loading && visibleCount < items.length && (
        <div className="col-md-12 text-center">
          <button onClick={handleLoadMore} className="btn-main lead" id="loadmore">
            Load more
          </button>
        </div>
      )}

      <style>{`
        .fade-in {
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .spinner-container {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }
        .spinner {
          border: 4px solid rgba(0,0,0,0.1);
          width: 40px;
          height: 40px;
          border-top-color: #333;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default ExploreItems;
