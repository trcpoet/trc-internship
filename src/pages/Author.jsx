import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorImage from "../images/author_thumbnail.jpg";
import AuthorItems from "../components/author/AuthorItems";
import Skeleton from "../components/UI/Skeleton";

const DEFAULT_AUTHOR_ID = "83937449";

const Author = () => {
  const { authorId: routeId } = useParams();
  const authorId = routeId ?? DEFAULT_AUTHOR_ID;

  const [author, setAuthor] = useState(null);
  const [followers, setFollowers] = useState(0);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authorItems, setAuthorItems] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    console.log("Fetching author with ID:", authorId);
    console.log("Loading state:", loading);
    const fetchAuthorData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
        );

        const data = res?.data;
        if (!data || typeof data !== "object") throw new Error("Invalid author data");

        setAuthor(data);
        setFollowers(data.followers || 0);
        setAuthorItems(data.nftCollection || []);
      } catch (err) {
        console.error("Fetch failed", err);
        setError("Author not found or failed to load.");
        setAuthor(null);
        setAuthorItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [authorId]);

  if (!routeId) {
    return <Navigate to={`/author/${DEFAULT_AUTHOR_ID}`} replace />;
  }

  const handleFollow = () => {
    if (!hasFollowed) {
      setFollowers((prev) => prev + 1);
      setHasFollowed(true);
    }
  };

  const authorDetails = author
    ? {
        name: author.authorName ?? author.name ?? "Unknown Artist",
        username: author.tag ?? `@${(author.authorName || "unknown").replace(/[^a-z0-9]+/gi, "").toLowerCase()}`,
        address: author.address ?? "",
        statsLabel: author.totalSales
          ? `${Number(author.totalSales).toFixed(2)} ETH total sales`
          : `${followers.toLocaleString()} followers`,
        avatar: author.authorImage ?? AuthorImage,
        banner: author.authorBanner ?? AuthorBanner,
        verified: Boolean(author.verified ?? true),
      }
    : {
        name: "Unknown Artist",
        username: "@unknown",
        wallet: "",
        statsLabel: `${followers.toLocaleString()} followers`,
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
            <div className="flex-grow-1">
              <Skeleton width="40%" height="20px" borderRadius="6px" />
              <Skeleton width="30%" height="16px" borderRadius="6px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);;

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
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
                  <Link to="/explore" className="btn-main">Browse marketplace</Link>
                </div>
              </div>
            )}

            {!error && (
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                      {loading ? (
                        <Skeleton width="96px" height="96px" borderRadius="50%" />
                      ) : (
                        <>
                          <img src={authorDetails.avatar} alt={authorDetails.name} />
                          {authorDetails.verified && <i className="fa fa-check"></i>}
                        </>
                      )}


                        <div className="profile_name">
                          <h4>
                            {loading ? (
                              <Skeleton width="30%" height="20px" borderRadius="4px"/>
                            ) : (
                              authorDetails.name
                            )}
                            <br/>
                            {loading ? (
                              <Skeleton width="25%" height="16px" borderRadius="4px" style={{marginTop: "6px"}}/>
                            ) : (
                              <span className="profile_username">{authorDetails.username}</span>
                            )}
                            <br/>
                            {loading ? (
                              <Skeleton width="60%" height="14px" borderRadius="4px" style={{marginTop: "6px"}}/>
                            ) : (
                              <span id="address" className="profile_address">{authorDetails.address.slice(0, 10)}...</span>
                            )}
                        
                            {!loading && authorDetails.address && (
                              <button
                                id="btn_copy"
                                title="Copy wallet"
                                onClick={() => navigator.clipboard?.writeText?.(authorDetails.address)}
                              >
                                Copy
                              </button>
                            )}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                      {loading ? (
                        <>
                          <Skeleton width="80px" height="16px" borderRadius="6px" />
                          <Skeleton width="100px" height="36px" borderRadius="8px" style={{ marginTop: "10px" }} />
                        </>
                      ) : (
                        <>
                          <div className="profile_follower">{followers.toLocaleString()} followers</div>
                          <button
                            type="button"
                            className="btn-main"
                            onClick={handleFollow}
                            disabled={hasFollowed}
                          >
                            {hasFollowed ? "Following" : "Follow"}
                          </button>
                        </>
                      )}

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
