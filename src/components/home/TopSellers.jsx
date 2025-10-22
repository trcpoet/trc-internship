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
        <div className="row">
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
                    <li key={index}>
                      <div className="author_list_pp">
                        <Skeleton width="50px" height="50px" borderRadius="50%" />
                      </div>
                      <div className="author_list_info">
                        <Skeleton width="80px" height="16px" borderRadius="4px" />
                        <Skeleton width="40px" height="14px" borderRadius="4px" />
                      </div>
                    </li>
                  ))
                : sellers.map((seller) => (
                    <li key={seller.id}>
                      <div className="author_list_pp">
                        <Link to={`/author/${seller.id}`}>
                          <img
                            className="lazy pp-author"
                            src={seller.authorImage || AuthorImage}
                            alt={seller.author}
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      <div className="author_list_info">
                        <Link to={`/author/${seller.id}`}>{seller.author}</Link>
                        <span>{parseFloat(seller.price).toFixed(2)} ETH</span>
                      </div>
                    </li>
                  ))}
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
        }
            .author_list {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            padding-left: 0;
            list-style: none;
            margin-top: 20px;
          }

          .author_list li {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            border-radius: 8px;
            background-color: #fff;
            width: calc(25% - 16px);
            box-sizing: border-box;
          }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }

         @media (max-width: 992px) {
    .author_list li {
      width: calc(33.33% - 16px);
    }
  }

  @media (max-width: 768px) {
    .author_list li {
      width: calc(50% - 16px);
    }
  }

  @media (max-width: 576px) {
    .author_list li {
      width: 100%;
    }
  }
      `}</style>
    </section>
  );
};

export default TopSellers;
