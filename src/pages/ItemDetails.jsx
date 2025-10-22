import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Skeleton from "../components/UI/Skeleton";
import EthImage from "../images/ethereum.svg";
import AuthorImage from "../images/author_thumbnail.jpg";
import nftImage from "../images/nftImage.jpg";

const ItemDetails = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!itemId) return;

    let isMounted = true;

    const fetchItem = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails",
          { params: { id: itemId } }
        );

        if (!isMounted) return;

        const normalized = Array.isArray(data) ? data[0] : data;
        setItem(normalized ?? null);
      } catch (err) {
        console.error("Failed to fetch item details", err);
        if (isMounted) setError("Unable to load item details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchItem();

    return () => {
      isMounted = false;
    };
  }, [itemId]);

  if (!itemId) {
    return <Navigate to="/" replace />;
  }

  const owner = item
    ? {
        name: item.owner ?? item.ownerName ?? item.author ?? "Unknown",
        image: item.ownerImage ?? item.ownerAvatar ?? item.authorImage ?? AuthorImage,
        id: item.ownerId ?? item.authorId ?? item.creatorId ?? null,
      }
    : null;

  const creator = item
    ? {
        name: item.creator ?? item.creatorName ?? owner?.name ?? "Unknown",
        image: item.creatorImage ?? item.creatorAvatar ?? owner?.image ?? AuthorImage,
        id: item.creatorId ?? owner?.id ?? null,
      }
    : null;

  const priceLabel = item?.price ?? item?.bid ?? item?.priceEth ?? "-";
  const itemTitle = item?.title ?? item?.name ?? "Untitled NFT";
  const itemDescription =
    item?.description ?? item?.desc ?? "No description available for this item.";
  const itemViews = item?.views ?? item?.watchers ?? 0;
  const itemLikes = item?.likes ?? 0;
  const itemImage = item?.nftImage ?? item?.image ?? nftImage;

  const renderLoading = () => (
    <div className="container">
      <div className="row">
        <div className="col-md-6 mb-4">
          <Skeleton width="100%" height="420px" borderRadius="16px" />
        </div>
        <div className="col-md-6">
          <Skeleton width="60%" height="36px" borderRadius="8px" />
          <div style={{ margin: "24px 0" }}>
            <Skeleton width="100%" height="18px" borderRadius="6px" />
            <Skeleton width="80%" height="18px" borderRadius="6px" />
            <Skeleton width="65%" height="18px" borderRadius="6px" />
          </div>
          <Skeleton width="40%" height="30px" borderRadius="6px" />
        </div>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h2>Item unavailable</h2>
          <p>{error ?? "We couldn't locate this item right now."}</p>
          <Link className="btn-main" to="/explore">
            Back to explore
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          {loading && renderLoading()}
          {!loading && error && renderError()}
          {!loading && !error && item && (
            <div className="container">
              <div className="row">
                <div className="col-md-6 text-center">
                  <img
                    src={itemImage}
                    className="img-fluid img-rounded mb-sm-30 nft-image"
                    alt={itemTitle}
                  />
                </div>
                <div className="col-md-6">
                  <div className="item_info">
                    <h2>{itemTitle}</h2>

                    <div className="item_info_counts">
                      <div className="item_info_views">
                        <i className="fa fa-eye"></i>
                        {itemViews}
                      </div>
                      <div className="item_info_like">
                        <i className="fa fa-heart"></i>
                        {itemLikes}
                      </div>
                    </div>
                    <p>{itemDescription}</p>
                    <div className="d-flex flex-row">
                      <div className="mr40">
                        <h6>Owner</h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            {owner?.id ? (
                              <Link to={`/author/${owner.id}`}>
                                <img className="lazy" src={owner.image} alt={owner.name} />
                                <i className="fa fa-check"></i>
                              </Link>
                            ) : (
                              <img className="lazy" src={owner?.image ?? AuthorImage} alt={owner?.name} />
                            )}
                          </div>
                          <div className="author_list_info">
                            {owner?.id ? (
                              <Link to={`/author/${owner.id}`}>{owner.name}</Link>
                            ) : (
                              <span>{owner?.name}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h6>Creator</h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            {creator?.id ? (
                              <Link to={`/author/${creator.id}`}>
                                <img className="lazy" src={creator.image} alt={creator.name} />
                                <i className="fa fa-check"></i>
                              </Link>
                            ) : (
                              <img className="lazy" src={creator?.image ?? AuthorImage} alt={creator?.name} />
                            )}
                          </div>
                          <div className="author_list_info">
                            {creator?.id ? (
                              <Link to={`/author/${creator.id}`}>{creator.name}</Link>
                            ) : (
                              <span>{creator?.name}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="de_tab tab_simple">
                      <div className="de_tab_content">
                        <div className="spacer-20"></div>
                        <h6>Price</h6>
                        <div className="nft-item-price">
                          <img src={EthImage} alt="ETH icon" />
                          <span>{priceLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
