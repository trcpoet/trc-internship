import React from "react";
import { Link } from "react-router-dom";
import Skeleton from "../UI/Skeleton";
import nftImage from "../../images/nftImage.jpg";

const AuthorItems = ({ items = [], loading = false, fallbackAvatar }) => {
const renderSkeletonGrid = () => (
  <div className="row">
    {new Array(8).fill(0).map((_, index) => (
      <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={`skeleton-${index}`}>
        <div className="nft__item">
          <div className="author_list_pp">
            <Skeleton width="50px" height="50px" borderRadius="5%" />
          </div>

          <Skeleton width="100%" height="200px" borderRadius="12px" />

          <div className="mt-3">
            <Skeleton width="70%" height="18px" borderRadius="6px" />
          </div>

          <div className="mt-2">
            <Skeleton width="40%" height="16px" borderRadius="6px" />
          </div>

          <div className="mt-2">
            <Skeleton width="20%" height="14px" borderRadius="6px" />
          </div>
        </div>
      </div>
    ))}
  </div>
);


  const safeItems = Array.isArray(items) ? items : [];

  if (loading) {
    return renderSkeletonGrid();
  }

  if (!safeItems.length) {
    return (
      <div className="row">
        <div className="col-md-12 text-center py-5">
          <h4>No collectibles yet</h4>
          <p>This creator has not listed any items at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      {safeItems.map((item) => {
        const itemId = item.nftId ?? item.id;
        const authorId = item.authorId ?? item.ownerId ?? null;
        const previewImage = item.nftImage ?? item.image ?? nftImage;
        const title = item.title ?? item.name ?? "Untitled";
        const price = item.price ?? item.priceEth ?? item.bid ?? "--";
        const likes = item.likes ?? 0;

        return (
          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={`${itemId ?? title}-${likes}`}>
            <div className="nft__item">
              <div className="author_list_pp">
                {authorId ? (
                  <Link to={`/author/${authorId}`}>
                    <img className="lazy" src={item.authorImage ?? fallbackAvatar} alt={title} />
                    <i className="fa fa-check"></i>
                  </Link>
                ) : (
                  <img className="lazy" src={item.authorImage ?? fallbackAvatar} alt={title} />
                )}
              </div>
              <div className="nft__item_wrap">
                {itemId ? (
                  <Link to={`/item-details/${itemId}`}>
                    <img src={previewImage} className="lazy nft__item_preview" alt={title} />
                  </Link>
                ) : (
                  <img src={previewImage} className="lazy nft__item_preview" alt={title} />
                )}
              </div>
              <div className="nft__item_info">
                {itemId ? (
                  <Link to={`/item-details/${itemId}`}>
                    <h4>{title}</h4>
                  </Link>
                ) : (
                  <h4>{title}</h4>
                )}
                <div className="nft__item_price">{price} ETH</div>
                <div className="nft__item_like">
                  <i className="fa fa-heart"></i>
                  <span>{likes}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AuthorItems;
