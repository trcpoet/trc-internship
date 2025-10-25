import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthorImage from "../../images/author_thumbnail.jpg";
import Skeleton from "../UI/Skeleton";

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
        );
        setSellers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch top sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row" data-aos="fade-up" data-aos-delay="300">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <div className="col-md-12">
            <ol className="author_list">
              {loading
                ? new Array(12).fill(0).map((_, index) => (
                    <li key={index} className="author_list_item">
                      <div className="author_list_pp">
                        <Skeleton width="50px" height="50px" borderRadius="50%" />
                      </div>
                      <div className="author_list_info">
                        <Skeleton width="80px" height="16px" borderRadius="4px" />
                        <Skeleton width="40px" height="14px" borderRadius="4px" />
                      </div>
                    </li>
                  ))
                : sellers.map((seller, index) => {
                    const authorName = seller.authorName || seller.author || "Unknown";
                    const profileId = seller.authorId || seller.id;
                    const ethValue = seller.price ?? seller.totalSales ?? 0;

                    return (
                      <li key={profileId || index} className="author_list_item">
                        <span className="author_rank">{index + 1}</span>
                        <div className="author_list_pp">
                          <Link to={`/author/${profileId}`}>
                            <img
                              className="lazy pp-author"
                              src={seller.authorImage || AuthorImage}
                              alt={authorName}
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${profileId}`}>{authorName}</Link>
                          <span>{parseFloat(ethValue).toFixed(2)} ETH</span>
                        </div>
                      </li>
                    );
                  })}
            </ol>
          </div>
        </div>
      </div>

      {/* Skeleton CSS */}
      <style>{`
        .skeleton-box {
          background: linear-gradient(90deg, #eee, #f5f5f5, #eee);
          animation: pulse 2s infinite ease-in-out;
        }
        
        .author_list_pp {
          
          margin-top: 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }
        .author_list {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          padding-left: 0;
          list-style: none;
          margin-top: 20px;
        }

        .author_list_item {
          position: relative;
          display: flex;
          align-items: center;
          flex: center;
          flex-direction: row;
          gap: 16px;
          border-radius: 20px;
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          background-color: #fff;
          width: calc(25% - 16px);
          box-sizing: border-box;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          transition:  transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .author_list_item:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          background: rgba(255, 255, 255, 0.15);
        }

        .author_rank {
          font-weight: 700;
          font-size: 0.9rem;
          padding: 6px 12px;
          border-radius: 999px;
          transition: transform 0.3s;
          color: #4c4c70;
          min-width: 20px;
          text-align: center;
          left: 20px;
        }

        .pp-author {
        left: 2rem;
        }

        .author_list_item:hover .author_rank {
        transform: scale(1.1) rotate(2deg);
        }

      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.4; }
        100% { opacity: 1; }
      }

      .author_list_info span {
        font-size: 0.9rem;
        font-weight: 500;
        color:#e1e1e1;
        transition: color 0.3s;
      }
      .author_list_item:hover .author_list_info span {
        color: #ffd369;
        animation: pulseEth 1.2s infinite ease-in-out;
      }
      @keyframes pulseEth {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; transform: scale(1.05); }
      }

        @media (max-width: 992px) {
        .author_list_item {
          width: calc(33.33% - 16px);
        }
      }

      @media (max-width: 768px) {
        .author_list_item {
          width: calc(50% - 16px);
        }
      }

      @media (max-width: 576px) {
        .author_list_item {
          width: 100%;
        }
      }
      `}</style>
    </section>
  );
};

export default TopSellers;
