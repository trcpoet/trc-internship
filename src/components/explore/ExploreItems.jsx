import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import axios from "axios";
import Skeleton from "../UI/Skeleton";
import CountdownTimer from "../UI/CountdownTimer";
import ExploreFilter from "./ExploreFilter";

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore"
        );
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setItems([]);
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4 ); // Show 4 more each time
  }

    const handleSortChange = (filter) => {
    const sorted = [...items];
    if (filter === "price_low_to_high") {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (filter === "price_high_to_low") {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (filter === "likes_high_to_low") {
      sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    setItems(sorted);
  };

  const displayedItems = items.slice(0, visibleCount); // Limit Display

  return (
    <>
    <ExploreFilter onSortChange={handleSortChange}/>
      {/* <div>
        <select id="filter-items" defaultValue="">
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div> */}

      {loading
        ? new Array(8).fill(0).map((_, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <Skeleton width="100%" height="200px" borderRadius="12px" />
            </div>
          ))
        : displayedItems.map((item, index) => {
            const deadlineValue =
              item.deadline ?? item.expiryDate ?? item.expiry_date ?? null;

            return (
              <div
                key={item.id || index}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
                style={{ display: "block", backgroundSize: "cover" }}
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link
                      to={`/author/${item.authorId}`}
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                    >
                      <img
                        className="lazy"
                        src={item.authorImage || AuthorImage}
                        alt={item.author}
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>

                  {deadlineValue && (
                    <div className="de_countdown">
                      <CountdownTimer deadline={deadlineValue} />
                    </div>
                  )}

                  <div className="nft__item_wrap">
                    <div className="nft__item_extra">
                      <div className="nft__item_buttons">
                        <button>Buy Now</button>
                        <div className="nft__item_share">
                          <h4>Share</h4>
                          <a href="#" target="_blank" rel="noreferrer">
                            <i className="fa fa-facebook fa-lg"></i>
                          </a>
                          <a href="#" target="_blank" rel="noreferrer">
                            <i className="fa fa-twitter fa-lg"></i>
                          </a>
                          <a href="#">
                            <i className="fa fa-envelope fa-lg"></i>
                          </a>
                        </div>
                      </div>
                    </div>
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

      {/* 👇 Only show button if more items remain */}
      {visibleCount < items.length && (
      <div className="col-md-12 text-center">
        <button onClick={handleLoadMore} id="loadmore" className="btn-main lead">
          Load more
        </button>
      </div>
      )}
    </>
  );
};

export default ExploreItems;
