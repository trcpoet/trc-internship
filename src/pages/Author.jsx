import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import AuthorImage from "../images/author_thumbnail.jpg";

const DEFAULT_AUTHOR_ID = "83937449";

const Author = () => {
  const params = useParams();
  const authorId = params.authorId ?? DEFAULT_AUTHOR_ID;
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorItems, setAuthorItems] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!authorId) return;

    let isMounted = true;

    const fetchAuthor = async () => {
      setLoading(true);
      setError(null);

      try {
        const [sellersResponse, itemsResponse] = await Promise.all([
          axios.get("https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"),
          axios.get("https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"),
        ]);

        if (!isMounted) return;

        const sellers = Array.isArray(sellersResponse.data)
          ? sellersResponse.data
          : [];
        const matchedAuthor = sellers.find((seller) => {
          const sellerId = seller.authorId ?? seller.id;
          return sellerId && String(sellerId) === String(authorId);
        });

        if (!matchedAuthor) {
          setAuthor(null);
          setAuthorItems([]);
          setError("Author not found in the top sellers feed.");
          return;
        }

        const allItems = Array.isArray(itemsResponse.data)
          ? itemsResponse.data
          : [];
        const targetId = matchedAuthor.authorId ?? matchedAuthor.id;

        const filteredItems = allItems.filter((item) => {
          const relatedId =
            item.authorId ??
            item.ownerId ??
            item.creatorId ??
            item.sellerId ??
            item.id;
          return (
            relatedId && targetId && String(relatedId) === String(targetId)
          );
        });

        setAuthor(matchedAuthor);
        setAuthorItems(filteredItems);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch author", err);
        if (isMounted) setError("Unable to load author profile.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAuthor();

    return () => {
      isMounted = false;
    };
  }, [authorId]);

  if (!params.authorId) {
    return <Navigate to={`/author/${DEFAULT_AUTHOR_ID}`} replace />;
  }

  const authorDetails = author
    ? {
        name:
          author.authorName ??
          author.author ??
          author.name ??
          "Unknown Artist",
        username:
          author.tag ??
          author.username ??
          `@${(
            author.authorName || author.author || "unknown"
          )
            .replace(/[^a-z0-9]+/gi, "")
            .toLowerCase()}`,
        wallet: author.wallet ?? "",
        statsLabel: author.totalSales
          ? `${Number(author.totalSales).toFixed(2)} ETH total sales`
          : author.price
          ? `${Number(author.price).toFixed(2)} ETH total sales`
          : author.followers
          ? `${Number(author.followers).toLocaleString()} followers`
          : "No stats available",
        avatar: author.authorImage ?? author.avatar ?? AuthorImage,
        banner: author.authorBanner ?? author.bannerImage ?? AuthorBanner,
        verified: Boolean(author.verified ?? true),
      }
    : {
        name: "Unknown Artist",
        username: "@unknown",
        wallet: "",
        statsLabel: "No stats available",
        avatar: AuthorImage,
        banner: AuthorBanner,
        verified: false,
      };

  const renderProfileSkeleton = () => (
    <div className="row">
      <div className="col-md-12">
        <div className="d_profile de-flex">
          <div className="de-flex-col w-100">
            <div className="profile_avatar d-flex align-items-center gap-3">
              <div className="skeleton-box" style={{ width: 96, height: 96, borderRadius: "50%" }}></div>
              <div className="flex-grow-1">
                <div className="skeleton-box" style={{ width: "40%", height: 20, borderRadius: 6 }}></div>
                <div className="skeleton-box" style={{ width: "30%", height: 16, borderRadius: 6, marginTop: 8 }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage={"url(images/author_banner.jpg) top"}
          style={{ background: `url(${authorDetails.banner}) top / cover no-repeat` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            {loading && renderProfileSkeleton()}
            {!loading && error && (
              <div className="row py-5">
                <div className="col-md-12 text-center">
                  <h2>Author unavailable</h2>
                  <p>{error}</p>
                  <Link to="/explore" className="btn-main">
                    Browse marketplace
                  </Link>
                </div>
              </div>
            )}
            {!loading && !error && (
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <img src={authorDetails.avatar} alt={authorDetails.name} />

                        {authorDetails.verified && <i className="fa fa-check"></i>}
                        <div className="profile_name">
                          <h4>
                            {authorDetails.name}
                            <span className="profile_username">{authorDetails.username}</span>
                            {authorDetails.wallet && (
                              <span id="wallet" className="profile_wallet">
                                {authorDetails.wallet}
                              </span>
                            )}
                            {authorDetails.wallet && (
                              <button id="btn_copy" title="Copy wallet" onClick={() => navigator.clipboard?.writeText?.(authorDetails.wallet)}>
                                Copy
                              </button>
                            )}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="profile_follower">{authorDetails.statsLabel}</div>
                        <button type="button" className="btn-main">
                          Follow
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="de_tab tab_simple">
                    <AuthorItems
                      items={authorItems}
                      loading={loading}
                      fallbackAvatar={authorDetails.avatar}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
